import { AnalyzedFileInfo } from '../compression/types';
import { formatBytes, isHeicFile } from '../compression/compressImage';

export interface BatchAnalysis {
  files: File[];
  analyzedFiles: AnalyzedFileInfo[];
  requiresProcessing: boolean;
  oversizedCount: number;
  heicCount: number;
  totalOriginalBytes: number;
  isJpgAllowed: boolean;
  strictPngOnly: boolean;
  acceptAttribute: string | null;
}

/**
 * Inspects an input element's `accept` attribute to determine if JPG format is acceptable.
 */
export function analyzeAcceptAttribute(acceptAttr: string | null): {
  isJpgAllowed: boolean;
  strictPngOnly: boolean;
} {
  if (!acceptAttr || acceptAttr.trim() === '' || acceptAttr.trim() === '*') {
    return { isJpgAllowed: true, strictPngOnly: false };
  }

  const tokens = acceptAttr
    .toLowerCase()
    .split(',')
    .map((t) => t.trim());

  // If wildcard image/* is accepted, JPG is allowed
  if (tokens.some((t) => t === 'image/*' || t === '*/*')) {
    return { isJpgAllowed: true, strictPngOnly: false };
  }

  const acceptsJpg = tokens.some(
    (t) =>
      t === 'image/jpeg' ||
      t === 'image/jpg' ||
      t === '.jpg' ||
      t === '.jpeg'
  );

  const acceptsPng = tokens.some((t) => t === 'image/png' || t === '.png');

  // If strictly accepts PNG and NOT JPG
  const strictPngOnly = acceptsPng && !acceptsJpg;

  return {
    isJpgAllowed: acceptsJpg || (!strictPngOnly && !tokens.every((t) => !t.includes('image'))),
    strictPngOnly,
  };
}

/**
 * Analyzes files selected in an input against the target threshold and rejected formats.
 */
export function analyzeInputFiles(
  input: HTMLInputElement,
  targetMaxBytes: number
): BatchAnalysis {
  const fileList = input.files;
  if (!fileList || fileList.length === 0) {
    return {
      files: [],
      analyzedFiles: [],
      requiresProcessing: false,
      oversizedCount: 0,
      heicCount: 0,
      totalOriginalBytes: 0,
      isJpgAllowed: true,
      strictPngOnly: false,
      acceptAttribute: null,
    };
  }

  const files = Array.from(fileList);
  const acceptAttr = input.getAttribute('accept');
  const { isJpgAllowed, strictPngOnly } = analyzeAcceptAttribute(acceptAttr);

  let oversizedCount = 0;
  let heicCount = 0;
  let totalOriginalBytes = 0;

  const analyzedFiles: AnalyzedFileInfo[] = files.map((file) => {
    totalOriginalBytes += file.size;

    const mime = file.type.toLowerCase();
    const name = file.name.toLowerCase();
    const isHeic = isHeicFile(file);
    const isWebP = mime === 'image/webp' || name.endsWith('.webp');
    const isPng = mime === 'image/png' || name.endsWith('.png');
    const isJpg = mime === 'image/jpeg' || mime === 'image/jpg' || name.endsWith('.jpg') || name.endsWith('.jpeg');
    const isImage = isHeic || isWebP || isPng || isJpg || mime.startsWith('image/');

    const isOversized = file.size > targetMaxBytes;
    const needsConversion = isHeic || isWebP || (isPng && isOversized);

    if (isOversized) oversizedCount++;
    if (isHeic) heicCount++;

    let displayFormat = 'FILE';
    if (isHeic) displayFormat = 'HEIC';
    else if (isWebP) displayFormat = 'WEBP';
    else if (isPng) displayFormat = 'PNG';
    else if (isJpg) displayFormat = 'JPG';
    else if (mime.startsWith('image/')) displayFormat = mime.replace('image/', '').toUpperCase();

    return {
      file,
      isImage,
      isHeic,
      isWebP,
      isPng,
      isOversized,
      needsConversion,
      displayFormat,
      formattedSize: formatBytes(file.size),
    };
  });

  const requiresProcessing = analyzedFiles.some(
    (item) => item.isImage && (item.isOversized || item.needsConversion)
  );

  return {
    files,
    analyzedFiles,
    requiresProcessing,
    oversizedCount,
    heicCount,
    totalOriginalBytes,
    isJpgAllowed,
    strictPngOnly,
    acceptAttribute: acceptAttr,
  };
}
