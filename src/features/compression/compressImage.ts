import { convertHeicToJpegBlob } from './convertHeic';
import { ProcessedFileResult, ProcessFileOptions } from './types';

/**
 * Format bytes into human-readable string with clean precision.
 * e.g., 4820000 -> "4.82 MB", 740000 -> "740 KB"
 */
export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const k = 1024;
  if (bytes < k) return `${bytes} B`;
  const kb = bytes / k;
  if (kb < k) {
    return kb >= 100 ? `${Math.round(kb)} KB` : `${kb.toFixed(1)} KB`;
  }
  const mb = kb / k;
  return `${mb.toFixed(2)} MB`;
}

/**
 * Check if a file is a HEIC or HEIF image.
 */
export function isHeicFile(file: File): boolean {
  const mime = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return (
    mime === 'image/heic' ||
    mime === 'image/heif' ||
    name.endsWith('.heic') ||
    name.endsWith('.heif')
  );
}

/**
 * Cleanly replaces filename extension with .jpg if converting to JPEG.
 */
export function getCleanJpgFilename(originalName: string): string {
  const lastDot = originalName.lastIndexOf('.');
  const baseName = lastDot > 0 ? originalName.slice(0, lastDot) : originalName;
  return `${baseName}.jpg`;
}

/**
 * Renders an ImageBitmap or HTMLImageElement to a JPEG Blob at the specified width, height, and quality.
 * Fills canvas with solid white (#FFFFFF) so alpha channels in PNG/WebP never turn black.
 */
async function renderCanvasToJpeg(
  source: ImageBitmap | HTMLImageElement,
  width: number,
  height: number,
  quality: number
): Promise<Blob> {
  if (typeof OffscreenCanvas !== 'undefined') {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get OffscreenCanvas 2D context');

    // Fill white background for alpha channel compatibility
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(source, 0, 0, width, height);

    return await canvas.convertToBlob({
      type: 'image/jpeg',
      quality: Math.min(Math.max(quality, 0.1), 1.0),
    });
  }

  // Fallback to standard DOM canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get Canvas 2D context');

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(source, 0, 0, width, height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas export toBlob returned null'));
      },
      'image/jpeg',
      Math.min(Math.max(quality, 0.1), 1.0)
    );
  });
}

/**
 * Decodes a File or Blob into an ImageBitmap (with HTMLImageElement fallback).
 */
async function decodeImage(blob: Blob): Promise<{
  source: ImageBitmap | HTMLImageElement;
  width: number;
  height: number;
  close: () => void;
}> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(blob);
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        close: () => bitmap.close(),
      };
    } catch (err) {
      console.warn('[FileFit] createImageBitmap failed, falling back to Image():', err);
    }
  }

  // Fallback: Image object
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image in fallback element'));
      img.src = url;
    });
    return {
      source: img,
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height,
      close: () => URL.revokeObjectURL(url),
    };
  } catch (err) {
    URL.revokeObjectURL(url);
    throw err;
  }
}

/**
 * Compresses a single image file with binary-search quality optimization and progressive step-down resize.
 */
export async function compressImageFile(
  file: File,
  options: ProcessFileOptions
): Promise<ProcessedFileResult> {
  const originalBytes = file.size;
  const originalFormat = file.type || file.name.split('.').pop()?.toUpperCase() || 'FILE';

  try {
    let sourceBlob: Blob = file;

    // Step 1: HEIC / HEIF conversion if needed
    if (isHeicFile(file)) {
      sourceBlob = await convertHeicToJpegBlob(file);
    }

    // Step 2: Decode image
    const decoded = await decodeImage(sourceBlob);

    try {
      const origWidth = decoded.width;
      const origHeight = decoded.height;
      const targetBytes = options.targetMaxBytes;

      let currentScale = 1.0;
      let bestBlob: Blob | null = null;
      const minDimension = 800; // Safe floor for legibility of IDs / documents

      // Progressive step-down loop: downscale by 0.8x if quality 0.5 still exceeds target
      while (currentScale >= 0.2) {
        const curW = Math.max(Math.round(origWidth * currentScale), 1);
        const curH = Math.max(Math.round(origHeight * currentScale), 1);

        // Quick check: Test high quality first (0.92)
        const highQualityBlob = await renderCanvasToJpeg(decoded.source, curW, curH, 0.92);
        if (highQualityBlob.size <= targetBytes) {
          bestBlob = highQualityBlob;
          break; // Perfect: fits at maximum fidelity
        }

        // Test safe lower bound (0.45)
        const lowQualityBlob = await renderCanvasToJpeg(decoded.source, curW, curH, 0.45);
        if (lowQualityBlob.size > targetBytes) {
          // Even lowest quality is oversized: check if we can downscale further
          const minCurDim = Math.min(curW, curH);
          if (minCurDim > minDimension) {
            currentScale *= 0.8;
            continue; // Downscale and retry
          } else {
            // Cannot downscale below safe threshold, use the lowest quality blob
            bestBlob = lowQualityBlob;
            break;
          }
        }

        // Run binary search on JPEG quality between 0.45 and 0.92 (up to 6 iterations)
        let lowQ = 0.45;
        let highQ = 0.92;
        let currentBest: Blob = lowQualityBlob;

        for (let iter = 0; iter < 6; iter++) {
          const midQ = (lowQ + highQ) / 2;
          const candidate = await renderCanvasToJpeg(decoded.source, curW, curH, midQ);

          if (candidate.size <= targetBytes) {
            currentBest = candidate;
            lowQ = midQ; // Try higher quality
          } else {
            highQ = midQ; // Too big, lower quality
          }
        }

        bestBlob = currentBest;
        break;
      }

      if (!bestBlob) {
        // Fallback: render at 0.75 quality if loop exited unexpectedly
        bestBlob = await renderCanvasToJpeg(decoded.source, origWidth, origHeight, 0.75);
      }

      const newFilename = options.convertToJpg
        ? getCleanJpgFilename(file.name)
        : file.name;
      const compressedFile = new File([bestBlob], newFilename, {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });

      const compressedBytes = compressedFile.size;
      const savings = originalBytes > 0
        ? Math.round(((originalBytes - compressedBytes) / originalBytes) * 100)
        : 0;

      return {
        file: compressedFile,
        originalFile: file,
        originalBytes,
        compressedBytes,
        originalFormat: isHeicFile(file) ? 'HEIC' : originalFormat.replace('image/', '').toUpperCase(),
        compressedFormat: 'JPG',
        savingsPercent: Math.max(savings, 0),
        success: true,
      };
    } finally {
      decoded.close();
    }
  } catch (err) {
    console.error('[FileFit] Image compression failed for file:', file.name, err);
    return {
      file,
      originalFile: file,
      originalBytes,
      compressedBytes: originalBytes,
      originalFormat,
      compressedFormat: originalFormat,
      savingsPercent: 0,
      success: false,
      error: err instanceof Error ? err.message : 'Compression failed',
    };
  }
}
