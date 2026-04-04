// src/components/pokemon/ComparisonModal.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Interface de comparaison directe entre deux Pokémon.
 * Affiche les statistiques sous forme de barres comparatives.
 */
const ComparisonModal = ({ p1, p2, isDarkMode, onClose }) => {
  if (!p1 || !p2) return null;
  const stats = Object.keys(p1.base);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] flex items-center justify-center p-6">
       <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl" onClick={onClose} />
       <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`relative w-full max-w-4xl p-12 rounded-[4rem] shadow-2xl border-4 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
          <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-rose-500 text-white rounded-full transition-transform hover:scale-110 active:scale-95"><X size={24}/></button>
          
          <div className="flex justify-around items-center mb-16">
             <div className="text-center">
                <img src={p1.image} className="w-32 h-32 md:w-48 md:h-48 object-contain mb-4" />
                <h3 className="text-2xl md:text-3xl font-black">{p1.nom}</h3>
             </div>
             <div className="text-4xl md:text-5xl font-black italic text-rose-500">VS</div>
             <div className="text-center">
                <img src={p2.image} className="w-32 h-32 md:w-48 md:h-48 object-contain mb-4" />
                <h3 className="text-2xl md:text-3xl font-black">{p2.nom}</h3>
             </div>
          </div>

          <div className="space-y-6 text-slate-900 dark:text-white">
             {stats.map(s => {
                const diff = p1.base[s] - p2.base[s];
                return (
                   <div key={s} className="grid grid-cols-3 items-center gap-4 md:gap-8">
                      <div className={`text-right font-black text-xl md:text-2xl ${diff > 0 ? 'text-green-500' : 'text-slate-400'}`}>{p1.base[s]}</div>
                      <div className="text-center">
                         <div className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{s}</div>
                         <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 relative">
                            {/* Barre de comparaison : s'étend à gauche ou à droite selon le gagnant de la stat */}
                            <div className={`absolute top-0 bottom-0 ${diff > 0 ? 'right-1/2 bg-green-500' : 'left-1/2 bg-rose-500'}`} style={{ width: `${Math.min(50, (Math.abs(diff) / 150) * 50)}%` }} />
                         </div>
                      </div>
                      <div className={`text-left font-black text-xl md:text-2xl ${diff < 0 ? 'text-green-500' : 'text-slate-400'}`}>{p2.base[s]}</div>
                   </div>
                );
             })}
          </div>
       </motion.div>
    </motion.div>
  );
};

export default ComparisonModal;
