import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Star, Heart, ChevronRight, Scale } from 'lucide-react';
import PokeBallLoader from '../../common/PokeBallLoader';
import { TYPE_COLORS } from '../../../constants/pokemon';
import { useWeaknesses } from './useWeaknesses';

/**
 * Onglet « stats » : statistiques de base, efficacité des types et lignée évolutive.
 */
export default function StatsTab({ pokemon, pokemons, isDarkMode, evoChain, loadingEvo, onNavigate, onCatch, isCaught, isFavorite, onToggleFavorite, onCompare }) {
  const weaknesses = useWeaknesses(pokemon);

  return (
    <Motion.div
      key="stats"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
        <h3 className="text-base font-black uppercase tracking-widest lg:text-lg">Statistiques</h3>
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
          <button type="button" aria-label={isFavorite ? `Retirer ${pokemon.nom} des favoris` : `Ajouter ${pokemon.nom} aux favoris`} onClick={onToggleFavorite} className={`rounded-2xl p-3 shadow-lg transition-all ${isFavorite ? 'bg-amber-400 text-white shadow-amber-400/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'}`}>
            <Star size={20} fill={isFavorite ? 'white' : 'none'} />
          </button>
          <button type="button" onClick={onCatch} className={`flex min-w-0 items-center justify-center gap-2 rounded-2xl px-4 py-3 font-black shadow-lg transition-all sm:px-6 ${isCaught ? 'bg-brand-500 text-white shadow-brand-500/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'}`}>
            <Heart size={20} fill={isCaught ? 'white' : 'none'} /> <span className="truncate text-xs sm:text-sm md:text-base">{isCaught ? 'LIBERER' : 'CAPTURER'}</span>
          </button>
          <button type="button" onClick={onCompare} className="col-span-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 font-black text-slate-500 shadow-lg transition-all hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 sm:col-auto sm:w-auto sm:px-5">
            <Scale size={18} /> <span className="text-xs sm:text-sm md:text-base">COMPARER</span>
          </button>
        </div>
      </div>

      <div className="space-y-1.5 lg:space-y-2">
        {Object.entries(pokemon.base).map(([key, val]) => (
          <div key={key}>
            <div className="mb-1 flex justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{key}</span>
              <span className="text-base font-black">{val}</span>
            </div>
            <div role="progressbar" aria-label={`${key} ${val}`} aria-valuemin={0} aria-valuemax={150} aria-valuenow={val} className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <Motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (val / 150) * 100)}%` }} className="h-full rounded-full" style={{ backgroundColor: TYPE_COLORS[pokemon.types[0].nom] }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h4 className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Efficacite subie</h4>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(weaknesses).sort((a, b) => b[1] - a[1]).map(([t, m]) => (
            <div key={t} className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-[9px] font-black shadow-sm ${m > 1 ? 'bg-brand-500/10 text-brand-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
              <span>{t}</span>
              <span className="rounded bg-white/50 px-1 py-0.5 text-[8px] dark:bg-black/20">x{m}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pb-2 pt-4 dark:border-slate-800 sm:pb-4">
        <h4 className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Lignee Evolutive</h4>
        {loadingEvo ? (
          <div role="status" className={`relative overflow-hidden rounded-[2rem] border px-4 py-5 sm:px-6 ${isDarkMode ? 'border-sky-400/10 bg-slate-950/70' : 'border-brand-100 bg-gradient-to-br from-brand-50 via-white to-sky-50'}`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(135,206,235,0.12),_transparent_35%)]" />
            <div className="relative flex flex-col items-center justify-center text-center">
              <PokeBallLoader size={78} showText={false} />
              <span className="text-[9px] font-black uppercase tracking-[0.42em] text-sky-400/80">Evolution Scan</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {evoChain.map((evo, i) => (
              <React.Fragment key={evo.id}>
                {i > 0 && (
                  <div className="flex flex-col items-center">
                    <ChevronRight size={16} className="text-slate-300" />
                    {evo.condition && <span className="mt-1 text-[7px] font-black uppercase text-brand-500">{evo.condition}</span>}
                  </div>
                )}
                <button type="button" disabled={evo.id === pokemon.id} onClick={() => { const p = pokemons.find((x) => x.id === evo.id); if (p) onNavigate(p); }} className={`group relative rounded-2xl border-2 p-2 transition-all ${evo.id === pokemon.id ? 'cursor-default border-brand-500 bg-brand-50' : 'cursor-pointer border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  <img src={evo.image} alt={evo.nom} className="h-14 w-14 object-contain transition-transform group-hover:scale-110" />
                </button>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </Motion.div>
  );
}
