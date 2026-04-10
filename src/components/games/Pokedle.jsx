import React, { useState, useMemo } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronUp, ChevronDown, Check, X, Hash } from 'lucide-react';
import { getGeneration } from '../../constants/gameMeta';
import { TYPE_COLORS } from '../../constants/pokemon';

export default function Pokedle({ state, pokemons, onGuess, onRestart, isDarkMode }) {
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => {
    if (search.length < 2) return [];
    return pokemons
      .filter(p => p.nom.toLowerCase().includes(search.toLowerCase()))
      .filter(p => !state.guesses.some(g => g.pokemon.id === p.id))
      .slice(0, 5);
  }, [search, pokemons, state.guesses]);

  const handleSelect = (p) => {
    onGuess(p);
    setSearch('');
    setShowSuggestions(false);
  };

  const getResultColor = (res) => {
    if (res === 'correct') return 'bg-emerald-500 text-white';
    if (res === 'pos') return 'bg-amber-500 text-white';
    return 'bg-slate-200 dark:bg-slate-800 text-slate-400';
  };

  const Arrow = ({ type }) => {
    if (type === 'up') return <ChevronUp size={16} className="inline ml-1" />;
    if (type === 'down') return <ChevronDown size={16} className="inline ml-1" />;
    return null;
  };

  return (
    <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Pokédle Daily</h2>
        <div className="flex flex-col items-center gap-4">
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Devine le Pokémon du jour • {6 - state.guesses.length} essais restants</p>
          {state.target && (
            <Motion.span 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-rose-500/20"
            >
              Indice : Génération {getGeneration(state.target.id)}
            </Motion.span>
          )}
        </div>
      </div>

      {state.status === 'playing' && (
        <div className="relative max-w-lg mx-auto z-50">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={24} />
            <input
              type="text"
              placeholder="Quel est ce Pokémon ?"
              className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl pl-16 pr-6 py-6 text-sm font-black shadow-2xl focus:border-rose-500 transition-all outline-none placeholder:text-slate-300"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && suggestions.length > 0) {
                  handleSelect(suggestions[0]);
                }
              }}
            />
          </div>

          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <Motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 right-0 top-full mt-4 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border-2 border-slate-100 dark:border-slate-800 overflow-hidden"
              >
                {suggestions.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(p)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b last:border-0 border-slate-100 dark:border-slate-800"
                  >
                    <img src={p.image} alt="" className="w-10 h-10 object-contain" />
                    <div className="text-left">
                      <div className="font-black uppercase text-xs">{p.nom}</div>
                      <div className="text-[10px] text-slate-500 font-bold">#{p.id}</div>
                    </div>
                  </button>
                ))}
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="space-y-3">
        <div className="grid grid-cols-5 gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">
          <div className="text-center">Pokémon</div>
          <div className="text-center">N° Dex</div>
          <div className="text-center">Gen</div>
          <div className="text-center">Type 1</div>
          <div className="text-center">Type 2</div>
        </div>

        <AnimatePresence initial={false}>
          {[...state.guesses].reverse().map((guess, idx) => (
            <Motion.div
              key={guess.pokemon.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-5 gap-4"
            >
              <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm flex items-center justify-center border border-slate-100 dark:border-slate-800">
                <img src={guess.pokemon.image} alt="" className="w-12 h-12 object-contain" />
              </div>
              
              <div className={`p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center font-black transition-all ${getResultColor(guess.result.id)}`}>
                <span className="text-[10px] opacity-60 uppercase mb-1">N° Dex</span>
                <span className="text-sm">#{guess.pokemon.id} <Arrow type={guess.result.id} /></span>
              </div>

              <div className={`p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center font-black transition-all ${getResultColor(guess.result.gen)}`}>
                <span className="text-[10px] opacity-60 uppercase mb-1">Gen</span>
                <span className="text-sm">G{getGeneration(guess.pokemon.id)} <Arrow type={guess.result.gen} /></span>
              </div>

              <div className={`p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center font-black transition-all ${getResultColor(guess.result.types[0])}`}>
                <span className="text-[10px] opacity-60 uppercase mb-1">T1</span>
                <span className="text-[10px] uppercase tracking-widest leading-none">{guess.pokemon.types[0]?.nom}</span>
              </div>

              <div className={`p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center font-black transition-all ${getResultColor(guess.result.types[1] ? guess.result.types[1] : 'fail')}`}>
                <span className="text-[10px] opacity-60 uppercase mb-1">T2</span>
                <span className="text-[10px] uppercase tracking-widest leading-none">{guess.pokemon.types[1] ? guess.pokemon.types[1].nom : 'Unique'}</span>
              </div>
            </Motion.div>
          ))}
        </AnimatePresence>
      </div>

      {(state.status === 'won' || state.status === 'lost') && (
        <Motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-8 rounded-[3rem] text-center space-y-6 ${state.status === 'won' ? 'bg-emerald-500' : 'bg-slate-900'} text-white shadow-2xl`}
        >
          <div className="inline-flex p-4 bg-white/20 rounded-full mb-2">
            {state.status === 'won' ? <Check size={40} /> : <X size={40} />}
          </div>
          <h3 className="text-3xl font-black uppercase tracking-tighter">
            {state.status === 'won' ? 'Félicitations !' : 'Dommage...'}
          </h3>
          <p className="font-bold opacity-80">
            Le Pokémon du jour était <span className="underline">{state.target.nom}</span> (#{state.target.id}).
          </p>
          <div className="flex justify-center gap-4">
             <img src={state.target.image} alt="" className="w-32 h-32 object-contain drop-shadow-2xl" />
          </div>
          <div className="text-xs font-black uppercase tracking-[0.3em] opacity-60">
             Reviens demain pour un nouveau défi !
          </div>
        </Motion.div>
      )}
    </Motion.div>
  );
}
