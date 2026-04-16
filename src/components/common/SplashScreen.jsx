import React, { useEffect } from 'react';
import { motion as Motion } from 'framer-motion';

/**
 * SplashScreen Component - Une introduction "Studio" pour NDJITEK.
 */
const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    // On force la fin de l'animation après 3.2 secondes si Framer Motion onAnimationComplete tarde (sécurité)
    const timer = setTimeout(onFinish, 3500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <Motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.8, duration: 0.7, ease: "easeInOut" }}
      onAnimationComplete={onFinish}
      className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Réseau de lignes Cyber/Tech en arrière-plan */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-1/4 -left-20 w-80 h-[2px] bg-cyan-500/30 rotate-45 blur-sm animate-pulse" />
        <div className="absolute top-3/4 -right-20 w-80 h-[2px] bg-blue-500/30 -rotate-45 blur-sm animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_70%)]" />
      </div>

      {/* Container du Logo Lion */}
      <Motion.div
        initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ duration: 1.2, ease: "backOut" }}
        className="relative group"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-cyan-500 blur-[80px] opacity-20 animate-pulse" />
        
        {/* Logo Lion Géométrique Simplifié */}
        <svg width="180" height="180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Crinière Tech */}
          <Motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d="M50 10 L65 25 L85 25 L75 45 L90 60 L70 70 L50 90 L30 70 L10 60 L25 45 L15 25 L35 25 Z" 
            stroke="url(#lionGradient)" 
            strokeWidth="1.5" 
            strokeLinecap="round"
            filter="url(#glow)"
          />
          
          {/* Yeux Lumineux */}
          <Motion.circle 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1] }}
            transition={{ delay: 1.5, duration: 1, repeat: Infinity }}
            cx="40" cy="45" r="2.5" fill="#22d3ee" 
          />
          <Motion.circle 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1] }}
            transition={{ delay: 1.5, duration: 1, repeat: Infinity }}
            cx="60" cy="45" r="2.5" fill="#22d3ee" 
          />

          {/* Museau */}
          <path d="M50 70 L46 62 L54 62 Z" fill="url(#lionGradient)" />
        </svg>
      </Motion.div>

      {/* Texte NDJITEK */}
      <Motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mt-8 flex flex-col items-center"
      >
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.6em] mb-2">PROJET RÉALISÉ PAR</span>
        <h2 className="text-5xl font-black tracking-tighter text-white uppercase italic">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">NDJI</span>TEK
        </h2>
        
        {/* Barre de chargement stylisée */}
        <div className="mt-8 w-48 h-1 bg-slate-900 rounded-full overflow-hidden border border-white/5">
          <Motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
          />
        </div>
      </Motion.div>

      {/* Particules de fond */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <Motion.div
            key={i}
            initial={{ y: "110%", x: `${Math.random() * 100}%` }}
            animate={{ y: "-10%" }}
            transition={{ 
              duration: Math.random() * 2 + 2, 
              repeat: Infinity, 
              delay: Math.random() * 2,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
          />
        ))}
      </div>
    </Motion.div>
  );
};

export default SplashScreen;
