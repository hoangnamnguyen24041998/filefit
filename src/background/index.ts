import { DEFAULT_SETTINGS, FileFitSettings } from '../features/settings/types';

const STORAGE_KEY = 'filefit_settings';

async function updateBadgeForTab(tabId?: number, url?: string) {
  try {
    const data = await chrome.storage.sync.get(STORAGE_KEY);
    const raw = data[STORAGE_KEY] as Partial<FileFitSettings> | undefined;
    const settings: FileFitSettings = { ...DEFAULT_SETTINGS, ...(raw || {}) };

    if (!settings.enabled) {
      await chrome.action.setBadgeText({ text: 'OFF', tabId });
      await chrome.action.setBadgeBackgroundColor({ color: '#71717A', tabId });
      return;
    }

    if (url) {
      try {
        const parsedUrl = new URL(url);
        const host = parsedUrl.hostname.toLowerCase();
        const isPaused = settings.disabledDomains.some(
          (d) => d.toLowerCase() === host || host.endsWith(`.${d.toLowerCase()}`)
        );

        if (isPaused) {
          await chrome.action.setBadgeText({ text: 'PAUSE', tabId });
          await chrome.action.setBadgeBackgroundColor({ color: '#F59E0B', tabId });
          return;
        }
      } catch {
        // Not a standard URL (e.g. chrome://)
      }
    }

    // Default active state: clear text or subtle dot
    await chrome.action.setBadgeText({ text: '', tabId });
  } catch (err) {
    console.warn('[FileFit] Failed to update badge:', err);
  }
}

// Initialize default settings on extension installation
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    const existing = await chrome.storage.sync.get(STORAGE_KEY);
    if (!existing[STORAGE_KEY]) {
      await chrome.storage.sync.set({ [STORAGE_KEY]: DEFAULT_SETTINGS });
    }
    console.log('[FileFit] Installed with default settings:', DEFAULT_SETTINGS);
  }
});

// Update badge when tab is activated or updated
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    await updateBadgeForTab(activeInfo.tabId, tab.url);
  } catch {
    // Tab might be closing
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    await updateBadgeForTab(tabId, tab.url);
  }
});

// React to storage setting changes
chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area === 'sync' && changes[STORAGE_KEY]) {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs[0]?.id) {
        await updateBadgeForTab(tabs[0].id, tabs[0].url);
      }
    } catch {
      // Ignore
    }
  }
});
