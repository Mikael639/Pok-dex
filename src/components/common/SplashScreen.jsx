import React, { useEffect } from 'react';
import { motion as Motion } from 'framer-motion';

/**
 * SplashScreen Component - Intro centree sur l'experience Pokedex,
 * avec NDJITEK comme signature visuelle.
 */
const scanLineVariants = {
  initial: { scaleX: 0, opacity: 0 },
  animate: {
    scaleX: 1,
    opacity: [0, 1, 0.35],
    transition: { duration: 0.85, ease: 'easeInOut' },
  },
};

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2550);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <Motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.05, duration: 0.45, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-slate-950"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.14),_transparent_32%),radial-gradient(circle_at_bottom,_rgba(34,211,238,0.18),_transparent_38%),linear-gradient(180deg,_#020617_0%,_#020617_45%,_#010409_100%)]" />

      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-500/70 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(2,6,23,0.85)_72%)]" />
      </div>

      <Motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative flex flex-col items-center px-6 text-center"
      >
        <Motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative mb-8 flex h-28 w-28 items-center justify-center md:h-32 md:w-32"
        >
          <Motion.div
            initial={{ rotate: -18, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full border border-white/10 shadow-[0_0_50px_rgba(239,68,68,0.14)]"
          />
          <Motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1.08, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.55, ease: 'easeOut' }}
            className="absolute inset-3 rounded-full border border-cyan-400/40"
          />
          <Motion.div
            variants={scanLineVariants}
            initial="initial"
            animate="animate"
            className="absolute left-1/2 top-1/2 h-px w-36 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-300 to-transparent"
          />
          <div className="relative h-full w-full overflow-hidden rounded-full border-[4px] border-slate-950 shadow-[0_0_45px_rgba(34,211,238,0.25)]">
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-rose-400 to-rose-600" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-slate-50" />
            <div className="absolute inset-x-0 top-1/2 h-[4px] -translate-y-1/2 bg-slate-950" />
            <div className="absolute left-1/2 top-1/2 z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-[4px] border-slate-950 bg-white md:h-10 md:w-10">
              <div className="absolute inset-1 rounded-full bg-slate-100 shadow-inner" />
            </div>
          </div>
        </Motion.div>

        <Motion.div
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.28, duration: 0.45 }}
          className="flex flex-col items-center"
        >
          <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.55em] text-cyan-300/75">
            Scan Initiated
          </span>
          <h1 className="text-4xl font-black uppercase tracking-[0.35em] text-white md:text-6xl">
            POKEDEX
          </h1>
          <p className="mt-3 max-w-xs text-xs uppercase tracking-[0.28em] text-slate-400 md:max-w-md">
            Identification en cours du bestiaire
          </p>
        </Motion.div>

        <Motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '100%', opacity: 1 }}
          transition={{ delay: 0.55, duration: 1.1, ease: 'easeInOut' }}
          className="mt-8 h-px max-w-sm bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent"
        />

        <Motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.4 }}
          className="relative mt-5 flex flex-col items-center"
        >
          <Motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.55, ease: 'easeOut' }}
            className="absolute inset-x-0 top-1/2 h-16 -translate-y-1/2 rounded-full bg-cyan-500/12 blur-3xl"
          />
          <span className="text-[9px] font-bold uppercase tracking-[0.45em] text-slate-500">
            Crafted by
          </span>
          <Motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.02, duration: 0.45, ease: 'easeOut' }}
            className="relative mt-3 flex items-center gap-4 rounded-full border border-cyan-400/15 bg-white/[0.03] px-5 py-3 shadow-[0_0_30px_rgba(34,211,238,0.12)] backdrop-blur-sm"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/0 via-cyan-300/8 to-blue-500/0" />
            <img
              src="/images/NDJITECH-Logo.png"
              alt="NDJITEK Lion Logo"
              fetchPriority="high"
              decoding="async"
              className="relative h-11 w-11 object-contain opacity-90 drop-shadow-[0_0_24px_rgba(34,211,238,0.4)]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="relative flex flex-col items-start">
              <span className="text-[8px] font-semibold uppercase tracking-[0.38em] text-cyan-200/65">
                Signature Edition
              </span>
              <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-blue-500 bg-clip-text text-xl font-black uppercase tracking-[0.34em] text-transparent">
                NDJITEK
              </span>
            </div>
          </Motion.div>
        </Motion.div>
      </Motion.div>
    </Motion.div>
  );
};

export default SplashScreen;
