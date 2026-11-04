import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { Sparkles, Volume2 } from 'lucide-react';
import { TYPE_COLORS } from '../../../constants/pokemon';
import usePokemonCry from '../../../hooks/usePokemonCry';

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
 * Panneau gauche de la fiche : illustration animée, nom, types, cri et version shiny.
 */
export default function PokemonHero({ pokemon }) {
  const [isShiny, setIsShiny] = useState(false);
  const { playCry, isPlaying } = usePokemonCry(pokemon.id);

  useEffect(() => {
    playCry();
  }, [playCry, pokemon.id]);

  const imageUrl = isShiny
    ? pokemon.image.replace('official-artwork', 'official-artwork/shiny')
    : pokemon.image;

  return (
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
  );
}
