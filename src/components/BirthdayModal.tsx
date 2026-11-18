import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Gift, Sparkles, X } from 'lucide-react';

interface BirthdayModalProps {
  catName: string;
  ownerName: string;
  onClose: () => void;
}

export const BirthdayModal: React.FC<BirthdayModalProps> = ({
  catName,
  ownerName,
  onClose,
}) => {
  useEffect(() => {
    // Trigger confetti explosion
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.warn('Confetti fail', e);
    }
  }, []);

  return (
    <div className="absolute inset-x-2 top-11 bottom-2 bg-slate-900/95 backdrop-blur-xl border-2 border-rose-500/80 rounded-2xl p-4 flex flex-col items-center justify-between z-50 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-300 select-none text-center">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>

      <div className="flex flex-col items-center mt-1">
        <div className="text-4xl animate-bounce mb-1">🎉 🐱 🎂</div>
        <h2 className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-purple-400 flex items-center gap-1">
          HAPPY BIRTHDAY, {ownerName.toUpperCase()}!
        </h2>
        <span className="text-[10px] text-rose-300 font-semibold flex items-center gap-1 mt-0.5">
          <Sparkles size={10} /> Special Message from {catName}
        </span>
      </div>

      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 my-2 text-xs leading-relaxed text-slate-200 shadow-inner">
        <p className="italic">
          "{ownerName}... I noticed it's your special day today! I brought you a gift, put on my birthday hat, and purred extra loud just for you. Thank you for being such a wonderful human to me!"
        </p>
      </div>

      <button
        onClick={onClose}
        className="w-full py-2 bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
      >
        <Gift size={14} /> Open Birthday Gift (+100 Coins & Party Hat)
      </button>
    </div>
  );
};
