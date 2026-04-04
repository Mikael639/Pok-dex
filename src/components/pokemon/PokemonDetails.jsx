// src/components/pokemon/PokemonDetails.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Star, Heart, ChevronRight } from 'lucide-react';
import { TYPE_COLORS, TYPE_CHART } from '../../constants/pokemon';

/**
 * Modal affichant les détails approfondis d'un Pokémon.
 * Récupère dynamiquement la chaîne d'évolution via l'API PokéAPI.
 */
const PokemonDetails = ({ pokemon, isDarkMode, pokemons, onClose, onNavigate, onCatch, isCaught, isFavorite, onToggleFavorite, onCompare }) => {
  const [isShiny, setIsShiny] = useState(false);
  const [evoChain, setEvoChain] = useState([]);
  const [loadingEvo, setLoadingEvo] = useState(false);

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
       <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl" onClick={onClose} />
       <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }} className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
          
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-50 p-2.5 bg-black/20 hover:bg-black/40 dark:bg-white/10 dark:hover:bg-white/20 rounded-full text-slate-800 dark:text-white backdrop-blur-xl transition-all hover:scale-110 active:scale-95 shadow-lg border border-transparent hover:border-white/20"
          >
            <X size={20} />
          </button>

          {/* Section Gauche : Visuel et Nom */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center items-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${TYPE_COLORS[pokemon.types[0].nom]} 0%, #000 150%)` }}>
             <div className="absolute inset-0 bg-black/10 z-0" />
             <motion.img 
               key={imageUrl}
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               src={imageUrl} 
               className="w-36 h-36 md:w-48 md:h-48 object-contain z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:scale-110 transition-transform duration-700" 
             />
             <div className="mt-4 text-center text-white z-10">
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-1">{pokemon.nom}</h2>
                <div className="flex gap-2 justify-center mb-3">
                   {pokemon.types.map(t => <span key={t.nom} className="px-4 py-1 bg-white/20 backdrop-blur-xl rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest">{t.nom}</span>)}
                </div>
                <button onClick={() => setIsShiny(!isShiny)} className={`p-2.5 rounded-xl backdrop-blur-xl transition-all shadow-md ${isShiny ? 'bg-amber-400 text-slate-900' : 'bg-white/10 hover:bg-white/20'}`}>
                   <Sparkles size={18} />
                </button>
             </div>
          </div>

          {/* Section Droite : Stats et Evolutions */}
          <div className="md:w-1/2 p-5 pt-10 md:p-8 md:pt-12 lg:p-10 lg:pt-14 overflow-y-auto flex-1 custom-scrollbar">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h3 className="text-base lg:text-lg font-black uppercase tracking-widest">Statistiques</h3>
                <div className="flex gap-2">
                    <button onClick={onToggleFavorite} className={`p-3 rounded-2xl transition-all shadow-lg ${isFavorite ? 'bg-amber-400 text-white shadow-amber-400/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                       <Star size={20} fill={isFavorite ? 'white' : 'none'} />
                    </button>
                    <button onClick={onCatch} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all shadow-lg ${isCaught ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                       <Heart size={20} fill={isCaught ? 'white' : 'none'} /> <span className="text-sm md:text-base">{isCaught ? 'LIBÉRER' : 'CAPTURER'}</span>
                    </button>
                </div>
             </div>

             {/* Barres de Statistiques */}
             <div className="space-y-3 lg:space-y-4">
                {Object.entries(pokemon.base).map(([key, val]) => (
                   <div key={key}>
                      <div className="flex justify-between mb-1">
                         <span className="font-black text-slate-400 uppercase text-[9px] tracking-widest">{key}</span>
                         <span className="font-black text-base">{val}</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (val / 150) * 100)}%` }} className="h-full rounded-full" style={{ backgroundColor: TYPE_COLORS[pokemon.types[0].nom] }} />
                      </div>
                   </div>
                ))}
             </div>

             {/* Efficacité subie */}
             <div className="mt-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Efficacité subie</h4>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(weaknesses).sort((a,b) => b[1] - a[1]).map(([t, m]) => (
                       <div key={t} className={`px-2 py-1 rounded-lg text-[9px] font-black flex items-center gap-1.5 shadow-sm ${m > 1 ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                          <span>{t}</span>
                          <span className="bg-white/50 dark:bg-black/20 px-1 py-0.5 rounded text-[8px]">x{m}</span>
                       </div>
                    ))}
                </div>
             </div>

             {/* Chaîne d'évolution */}
             <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 pb-10">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Lignée Évolutive</h4>
                {loadingEvo ? (
                  <div className="flex gap-4 animate-pulse">
                    {[1, 2, 3].map(i => <div key={i} className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl" />)}
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-4">
                    {evoChain.map((evo, i) => (
                      <React.Fragment key={evo.id}>
                        {i > 0 && (
                          <div className="flex flex-col items-center">
                            <ChevronRight size={16} className="text-slate-300" />
                            {evo.condition && <span className="text-[7px] font-black uppercase text-rose-500 mt-1">{evo.condition}</span>}
                          </div>
                        )}
                        <div onClick={() => { const p = pokemons.find(x => x.id === evo.id); if (p) onNavigate(p); }} className={`relative group cursor-pointer p-2 rounded-2xl border-2 transition-all ${evo.id === pokemon.id ? 'border-rose-500 bg-rose-50' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                           <img src={evo.image} className="w-14 h-14 object-contain group-hover:scale-110 transition-transform" />
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                )}
             </div>
          </div>
       </motion.div>
    </motion.div>
  );
};

export default PokemonDetails;
