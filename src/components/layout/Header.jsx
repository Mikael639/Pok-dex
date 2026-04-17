import React, { useState } from 'react';
import { Menu, Search, Filter, Activity, Heart, Shuffle, Globe } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import CustomDropdown from '../common/CustomDropdown';
import { TYPE_COLORS } from '../../constants/pokemon';
import { TAB_TITLES, POKEMON_GENERATIONS } from '../../constants/gameMeta';

const REGION_NAMES = [
  'Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola', 'Galar', 'Paldea'
];

export default function Header({
  activeTab,
  pokemonsLength,
  setIsMobileMenuOpen,
  showBrowseControls,
  searchQuery,
  setSearchQuery,
  suggestionPokemons,
  setSelectedPokemon,
  typeFilter,
  setTypeFilter,
  sortBy,
  setSortBy,
  isFavoritesOnly,
  setIsFavoritesOnly,
  getRandomPokemon,
  setPage,
  isDarkMode,
  trainerStats,
  activeRegion,
  setActiveRegion
}) {
  const { trainerTitle, trainerScore, nextTitleThreshold } = trainerStats || {};
  const [showSuggestions, setShowSuggestions] = useState(false);
  const activeTabTitle = TAB_TITLES[activeTab] ?? activeTab.toUpperCase();

  return (
    <header className="mb-8 flex flex-col gap-4 sm:gap-6 lg:mb-16 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start justify-between gap-4 lg:block">
        <div>
          <Motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 mb-2"
          >
            <Shuffle size={10} className="animate-spin-slow" />
            <span className="text-[8px] font-black uppercase tracking-widest">{trainerTitle}</span>
            <span className="text-[8px] opacity-40">• {trainerScore} PTS</span>
          </Motion.div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter">{activeTabTitle}</h2>
          <p className="text-slate-500 text-[10px] lg:text-xs font-bold uppercase tracking-widest mt-1 opacity-70">Gens 1 à 9 • {pokemonsLength} espèces • Rang S</p>
        </div>
        <button type="button" aria-label="Ouvrir le menu" onClick={() => setIsMobileMenuOpen(true)} className="shrink-0 lg:hidden p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border-2 border-slate-100 dark:border-slate-800"><Menu size={24} /></button>
      </div>
      
      <div className="w-full lg:w-auto">
        {showBrowseControls ? (
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 lg:flex lg:flex-wrap lg:justify-end">
            <div className="col-span-2 sm:col-span-4 lg:order-4 lg:w-72">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Rechercher..." onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 120)} aria-label="Rechercher un Pokemon" aria-expanded={showSuggestions && searchQuery.length >= 2} aria-controls="pokemon-search-suggestions" className="w-full bg-white dark:bg-slate-900 border-none rounded-[2rem] pl-14 pr-4 py-3 text-sm font-bold shadow-xl focus:ring-4 ring-rose-500/20" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); setShowSuggestions(true); }} />
                <AnimatePresence>
                  {showSuggestions && searchQuery.length >= 2 && (
                    <Motion.div id="pokemon-search-suggestions" role="listbox" aria-label="Suggestions Pokemon" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:10}} className={`absolute left-0 right-0 top-full mt-3 rounded-[2.5rem] shadow-2xl border-2 overflow-hidden z-50 backdrop-blur-2xl sm:w-72 sm:left-auto ${isDarkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-100'}`}>
                       <div className="p-2 space-y-1">
                          {suggestionPokemons.length > 0 ? suggestionPokemons.map(p => (
                             <button type="button" role="option" aria-label={`Voir ${p.nom}`} key={p.id} onClick={() => { setSelectedPokemon(p); setShowSuggestions(false); setSearchQuery(''); }} className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-50'}`}>
                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl"><img src={p.image} alt="" className="w-8 h-8 object-contain" /></div>
                                <div className="text-left"><div className="text-xs font-black uppercase tracking-tight">{p.nom}</div><div className="text-[8px] font-bold text-slate-500">#{p.id.toString().padStart(3, '0')}</div></div>
                             </button>
                          )) : <p role="status" className="px-4 py-3 text-xs font-bold text-slate-500">Aucun Pokemon trouve.</p>}
                       </div>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="lg:order-1">
              <CustomDropdown isDarkMode={isDarkMode} icon={Filter} label="Type" value={typeFilter} onChange={(v) => { setTypeFilter(v); setPage(1); }} typeColors={TYPE_COLORS} options={[{ value: 'Tous', label: 'Tous les Types' }, ...Object.keys(TYPE_COLORS).map(t => ({ value: t, label: t }))]} />
            </div>
            <div className="lg:order-2">
              <CustomDropdown isDarkMode={isDarkMode} icon={Globe} label="Region" value={activeRegion || 'Tous'} onChange={(v) => { setActiveRegion(v === 'Tous' ? null : v); setPage(1); }} options={[{ value: 'Tous', label: 'Toutes les Régions' }, ...POKEMON_GENERATIONS.map((g, i) => ({ value: g.gen, label: REGION_NAMES[i] }))]} />
            </div>
            <div className="lg:order-3">
              <CustomDropdown isDarkMode={isDarkMode} icon={Activity} label="Trier" value={sortBy} onChange={(v) => { setSortBy(v); setPage(1); }} options={[{ value: 'id', label: 'N° Pokédex' }, { value: 'nom', label: 'Nom (A-Z)' }, { value: 'hp', label: 'Points de Vie' }, { value: 'attack', label: 'Attaque' }, { value: 'speed', label: 'Vitesse' }]} />
            </div>
            <button type="button" aria-pressed={isFavoritesOnly} aria-label={isFavoritesOnly ? 'Afficher tous les Pokemon' : 'Afficher uniquement les favoris'} onClick={() => setIsFavoritesOnly(!isFavoritesOnly)} className={`col-span-1 flex items-center justify-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all shadow-xl border-2 lg:order-4 ${isFavoritesOnly ? 'bg-rose-500 text-white border-rose-500' : 'bg-white dark:bg-slate-900 border-transparent text-slate-400'}`}><Heart size={18} fill={isFavoritesOnly ? "currentColor" : "none"} /><span className="uppercase tracking-widest hidden sm:inline">Favoris</span></button>
            <button type="button" aria-label="Afficher un Pokemon aleatoire" onClick={getRandomPokemon} className="col-span-1 flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95 dark:bg-white dark:text-slate-900 lg:order-6"><Shuffle size={20} /></button>
          </div>
        ) : (
          <div className="flex justify-end">
            <button type="button" aria-label="Afficher un Pokemon aleatoire" onClick={getRandomPokemon} className="p-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all"><Shuffle size={20} /></button>
          </div>
        )}
      </div>
    </header>
  );
}
