// src/components/pokemon/ComparisonModal.jsx
import React from 'react';
import { motion as Motion } from 'framer-motion';
import { X, Search, Volume2, Swords, ShieldAlert } from 'lucide-react';
import useAccessibleModal from '../../hooks/useAccessibleModal';
import usePokemonCry from '../../hooks/usePokemonCry';
import { TYPE_CHART } from '../../constants/pokemon';

const ComparisonModal = ({ p1, pokemons, isDarkMode, onClose }) => {
  const modalRef = React.useRef(null);
  const availablePokemons = React.useMemo(
    () => pokemons.filter((pokemon) => pokemon.id !== p1.id),
    [p1.id, pokemons]
  );

  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedPokemon, setSelectedPokemon] = React.useState(() => availablePokemons[0] ?? null);

  React.useEffect(() => {
    setSelectedPokemon(availablePokemons[0] ?? null);
    setSearchTerm('');
  }, [availablePokemons]);

  useAccessibleModal(modalRef, onClose);

  const filteredPokemons = React.useMemo(
    () => availablePokemons.filter((pokemon) => pokemon.nom.toLowerCase().includes(searchTerm.toLowerCase())),
    [availablePokemons, searchTerm]
  );

  const p2 = selectedPokemon ?? availablePokemons[0] ?? null;

  const { playCry: playCryP1 } = usePokemonCry(p1?.id);
  const { playCry: playCryP2 } = usePokemonCry(p2?.id);

  // Play P2 sound on selection
  const p2Id = p2?.id;
  React.useEffect(() => {
    if (p2Id) playCryP2();
  }, [p2Id, playCryP2]);

  // Initial sound for P1
  React.useEffect(() => {
    playCryP1();
  }, [playCryP1]);

  if (!p1 || !p2) return null;

  const stats = Object.keys(p1.base);
  const totalP1 = Object.values(p1.base).reduce((sum, value) => sum + value, 0);
  const totalP2 = Object.values(p2.base).reduce((sum, value) => sum + value, 0);

  // Calcul du Matchup Tactique
  const calculateAdvantage = (attacker, defender) => {
    let multiplier = 1;
    attacker.types.forEach(aType => {
      defender.types.forEach(dType => {
         multiplier *= (TYPE_CHART[aType.nom] && TYPE_CHART[aType.nom][dType.nom]) ?? 1;
      });
    });
    return multiplier;
  };

  const p1Advantage = calculateAdvantage(p1, p2);
  const p2Advantage = calculateAdvantage(p2, p1);

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Comparaison de ${p1.nom}`}
      className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-6"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl" onClick={onClose} />
      <Motion.div ref={modalRef} tabIndex={-1} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`relative flex max-h-full w-full max-w-5xl flex-col gap-2 overflow-y-auto rounded-[1.5rem] border-4 p-3 shadow-2xl sm:gap-5 sm:rounded-[3rem] sm:p-6 md:p-8 custom-scrollbar ${isDarkMode ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-100 bg-white text-slate-900'}`}>
        <button type="button" aria-label="Fermer la comparaison" onClick={onClose} className="absolute right-3 top-3 z-10 rounded-full bg-brand-500 p-2 text-white transition-transform hover:scale-110 active:scale-95 sm:right-6 sm:top-6 sm:p-3">
          <X size={20} />
        </button>

        <div className="shrink-0 pr-10 sm:pr-14">
          <h3 className="text-xl font-black uppercase tracking-tighter sm:text-2xl md:text-3xl">Comparer {p1.nom}</h3>
          <p className="mt-2 hidden text-sm font-bold uppercase tracking-widest text-slate-400 sm:block">Choisis un deuxieme Pokemon pour une comparaison directe</p>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-2 sm:gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
          <div className="order-last min-w-0 space-y-2 lg:order-first lg:space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                data-autofocus
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label="Rechercher un Pokemon a comparer"
                placeholder="Rechercher..."
                className={`w-full rounded-2xl border-2 py-3 pl-12 pr-4 text-sm font-bold shadow-lg ring-brand-500/20 focus:ring-4 ${isDarkMode ? 'border-slate-800 bg-slate-950 text-white' : 'border-slate-100 bg-slate-50 text-slate-900'}`}
              />
            </div>

            <div className={`flex gap-2 overflow-x-auto rounded-2xl p-2 custom-scrollbar lg:grid lg:max-h-[360px] lg:gap-3 lg:overflow-x-visible lg:overflow-y-auto lg:rounded-[2rem] lg:p-3 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
              {filteredPokemons.length === 0 && <p role="status" className="px-4 py-6 text-center text-xs font-black uppercase tracking-widest text-slate-400">Aucun Pokemon ne correspond a cette recherche.</p>}
              {filteredPokemons.slice(0, 12).map((pokemon) => (
                <button
                  type="button"
                  aria-label={`Comparer avec ${pokemon.nom}`}
                  key={pokemon.id}
                  onClick={() => setSelectedPokemon(pokemon)}
                  className={`flex w-24 shrink-0 flex-col items-center gap-1 rounded-2xl border-2 p-2 text-center transition-all lg:w-auto lg:flex-row lg:gap-3 lg:p-3 lg:text-left ${selectedPokemon?.id === pokemon.id ? 'border-brand-500 bg-brand-500 text-white' : isDarkMode ? 'border-transparent bg-slate-900 hover:border-brand-500' : 'border-transparent bg-white hover:border-brand-500'}`}
                >
                  <img src={pokemon.image} alt={pokemon.nom} className="h-10 w-10 object-contain lg:h-12 lg:w-12" />
                  <div className="min-w-0 max-w-full">
                    <div className="truncate text-[10px] font-black uppercase tracking-tight lg:text-sm">{pokemon.nom}</div>
                    <div className={`hidden text-[10px] font-black uppercase tracking-widest lg:block ${selectedPokemon?.id === pokemon.id ? 'text-white/80' : 'text-slate-400'}`}>#{pokemon.id.toString().padStart(3, '0')}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="min-w-0 space-y-2 sm:space-y-8">
            <div className="relative grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-6">
              <div aria-live="polite" className="text-center group relative cursor-pointer" onClick={playCryP1}>
                <div className="absolute inset-0 bg-brand-500/0 group-hover:bg-brand-500/5 rounded-full transition-all blur-xl" />
                <img src={p1.image} alt={p1.nom} className="relative z-10 mx-auto mb-1 h-20 w-20 object-contain transition-transform group-hover:scale-110 sm:mb-4 sm:h-32 sm:w-32 md:h-40 md:w-40" />
                <h4 className="flex items-center justify-center gap-2 truncate text-sm font-black sm:text-2xl">{p1.nom} <Volume2 size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" /></h4>
                <p className="mt-0.5 text-[8px] font-black uppercase tracking-wide text-slate-400 sm:mt-1 sm:text-xs sm:tracking-widest">Base stat total: {totalP1}</p>
              </div>

              <div className="flex flex-col items-center gap-2 text-center sm:gap-4">
                 <div className="text-2xl font-black italic text-brand-500 drop-shadow-lg sm:text-4xl md:text-5xl">VS</div>
                 
                 {/* Tactique Avancée */}
                 <div className={`flex flex-col gap-1 rounded-2xl border-2 p-2 shadow-xl sm:gap-2 sm:rounded-3xl sm:p-4 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex items-center justify-center gap-1 text-[8px] font-black uppercase tracking-widest text-slate-400 sm:gap-2 sm:text-[10px]"><Swords size={12} /> <span className="hidden sm:inline">Avantage</span> Tactique <ShieldAlert size={12} className="hidden sm:block" /></div>
                    <div className="flex w-full items-center justify-between gap-2 px-1 sm:gap-4 sm:px-2">
                       <span className={`text-sm font-black ${p1Advantage > 1 ? 'text-emerald-500' : p1Advantage < 1 ? 'text-brand-500' : 'text-slate-500'}`}>x{p1Advantage}</span>
                       <div className="h-1 flex-1 bg-slate-200 dark:bg-slate-800 rounded-full relative overflow-hidden">
                          <div className={`absolute inset-y-0 left-0 bg-emerald-500 transition-all`} style={{ width: `${Math.min(100, (p1Advantage / Math.max(0.1, p2Advantage)) * 50)}%` }} />
                          <div className={`absolute inset-y-0 right-0 bg-brand-500 transition-all`} style={{ width: `${Math.min(100, (p2Advantage / Math.max(0.1, p1Advantage)) * 50)}%` }} />
                       </div>
                       <span className={`text-sm font-black ${p2Advantage > 1 ? 'text-emerald-500' : p2Advantage < 1 ? 'text-brand-500' : 'text-slate-500'}`}>x{p2Advantage}</span>
                    </div>
                 </div>
              </div>

              <div aria-live="polite" className="text-center group relative cursor-pointer" onClick={playCryP2}>
                <div className="absolute inset-0 bg-brand-500/0 group-hover:bg-brand-500/5 rounded-full transition-all blur-xl" />
                <img src={p2.image} alt={p2.nom} className="relative z-10 mx-auto mb-1 h-20 w-20 object-contain transition-transform group-hover:scale-110 sm:mb-4 sm:h-32 sm:w-32 md:h-40 md:w-40" />
                <h4 className="flex items-center justify-center gap-2 truncate text-sm font-black sm:text-2xl">{p2.nom} <Volume2 size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" /></h4>
                <p className="mt-0.5 text-[8px] font-black uppercase tracking-wide text-slate-400 sm:mt-1 sm:text-xs sm:tracking-widest">Base stat total: {totalP2}</p>
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-5">
              {stats.map((stat) => {
                const diff = p1.base[stat] - p2.base[stat];
                const magnitude = Math.min(50, (Math.abs(diff) / 150) * 50);

                return (
                  <div key={stat} className="grid grid-cols-3 items-center gap-2 sm:gap-4 md:gap-8">
                    <div className={`text-right text-base font-black sm:text-xl md:text-2xl ${diff > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>{p1.base[stat]}</div>
                    <div className="text-center">
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 md:text-[10px]">{stat}</div>
                      <div className="relative mt-1 h-1 rounded-full bg-slate-200 sm:mt-2 dark:bg-slate-800">
                        <div className={`absolute inset-y-0 ${diff > 0 ? 'right-1/2 bg-emerald-500' : 'left-1/2 bg-brand-500'}`} style={{ width: `${magnitude}%` }} />
                      </div>
                    </div>
                    <div className={`text-left text-base font-black sm:text-xl md:text-2xl ${diff < 0 ? 'text-emerald-500' : 'text-slate-400'}`}>{p2.base[stat]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Motion.div>
    </Motion.div>
  );
};

export default ComparisonModal;
