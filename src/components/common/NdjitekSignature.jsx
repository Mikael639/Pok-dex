import React from 'react';
import { Cpu } from 'lucide-react';

/**
 * Composant de signature NDJITEK
 * Design Premium / Tech pour s'accorder avec le logo d'origine.
 */
export default function NdjitekSignature({ isExpanded }) {
  return (
    <div 
      className={`
        mt-2 mx-2 p-3 rounded-2xl transition-all duration-500 flex items-center gap-3 overflow-hidden
        ${isExpanded 
          ? 'bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 shadow-sm' 
          : 'bg-transparent border-transparent'}
      `}
    >
      <div className="relative flex-shrink-0">
        {/* Icône Tech rappelant le lion du logo par sa symétrie/puissance */}
        <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2 rounded-xl shadow-lg shadow-cyan-500/20">
          <Cpu className="h-5 w-5 text-white" />
        </div>
        <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 animate-pulse pointer-events-none" />
      </div>
      
      {isExpanded && (
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-tight">
            Propulsé par
          </span>
          <span className="text-sm font-black tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-700 dark:from-cyan-400 dark:to-blue-500">
            NDJITEK
          </span>
        </div>
      )}
    </div>
  );
}
