import React, { useState } from 'react';
import { CatPersonalityType, CatSkin } from '../types/cat';

interface FirstLaunchModalProps {
  onComplete: (name: string, personality: CatPersonalityType, skin: CatSkin) => void;
}

export const FirstLaunchModal: React.FC<FirstLaunchModalProps> = ({ onComplete }) => {
  const [name, setName] = useState('Katto');
  const [personality, setPersonality] = useState<CatPersonalityType>('affectionate');
  const [skin, setSkin] = useState<CatSkin>('orange');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(name.trim() || 'Katto', personality, skin);
  };

  return (
    <div className="absolute inset-0 bg-black z-50 text-white select-none flex flex-col p-5 font-sans border border-zinc-800 shadow-2xl animate-in fade-in duration-300 overflow-hidden">
      {/* Top Header */}
      <div className="border-b border-zinc-800 pb-2.5 mb-3 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-sm font-black tracking-widest uppercase text-white">
            Adopt Companion
          </h2>
          <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
            Configure your desktop pet
          </p>
        </div>
        <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-wider border border-zinc-800 px-2 py-0.5 rounded">
          CatDesk v1.0
        </span>
      </div>

      {/* Main Adoption Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">
        {/* Name Input */}
        <div className="flex-shrink-0">
          <label className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1">
            Companion Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name (e.g. Katto)"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-white font-bold focus:outline-none focus:border-white placeholder:text-zinc-700 transition-all"
            required
          />
        </div>

        {/* Personality Selector */}
        <div className="flex-shrink-0">
          <label className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1.5">
            Personality Type
          </label>
          <div className="grid grid-cols-4 gap-1.5 text-[10px]">
            {[
              { id: 'affectionate', name: 'Affectionate' },
              { id: 'energetic', name: 'Energetic' },
              { id: 'lazy', name: 'Lazy' },
              { id: 'mischievous', name: 'Mischievous' },
            ].map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => setPersonality(p.id as any)}
                className={`py-2 rounded-lg font-bold transition-all text-center border text-[10px] ${
                  personality === p.id
                    ? 'bg-white text-black border-white shadow-md'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-200 hover:border-zinc-600'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Coat Pattern Selector */}
        <div className="flex-shrink-0">
          <label className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1.5">
            Coat Pattern
          </label>
          <div className="grid grid-cols-3 gap-1.5 text-[10px]">
            {[
              { id: 'orange', name: 'Orange Tabby' },
              { id: 'tuxedo', name: 'Classic Tuxedo' },
              { id: 'calico', name: 'Calico' },
            ].map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => setSkin(s.id as any)}
                className={`py-2 rounded-lg font-bold transition-all text-center border text-[10px] ${
                  skin === s.id
                    ? 'bg-white text-black border-white shadow-md'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-200 hover:border-zinc-600'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Confirm Adopt Button — always visible at bottom */}
        <div className="flex-shrink-0 mt-auto pt-1">
          <button
            type="submit"
            className="w-full py-2.5 bg-white hover:bg-zinc-100 text-black font-black text-xs rounded-xl shadow-lg transition-all active:scale-[0.98] uppercase tracking-widest border border-white cursor-pointer"
          >
            Confirm and Adopt Companion
          </button>
        </div>
      </form>
    </div>
  );
};
