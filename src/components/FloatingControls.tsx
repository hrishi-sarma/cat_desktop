import React from 'react';
import {
  CheckSquare,
  Timer,
  FileText,
  Home,
  Settings,
  GripHorizontal,
  Pin,
  PinOff,
  Power,
} from 'lucide-react';
import { startWindowDrag, closeAppWindow } from '../services/windowManager';

interface FloatingControlsProps {
  onOpenPanel: (panel: 'tasks' | 'focus' | 'notes' | 'shop' | 'settings') => void;
  activePanel: string | null;
  catName: string;
  alwaysOnTop: boolean;
  onTogglePin: () => void;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  onOpenPanel,
  activePanel,
  catName,
  alwaysOnTop,
  onTogglePin,
}) => {
  return (
    <div
      data-tauri-drag-region
      className="absolute top-0 left-0 right-0 p-2 flex items-center justify-between pointer-events-auto z-40 select-none"
    >
      {/* Drag handle & Cat name */}
      <div
        data-tauri-drag-region
        onMouseDown={startWindowDrag}
        className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700 cursor-grab active:cursor-grabbing text-xs text-white shadow-lg whitespace-nowrap"
        title="Click & drag to move window"
      >
        <GripHorizontal size={14} className="text-slate-400" />
        <span className="text-[11px] text-slate-200 font-semibold">{catName}</span>
      </div>

      {/* Quick Access Menu Bar + Pin Toggle + Quit Button */}
      <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-full border border-slate-700 shadow-lg">
        {/* Pin / Always On Top Toggle */}
        <button
          onClick={onTogglePin}
          className={`p-1.5 rounded-full transition-all ${
            alwaysOnTop
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
          title={
            alwaysOnTop
              ? 'Pinned On Top — click to unpin'
              : 'Unpinned — click to pin on top of all windows'
          }
        >
          {alwaysOnTop ? <Pin size={14} fill="currentColor" /> : <PinOff size={14} />}
        </button>

        <div className="w-[1px] h-3.5 bg-slate-700 mx-0.5" />

        <button
          onClick={() => onOpenPanel('tasks')}
          className={`p-1.5 rounded-full transition-all ${
            activePanel === 'tasks'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-200 hover:bg-slate-800 hover:text-white'
          }`}
          title="Tasks"
        >
          <CheckSquare size={14} />
        </button>

        <button
          onClick={() => onOpenPanel('focus')}
          className={`p-1.5 rounded-full transition-all ${
            activePanel === 'focus'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-200 hover:bg-slate-800 hover:text-white'
          }`}
          title="Focus Timer"
        >
          <Timer size={14} />
        </button>

        <button
          onClick={() => onOpenPanel('notes')}
          className={`p-1.5 rounded-full transition-all ${
            activePanel === 'notes'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-200 hover:bg-slate-800 hover:text-white'
          }`}
          title="Notes"
        >
          <FileText size={14} />
        </button>

        <button
          onClick={() => onOpenPanel('shop')}
          className={`p-1.5 rounded-full transition-all ${
            activePanel === 'shop'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-200 hover:bg-slate-800 hover:text-white'
          }`}
          title="Accessories & Rooms"
        >
          <Home size={14} />
        </button>

        <button
          onClick={() => onOpenPanel('settings')}
          className={`p-1.5 rounded-full transition-all ${
            activePanel === 'settings'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-200 hover:bg-slate-800 hover:text-white'
          }`}
          title="Settings"
        >
          <Settings size={14} />
        </button>

        {/* Quit App Button */}
        <button
          onClick={() => closeAppWindow()}
          className="p-1.5 rounded-full text-slate-400 hover:bg-rose-600 hover:text-white transition-all ml-0.5"
          title="Quit CatDesk Application"
        >
          <Power size={14} />
        </button>
      </div>
    </div>
  );
};
