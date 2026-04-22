// src/components/pokemon/PokemonCard.jsx
import React from 'react';
import { motion as Motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Star, Heart } from 'lucide-react';
import { TYPE_COLORS } from '../../constants/pokemon';
import { cn } from '../../lib/utils';
import MagicCard from '../magicui/MagicCard';
import ShineBorder from '../magicui/ShineBorder';

function PokeBallBadge({ isCaught }) {
  return (
    <div className="relative mx-auto mt-6 h-11 w-11">
      <div className={`absolute inset-0 rounded-full blur-xl ${isCaught ? 'bg-rose-500/30' : 'bg-rose-400/18'}`} />
      <div className="relative h-full w-full overflow-hidden rounded-full border-[3px] border-slate-950 shadow-[0_10px_25px_rgba(15,23,42,0.18)]">
        <div className={`absolute inset-x-0 top-0 h-1/2 ${isCaught ? 'bg-gradient-to-b from-rose-400 to-rose-600' : 'bg-gradient-to-b from-rose-300 to-rose-500'}`} />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white" />
        <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-slate-950" />
        <div className="absolute left-1/2 top-1/2 z-10 h-4.5 w-4.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-slate-950 bg-white">
          <div className={`absolute inset-[2px] rounded-full ${isCaught ? 'bg-rose-200' : 'bg-slate-200'}`} />
        </div>
      </div>
      {isCaught && (
        <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-300/40 blur-sm" />
      )}
    </div>
  );
}

const PokemonCard = ({ pokemon, isCaught, isFavorite, isDarkMode, onClick, onCatch, onToggleFavorite, index = 0 }) => {
  const color = (pokemon?.types && pokemon.types[0] && TYPE_COLORS[pokemon.types[0].nom]) || '#94A3B8';
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 300, damping: 30 });

  const shineX = useTransform(x, [-100, 100], ["0%", "100%"]);
  const shineY = useTransform(y, [-100, 100], ["0%", "100%"]);
  const shineOpacity = useTransform(x, [-100, 0, 100], [0.3, 0, 0.3]);

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = (mouseX / width - 0.5) * 200;
    const yPct = (mouseY / height - 0.5) * 200;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }
  
  const totalStats = pokemon?.base ? Object.values(pokemon.base).reduce((a, b) => a + b, 0) : 0;
  const isRare = totalStats > 450;

  const CardContent = (
    <div className="relative w-full h-full p-8 text-left">
       {/* Holographic Shine Overlay - Using absolute positioning within a motion block */}
       <Motion.div 
         className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
         style={{
           background: `radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 70%)`,
           left: shineX,
           top: shineY,
           opacity: shineOpacity,
           mixBlendMode: 'overlay'
         }}
       />
       {isRare && (
         <div className="absolute inset-0 z-10 pointer-events-none opacity-10 bg-[linear-gradient(105deg,transparent_20%,rgba(255,255,255,0.2)_25%,rgba(0,255,255,0.1)_30%,rgba(255,0,255,0.1)_35%,transparent_40%)] bg-[length:200%_200%] mix-blend-color-dodge" />
       )}
       <button
         type="button"
         aria-label={`Voir ${pokemon?.nom}`}
         onClick={(event) => { event.stopPropagation(); onClick(); }}
         className="absolute inset-0 z-10 rounded-[3rem] focus-visible:outline-none focus-visible:ring-4 ring-rose-500/20"
       />
       <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
          <Motion.button
            type="button"
            aria-label={isFavorite ? `Retirer ${pokemon?.nom} des favoris` : `Ajouter ${pokemon?.nom} aux favoris`}
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
            className={`p-3 rounded-full transition-all shadow-md ${isFavorite ? 'bg-amber-400 text-white' : 'bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-400 hover:text-amber-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
             <Star size={22} fill={isFavorite ? 'white' : 'none'} />
          </Motion.button>
       </div>
       <div className="absolute top-5 right-5 z-20 flex flex-col gap-2">
          <Motion.button
            type="button"
            aria-label={isCaught ? `Retirer ${pokemon?.nom} de l equipe` : `Ajouter ${pokemon?.nom} a l equipe`}
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); onCatch(); }}
            className={`p-3 rounded-full transition-all shadow-md ${isCaught ? 'bg-rose-500 text-white' : 'bg-slate-100/10 dark:bg-slate-800/10 backdrop-blur-sm text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
             <Heart size={22} fill={isCaught ? 'white' : 'none'} />
          </Motion.button>
       </div>
       <div className="relative z-[1] mb-8 mt-4 h-48 flex items-center justify-center">
          <div className="pokemon-aura absolute inset-0 blur-3xl rounded-full" style={{ backgroundColor: color, opacity: 0.4 }} />
          <img src={pokemon?.image} alt={pokemon?.nom} loading="lazy" className="pokemon-float-img w-48 h-48 object-contain relative z-10 drop-shadow-2xl mx-auto" />
       </div>
        <div className="relative z-[1] mt-4 text-center">
           <h3 className="text-3xl font-black capitalize tracking-tighter mb-4">{pokemon?.nom}</h3>
          <div className="flex flex-wrap gap-2 justify-center">
             {pokemon?.types?.map(t => (
                <span key={t.nom} className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg" style={{backgroundColor: TYPE_COLORS[t.nom] || '#94A3B8'}}>{t.nom}</span>
             ))}
          </div>
          <PokeBallBadge isCaught={isCaught} />
       </div>
    </div>
  );

  return (
    <Motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      whileHover={{ y: -6 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className="h-full group"
    >
      {isRare ? (
        <ShineBorder borderRadius={48} borderWidth={4} color={[color, "#ffffff", color]} duration={8} className={cn("p-0 h-full cursor-pointer overflow-hidden", isDarkMode ? "bg-slate-900" : "bg-white")}>
          <MagicCard className={cn("border-none h-full", isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900")} gradientColor={isDarkMode ? `${color}33` : `${color}11`} onClick={onClick}>
            {CardContent}
          </MagicCard>
        </ShineBorder>
      ) : (
        <MagicCard className={cn("border-4 h-full cursor-pointer", isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-white text-slate-900")} gradientColor={isDarkMode ? `${color}33` : `${color}11`} onClick={onClick}>
          {CardContent}
        </MagicCard>
      )}
    </Motion.div>
  );
};

export default PokemonCard;
