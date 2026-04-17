// src/components/pokemon/ComparisonModal.jsx
import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X, Search, Volume2, Swords, ShieldAlert } from 'lucide-react';
import useAccessibleModal from '../../hooks/useAccessibleModal';
import usePokemonCry from '../../hooks/usePokemonCry';
import { TYPE_CHART, TYPE_COLORS } from '../../constants/pokemon';

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
  React.useEffect(() => {
    if (p2) playCryP2();
  }, [p2?.id, playCryP2]);

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
      className="fixed inset-0 z-[150] flex items-center justify-center p-6"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl" onClick={onClose} />
      <Motion.div ref={modalRef} tabIndex={-1} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`relative flex w-full max-w-5xl flex-col gap-6 rounded-[2rem] border-4 p-4 shadow-2xl sm:gap-8 sm:rounded-[3rem] sm:p-6 md:p-10 ${isDarkMode ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-100 bg-white text-slate-900'}`}>
        <button type="button" aria-label="Fermer la comparaison" onClick={onClose} className="absolute right-4 top-4 rounded-full bg-rose-500 p-2.5 text-white transition-transform hover:scale-110 active:scale-95 sm:right-6 sm:top-6 sm:p-3">
          <X size={24} />
        </button>

        <div className="pr-12 sm:pr-14">
          <h3 className="text-xl font-black uppercase tracking-tighter sm:text-2xl md:text-3xl">Comparer {p1.nom}</h3>
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-slate-400">Choisis un deuxieme Pokemon pour une comparaison directe</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_2fr]">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                data-autofocus
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label="Rechercher un Pokemon a comparer"
                placeholder="Rechercher..."
                className={`w-full rounded-2xl border-2 py-3 pl-12 pr-4 text-sm font-bold shadow-lg ring-rose-500/20 focus:ring-4 ${isDarkMode ? 'border-slate-800 bg-slate-950 text-white' : 'border-slate-100 bg-slate-50 text-slate-900'}`}
              />
            </div>

            <div className={`grid max-h-[320px] gap-3 overflow-y-auto rounded-[2rem] p-3 custom-scrollbar sm:max-h-[360px] ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
              {filteredPokemons.length === 0 && <p role="status" className="px-4 py-6 text-center text-xs font-black uppercase tracking-widest text-slate-400">Aucun Pokemon ne correspond a cette recherche.</p>}
              {filteredPokemons.slice(0, 12).map((pokemon) => (
                <button
                  type="button"
                  aria-label={`Comparer avec ${pokemon.nom}`}
                  key={pokemon.id}
                  onClick={() => setSelectedPokemon(pokemon)}
                  className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all ${selectedPokemon?.id === pokemon.id ? 'border-rose-500 bg-rose-500 text-white' : isDarkMode ? 'border-transparent bg-slate-900 hover:border-rose-500' : 'border-transparent bg-white hover:border-rose-500'}`}
                >
                  <img src={pokemon.image} alt={pokemon.nom} className="h-12 w-12 object-contain" />
                  <div>
                    <div className="text-sm font-black uppercase tracking-tight">{pokemon.nom}</div>
                    <div className={`text-[10px] font-black uppercase tracking-widest ${selectedPokemon?.id === pokemon.id ? 'text-white/80' : 'text-slate-400'}`}>#{pokemon.id.toString().padStart(3, '0')}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="grid items-center gap-4 sm:gap-6 md:grid-cols-3 relative">
              <div aria-live="polite" className="text-center group relative cursor-pointer" onClick={playCryP1}>
                <div className="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/5 rounded-full transition-all blur-xl" />
                <img src={p1.image} alt={p1.nom} className="mx-auto mb-3 h-24 w-24 object-contain sm:mb-4 sm:h-32 sm:w-32 md:h-40 md:w-40 relative z-10 transition-transform group-hover:scale-110" />
                <h4 className="text-xl font-black sm:text-2xl flex justify-center items-center gap-2">{p1.nom} <Volume2 size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" /></h4>
                <p className="mt-1 text-xs font-black uppercase tracking-widest text-slate-400">Total: {totalP1}</p>
              </div>

              <div className="text-center flex flex-col items-center gap-4">
                 <div className="text-3xl font-black italic text-rose-500 sm:text-4xl md:text-5xl drop-shadow-lg">VS</div>
                 
                 {/* Tactique Avancée */}
                 <div className={`p-4 rounded-3xl border-2 flex flex-col gap-2 shadow-xl ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 justify-center"><Swords size={12} /> Avantage Tactique <ShieldAlert size={12} /></div>
                    <div className="flex justify-between items-center gap-4 w-full px-2">
                       <span className={`text-sm font-black ${p1Advantage > 1 ? 'text-emerald-500' : p1Advantage < 1 ? 'text-rose-500' : 'text-slate-500'}`}>x{p1Advantage}</span>
                       <div className="h-1 flex-1 bg-slate-200 dark:bg-slate-800 rounded-full relative overflow-hidden">
                          <div className={`absolute inset-y-0 left-0 bg-emerald-500 transition-all`} style={{ width: `${Math.min(100, (p1Advantage / Math.max(0.1, p2Advantage)) * 50)}%` }} />
                          <div className={`absolute inset-y-0 right-0 bg-rose-500 transition-all`} style={{ width: `${Math.min(100, (p2Advantage / Math.max(0.1, p1Advantage)) * 50)}%` }} />
                       </div>
                       <span className={`text-sm font-black ${p2Advantage > 1 ? 'text-emerald-500' : p2Advantage < 1 ? 'text-rose-500' : 'text-slate-500'}`}>x{p2Advantage}</span>
                    </div>
                 </div>
              </div>

              <div aria-live="polite" className="text-center group relative cursor-pointer" onClick={playCryP2}>
                <div className="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/5 rounded-full transition-all blur-xl" />
                <img src={p2.image} alt={p2.nom} className="mx-auto mb-3 h-24 w-24 object-contain sm:mb-4 sm:h-32 sm:w-32 md:h-40 md:w-40 relative z-10 transition-transform group-hover:scale-110" />
                <h4 className="text-xl font-black sm:text-2xl flex justify-center items-center gap-2">{p2.nom} <Volume2 size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" /></h4>
                <p className="mt-1 text-xs font-black uppercase tracking-widest text-slate-400">Total: {totalP2}</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {stats.map((stat) => {
                const diff = p1.base[stat] - p2.base[stat];
                const magnitude = Math.min(50, (Math.abs(diff) / 150) * 50);

                return (
                  <div key={stat} className="grid grid-cols-3 items-center gap-2 sm:gap-4 md:gap-8">
                    <div className={`text-right text-lg font-black sm:text-xl md:text-2xl ${diff > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>{p1.base[stat]}</div>
                    <div className="text-center">
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 md:text-[10px]">{stat}</div>
                      <div className="relative mt-2 h-1 rounded-full bg-slate-200 dark:bg-slate-800">
                        <div className={`absolute inset-y-0 ${diff > 0 ? 'right-1/2 bg-emerald-500' : 'left-1/2 bg-rose-500'}`} style={{ width: `${magnitude}%` }} />
                      </div>
                    </div>
                    <div className={`text-left text-lg font-black sm:text-xl md:text-2xl ${diff < 0 ? 'text-emerald-500' : 'text-slate-400'}`}>{p2.base[stat]}</div>
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
