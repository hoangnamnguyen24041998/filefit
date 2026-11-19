import { getSettings, isDomainDisabled } from '../settings/storage';
import { analyzeInputFiles } from './fileAnalyzer';
import { compressImageFile } from '../compression/compressImage';
import { FloatingWidgetProps } from '../widget/FloatingWidget';
import { ProcessedFileResult } from '../compression/types';

const syntheticInputs = new WeakSet<HTMLInputElement>();

export type WidgetRenderer = (props: FloatingWidgetProps | null) => void;

/**
 * Initializes global capture-phase interception for all <input type="file"> elements on the page.
 */
export function initFileInterceptor(renderWidget: WidgetRenderer): () => void {
  const handleChange = async (event: Event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.type !== 'file') {
      return;
    }

    const input = target;

    // Loop guard: ignore synthetic events re-dispatched by FileFit
    if (syntheticInputs.has(input)) {
      return;
    }

    // Check if extension is enabled and current domain is not paused
    const settings = await getSettings();
    const hostname = window.location.hostname;
    if (!settings.enabled || (await isDomainDisabled(hostname, settings))) {
      return;
    }

    const analysis = analyzeInputFiles(input, settings.targetMaxBytes);
    if (!analysis.requiresProcessing) {
      return;
    }

    // Intercept: pause host website from processing oversized / incompatible files
    event.stopImmediatePropagation();
    event.preventDefault();

    // Helper to process files and inject via DataTransfer
    const executeProcessing = async (targetBytes: number, convertToJpg: boolean) => {
      let isCancelled = false;

      // Update widget into processing state
      renderWidget({
        analysis,
        initialTargetBytes: targetBytes,
        initialConvertToJpg: convertToJpg,
        isProcessing: true,
        processingStatus: {
          current: 1,
          total: analysis.files.length,
          currentFileName: analysis.files[0]?.name || '',
        },
        errorMessage: null,
        onApply: () => {},
        onDismiss: () => {
          isCancelled = true;
          renderWidget(null);
        },
      });

      const processedResults: ProcessedFileResult[] = [];
      let totalOriginalBytes = 0;
      let totalCompressedBytes = 0;

      for (let i = 0; i < analysis.analyzedFiles.length; i++) {
        if (isCancelled) return;

        const item = analysis.analyzedFiles[i];
        renderWidget({
          analysis,
          initialTargetBytes: targetBytes,
          initialConvertToJpg: convertToJpg,
          isProcessing: true,
          processingStatus: {
            current: i + 1,
            total: analysis.analyzedFiles.length,
            currentFileName: item.file.name,
          },
          errorMessage: null,
          onApply: () => {},
          onDismiss: () => {
            isCancelled = true;
            renderWidget(null);
          },
        });

        if (item.isImage) {
          const res = await compressImageFile(item.file, {
            targetMaxBytes: targetBytes,
            convertToJpg: analysis.strictPngOnly ? false : convertToJpg,
          });
          processedResults.push(res);
          totalOriginalBytes += res.originalBytes;
          totalCompressedBytes += res.compressedBytes;
        } else {
          // Keep non-image files intact
          processedResults.push({
            file: item.file,
            originalFile: item.file,
            originalBytes: item.file.size,
            compressedBytes: item.file.size,
            originalFormat: 'FILE',
            compressedFormat: 'FILE',
            savingsPercent: 0,
            success: true,
          });
          totalOriginalBytes += item.file.size;
          totalCompressedBytes += item.file.size;
        }
      }

      if (isCancelled) return;

      // Inject new files into input via DataTransfer
      const dataTransfer = new DataTransfer();
      for (const res of processedResults) {
        dataTransfer.items.add(res.file);
      }

      try {
        input.files = dataTransfer.files;
      } catch (err) {
        console.warn('[FileFit] Could not set input.files directly via DataTransfer:', err);
      }

      // Mark input in WeakSet to prevent interception loop
      syntheticInputs.add(input);

      // Re-dispatch synthetic bubbles events for React / Vue / Angular / native host forms
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));

      // Calculate total savings
      const overallSavings =
        totalOriginalBytes > 0
          ? Math.round(
              ((totalOriginalBytes - totalCompressedBytes) / totalOriginalBytes) * 100
            )
          : 0;

      const fromFormat = analysis.analyzedFiles[0]?.displayFormat || 'ORIG';
      const toFormat = analysis.strictPngOnly || !convertToJpg ? fromFormat : 'JPG';

      // Show success state on Floating Widget
      renderWidget({
        analysis,
        initialTargetBytes: targetBytes,
        initialConvertToJpg: convertToJpg,
        isProcessing: false,
        processingStatus: null,
        successResult: {
          originalBytes: totalOriginalBytes,
          compressedBytes: totalCompressedBytes,
          savingsPercent: Math.max(overallSavings, 0),
          count: analysis.analyzedFiles.filter((a) => a.isImage).length,
          fromFormat,
          toFormat,
        },
        errorMessage: null,
        onApply: () => {},
        onDismiss: () => {
          renderWidget(null);
        },
      });
    };

    // Helper to bypass compression and keep original files
    const passOriginalsThrough = () => {
      renderWidget(null);
      syntheticInputs.add(input);
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    };

    if (settings.mode === 'auto') {
      // Auto-Fit mode: compress transparently using current settings
      await executeProcessing(settings.targetMaxBytes, settings.convertToJpg);
    } else {
      // Manual Assist mode: present interactive Floating Widget
      renderWidget({
        analysis,
        initialTargetBytes: settings.targetMaxBytes,
        initialConvertToJpg: settings.convertToJpg,
        isProcessing: false,
        processingStatus: null,
        successResult: null,
        errorMessage: null,
        onApply: (targetBytes, convertToJpg) => {
          executeProcessing(targetBytes, convertToJpg);
        },
        onDismiss: () => {
          passOriginalsThrough();
        },
      });
    }
  };

  // Add capture-phase listener on document
  document.addEventListener('change', handleChange, true);

  return () => {
    document.removeEventListener('change', handleChange, true);
  };
}
