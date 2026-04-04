// src/components/pokemon/PokemonCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart } from 'lucide-react';
import { TYPE_COLORS } from '../../constants/pokemon';

/**
 * Carte de Pokémon interactive affichée dans la liste principale.
 * Gère le survol, le clic et les actions rapides (favori/capture).
 */
const PokemonCard = ({ pokemon, isCaught, isFavorite, isDarkMode, onClick, onCatch, onToggleFavorite, index = 0 }) => {
  const color = (pokemon.types && pokemon.types[0] && TYPE_COLORS[pokemon.types[0].nom]) || '#94A3B8';
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.175, 0.885, 0.32, 1.275] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`card-shimmer relative p-8 rounded-[3rem] shadow-2xl border-4 transition-all cursor-pointer group ${isCaught ? 'card-caught' : ''} ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-white text-slate-900'}`}
      onClick={onClick}
    >
       <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
            className={`p-3 rounded-full transition-all shadow-md ${isFavorite ? 'bg-amber-400 text-white' : 'bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-400 hover:text-amber-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
             <Star size={22} fill={isFavorite ? 'white' : 'none'} />
          </motion.button>
       </div>
       <div className="absolute top-5 right-5 z-20 flex flex-col gap-2">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); onCatch(); }}
            className={`p-3 rounded-full transition-all shadow-md ${isCaught ? 'bg-rose-500 text-white' : 'bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
             <Heart size={22} fill={isCaught ? 'white' : 'none'} />
          </motion.button>
       </div>
       <div className="relative mb-8 mt-4 h-48 flex items-center justify-center">
          {/* Aura lumineuse derrière le Pokémon basée sur son type primaire */}
          <div
            className="pokemon-aura absolute inset-0 blur-3xl rounded-full"
            style={{ backgroundColor: color, opacity: 0.4 }}
          />
          <img
            src={pokemon.image}
            alt={pokemon.nom}
            className="pokemon-float-img w-48 h-48 object-contain relative z-10 drop-shadow-2xl mx-auto"
          />
       </div>
        <div className="mt-4">
           <h3 className="text-3xl font-black capitalize tracking-tighter mb-4">{pokemon.nom}</h3>
          <div className="flex gap-2">
             {pokemon.types.map(t => (
                <span key={t.nom} className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg" style={{backgroundColor: TYPE_COLORS[t.nom] || '#94A3B8'}}>{t.nom}</span>
             ))}
          </div>
       </div>
    </motion.div>
  );
};

export default PokemonCard;
