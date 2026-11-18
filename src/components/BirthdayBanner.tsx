import React, { useState, useEffect } from 'react';

export const BirthdayBanner: React.FC = () => {
  const [name, setName] = useState<'UMAMAH' | 'Tiny Labubu'>('UMAMAH');

  useEffect(() => {
    // Every 10s, switch name to 'Tiny Labubu' for 3 seconds, then switch back to 'UMAMAH'
    const interval = setInterval(() => {
      setName('Tiny Labubu');
      setTimeout(() => {
        setName('UMAMAH');
      }, 3000);
    }, 13000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-11 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-600 via-amber-500 to-pink-600 text-slate-950 px-4 py-1 rounded-full border-2 border-amber-300 shadow-xl flex items-center gap-1.5 z-40 select-none animate-pulse">
      <span className="text-xs font-black tracking-wide whitespace-nowrap drop-shadow-sm uppercase">
        🎉 HAPPY BIRTHDAY {name} 🎉
      </span>
    </div>
  );
};
