/**
 * Lazy-loads heic2any ONLY when a HEIC/HEIF file is encountered.
 * Converts HEIC/HEIF blob to a standard JPEG blob.
 */
export async function convertHeicToJpegBlob(file: File | Blob): Promise<Blob> {
  try {
    const heic2anyModule = await import('heic2any');
    const heic2any = (heic2anyModule.default || heic2anyModule) as (
      options: { blob: Blob; toType?: string; quality?: number }
    ) => Promise<Blob | Blob[]>;

    const result = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.92,
    });

    if (Array.isArray(result)) {
      return result[0];
    }
    return result;
  } catch (err) {
    console.error('[FileFit] Failed to convert HEIC to JPEG:', err);
    throw new Error(
      `HEIC conversion failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}
