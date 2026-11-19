import React, { useEffect, useState } from 'react';
import {
  Globe,
  Sliders,
  Zap,
  ShieldCheck,
  Power,
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import {
  DEFAULT_SETTINGS,
  FileFitMode,
  FileFitSettings,
  SIZE_PRESETS,
} from '../features/settings/types';
import {
  getSettings,
  updateSettings,
  onSettingsChanged,
} from '../features/settings/storage';

export const App: React.FC = () => {
  const [settings, setSettings] = useState<FileFitSettings>(DEFAULT_SETTINGS);
  const [currentHost, setCurrentHost] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial settings
    getSettings().then((loaded) => {
      setSettings(loaded);
      setLoading(false);
    });

    // Detect active tab domain
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs[0]?.url) {
          try {
            const url = new URL(tabs[0].url);
            if (url.protocol.startsWith('http')) {
              setCurrentHost(url.hostname);
            } else {
              setCurrentHost(null);
            }
          } catch {
            setCurrentHost(null);
          }
        }
      });
    } else {
      setCurrentHost(window.location.hostname || 'localhost');
    }

    // Subscribe to external storage updates
    const unsubscribe = onSettingsChanged((updated) => {
      setSettings(updated);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleMaster = async () => {
    const updated = await updateSettings({ enabled: !settings.enabled });
    setSettings(updated);
  };

  const handleModeChange = async (mode: FileFitMode) => {
    const updated = await updateSettings({ mode });
    setSettings(updated);
  };

  const handleTargetSizeChange = async (bytes: number) => {
    const updated = await updateSettings({ targetMaxBytes: bytes });
    setSettings(updated);
  };

  const handleToggleConvertToJpg = async () => {
    const updated = await updateSettings({ convertToJpg: !settings.convertToJpg });
    setSettings(updated);
  };

  const isCurrentDomainPaused = Boolean(
    currentHost &&
      settings.disabledDomains.some(
        (d) =>
          d.toLowerCase() === currentHost.toLowerCase() ||
          currentHost.toLowerCase().endsWith(`.${d.toLowerCase()}`)
      )
  );

  const handleToggleDomainPause = async () => {
    if (!currentHost) return;
    const cleanHost = currentHost.toLowerCase();
    let newDomains: string[];
    if (isCurrentDomainPaused) {
      newDomains = settings.disabledDomains.filter(
        (d) => d.toLowerCase() !== cleanHost
      );
    } else {
      newDomains = [...settings.disabledDomains, cleanHost];
    }
    const updated = await updateSettings({ disabledDomains: newDomains });
    setSettings(updated);
  };

  if (loading) {
    return (
      <div className="w-[320px] h-96 flex items-center justify-center bg-white">
        <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-[320px] bg-white text-zinc-950 font-sans select-none overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="px-4 py-3.5 flex items-center justify-between border-b border-zinc-100 bg-white">
        <BrandLogo size={24} showWordmark />

        {/* Master Power Button Toggle */}
        <button
          type="button"
          role="switch"
          aria-checked={settings.enabled}
          onClick={handleToggleMaster}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
            settings.enabled
              ? 'bg-zinc-950 text-white shadow-subtle hover:bg-zinc-800'
              : 'bg-zinc-100 text-zinc-400 hover:text-zinc-600'
          }`}
          title={settings.enabled ? 'Disable FileFit globally' : 'Enable FileFit globally'}
        >
          <Power size={12} strokeWidth={2.2} />
          <span>{settings.enabled ? 'Active' : 'Off'}</span>
        </button>
      </div>

      {/* Main Settings Container */}
      <div className={`p-4 space-y-4 transition-opacity ${settings.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        {/* Active Site Card */}
        {currentHost ? (
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/50 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Globe size={15} className="text-zinc-400 flex-shrink-0" strokeWidth={1.75} />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-zinc-900 truncate">
                  {currentHost}
                </p>
                <p className="text-[10px] text-zinc-400 leading-tight">
                  {isCurrentDomainPaused ? 'Interception paused' : 'Auto-intercepting uploads'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleDomainPause}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors flex-shrink-0 border ${
                isCurrentDomainPaused
                  ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
              }`}
            >
              {isCurrentDomainPaused ? 'Resume' : 'Pause'}
            </button>
          </div>
        ) : (
          <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-200/50 text-xs text-zinc-400 flex items-center gap-2">
            <Globe size={14} />
            <span>Navigate to a webpage to inspect site rules</span>
          </div>
        )}

        {/* Operating Mode Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-zinc-600 tracking-tight">
              OPERATING MODE
            </label>
            <span className="text-[10px] text-zinc-400">
              {settings.mode === 'manual' ? 'Interactive' : 'Background'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200/50">
            <button
              type="button"
              onClick={() => handleModeChange('manual')}
              className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                settings.mode === 'manual'
                  ? 'bg-white text-zinc-950 shadow-subtle border border-zinc-950/[0.06]'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Sliders size={13} strokeWidth={1.75} />
              <span>Manual Assist</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('auto')}
              className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                settings.mode === 'auto'
                  ? 'bg-white text-zinc-950 shadow-subtle border border-zinc-950/[0.06]'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Zap size={13} strokeWidth={1.75} />
              <span>Auto-Fit</span>
            </button>
          </div>

          <p className="text-[11px] text-zinc-500 leading-tight pt-0.5">
            {settings.mode === 'manual'
              ? 'Shows floating widget to review, tune size, and apply.'
              : 'Silently compresses images on upload without interrupting.'}
          </p>
        </div>

        {/* Target Max Size Presets */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-zinc-600 tracking-tight">
            DEFAULT TARGET SIZE
          </label>
          <div className="grid grid-cols-3 gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200/50">
            {SIZE_PRESETS.map((preset) => {
              const isSelected = settings.targetMaxBytes === preset.bytes;
              return (
                <button
                  key={preset.bytes}
                  type="button"
                  onClick={() => handleTargetSizeChange(preset.bytes)}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-all text-center tabular-nums ${
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

        {/* Convert to JPG Tactile Switch */}
        <div className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-xl border border-zinc-200/40">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-zinc-900 block leading-none">
              Auto-convert to JPG
            </span>
            <span className="text-[10px] text-zinc-500 block leading-tight">
              Converts HEIC, WebP, and heavy PNGs
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={settings.convertToJpg}
            onClick={handleToggleConvertToJpg}
            className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
              settings.convertToJpg ? 'bg-zinc-950' : 'bg-zinc-300'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-150 ${
                settings.convertToJpg ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Footer Strip */}
      <div className="px-4 py-2.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={13} strokeWidth={1.75} className="text-emerald-600" />
          <span className="text-zinc-500 font-medium">100% On-Device</span>
        </div>
        <span className="text-[10px] text-zinc-400 font-mono">v1.0.0</span>
      </div>
    </div>
  );
};
