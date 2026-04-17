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

    const criticalWeaknesses = Object.entries(weaknesses).filter(([_, count]) => count >= 3).sort((a, b) => b[1] - a[1]);
    const topResistances = Object.entries(resistances).sort((a, b) => b[1] - a[1]).slice(0, 4);

    return { weaknesses, resistances, criticalWeaknesses, topResistances };
  }, [team]);

  if (!analysis) return null;

  const { criticalWeaknesses, topResistances } = analysis;

  return (
    <div className={`mb-12 rounded-[2rem] border-4 p-6 shadow-xl lg:p-10 ${isDarkMode ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-100 bg-white text-slate-900'}`}>
       <div className="mb-8 flex items-center justify-between">
          <div>
             <h2 className="text-xl font-black uppercase tracking-tighter md:text-3xl">Analyse de Synergie</h2>
             <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">Forces et Faiblesses globales de l'equipe active</p>
          </div>
          <Info size={32} className="text-slate-200 dark:text-slate-800" />
       </div>

       <div className="grid gap-8 md:grid-cols-2">
          {/* Section Faiblesses / Alertes */}
          <div className="space-y-4">
             <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-rose-500">
                <TrendingDown size={16} /> Points Faibles Globaux
             </h3>
             {criticalWeaknesses.length > 0 ? (
                <div className="space-y-3">
                   {criticalWeaknesses.map(([type, count]) => (
                      <Motion.div 
                        initial={{ x: -20, opacity: 0 }} 
                        animate={{ x: 0, opacity: 1 }} 
                        key={type} 
                        className="flex items-center justify-between rounded-2xl bg-rose-500/10 p-4 border border-rose-500/20"
                      >
                         <div className="flex items-center gap-3">
                            <ShieldAlert className="text-rose-500" size={20} />
                            <span className="font-black uppercase tracking-widest text-[10px] md:text-xs" style={{ color: TYPE_COLORS[type] }}>Equipe sensible au {type}</span>
                         </div>
                         <div className="text-lg font-black text-rose-600">{count} / {team.length}</div>
                      </Motion.div>
                   ))}
                </div>
             ) : (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center dark:border-slate-800">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Excellente couverture defensive globale.</p>
                </div>
             )}
          </div>

          {/* Section Résistances / Points Forts */}
          <div className="space-y-4">
             <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-500">
                <TrendingUp size={16} /> Meilleures Resistances
             </h3>
             <div className="grid grid-cols-2 gap-3">
                 {topResistances.length > 0 ? topResistances.map(([type, count]) => (
                    <div key={type} className="rounded-2xl border-2 p-4 text-center dark:border-slate-800 dark:bg-slate-950">
                       <div className="mb-2 text-[10px] font-black uppercase tracking-widest" style={{ color: TYPE_COLORS[type] }}>{type}</div>
                       <div className="text-2xl font-black text-emerald-500">{count}x</div>
                       <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Resistances</div>
                    </div>
                 )) : (
                    <div className="col-span-2 text-center text-xs text-slate-400">Pas de résistances notables.</div>
                 )}
             </div>
          </div>
       </div>
    </div>
  );
}
