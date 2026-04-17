import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Globe, Compass, Sparkles } from 'lucide-react';
import { POKEMON_GENERATIONS } from '../../constants/gameMeta';

const REGION_NAMES = [
  'Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola', 'Galar', 'Paldea'
];

export default function RegionExplorer({ pokemons, team, favorites, onSelectRegion, activeRegion, isDarkMode }) {
  // Calcul de la progression par région
  const regionStats = (POKEMON_GENERATIONS || []).map((gen, index) => {
    const list = pokemons || [];
    const t = team || [];
    const f = favorites || [];
    
    const regionPokemons = list.filter(p => p.id >= gen.start && p.id <= gen.end);
    const discovered = regionPokemons.filter(p => 
      t.some(teamMember => teamMember?.id === p.id) || f.includes(p.id)
    ).length;
    
    return {
      id: gen.gen,
      name: REGION_NAMES[index],
      total: regionPokemons.length,
      discovered,
      percent: Math.round((discovered / regionPokemons.length) * 100) || 0,
      start: gen.start
    };
  });

  return (
    <div className="mb-10 relative">
      {/* Background Glow Decors */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-rose-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/10 blur-[100px] pointer-events-none" />

      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/50 backdrop-blur-md shadow-sm">
            <Globe size={18} className="text-rose-500" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tighter leading-none dark:text-white">Explorateur</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1 opacity-80">Générations 1 à 9</p>
          </div>
        </div>
        
        {activeRegion && (
          <Motion.button 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => onSelectRegion(null)}
            className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-2"
          >
            Réinitialiser <Sparkles size={12} />
          </Motion.button>
        )}
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-4 -mx-4 items-stretch scroll-smooth no-scrollbar">
        {regionStats.map((region) => {
          const isActive = activeRegion === region.id;
          
          return (
            <Motion.button
              key={region.id}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectRegion(region.id)}
              className={`flex-shrink-0 min-w-[170px] p-5 rounded-[2.5rem] border-2 transition-all duration-500 relative overflow-hidden group ${
                isActive 
                  ? 'border-transparent text-white shadow-2xl shadow-rose-500/30' 
                  : 'bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border-white/40 dark:border-slate-800/50 hover:border-rose-300 dark:hover:border-rose-900'
              }`}
            >
              {/* Background Active Gradient */}
              <AnimatePresence>
                {isActive && (
                  <Motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="absolute inset-0 bg-gradient-to-br from-rose-500 via-rose-600 to-orange-500"
                  />
                )}
              </AnimatePresence>

              {/* Decorative Compass Icon */}
              <Compass 
                size={70} 
                className={`absolute -bottom-4 -right-4 opacity-5 transition-all duration-1000 group-hover:rotate-[360deg] group-hover:scale-110 ${
                  isActive ? 'text-white opacity-10' : 'text-slate-400'
                }`} 
              />

              <div className="relative z-10 text-left h-full flex flex-col justify-between">
                <div>
                  <div className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1.5 transition-colors ${isActive ? 'text-white/60' : 'text-slate-400'}`}>
                    0{region.id} — GEN
                  </div>
                  <div className={`text-lg font-black uppercase tracking-tight leading-none truncate transition-colors ${isActive ? 'text-white' : 'dark:text-white text-slate-900'}`}>{region.name}</div>
                </div>
                
                <div className="mt-8 space-y-2.5">
                  <div className={`flex justify-between items-end text-[9px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-white' : 'text-slate-500'}`}>
                    <span className="opacity-70">{region.discovered} / {region.total}</span>
                    <span className="text-xs">{region.percent}%</span>
                  </div>
                  
                  <div className={`h-1.5 rounded-full overflow-hidden transition-colors ${isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800/80'}`}>
                    <Motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${region.percent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full relative ${
                        isActive 
                          ? 'bg-white' 
                          : 'bg-gradient-to-r from-rose-500 to-orange-400 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                      }`}
                    >
                      {isActive && <div className="absolute inset-0 bg-white blur-[2px] opacity-50" />}
                    </Motion.div>
                  </div>
                </div>
              </div>

              {/* Selection Glow */}
              {isActive && (
                <div className="absolute top-0 right-0 w-12 h-12 bg-white/20 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
              )}
            </Motion.button>
          );
        })}
      </div>
    </div>
  );
}
