import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Timer, Coffee } from 'lucide-react';

interface FocusPanelProps {
  workMinutes: number;
  breakMinutes: number;
  secondsLeft: number;
  isActive: boolean;
  mode: 'work' | 'break';
  onToggleActive: () => void;
  onReset: () => void;
  onSetWorkMinutes: (mins: number) => void;
  onSetBreakMinutes: (mins: number) => void;
  onSetMode: (mode: 'work' | 'break') => void;
  onClose: () => void;
  catName: string;
}

export const FocusPanel: React.FC<FocusPanelProps> = ({
  workMinutes,
  breakMinutes,
  secondsLeft,
  isActive,
  mode,
  onToggleActive,
  onReset,
  onSetWorkMinutes,
  onSetBreakMinutes,
  onSetMode,
  onClose,
  catName,
}) => {
  const [editingWork, setEditingWork] = useState(false);
  const [editingBreak, setEditingBreak] = useState(false);
  const workInputRef = useRef<HTMLInputElement>(null);
  const breakInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingWork && workInputRef.current) workInputRef.current.focus();
  }, [editingWork]);

  useEffect(() => {
    if (editingBreak && breakInputRef.current) breakInputRef.current.focus();
  }, [editingBreak]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const applyWorkMinutes = (val: number) => {
    const clamped = Math.max(1, Math.min(180, val || 25));
    onSetWorkMinutes(clamped);
    setEditingWork(false);
  };

  const applyBreakMinutes = (val: number) => {
    const clamped = Math.max(1, Math.min(60, val || 5));
    onSetBreakMinutes(clamped);
    setEditingBreak(false);
  };

  return (
    <div className="absolute inset-x-2 top-11 bottom-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-3 flex flex-col justify-between z-50 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5">
          <Timer size={16} className="text-rose-400" />
          <h3 className="text-xs font-bold text-slate-100">Focus Timer with {catName}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Mode + Editable Duration */}
      <div className="flex flex-col items-center gap-2 my-1">
        {/* Mode Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSetMode('work')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
              mode === 'work'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Timer size={12} /> Work
          </button>
          <button
            onClick={() => onSetMode('break')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
              mode === 'break'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Coffee size={12} /> Break
          </button>
        </div>

        {/* Editable duration — click the number to edit */}
        {!isActive && (
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span>Duration:</span>
            {mode === 'work' ? (
              editingWork ? (
                <input
                  ref={workInputRef}
                  type="number"
                  min={1}
                  max={180}
                  defaultValue={workMinutes}
                  onBlur={(e) => applyWorkMinutes(parseInt(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter')
                      applyWorkMinutes(parseInt((e.target as HTMLInputElement).value));
                    if (e.key === 'Escape') setEditingWork(false);
                  }}
                  className="w-14 bg-slate-950 text-amber-300 text-center rounded px-1.5 py-0.5 text-xs font-black outline-none border-2 border-rose-500 focus:bg-slate-950 focus:text-amber-300 focus:border-rose-400 caret-amber-400 selection:bg-amber-500 selection:text-slate-950"
                />
              ) : (
                <button
                  onClick={() => setEditingWork(true)}
                  className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded font-bold text-white border border-slate-600 hover:border-rose-400 transition-colors"
                  title="Click to edit duration"
                >
                  {workMinutes}m
                </button>
              )
            ) : editingBreak ? (
              <input
                ref={breakInputRef}
                type="number"
                min={1}
                max={60}
                defaultValue={breakMinutes}
                onBlur={(e) => applyBreakMinutes(parseInt(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter')
                    applyBreakMinutes(parseInt((e.target as HTMLInputElement).value));
                  if (e.key === 'Escape') setEditingBreak(false);
                }}
                className="w-14 bg-slate-950 text-amber-300 text-center rounded px-1.5 py-0.5 text-xs font-black outline-none border-2 border-emerald-500 focus:bg-slate-950 focus:text-amber-300 focus:border-emerald-400 caret-amber-400 selection:bg-amber-500 selection:text-slate-950"
              />
            ) : (
              <button
                onClick={() => setEditingBreak(true)}
                className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded font-bold text-white border border-slate-600 hover:border-emerald-400 transition-colors"
                title="Click to edit duration"
              >
                {breakMinutes}m
              </button>
            )}
            <span className="text-slate-500 text-[10px]">(click to edit)</span>
          </div>
        )}
      </div>

      {/* Timer Display */}
      <div className="flex flex-col items-center justify-center my-1">
        <div className="text-4xl font-extrabold tracking-tight text-white font-mono bg-slate-950/60 px-5 py-2 rounded-2xl border border-slate-800 shadow-inner">
          {formatTime(secondsLeft)}
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5">
          {mode === 'break'
            ? `${catName} is resting too 😴`
            : `Stay focused! ${catName} is cheering for you 🐱`}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onToggleActive}
          className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg active:scale-95 ${
            isActive
              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
        >
          {isActive ? (
            <>
              <Pause size={14} fill="currentColor" /> Pause
            </>
          ) : (
            <>
              <Play size={14} fill="currentColor" /> Start Focus
            </>
          )}
        </button>

        <button
          onClick={onReset}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
          title="Reset Timer"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
};
