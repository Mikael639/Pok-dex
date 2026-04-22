// src/components/pokemon/PokemonDetails.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import PokeBallLoader from '../common/PokeBallLoader';
import { motion as Motion } from 'framer-motion';
import { X, Sparkles, Star, Heart, ChevronRight, Scale, Volume2 } from 'lucide-react';
import { TYPE_COLORS, TYPE_CHART } from '../../constants/pokemon';
import useAccessibleModal from '../../hooks/useAccessibleModal';
import usePokemonCry from '../../hooks/usePokemonCry';

const floatingAnimation = {
  y: [0, -26, 0, -14, 0],
  rotate: [0, -4, 4, -2, 0],
  scale: [1, 1.045, 1, 1.025, 1],
  transition: {
    duration: 3.2,
    ease: 'easeInOut',
    repeat: Infinity,
  },
};

const getCachedEvolutionChain = (pokemonId) => {
  try {
    const cachedData = localStorage.getItem(`evo_cache_${pokemonId}`);
    if (!cachedData) return null;

    const parsedData = JSON.parse(cachedData);
    return Array.isArray(parsedData) ? parsedData : null;
  } catch (_error) {
    return null;
  }
};

/**
 * Modal affichant les details approfondis d'un Pokemon.
 * Recupere dynamiquement la chaine d'evolution via l'API PokeAPI.
 */
const PokemonDetails = ({ pokemon, isDarkMode, pokemons, onClose, onNavigate, onCatch, isCaught, isFavorite, onToggleFavorite, onCompare }) => {
  const [isShiny, setIsShiny] = useState(false);
  const [evoChain, setEvoChain] = useState(() => getCachedEvolutionChain(pokemon.id) ?? []);
  const [loadingEvo, setLoadingEvo] = useState(() => !getCachedEvolutionChain(pokemon.id));
  const modalRef = useRef(null);

  const { playCry, isPlaying } = usePokemonCry(pokemon.id);

  useEffect(() => {
    playCry();
  }, [playCry, pokemon.id]);

  useAccessibleModal(modalRef, onClose);

  const imageUrl = isShiny
    ? pokemon.image.replace('official-artwork', 'official-artwork/shiny')
    : pokemon.image;

  useEffect(() => {
    const cacheKey = `evo_cache_${pokemon.id}`;
    const cachedChain = getCachedEvolutionChain(pokemon.id);

    if (cachedChain) {
      setEvoChain(cachedChain);
      setLoadingEvo(false);
      return;
    }

    setLoadingEvo(true);
    setEvoChain([]);

    const fetchEvo = async () => {
      try {
        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`).then((r) => r.json());
        const evoRes = await fetch(speciesRes.evolution_chain.url).then((r) => r.json());

        const chain = [];
        let curr = evoRes.chain;

        const getTriggerLabel = (details) => {
          if (!details || !details[0]) return null;
          const d = details[0];
          if (d.trigger.name === 'level-up') {
            if (d.min_level) return `Niv. ${d.min_level}`;
            if (d.min_happiness) return 'Bonheur';
            if (d.known_move) return 'Capacite';
            return 'Niveau';
          }
          if (d.trigger.name === 'use-item') return d.item.name.replace(/-/g, ' ').toUpperCase();
          if (d.trigger.name === 'trade') return 'Echange';
          return d.trigger.name;
        };

        const processNode = async (node) => {
          const id = parseInt(node.species.url.split('/').filter(Boolean).pop(), 10);
          const localP = pokemons.find((p) => p.id === id);
          chain.push({
            id,
            nom: localP ? localP.nom : node.species.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
            condition: getTriggerLabel(node.evolution_details),
          });
          if (node.evolves_to.length > 0) {
            await processNode(node.evolves_to[0]);
          }
        };

        await processNode(curr);
        setEvoChain(chain);
        localStorage.setItem(cacheKey, JSON.stringify(chain));
      } catch (err) {
        console.error("Erreur de recuperation des evolutions :", err);
      } finally {
        setLoadingEvo(false);
      }
    };

    fetchEvo();
  }, [pokemon.id, pokemons]);

  const weaknesses = useMemo(() => {
    const list = {};
    Object.keys(TYPE_CHART).forEach((type) => {
      let mult = 1;
      pokemon.types.forEach((pType) => {
        mult *= (TYPE_CHART[type] && TYPE_CHART[type][pType.nom]) ?? 1;
      });
      if (mult !== 1) list[type] = mult;
    });
    return list;
  }, [pokemon]);

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

        <div
          className="relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden p-5 sm:p-6 md:w-1/2 md:p-8"
          style={{ background: `linear-gradient(135deg, ${TYPE_COLORS[pokemon.types[0].nom]} 0%, #000 150%)` }}
        >
          <div className="absolute inset-0 z-0 bg-black/10" />
          <Motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="relative z-10 flex items-center justify-center"
          >
            <Motion.div
              animate={{
                scale: [0.96, 1.06, 0.98],
                opacity: [0.14, 0.24, 0.16],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute h-40 w-40 rounded-full bg-white/10 blur-3xl sm:h-48 sm:w-48 md:h-56 md:w-56"
            />
            <Motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.02, 1],
                opacity: [0.06, 0.14, 0.08],
              }}
              transition={{
                rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
                scale: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="absolute h-40 w-40 rounded-full border border-white/10 sm:h-48 sm:w-48 md:h-56 md:w-56"
            />
            <Motion.div
              animate={{
                rotate: -360,
                scale: [0.97, 1, 0.98],
                opacity: [0.04, 0.1, 0.05],
              }}
              transition={{
                rotate: { duration: 14, repeat: Infinity, ease: 'linear' },
                scale: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="absolute h-48 w-48 rounded-full border border-cyan-300/10 sm:h-56 sm:w-56 md:h-64 md:w-64"
            />
            <Motion.div
              animate={{
                y: [0, -12, 0],
                opacity: [0.2, 0.55, 0.2],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute bottom-2 h-16 w-28 rounded-full bg-black/35 blur-2xl sm:w-32 md:w-40"
            />
            <Motion.div key={imageUrl} animate={floatingAnimation} className="relative">
              <img
                src={imageUrl}
                alt={pokemon.nom}
                className="relative h-36 w-36 object-contain drop-shadow-[0_28px_60px_rgba(0,0,0,0.58)] transition-transform duration-700 hover:scale-110 sm:h-40 sm:w-40 md:h-48 md:w-48"
              />
            </Motion.div>
          </Motion.div>
          <div className="z-10 mt-4 text-center text-white">
            <h2 className="mb-1 text-2xl font-black uppercase tracking-tighter sm:text-3xl md:text-4xl">{pokemon.nom}</h2>
            <div className="mb-3 flex flex-wrap justify-center gap-2">
              {pokemon.types.map((t) => (
                <span key={t.nom} className="rounded-full bg-white/20 px-3 py-1 text-[9px] font-black uppercase tracking-widest backdrop-blur-xl sm:px-4 md:text-[10px]">
                  {t.nom}
                </span>
              ))}
            </div>
            <div className="flex justify-center gap-3">
              <button type="button" aria-label="Ecouter le cri" onClick={playCry} className={`rounded-xl p-2.5 shadow-md backdrop-blur-xl transition-all ${isPlaying ? 'animate-pulse bg-rose-500 text-white' : 'bg-white/10 hover:bg-white/20'}`}>
                <Volume2 size={18} />
              </button>
              <button type="button" aria-label={isShiny ? 'Afficher la version classique' : 'Afficher la version shiny'} onClick={() => setIsShiny(!isShiny)} className={`rounded-xl p-2.5 shadow-md backdrop-blur-xl transition-all ${isShiny ? 'bg-amber-400 text-slate-900' : 'bg-white/10 hover:bg-white/20'}`}>
                <Sparkles size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto p-4 pt-5 sm:p-5 sm:pt-6 md:w-1/2 md:p-6 lg:p-8">
          <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
            <h3 className="text-base font-black uppercase tracking-widest lg:text-lg">Statistiques</h3>
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
              <button type="button" aria-label={isFavorite ? `Retirer ${pokemon.nom} des favoris` : `Ajouter ${pokemon.nom} aux favoris`} onClick={onToggleFavorite} className={`rounded-2xl p-3 shadow-lg transition-all ${isFavorite ? 'bg-amber-400 text-white shadow-amber-400/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'}`}>
                <Star size={20} fill={isFavorite ? 'white' : 'none'} />
              </button>
              <button type="button" onClick={onCatch} className={`flex min-w-0 items-center justify-center gap-2 rounded-2xl px-4 py-3 font-black shadow-lg transition-all sm:px-6 ${isCaught ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'}`}>
                <Heart size={20} fill={isCaught ? 'white' : 'none'} /> <span className="truncate text-xs sm:text-sm md:text-base">{isCaught ? 'LIBERER' : 'CAPTURER'}</span>
              </button>
              <button type="button" onClick={onCompare} className="col-span-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 font-black text-slate-500 shadow-lg transition-all hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 sm:col-auto sm:w-auto sm:px-5">
                <Scale size={18} /> <span className="text-xs sm:text-sm md:text-base">COMPARER</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5 lg:space-y-2">
            {Object.entries(pokemon.base).map(([key, val]) => (
              <div key={key}>
                <div className="mb-1 flex justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{key}</span>
                  <span className="text-base font-black">{val}</span>
                </div>
                <div role="progressbar" aria-label={`${key} ${val}`} aria-valuemin={0} aria-valuemax={150} aria-valuenow={val} className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <Motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (val / 150) * 100)}%` }} className="h-full rounded-full" style={{ backgroundColor: TYPE_COLORS[pokemon.types[0].nom] }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h4 className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Efficacite subie</h4>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(weaknesses).sort((a, b) => b[1] - a[1]).map(([t, m]) => (
                <div key={t} className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-[9px] font-black shadow-sm ${m > 1 ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                  <span>{t}</span>
                  <span className="rounded bg-white/50 px-1 py-0.5 text-[8px] dark:bg-black/20">x{m}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 border-t border-slate-100 pb-2 pt-4 dark:border-slate-800 sm:pb-4">
            <h4 className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Lignee Evolutive</h4>
            {loadingEvo ? (
              <div
                role="status"
                aria-live="polite"
                className={`relative overflow-hidden rounded-[2rem] border px-4 py-5 sm:px-6 ${
                  isDarkMode
                    ? 'border-cyan-400/10 bg-slate-950/70'
                    : 'border-rose-100 bg-gradient-to-br from-rose-50 via-white to-sky-50'
                }`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_35%)]" />
                <div className="relative flex flex-col items-center justify-center text-center">
                  <PokeBallLoader size={78} showText={false} />
                  <span className="text-[9px] font-black uppercase tracking-[0.42em] text-cyan-400/80">Evolution Scan</span>
                  <p className={`mt-2 max-w-[18rem] text-[11px] font-bold uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Analyse de la lignee en cours...
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {evoChain.map((evo, i) => (
                  <React.Fragment key={evo.id}>
                    {i > 0 && (
                      <div className="flex flex-col items-center">
                        <ChevronRight size={16} className="text-slate-300" />
                        {evo.condition && <span className="mt-1 text-[7px] font-black uppercase text-rose-500">{evo.condition}</span>}
                      </div>
                    )}
                    <button type="button" disabled={evo.id === pokemon.id} aria-label={evo.id === pokemon.id ? `${evo.nom}, Pokemon actuel` : `Voir ${evo.nom}`} onClick={() => { const p = pokemons.find((x) => x.id === evo.id); if (p) onNavigate(p); }} className={`group relative rounded-2xl border-2 p-2 transition-all ${evo.id === pokemon.id ? 'cursor-default border-rose-500 bg-rose-50' : 'cursor-pointer border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                      <img src={evo.image} alt={evo.nom} className="h-14 w-14 object-contain transition-transform group-hover:scale-110" />
                    </button>
                  </React.Fragment>
                ))}
                {!loadingEvo && evoChain.length === 0 && <p role="status" className="text-xs font-black uppercase tracking-widest text-slate-400">Aucune evolution disponible.</p>}
              </div>
            )}
          </div>
        </div>
      </Motion.div>
    </Motion.div>
  );
};

export default PokemonDetails;
