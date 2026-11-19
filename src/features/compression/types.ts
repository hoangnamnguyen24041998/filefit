export interface ProcessFileOptions {
  targetMaxBytes: number;
  convertToJpg: boolean;
}

export interface ProcessedFileResult {
  file: File;
  originalFile: File;
  originalBytes: number;
  compressedBytes: number;
  originalFormat: string;
  compressedFormat: string;
  savingsPercent: number;
  success: boolean;
  error?: string;
}

export interface InterceptedBatch {
  inputElement: HTMLInputElement;
  files: File[];
  analyzedFiles: AnalyzedFileInfo[];
  requiresProcessing: boolean;
}

export interface AnalyzedFileInfo {
  file: File;
  isImage: boolean;
  isHeic: boolean;
  isWebP: boolean;
  isPng: boolean;
  isOversized: boolean;
  needsConversion: boolean;
  displayFormat: string;
  formattedSize: string;
}
