import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileImage,
  Sparkles,
} from 'lucide-react';
import { BrandLogo } from '../../components/BrandLogo';
import { BatchAnalysis } from '../interceptor/fileAnalyzer';
import { SIZE_PRESETS } from '../settings/types';
import { formatBytes } from '../compression/compressImage';

export interface FloatingWidgetProps {
  analysis: BatchAnalysis;
  initialTargetBytes: number;
  initialConvertToJpg: boolean;
  isProcessing: boolean;
  processingStatus?: { current: number; total: number; currentFileName: string } | null;
  successResult?: {
    originalBytes: number;
    compressedBytes: number;
    savingsPercent: number;
    count: number;
    fromFormat: string;
    toFormat: string;
  } | null;
  errorMessage?: string | null;
  onApply: (targetBytes: number, convertToJpg: boolean) => void;
  onDismiss: () => void;
}

export const FloatingWidget: React.FC<FloatingWidgetProps> = ({
  analysis,
  initialTargetBytes,
  initialConvertToJpg,
  isProcessing,
  processingStatus,
  successResult,
  errorMessage,
  onApply,
  onDismiss,
}) => {
  const [selectedTargetBytes, setSelectedTargetBytes] = useState(initialTargetBytes);
  const [convertToJpg, setConvertToJpg] = useState(
    analysis.strictPngOnly ? false : initialConvertToJpg
  );
  const [showMultiFileList, setShowMultiFileList] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [countdownProgress, setCountdownProgress] = useState(100);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state if initial props change
  useEffect(() => {
    setSelectedTargetBytes(initialTargetBytes);
  }, [initialTargetBytes]);

  useEffect(() => {
    if (analysis.strictPngOnly) {
      setConvertToJpg(false);
    } else {
      setConvertToJpg(initialConvertToJpg);
    }
  }, [initialConvertToJpg, analysis.strictPngOnly]);

  // Keyboard navigation: Escape closes, Enter applies
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onDismiss();
      } else if (e.key === 'Enter' && !isProcessing && !successResult) {
        e.preventDefault();
        onApply(selectedTargetBytes, convertToJpg);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss, onApply, selectedTargetBytes, convertToJpg, isProcessing, successResult]);

  // Auto-dismiss on success (4s countdown, pauses on hover)
  useEffect(() => {
    if (!successResult) {
      setCountdownProgress(100);
      return;
    }

    const duration = 4000;
    const intervalTime = 50;
    let elapsed = 0;

    const timer = window.setInterval(() => {
      if (!isHovered) {
        elapsed += intervalTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setCountdownProgress(remaining);

        if (elapsed >= duration) {
          clearInterval(timer);
          onDismiss();
        }
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [successResult, isHovered, onDismiss]);

  const fileCount = analysis.files.length;
  const firstFile = analysis.analyzedFiles[0];
  const isMultiple = fileCount > 1;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-[348px] bg-white/95 backdrop-blur-xl rounded-2xl border border-zinc-950/[0.08] shadow-hallmark text-zinc-950 font-sans select-none overflow-hidden transition-all duration-200 animate-fade-in"
      role="dialog"
      aria-labelledby="filefit-title"
      tabIndex={-1}
    >
      {/* Header */}
      <div className="px-4 pt-3.5 pb-2.5 flex items-center justify-between border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <BrandLogo size={20} variant="mark" />
          <span id="filefit-title" className="font-semibold text-[13px] tracking-tight text-zinc-950">
            FileFit
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Local
          </span>
        </div>

        <button
          onClick={onDismiss}
          className="text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 p-1 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
          title="Close (Esc)"
          aria-label="Close"
        >
          <X size={15} strokeWidth={1.75} />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-3.5">
        {/* Error Notification */}
        {errorMessage && (
          <div className="p-2.5 bg-red-50 border border-red-200/60 rounded-xl flex items-start gap-2 text-red-800 text-xs">
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5 text-red-600" />
            <div className="leading-snug">{errorMessage}</div>
          </div>
        )}

        {/* State 1: Success State */}
        {successResult ? (
          <div className="space-y-3">
            <div className="p-3 bg-emerald-50/80 border border-emerald-200/70 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-semibold">
                  <CheckCircle2 size={16} strokeWidth={2} className="text-emerald-600" />
                  <span>
                    {successResult.count > 1
                      ? `${successResult.count} images fitted & applied`
                      : 'Image fitted & applied'}
                  </span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[11px] font-semibold tabular-nums">
                  -{successResult.savingsPercent}%
                </span>
              </div>

              {/* Before -> After Delta */}
              <div className="flex items-center justify-between text-xs text-emerald-950/80 pt-1 border-t border-emerald-200/40">
                <span className="tabular-nums font-medium text-zinc-500">
                  {formatBytes(successResult.originalBytes)}{' '}
                  <span className="text-[10px] uppercase font-bold text-zinc-400">
                    {successResult.fromFormat}
                  </span>
                </span>
                <span className="text-zinc-400 text-[11px]">→</span>
                <span className="tabular-nums font-semibold text-emerald-700">
                  {formatBytes(successResult.compressedBytes)}{' '}
                  <span className="text-[10px] uppercase font-bold text-emerald-600">
                    {successResult.toFormat}
                  </span>
                </span>
              </div>
            </div>

            {/* Countdown bar */}
            <div className="space-y-1">
              <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-75 ease-linear"
                  style={{ width: `${countdownProgress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-zinc-400 px-0.5">
                <span>{isHovered ? 'Paused on hover' : 'Auto-closing...'}</span>
                <button
                  onClick={onDismiss}
                  className="hover:text-zinc-700 underline underline-offset-2"
                >
                  Dismiss now
                </button>
              </div>
            </div>
          </div>
        ) : isProcessing ? (
          /* State 2: Processing State */
          <div className="py-4 space-y-3 text-center">
            <div className="flex items-center justify-center gap-2 text-zinc-900 text-xs font-medium">
              <Sparkles size={16} className="text-zinc-800 animate-spin" strokeWidth={1.75} />
              <span>
                {processingStatus
                  ? `Fitting ${processingStatus.current} of ${processingStatus.total}...`
                  : 'Fitting image...'}
              </span>
            </div>

            {/* Animated Shimmer Bar */}
            <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden relative">
              <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-zinc-200 via-zinc-900 to-zinc-200 animate-shimmer" />
            </div>

            {processingStatus?.currentFileName && (
              <p className="text-[11px] text-zinc-500 truncate px-4">
                {processingStatus.currentFileName}
              </p>
            )}
          </div>
        ) : (
          /* State 3: Manual Control & Inspection View */
          <>
            {/* File Summary Card (Recessed Well) */}
            <div className="bg-zinc-100/90 rounded-xl p-3 border border-zinc-200/50 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200/60 flex items-center justify-center flex-shrink-0 text-zinc-600 shadow-sm">
                    <FileImage size={15} strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-zinc-900 truncate">
                      {firstFile?.file.name}
                    </p>
                    <p className="text-[11px] text-zinc-500 tabular-nums">
                      {firstFile ? formatBytes(firstFile.file.size) : '0 B'}
                    </p>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {firstFile?.isHeic && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wider bg-amber-100 text-amber-800 border border-amber-200/60 uppercase">
                      HEIC
                    </span>
                  )}
                  {firstFile?.isOversized && !firstFile?.isHeic && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-100 text-amber-800 border border-amber-200/60">
                      Heavy
                    </span>
                  )}
                  {!firstFile?.isHeic && !firstFile?.isOversized && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-200 text-zinc-700 uppercase">
                      {firstFile?.displayFormat}
                    </span>
                  )}
                </div>
              </div>

              {/* Multi-file toggle drawer */}
              {isMultiple && (
                <div className="pt-2 border-t border-zinc-200/60">
                  <button
                    onClick={() => setShowMultiFileList(!showMultiFileList)}
                    className="w-full flex items-center justify-between text-[11px] text-zinc-600 hover:text-zinc-900 font-medium transition-colors"
                  >
                    <span>
                      +{fileCount - 1} more file{fileCount - 1 > 1 ? 's' : ''} (Total:{' '}
                      <span className="tabular-nums font-semibold">
                        {formatBytes(analysis.totalOriginalBytes)}
                      </span>
                      )
                    </span>
                    {showMultiFileList ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>

                  {showMultiFileList && (
                    <div className="mt-2 space-y-1.5 max-h-28 overflow-y-auto pr-1">
                      {analysis.analyzedFiles.slice(1).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-[11px] bg-white/70 px-2 py-1 rounded-md border border-zinc-200/40"
                        >
                          <span className="truncate max-w-[170px] text-zinc-800">
                            {item.file.name}
                          </span>
                          <span className="text-zinc-500 tabular-nums flex-shrink-0 text-[10px]">
                            {item.formattedSize} • {item.displayFormat}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Target Size Segmented Control */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-600 block tracking-tight">
                TARGET FILE SIZE
              </label>
              <div className="grid grid-cols-3 gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200/50">
                {SIZE_PRESETS.map((preset) => {
                  const isSelected = selectedTargetBytes === preset.bytes;
                  return (
                    <button
                      key={preset.bytes}
                      type="button"
                      onClick={() => setSelectedTargetBytes(preset.bytes)}
                      className={`py-1.5 text-xs font-medium rounded-lg transition-all text-center tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 ${
                        isSelected
                          ? 'bg-white text-zinc-950 shadow-subtle border border-zinc-950/[0.06]'
                          : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Convert to JPG Tactile Switch Row */}
            <div className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-xl border border-zinc-200/40">
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-zinc-900 block leading-none">
                  Convert to JPG
                </span>
                <span className="text-[10px] text-zinc-500 block leading-tight">
                  {analysis.strictPngOnly
                    ? 'Target accepts PNG only'
                    : 'Universal format with maximum compression'}
                </span>
              </div>

              {/* Tactile Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={convertToJpg}
                disabled={analysis.strictPngOnly}
                onClick={() => setConvertToJpg(!convertToJpg)}
                className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 disabled:opacity-40 disabled:cursor-not-allowed ${
                  convertToJpg ? 'bg-zinc-950' : 'bg-zinc-300'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-150 ${
                    convertToJpg ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Actions */}
            <div className="pt-1 space-y-2">
              <button
                type="button"
                onClick={() => onApply(selectedTargetBytes, convertToJpg)}
                className="w-full h-9 rounded-xl bg-zinc-950 hover:bg-zinc-800 active:scale-[0.985] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
              >
                <span>Compress & Apply</span>
                <ArrowRight size={14} strokeWidth={2} />
              </button>

              <button
                type="button"
                onClick={onDismiss}
                className="w-full text-center text-[11px] text-zinc-500 hover:text-zinc-800 transition-colors py-0.5 font-medium"
              >
                Keep original {fileCount > 1 ? 'files' : 'file'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Footer Strip */}
      <div className="px-4 py-2 bg-zinc-50/80 border-t border-zinc-100 flex items-center justify-center gap-1.5 text-[10px] text-zinc-400">
        <ShieldCheck size={12} strokeWidth={1.75} className="text-emerald-600" />
        <span>100% On-Device • Zero Server Uploads</span>
      </div>
    </div>
  );
};
