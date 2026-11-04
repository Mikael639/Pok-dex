import React, { useState, useRef } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useAccessibleModal from '../../hooks/useAccessibleModal';
import PokemonHero from './details/PokemonHero';
import StatsTab from './details/StatsTab';
import MovesTab from './details/MovesTab';
import InfosTab from './details/InfosTab';
import { useEvolutionData } from './details/useEvolutionData';
import { usePokemonMoves } from './details/usePokemonMoves';

const SUB_TABS = ['stats', 'attaques', 'infos'];

/**
 * Modal affichant les details approfondis d'un Pokemon.
 * Recupere dynamiquement la chaine d'evolution et les attaques via l'API PokeAPI.
 */
const PokemonDetails = ({ pokemon, isDarkMode, pokemons, onClose, onNavigate, onCatch, isCaught, isFavorite, onToggleFavorite, onCompare }) => {
  const [activeSubTab, setActiveSubTab] = useState('stats'); // 'stats' | 'attaques' | 'infos'
  const modalRef = useRef(null);

  const { evoChain, loadingEvo, technicalData } = useEvolutionData(pokemon, pokemons);
  const moves = usePokemonMoves(pokemon.id, activeSubTab === 'attaques');

  useAccessibleModal(modalRef, onClose);

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Fiche de ${pokemon.nom}`}
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-hidden p-2 sm:items-center sm:p-4"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl" onClick={onClose} />
      <Motion.div
        ref={modalRef}
        tabIndex={-1}
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className={`relative flex max-h-[96vh] w-full max-w-4xl flex-col overflow-hidden rounded-[1.75rem] shadow-2xl sm:max-h-[98vh] sm:rounded-[3rem] md:flex-row ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
      >
        <button
          type="button"
          data-autofocus
          onClick={onClose}
          aria-label="Fermer la fiche Pokemon"
          className="absolute right-4 top-4 z-50 rounded-full border border-transparent bg-black/20 p-2.5 text-slate-800 shadow-lg backdrop-blur-xl transition-all hover:scale-110 hover:border-white/20 hover:bg-black/40 active:scale-95 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
        >
          <X size={20} />
        </button>

        <PokemonHero pokemon={pokemon} />

        <div className="custom-scrollbar flex-1 overflow-y-auto p-4 pt-5 sm:p-5 sm:pt-6 md:w-1/2 md:p-6 lg:p-8">
          {/* --- TAB SWITCHER --- */}
          <div className="mb-6 flex gap-1.5 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800 sm:gap-2">
            {SUB_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`flex-1 rounded-xl py-2 text-[10px] font-black uppercase tracking-widest transition-all sm:text-xs ${activeSubTab === tab ? 'bg-white shadow-sm dark:bg-slate-700 text-brand-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeSubTab === 'stats' && (
              <StatsTab
                key="stats"
                pokemon={pokemon}
                pokemons={pokemons}
                isDarkMode={isDarkMode}
                evoChain={evoChain}
                loadingEvo={loadingEvo}
                onNavigate={onNavigate}
                onCatch={onCatch}
                isCaught={isCaught}
                isFavorite={isFavorite}
                onToggleFavorite={onToggleFavorite}
                onCompare={onCompare}
              />
            )}
            {activeSubTab === 'attaques' && <MovesTab key="attaques" isDarkMode={isDarkMode} moves={moves} />}
            {activeSubTab === 'infos' && <InfosTab key="infos" pokemon={pokemon} technicalData={technicalData} />}
          </AnimatePresence>
        </div>
      </Motion.div>
    </Motion.div>
  );
};

export default PokemonDetails;
