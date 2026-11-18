import React from 'react';

interface DialogueBubbleProps {
  text: string;
  x: number;
  y: number;
  catName: string;
  onClose?: () => void;
}

export const DialogueBubble: React.FC<DialogueBubbleProps> = ({
  text,
  x,
  y,
  catName,
  onClose,
}) => {
  return (
    <div
      onClick={onClose}
      className="absolute bg-slate-900/90 border border-slate-700/90 backdrop-blur-md text-slate-100 text-[11px] px-2.5 py-1.5 rounded-2xl shadow-xl z-40 max-w-[200px] animate-in fade-in slide-in-from-bottom-2 duration-200 cursor-pointer select-none"
      style={{
        left: `${Math.max(10, Math.min(x - 90, 110))}px`,
        top: `${Math.max(45, y - 55)}px`,
      }}
    >
      <div className="font-bold text-[9px] text-amber-400 mb-0.5">{catName}</div>
      <div className="leading-tight">{text}</div>
      {/* Triangle pointer */}
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900/90" />
    </div>
  );
};
