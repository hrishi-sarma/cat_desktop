import React from 'react';
import { CatDeskSettings, CatPersonalityType, CatSkin, ViewMode } from '../types/cat';
import { Settings, X, Volume2, VolumeX, Shield, Eye, Sparkles } from 'lucide-react';
import { setAlwaysOnTop } from '../services/windowManager';

interface SettingsPanelProps {
  settings: CatDeskSettings;
  onUpdateSettings: (newSettings: Partial<CatDeskSettings>) => void;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const handleToggleAlwaysOnTop = (val: boolean) => {
    onUpdateSettings({ alwaysOnTop: val });
    setAlwaysOnTop(val);
  };

  return (
    <div className="absolute inset-x-2 top-11 bottom-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-3 flex flex-col z-50 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <div className="flex items-center gap-1.5">
          <Settings size={16} className="text-purple-400" />
          <h3 className="text-xs font-bold text-slate-100">CatDesk Settings</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Settings Form List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar text-xs">
        {/* Cat Name & Owner Name */}
        <div className="grid grid-cols-2 gap-2 bg-slate-800/60 p-2 rounded-xl border border-slate-700/60">
          <div>
            <label className="block text-[10px] text-slate-400 font-semibold mb-0.5">
              Cat Name
            </label>
            <input
              type="text"
              value={settings.catName}
              onChange={(e) => onUpdateSettings({ catName: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 font-semibold mb-0.5">
              Owner Name
            </label>
            <input
              type="text"
              value={settings.ownerName}
              onChange={(e) => onUpdateSettings({ ownerName: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Cat Personality */}
        <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/60">
          <label className="block text-[10px] text-slate-400 font-semibold mb-1">
            Cat Personality
          </label>
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'lazy', name: '😴 Lazy' },
              { id: 'energetic', name: '⚡ Energetic' },
              { id: 'mischievous', name: '😼 Mischievous' },
              { id: 'affectionate', name: '🥰 Affectionate' },
              { id: 'grumpy', name: '😾 Grumpy' },
              { id: 'curious', name: '🧠 Curious' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() =>
                  onUpdateSettings({ personality: p.id as CatPersonalityType })
                }
                className={`py-1 rounded-lg text-[10px] font-bold transition-all ${
                  settings.personality === p.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Cat Coat Skin */}
        <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/60">
          <label className="block text-[10px] text-slate-400 font-semibold mb-1">
            Cat Coat Breed
          </label>
          <div className="grid grid-cols-3 gap-1 text-[10px]">
            {[
              { id: 'orange', name: '🐱 Orange Tabby' },
              { id: 'tuxedo', name: '🐧 Tuxedo' },
              { id: 'calico', name: '🦊 Calico' },
              { id: 'black', name: '🐈‍⬛ Black Cat' },
              { id: 'snow', name: '❄️ Snow White' },
              { id: 'grey_tabby', name: '🐺 Grey Tabby' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => onUpdateSettings({ skin: s.id as CatSkin })}
                className={`py-1 rounded-lg font-semibold transition-all ${
                  settings.skin === s.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Display View Modes */}
        <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/60">
          <label className="block text-[10px] text-slate-400 font-semibold mb-1 flex items-center gap-1">
            <Eye size={12} className="text-sky-400" /> View Display Mode
          </label>
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'room', name: '🏠 Room' },
              { id: 'transparent', name: '👻 Floating' },
              { id: 'minimal', name: '🐾 Minimal' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => onUpdateSettings({ viewMode: m.id as ViewMode })}
                className={`py-1 rounded-lg text-[10px] font-bold transition-all ${
                  settings.viewMode === m.id
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>



        {/* Toggles */}
        <div className="space-y-1.5 bg-slate-800/60 p-2 rounded-xl border border-slate-700/60 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-300">
              {settings.soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />} Audio Sound Effects
            </span>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
              className="rounded bg-slate-900 border-slate-700 text-purple-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-300">
              <Shield size={12} /> Always On Top Window
            </span>
            <input
              type="checkbox"
              checked={settings.alwaysOnTop}
              onChange={(e) => handleToggleAlwaysOnTop(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-purple-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-300">
              <Sparkles size={12} /> Energy Saver Mode (30 FPS)
            </span>
            <input
              type="checkbox"
              checked={settings.performanceMode}
              onChange={(e) => onUpdateSettings({ performanceMode: e.target.checked })}
              className="rounded bg-slate-900 border-slate-700 text-purple-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
