import React from 'react';

/**
 * PokeBallLoader Component
 * CSS-only Pokeball loader for transient loading states.
 */
const PokeBallLoader = ({ size = 60, showText = true }) => {
  const borderWidth = Math.max(2, Math.round(size * 0.05));

  return (
    <div className="flex flex-col items-center justify-center p-4 select-none pointer-events-none">
      <div
        className="relative"
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-xl" />
        <div
          className="relative h-full w-full rounded-full"
          style={{ animation: 'pokeball-spin 1.35s linear infinite' }}
        >
          <div
            className="relative h-full w-full overflow-hidden rounded-full border-slate-950 shadow-[0_10px_30px_rgba(15,23,42,0.22)]"
            style={{ borderWidth }}
          >
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-rose-400 to-rose-600" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white" />
            <div
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-slate-950"
              style={{ height: borderWidth }}
            />
            <div className="absolute left-[18%] top-[16%] h-[20%] w-[38%] rotate-[-24deg] rounded-full bg-white/30 blur-sm" />
            <div
              className="absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-slate-950 bg-white shadow-inner"
              style={{
                width: `${size * 0.34}px`,
                height: `${size * 0.34}px`,
                borderWidth,
              }}
            >
              <div
                className="rounded-full border border-slate-300 bg-slate-100"
                style={{ width: `${size * 0.14}px`, height: `${size * 0.14}px` }}
              />
            </div>
          </div>
        </div>
      </div>

      {showText && (
        <p className="mt-3 text-[9px] font-black uppercase tracking-[0.28em] text-rose-500 animate-pulse">
          Analyse en cours...
        </p>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pokeball-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

export default PokeBallLoader;
