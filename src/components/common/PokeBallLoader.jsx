import React from 'react';

/**
 * PokeBallLoader Component
 * Simple and robust CSS-only PokeBall loader as Lottie public URLs are often restricted.
 */
const PokeBallLoader = ({ size = 60, showText = true }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 select-none pointer-events-none">
      <div 
        className="relative animate-spin-slow" 
        style={{ width: size, height: size, transition: 'var(--duration) linear infinite' }}
      >
        {/* Main Ball Section */}
        <div className="w-full h-full rounded-full border-[3px] border-slate-950 overflow-hidden relative shadow-lg">
           {/* Top Red Half */}
           <div className="absolute top-0 left-0 w-full h-1/2 bg-rose-500 border-b-[3px] border-slate-950" />
           {/* Bottom White Half */}
           <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white" />
           {/* Inner Button Detail */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-white border-[3px] border-slate-950 rounded-full z-10 flex items-center justify-center">
              <div className="w-1/2 h-1/2 bg-slate-100 border border-slate-200 rounded-full" />
           </div>
        </div>
      </div>
      
      {showText && (
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-500 mt-3 animate-pulse">
          Attrapez-les tous...
        </p>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pokeball-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: pokeball-spin 1.5s linear infinite;
        }
      `}} />
    </div>
  );
};

export default PokeBallLoader;
