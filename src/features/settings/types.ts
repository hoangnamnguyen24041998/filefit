export type FileFitMode = 'manual' | 'auto';

export interface FileFitSettings {
  enabled: boolean;
  mode: FileFitMode;
  targetMaxBytes: number;
  convertToJpg: boolean;
  disabledDomains: string[];
}

export const SIZE_PRESETS: { label: string; bytes: number }[] = [
  { label: '< 500 KB', bytes: 500 * 1024 },
  { label: '< 1 MB', bytes: 1024 * 1024 },
  { label: '< 2 MB', bytes: 2 * 1024 * 1024 },
];

export const DEFAULT_SETTINGS: FileFitSettings = {
  enabled: true,
  mode: 'manual',
  targetMaxBytes: 1024 * 1024, // 1 MB
  convertToJpg: true,
  disabledDomains: [],
};
