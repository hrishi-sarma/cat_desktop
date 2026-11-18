import React from 'react';
import { Heart, Disc, UtensilsCrossed } from 'lucide-react';

interface InteractionMenuProps {
  onPet: () => void;
  onPlay: () => void;
  onFeed: () => void;
  onClose: () => void;
}

export const InteractionMenu: React.FC<InteractionMenuProps> = ({
  onPet,
  onPlay,
  onFeed,
  onClose,
}) => {
  return (
    <div
      className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-white px-3 py-2 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in zoom-in duration-200 z-50 select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => {
          onPet();
          onClose();
        }}
        className="flex flex-col items-center p-1.5 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-colors active:scale-95"
        title="Pet Cat"
      >
        <Heart size={18} />
        <span className="text-[10px] mt-0.5 font-medium">Pet</span>
      </button>

      <button
        onClick={() => {
          onPlay();
          onClose();
        }}
        className="flex flex-col items-center p-1.5 hover:bg-amber-500/20 text-amber-400 rounded-xl transition-colors active:scale-95"
        title="Play with Yarn"
      >
        <Disc size={18} />
        <span className="text-[10px] mt-0.5 font-medium">Play</span>
      </button>

      <button
        onClick={() => {
          onFeed();
          onClose();
        }}
        className="flex flex-col items-center p-1.5 hover:bg-emerald-500/20 text-emerald-400 rounded-xl transition-colors active:scale-95"
        title="Feed Snacks"
      >
        <UtensilsCrossed size={18} />
        <span className="text-[10px] mt-0.5 font-medium">Feed</span>
      </button>
    </div>
  );
};
