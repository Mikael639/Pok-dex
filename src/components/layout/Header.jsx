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
  const { trainerTitle, trainerScore } = trainerStats || {};
  const [showSuggestions, setShowSuggestions] = useState(false);
  const activeTabTitle = TAB_TITLES[activeTab] ?? activeTab.toUpperCase();

  const [showFilters, setShowFilters] = useState(false);
  const filtersActive = typeFilter !== 'Tous' || sortBy !== 'id' || activeRegion;

  const randomButton = (
    <button type="button" aria-label="Afficher un Pokemon aleatoire" onClick={getRandomPokemon} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg transition-all hover:scale-105 active:scale-95 dark:bg-white dark:text-slate-900 sm:h-12 sm:w-12">
      <Shuffle size={20} />
    </button>
  );

  return (
    <header className="relative z-30 mb-2 shrink-0 sm:mb-4 lg:mb-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 lg:flex-nowrap lg:gap-6">
        <button type="button" aria-label="Ouvrir le menu" onClick={() => setIsMobileMenuOpen(true)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-100 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900 lg:hidden">
          <Menu size={22} />
        </button>

        <div className="min-w-0 flex-1">
          <Motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-0.5 hidden items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-0.5 text-amber-600 dark:text-amber-400 sm:inline-flex"
          >
            <Shuffle size={10} />
            <span className="text-[8px] font-black uppercase tracking-widest">{trainerTitle}</span>
            <span className="text-[8px] opacity-40">• {trainerScore} PTS</span>
          </Motion.div>
          <h2 className="truncate text-xl font-black uppercase leading-tight tracking-tighter sm:text-2xl lg:text-3xl">{activeTabTitle}</h2>
          <p className="hidden text-[10px] font-bold uppercase tracking-widest text-slate-500 opacity-70 lg:block">Gens 1 à 9 • {pokemonsLength} espèces • Rang S</p>
        </div>

        {showBrowseControls ? (
          <div className="flex w-full items-center gap-2 lg:w-auto lg:flex-none lg:gap-3">
            <div className={`${showFilters ? 'grid' : 'hidden'} absolute inset-x-0 top-full z-40 mt-2 grid-cols-1 gap-2 rounded-2xl border-2 border-slate-100 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-3 lg:left-auto lg:w-[44rem]`}>
              <CustomDropdown isDarkMode={isDarkMode} icon={Filter} label="Type" value={typeFilter} onChange={(v) => { setTypeFilter(v); setPage(1); }} typeColors={TYPE_COLORS} options={[{ value: 'Tous', label: 'Tous les Types' }, ...Object.keys(TYPE_COLORS).map(t => ({ value: t, label: t }))]} />
              <CustomDropdown isDarkMode={isDarkMode} icon={Globe} label="Region" value={activeRegion || 'Tous'} onChange={(v) => { setActiveRegion(v === 'Tous' ? null : v); setPage(1); }} options={[{ value: 'Tous', label: 'Toutes les Régions' }, ...POKEMON_GENERATIONS.map((g, i) => ({ value: g.gen, label: REGION_NAMES[i] }))]} />
              <CustomDropdown isDarkMode={isDarkMode} icon={Activity} label="Trier" value={sortBy} onChange={(v) => { setSortBy(v); setPage(1); }} options={[{ value: 'id', label: 'N° Pokédex' }, { value: 'nom', label: 'Nom (A-Z)' }, { value: 'hp', label: 'Points de Vie' }, { value: 'attack', label: 'Attaque' }, { value: 'speed', label: 'Vitesse' }]} />
            </div>

            <div className="relative min-w-0 flex-1 lg:w-72 lg:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Rechercher..." onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 120)} aria-label="Rechercher un Pokemon" aria-expanded={showSuggestions && searchQuery.length >= 2} aria-controls="pokemon-search-suggestions" className="h-11 w-full rounded-2xl border-none bg-white pl-11 pr-3 text-sm font-bold shadow-lg ring-brand-500/20 focus:ring-4 dark:bg-slate-900 sm:h-12" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); setShowSuggestions(true); }} />
              <AnimatePresence>
                {showSuggestions && searchQuery.length >= 2 && (
                  <Motion.div id="pokemon-search-suggestions" role="listbox" aria-label="Suggestions Pokemon" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:10}} className={`absolute right-0 top-full z-50 mt-2 w-[min(18rem,85vw)] overflow-hidden rounded-[2rem] border-2 shadow-2xl backdrop-blur-2xl ${isDarkMode ? 'border-slate-800 bg-slate-900/95' : 'border-slate-100 bg-white/95'}`}>
                    <div className="space-y-1 p-2">
                      {suggestionPokemons.length > 0 ? suggestionPokemons.map(p => (
                        <button type="button" role="option" aria-label={`Voir ${p.nom}`} key={p.id} onClick={() => { setSelectedPokemon(p); setShowSuggestions(false); setSearchQuery(''); }} className={`flex w-full items-center gap-4 rounded-2xl p-3 transition-all ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-50'}`}>
                          <div className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800"><img src={p.image} alt="" className="h-8 w-8 object-contain" /></div>
                          <div className="text-left"><div className="text-xs font-black uppercase tracking-tight">{p.nom}</div><div className="text-[8px] font-bold text-slate-500">#{p.id.toString().padStart(3, '0')}</div></div>
                        </button>
                      )) : <p role="status" className="px-4 py-3 text-xs font-bold text-slate-500">Aucun Pokemon trouve.</p>}
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>

            <button type="button" aria-expanded={showFilters} aria-label="Afficher les filtres" onClick={() => setShowFilters((v) => !v)} className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 shadow-lg transition-all sm:h-12 sm:w-12 ${showFilters ? 'border-brand-500 bg-brand-500 text-white' : 'border-transparent bg-white text-slate-500 dark:bg-slate-900'}`}>
              <Filter size={18} />
              {filtersActive && !showFilters && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500" />}
            </button>
            <button type="button" aria-pressed={isFavoritesOnly} aria-label={isFavoritesOnly ? 'Afficher tous les Pokemon' : 'Afficher uniquement les favoris'} onClick={() => setIsFavoritesOnly(!isFavoritesOnly)} className={`flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl border-2 px-3 text-sm font-black shadow-lg transition-all sm:h-12 lg:px-4 ${isFavoritesOnly ? 'border-brand-500 bg-brand-500 text-white' : 'border-transparent bg-white text-slate-400 dark:bg-slate-900'}`}>
              <Heart size={18} fill={isFavoritesOnly ? 'currentColor' : 'none'} /><span className="hidden uppercase tracking-widest lg:inline">Favoris</span>
            </button>
            {randomButton}
          </div>
        ) : randomButton}
      </div>
    </header>
  );
}
