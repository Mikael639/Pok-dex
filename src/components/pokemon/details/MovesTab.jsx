import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Swords, Zap, ShieldAlert, BookOpen, Info } from 'lucide-react';
import PokeBallLoader from '../../common/PokeBallLoader';
import { TYPE_COLORS } from '../../../constants/pokemon';

/**
 * Onglet « attaques » : filtres par catégorie / méthode d'apprentissage et liste des capacités.
 */
export default function MovesTab({ isDarkMode, moves }) {
  const {
    movesByMethod, filteredMoves, loadingMoves,
    activeMoveFilter, setActiveMoveFilter,
    activeLearnMethod, setActiveLearnMethod
  } = moves;

  return (
    <Motion.div
      key="attaques"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-black uppercase tracking-widest lg:text-lg">Capacités</h3>
        <div className="flex flex-wrap gap-1">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'physical', icon: Swords },
            { id: 'special', icon: Zap },
            { id: 'status', icon: ShieldAlert }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveMoveFilter(f.id)}
              className={`rounded-lg px-2 py-1 text-[8px] font-black uppercase transition-all ${activeMoveFilter === f.id ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}
            >
              {f.icon ? <f.icon size={12} /> : f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { id: 'level-up', label: 'Niveau' },
          { id: 'machine', label: 'CT/CS' },
          { id: 'egg', label: 'Œuf' },
          { id: 'tutor', label: 'Maître' }
        ].map(m => (
          <button
            key={m.id}
            onClick={() => { setActiveLearnMethod(m.id); setActiveMoveFilter('all'); }}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${activeLearnMethod === m.id ? 'bg-slate-800 text-white dark:bg-slate-700 shadow-lg scale-105' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 hover:bg-slate-200'}`}
          >
            {m.label} ({movesByMethod[m.id]?.length || 0})
          </button>
        ))}
      </div>

      {loadingMoves ? (
        <div className="flex flex-col items-center justify-center py-12">
          <PokeBallLoader size={60} showText={false} />
          <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Chargement du Moveset...</p>
        </div>
      ) : (
        <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredMoves.map((move, i) => (
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={`${move.name}-${i}`}
              className={`group relative flex items-center justify-between rounded-2xl border-2 p-3 transition-all hover:border-rose-500 ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-50 bg-slate-50/50'}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-col items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[7px] font-black uppercase text-slate-400">
                    {activeLearnMethod === 'level-up' ? 'Niv.' : activeLearnMethod === 'machine' ? 'CT' : activeLearnMethod === 'egg' ? 'Œuf' : 'Mtr'}
                  </span>
                  <span className="text-sm font-black text-rose-500">{activeLearnMethod === 'level-up' ? move.level : '-'}</span>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider">{move.displayName || move.name.replace(/-/g, ' ')}</h4>
                  <div className="mt-1 flex items-center gap-2">
                    {move.detailsLoaded ? (
                      <>
                        <span className="rounded-md px-1.5 py-0.5 text-[8px] font-black uppercase text-white shadow-sm" style={{ backgroundColor: TYPE_COLORS[move.type?.charAt(0).toUpperCase() + move.type?.slice(1)] || '#ccc' }}>
                          {move.type}
                        </span>
                        <div className="flex items-center gap-1 text-slate-400">
                          {move.category === 'physical' && <Swords size={12} />}
                          {move.category === 'special' && <Zap size={12} />}
                          {move.category === 'status' && <ShieldAlert size={12} />}
                          <span className="text-[8px] font-bold uppercase">{move.category}</span>
                        </div>
                      </>
                    ) : (
                      <div className="h-3 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {move.detailsLoaded ? (
                  <>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-[9px] font-black text-slate-400">
                        <Info size={10} /> PUISSANCE
                      </div>
                      <div className="text-sm font-black">{move.power || '--'}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-[9px] font-black text-slate-400">
                        <BookOpen size={10} /> PRECISION
                      </div>
                      <div className="text-sm font-black">{move.accuracy || '--'}%</div>
                    </div>
                  </>
                ) : (
                  <div className="h-8 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                )}
              </div>
            </Motion.div>
          ))}
          {filteredMoves.length === 0 && (
            <div className="py-10 text-center text-xs font-black uppercase text-slate-400 opacity-50">Aucune capacité dans cette catégorie</div>
          )}
        </div>
      )}
    </Motion.div>
  );
}
