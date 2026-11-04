import React from 'react';
import { motion as Motion } from 'framer-motion';
import { BookOpen, Dna, Target, Smile, TrendingUp } from 'lucide-react';
import PokeBallLoader from '../../common/PokeBallLoader';

/**
 * Onglet « infos » : description, données physiques, techniques et reproduction.
 */
export default function InfosTab({ pokemon, technicalData }) {
  return (
    <Motion.div
      key="infos"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* --- SECTION DESCRIPTION --- */}
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-slate-50/30 p-5 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="absolute -right-4 -top-4 opacity-5">
          <BookOpen size={120} />
        </div>
        <h3 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">
          <BookOpen size={14} /> Description
        </h3>
        <p className="relative z-10 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
          {pokemon.description || "Aucune description disponible pour ce Pokémon."}
        </p>
      </div>

      {/* --- SECTION PHYSIQUE --- */}
      <div>
        <h3 className="mb-4 text-base font-black uppercase tracking-widest lg:text-lg">Données Physiques</h3>
        {!technicalData ? (
          <div className="flex justify-center py-8"><PokeBallLoader size={40} showText={false} /></div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-4 transition-all hover:border-rose-500/20 dark:border-slate-800 dark:bg-slate-900/50">
              <span className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">Taille</span>
              <span className="text-lg font-black">{technicalData.height} m</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-4 transition-all hover:border-rose-500/20 dark:border-slate-800 dark:bg-slate-900/50">
              <span className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">Poids</span>
              <span className="text-lg font-black">{technicalData.weight} kg</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-4 transition-all hover:border-rose-500/20 dark:border-slate-800 dark:bg-slate-900/50">
              <span className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">Catégorie</span>
              <span className="text-[10px] font-black text-center uppercase leading-tight">{technicalData.genus.replace('Pokémon ', '')}</span>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-4 text-base font-black uppercase tracking-widest lg:text-lg">Données Techniques</h3>
        {!technicalData ? (
          <div className="flex justify-center py-8"><PokeBallLoader size={40} showText={false} /></div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                <Target size={14} className="text-rose-500" /> Capture
              </div>
              <div className="text-xl font-black">{technicalData.captureRate}</div>
              <p className="text-[8px] font-bold uppercase text-slate-500">Taux de base</p>
            </div>
            <div className="rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                <Smile size={14} className="text-rose-500" /> Bonheur
              </div>
              <div className="text-xl font-black">{technicalData.baseHappiness}</div>
              <p className="text-[8px] font-bold uppercase text-slate-500">Base amitié</p>
            </div>
            <div className="col-span-2 rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                <TrendingUp size={14} className="text-rose-500" /> Croissance
              </div>
              <div className="text-sm font-black uppercase">{technicalData.growthRate}</div>
              <p className="text-[8px] font-bold uppercase text-slate-500">Vitesse de progression</p>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-4 text-base font-black uppercase tracking-widest lg:text-lg">Reproduction</h3>
        {!technicalData ? (
          <div className="flex justify-center py-8"><PokeBallLoader size={40} showText={false} /></div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                <Dna size={14} className="text-rose-500" /> Groupes d'œufs
              </div>
              <div className="flex flex-wrap gap-2">
                {technicalData.eggGroups.map(group => (
                  <span key={group} className="rounded-lg bg-white px-3 py-1 text-[10px] font-black uppercase shadow-sm dark:bg-slate-800">
                    {group}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mb-2 text-[10px] font-black uppercase text-slate-400 text-center">Genre</div>
                {technicalData.genderRate === -1 ? (
                  <div className="text-center text-sm font-black uppercase text-slate-500">Asexué</div>
                ) : (
                  <div className="flex h-4 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div style={{ width: `${(8 - technicalData.genderRate) * 12.5}%` }} className="bg-blue-400" />
                    <div style={{ width: `${technicalData.genderRate * 12.5}%` }} className="bg-rose-400" />
                  </div>
                )}
                <div className="mt-2 flex justify-between text-[8px] font-black">
                  <span className="text-blue-500">♂ {(8 - technicalData.genderRate) * 12.5}%</span>
                  <span className="text-rose-500">♀ {technicalData.genderRate * 12.5}%</span>
                </div>
              </div>
              <div className="rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mb-2 text-[10px] font-black uppercase text-slate-400 text-center">Eclosion</div>
                <div className="text-center text-xl font-black">{technicalData.hatchCounter * 255}</div>
                <div className="text-center text-[8px] font-bold uppercase text-slate-500">Pas environ</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Motion.div>
  );
}
