import React, { useMemo } from 'react';
import { TYPE_COLORS, TYPE_CHART } from '../../constants/pokemon';
import { ShieldAlert, Info, TrendingUp, TrendingDown } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

export default function TeamSynergy({ team, isDarkMode }) {
  const analysis = useMemo(() => {
    if (!team || team.length === 0) return null;
    
    const weaknesses = {};
    const resistances = {};
    
    // Accumulate weaknesses and resistances for the entire team
    team.forEach(p => {
      Object.keys(TYPE_CHART).forEach(type => {
        let mult = 1;
        p.types.forEach(pType => {
          mult *= (TYPE_CHART[type] && TYPE_CHART[type][pType.nom]) ?? 1;
        });
        
        if (mult > 1) {
          weaknesses[type] = (weaknesses[type] || 0) + 1;
        } else if (mult < 1) {
          resistances[type] = (resistances[type] || 0) + 1;
        }
      });
    });

    const criticalWeaknesses = Object.entries(weaknesses).filter(([, count]) => count >= 3).sort((a, b) => b[1] - a[1]);
    const topResistances = Object.entries(resistances).sort((a, b) => b[1] - a[1]).slice(0, 4);

    return { weaknesses, resistances, criticalWeaknesses, topResistances };
  }, [team]);

  if (!analysis) return null;

  const { criticalWeaknesses, topResistances } = analysis;

  return (
    <section className={`flex min-h-0 flex-col gap-2 rounded-[1.5rem] border-2 p-3 shadow-xl sm:rounded-[2rem] sm:p-5 ${isDarkMode ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-100 bg-white text-slate-900'}`}>
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-black uppercase tracking-tighter sm:text-2xl">Analyse de Synergie</h2>
          <p className="hidden text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:block">Forces et faiblesses globales de l'equipe active</p>
        </div>
        <Info size={24} className="shrink-0 text-slate-300 dark:text-slate-700" />
      </div>

      <div className="grid min-h-0 flex-1 gap-3 overflow-y-auto custom-scrollbar sm:grid-cols-2 sm:gap-5">
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-500 sm:text-xs">
            <TrendingDown size={14} /> Points Faibles Globaux
          </h3>
          {criticalWeaknesses.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {criticalWeaknesses.map(([type, count]) => (
                <Motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={type}
                  className="flex items-center gap-2 rounded-xl border border-brand-500/20 bg-brand-500/10 px-3 py-1.5"
                >
                  <ShieldAlert className="text-brand-500" size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: TYPE_COLORS[type] }}>Sensible au {type}</span>
                  <span className="text-sm font-black text-brand-600">{count}/{team.length}</span>
                </Motion.div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border-2 border-dashed border-slate-200 px-3 py-2 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 dark:border-slate-800">Excellente couverture defensive globale.</p>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 sm:text-xs">
            <TrendingUp size={14} /> Meilleures Resistances
          </h3>
          {topResistances.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {topResistances.map(([type, count]) => (
                <div key={type} className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: TYPE_COLORS[type] }}>{type}</span>
                  <span className="text-sm font-black text-emerald-500">{count}x</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">Pas de résistances notables.</p>
          )}
        </div>
      </div>
    </section>
  );
}
