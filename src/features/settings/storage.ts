import { DEFAULT_SETTINGS, FileFitSettings } from './types';

const STORAGE_KEY = 'filefit_settings';

const hasChromeStorage = (): boolean => {
  return (
    typeof chrome !== 'undefined' &&
    Boolean(chrome.storage) &&
    Boolean(chrome.storage.sync)
  );
};

export async function getSettings(): Promise<FileFitSettings> {
  if (hasChromeStorage()) {
    try {
      const result = await chrome.storage.sync.get(STORAGE_KEY);
      if (result && result[STORAGE_KEY]) {
        return { ...DEFAULT_SETTINGS, ...result[STORAGE_KEY] };
      }
    } catch (err) {
      console.warn('[FileFit] Failed to read from chrome.storage.sync:', err);
    }
  }

  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
    // Ignore localStorage errors (e.g., restricted iframe)
  }

  return DEFAULT_SETTINGS;
}

export async function updateSettings(
  partial: Partial<FileFitSettings>
): Promise<FileFitSettings> {
  const current = await getSettings();
  const updated: FileFitSettings = { ...current, ...partial };

  if (hasChromeStorage()) {
    try {
      await chrome.storage.sync.set({ [STORAGE_KEY]: updated });
    } catch (err) {
      console.warn('[FileFit] Failed to write to chrome.storage.sync:', err);
    }
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore localStorage errors
  }

  return updated;
}

export async function isDomainDisabled(
  hostname: string,
  preloadedSettings?: FileFitSettings
): Promise<boolean> {
  const settings = preloadedSettings || (await getSettings());
  if (!settings.enabled) return true;
  const cleanHost = hostname.toLowerCase();
  return settings.disabledDomains.some(
    (d) => d.toLowerCase() === cleanHost || cleanHost.endsWith(`.${d.toLowerCase()}`)
  );
}

export async function toggleDomainDisabled(hostname: string): Promise<boolean> {
  const settings = await getSettings();
  const cleanHost = hostname.toLowerCase();
  const exists = settings.disabledDomains.includes(cleanHost);

  let newDomains: string[];
  if (exists) {
    newDomains = settings.disabledDomains.filter((d) => d !== cleanHost);
  } else {
    newDomains = [...settings.disabledDomains, cleanHost];
  }

  await updateSettings({ disabledDomains: newDomains });
  return !exists;
}

export function onSettingsChanged(callback: (settings: FileFitSettings) => void): () => void {
  if (hasChromeStorage()) {
    const listener = (changes: { [key: string]: chrome.storage.StorageChange }, area: string) => {
      if (area === 'sync' && changes[STORAGE_KEY]) {
        const val = changes[STORAGE_KEY].newValue as Partial<FileFitSettings> | undefined;
        callback({ ...DEFAULT_SETTINGS, ...(val || {}) });
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }

  const storageHandler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        callback({ ...DEFAULT_SETTINGS, ...JSON.parse(e.newValue) });
      } catch {
        // Ignore
      }
    }
  };
  window.addEventListener('storage', storageHandler);
  return () => window.removeEventListener('storage', storageHandler);
}
