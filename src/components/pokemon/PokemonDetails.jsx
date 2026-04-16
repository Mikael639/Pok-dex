// src/components/pokemon/PokemonDetails.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import PokeBallLoader from '../common/PokeBallLoader';
import { motion as Motion } from 'framer-motion';
import { X, Sparkles, Star, Heart, ChevronRight, Scale } from 'lucide-react';
import { TYPE_COLORS, TYPE_CHART } from '../../constants/pokemon';
import useAccessibleModal from '../../hooks/useAccessibleModal';

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

/**
 * Modal affichant les détails approfondis d'un Pokémon.
 * Récupère dynamiquement la chaîne d'évolution via l'API PokéAPI.
 */
const PokemonDetails = ({ pokemon, isDarkMode, pokemons, onClose, onNavigate, onCatch, isCaught, isFavorite, onToggleFavorite, onCompare }) => {
  const [isShiny, setIsShiny] = useState(false);
  const [evoChain, setEvoChain] = useState([]);
  const [loadingEvo, setLoadingEvo] = useState(false);
  const modalRef = useRef(null);

  useAccessibleModal(modalRef, onClose);

  // URL de l'image dynamique (normale ou chromatique/shiny)
  const imageUrl = isShiny 
    ? pokemon.image.replace('official-artwork', 'official-artwork/shiny')
    : pokemon.image;

  useEffect(() => {
    setLoadingEvo(true);
    
    // Vérification du Cache LocalStorage pour les évolutions
    const cacheKey = `evo_cache_${pokemon.id}`;
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      setEvoChain(JSON.parse(cachedData));
      setLoadingEvo(false);
      return;
    }

    const fetchEvo = async () => {
      try {
        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`).then(r => r.json());
        const evoRes = await fetch(speciesRes.evolution_chain.url).then(r => r.json());
        
        const chain = [];
        let curr = evoRes.chain;

        // Formate les conditions d'évolution de l'API vers un libellé lisible
        const getTriggerLabel = (details) => {
          if (!details || !details[0]) return null;
          const d = details[0];
          if (d.trigger.name === 'level-up') {
            if (d.min_level) return `Niv. ${d.min_level}`;
            if (d.min_happiness) return `Bonheur`;
            if (d.known_move) return `Capacité`;
            return `Niveau`;
          }
          if (d.trigger.name === 'use-item') return d.item.name.replace(/-/g, ' ').toUpperCase();
          if (d.trigger.name === 'trade') return `Échange`;
          return d.trigger.name;
        };

        const processNode = async (node) => {
          const id = parseInt(node.species.url.split('/').filter(Boolean).pop());
          const localP = pokemons.find(p => p.id === id);
          chain.push({
            id,
            nom: localP ? localP.nom : node.species.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
            condition: getTriggerLabel(node.evolution_details)
          });
          if (node.evolves_to.length > 0) {
            await processNode(node.evolves_to[0]);
          }
        };

        await processNode(curr);
        setEvoChain(chain);
        localStorage.setItem(cacheKey, JSON.stringify(chain));
      } catch (err) {
        console.error("Erreur de récupération des évolutions :", err);
      } finally {
        setLoadingEvo(false);
      }
    };
    fetchEvo();
  }, [pokemon.id, pokemons]);

  // Calcul des faiblesses basé sur la table des types
  const weaknesses = useMemo(() => {
    const list = {};
    Object.keys(TYPE_CHART).forEach(type => {
      let mult = 1;
      pokemon.types.forEach(pType => {
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
      className="fixed inset-0 z-[100] flex items-end justify-center p-2 overflow-hidden sm:items-center sm:p-4"
    >
       <div aria-hidden="true" className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl" onClick={onClose} />
       <Motion.div ref={modalRef} tabIndex={-1} initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }} className={`relative w-full max-w-4xl max-h-[96vh] sm:max-h-[98vh] flex flex-col md:flex-row rounded-[1.75rem] sm:rounded-[3rem] overflow-hidden shadow-2xl ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
          
          <button 
            type="button"
            data-autofocus
            onClick={onClose} 
            aria-label="Fermer la fiche Pokemon"
            className="absolute top-4 right-4 z-50 p-2.5 bg-black/20 hover:bg-black/40 dark:bg-white/10 dark:hover:bg-white/20 rounded-full text-slate-800 dark:text-white backdrop-blur-xl transition-all hover:scale-110 active:scale-95 shadow-lg border border-transparent hover:border-white/20"
          >
            <X size={20} />
          </button>

          {/* Section Gauche : Visuel et Nom */}
          <div className="md:w-1/2 min-h-[280px] p-5 sm:p-6 md:p-8 flex flex-col justify-center items-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${TYPE_COLORS[pokemon.types[0].nom]} 0%, #000 150%)` }}>
             <div className="absolute inset-0 bg-black/10 z-0" />
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
               <Motion.div
                 key={imageUrl}
                 animate={floatingAnimation}
                 className="relative"
               >
                 <img
                   src={imageUrl}
                   alt={pokemon.nom}
                   className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain drop-shadow-[0_28px_60px_rgba(0,0,0,0.58)] transition-transform duration-700 hover:scale-110"
                 />
               </Motion.div>
             </Motion.div>
             <div className="mt-4 text-center text-white z-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter mb-1">{pokemon.nom}</h2>
                <div className="flex flex-wrap gap-2 justify-center mb-3">
                   {pokemon.types.map(t => <span key={t.nom} className="px-3 sm:px-4 py-1 bg-white/20 backdrop-blur-xl rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest">{t.nom}</span>)}
                </div>
                <button type="button" aria-label={isShiny ? 'Afficher la version classique' : 'Afficher la version shiny'} onClick={() => setIsShiny(!isShiny)} className={`p-2.5 rounded-xl backdrop-blur-xl transition-all shadow-md ${isShiny ? 'bg-amber-400 text-slate-900' : 'bg-white/10 hover:bg-white/20'}`}>
                   <Sparkles size={18} />
                </button>
             </div>
          </div>

          {/* Section Droite : Stats et Evolutions */}
          <div className="md:w-1/2 p-4 pt-5 sm:p-5 sm:pt-6 md:p-6 lg:p-8 overflow-y-auto flex-1 custom-scrollbar">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4">
                <h3 className="text-base lg:text-lg font-black uppercase tracking-widest">Statistiques</h3>
                <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
                    <button type="button" aria-label={isFavorite ? `Retirer ${pokemon.nom} des favoris` : `Ajouter ${pokemon.nom} aux favoris`} onClick={onToggleFavorite} className={`p-3 rounded-2xl transition-all shadow-lg ${isFavorite ? 'bg-amber-400 text-white shadow-amber-400/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                       <Star size={20} fill={isFavorite ? 'white' : 'none'} />
                    </button>
                    <button type="button" onClick={onCatch} className={`flex min-w-0 items-center justify-center gap-2 px-4 py-3 rounded-2xl font-black transition-all shadow-lg sm:px-6 ${isCaught ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                       <Heart size={20} fill={isCaught ? 'white' : 'none'} /> <span className="truncate text-xs sm:text-sm md:text-base">{isCaught ? 'LIBÉRER' : 'CAPTURER'}</span>
                    </button>
                    <button type="button" onClick={onCompare} className="col-span-2 flex w-full items-center justify-center gap-2 px-4 py-3 rounded-2xl font-black transition-all shadow-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 sm:col-auto sm:w-auto sm:px-5">
                       <Scale size={18} /> <span className="text-xs sm:text-sm md:text-base">COMPARER</span>
                    </button>
                </div>
             </div>

             {/* Barres de Statistiques */}
             <div className="space-y-1.5 lg:space-y-2">
                {Object.entries(pokemon.base).map(([key, val]) => (
                   <div key={key}>
                      <div className="flex justify-between mb-1">
                         <span className="font-black text-slate-400 uppercase text-[9px] tracking-widest">{key}</span>
                         <span className="font-black text-base">{val}</span>
                      </div>
                      <div role="progressbar" aria-label={`${key} ${val}`} aria-valuemin={0} aria-valuemax={150} aria-valuenow={val} className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                         <Motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (val / 150) * 100)}%` }} className="h-full rounded-full" style={{ backgroundColor: TYPE_COLORS[pokemon.types[0].nom] }} />
                      </div>
                   </div>
                ))}
             </div>

             {/* Efficacité subie */}
             <div className="mt-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Efficacité subie</h4>
                <div className="flex flex-wrap gap-1.5">
                    {Object.entries(weaknesses).sort((a,b) => b[1] - a[1]).map(([t, m]) => (
                       <div key={t} className={`px-2 py-1 rounded-lg text-[9px] font-black flex items-center gap-1.5 shadow-sm ${m > 1 ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                          <span>{t}</span>
                          <span className="bg-white/50 dark:bg-black/20 px-1 py-0.5 rounded text-[8px]">x{m}</span>
                       </div>
                    ))}
                </div>
             </div>

             {/* Chaîne d'évolution */}
             <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 pb-2 sm:pb-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Lignée Évolutive</h4>
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
                      <span className="text-[9px] font-black uppercase tracking-[0.42em] text-cyan-400/80">
                        Evolution Scan
                      </span>
                      <p
                        className={`mt-2 max-w-[18rem] text-[11px] font-bold uppercase tracking-[0.2em] ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
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
                            {evo.condition && <span className="text-[7px] font-black uppercase text-rose-500 mt-1">{evo.condition}</span>}
                          </div>
                        )}
                        <button type="button" disabled={evo.id === pokemon.id} aria-label={evo.id === pokemon.id ? `${evo.nom}, Pokemon actuel` : `Voir ${evo.nom}`} onClick={() => { const p = pokemons.find(x => x.id === evo.id); if (p) onNavigate(p); }} className={`relative group p-2 rounded-2xl border-2 transition-all ${evo.id === pokemon.id ? 'border-rose-500 bg-rose-50 cursor-default' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer'}`}>
                           <img src={evo.image} alt={evo.nom} className="w-14 h-14 object-contain group-hover:scale-110 transition-transform" />
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
