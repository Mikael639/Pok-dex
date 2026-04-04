// src/components/games/BattleArena.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Shield, Users, Shuffle, ChevronLeft, Trophy, Search } from 'lucide-react';
import { TYPE_CHART } from '../../constants/pokemon';

/**
 * Arène de combat gérant plusieurs modes de jeu.
 * Utilise un système de tours et de multiplicateurs de types.
 */
const BattleArena = ({ state, onStart, isDarkMode, teamLength, pokemons, onManualMove, setBattleState }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  // Mode Menu : Sélection du type de combat
  if (state.mode === 'menu') {
    return (
      <div className="flex flex-col items-center justify-center py-12 md:py-20 animate-fade-in text-center max-w-4xl mx-auto space-y-8 md:space-y-12 px-4">
          <div className="relative">
             <div className="absolute inset-0 bg-rose-500/20 blur-3xl rounded-full scale-110 animate-pulse" />
             <div className="relative p-6 md:p-10 bg-rose-500 rounded-[2rem] md:rounded-[3rem] shadow-2xl ring-4 md:ring-8 ring-rose-500/20"><Activity size={48} className="text-white md:w-20 md:h-20"/></div>
          </div>
          <div>
             <h2 className="text-3xl md:text-6xl font-black mb-3 md:mb-6 uppercase tracking-tighter text-slate-900 dark:text-white leading-none">Arène Master</h2>
             <p className="text-slate-500 text-xs md:text-xl font-bold uppercase tracking-widest opacity-70">Choisissez votre défi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full px-2">
             {[
                { id: 'ia', title: 'J1 vs IA', desc: 'Le défi classique', icon: Shield },
                { id: 'pvp', title: 'Local PvP', desc: 'Défiez un ami', icon: Users },
                { id: 'auto', title: 'Spectateur', desc: 'Combat Auto', icon: Shuffle }
             ].map((m) => (
                <button 
                  key={m.id}
                  onClick={() => onStart(m.id)}
                  disabled={teamLength < 6}
                  className={`group relative p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-xl border-4 transition-all overflow-hidden ${teamLength < 6 ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:border-rose-500 hover:scale-[1.03] active:scale-95 border-slate-100 dark:border-slate-800'}`}
                >
                   <div className="relative z-10 flex flex-col items-center">
                      <m.icon size={32} className="text-rose-500 mb-3 md:mb-4 group-hover:scale-110 transition-transform md:w-10 md:h-10" />
                      <h3 className="text-sm md:text-xl font-black uppercase tracking-tighter mb-1 md:mb-2">{m.title}</h3>
                      <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-rose-500 transition-colors">{m.desc}</p>
                   </div>
                </button>
             ))}
          </div>

          {teamLength < 6 && (
            <div className="px-6 py-3 md:px-10 md:py-5 bg-rose-500/10 rounded-xl md:rounded-2xl border-2 border-rose-500/20 text-rose-500 font-black text-[10px] md:text-sm uppercase tracking-widest animate-pulse max-w-sm mx-auto">
               Veuillez sélectionner 6 Pokémon dans votre équipe ({teamLength}/6)
            </div>
          )}
      </div>
    );
  }

  // Mode Selection : Pour le PvP Local, sélection de l'équipe adverse
  if (state.mode === 'selection') {
    const filteredSelection = pokemons.filter(p => p.nom.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-fade-in relative px-4 pb-20">
         <button onClick={() => setBattleState(s => ({ ...s, mode: 'menu' }))} className="absolute -top-8 left-4 md:left-0 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors group">
           <ChevronLeft size={16} /> Retour
         </button>

         <div className="text-center pt-8">
            <h2 className="text-2xl md:text-4xl font-black uppercase italic mb-2 text-rose-500">Joueur 2</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[8px] md:text-sm">Composez votre équipe ({state.enemyTeam.length}/6)</p>
         </div>

         <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
               type="text" 
               placeholder="Rechercher..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-white dark:bg-slate-900 border-2 md:border-4 border-slate-100 dark:border-slate-800 rounded-xl md:rounded-[2rem] pl-12 pr-4 py-3 md:pl-14 md:pr-6 md:py-4 text-xs md:text-sm font-bold shadow-xl focus:ring-4 ring-rose-500/20"
            />
         </div>

         <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 mb-8">
            {state.enemyTeam.map((p, i) => (
               <div key={i} className="bg-rose-500 p-2 md:p-4 rounded-xl md:rounded-3xl shadow-xl flex flex-col items-center relative overflow-hidden group">
                  <button onClick={() => setBattleState(s => ({ ...s, enemyTeam: s.enemyTeam.filter((_, idx) => idx !== i) }))} className="absolute top-1 right-1 bg-white/20 p-1 rounded-full text-white"><X size={10}/></button>
                  <img src={p.image} className="w-10 h-10 md:w-16 md:h-16 object-contain" />
               </div>
            ))}
            {Array.from({ length: 6 - state.enemyTeam.length }).map((_, i) => (
               <div key={i} className="aspect-square rounded-xl md:rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-200" />
            ))}
         </div>
         
         {state.enemyTeam.length === 6 && (
            <button onClick={() => { setBattleState(s => ({ ...s, mode: 'pvp', isFighting: true, logs: ['QUE LE DUEL COMMENCE !'] })); setSearchTerm(''); }} className="w-full py-4 md:py-6 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl md:rounded-[2rem] font-black hover:bg-rose-500 hover:text-white transition-all shadow-2xl">
               VALIDE & COMBAT
            </button>
         )}

         <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 md:gap-4 max-h-[300px] overflow-y-auto p-4 custom-scrollbar bg-slate-50 dark:bg-slate-950/20 rounded-[2rem]">
            {filteredSelection.map(p => (
               <button key={p.id} onClick={() => state.enemyTeam.length < 6 && setBattleState(s => ({ ...s, enemyTeam: [...s.enemyTeam, { ...p, currentHP: 100 }] }))} className={`p-2 md:p-4 rounded-xl md:rounded-2xl transition-all shadow-md flex flex-col items-center border-2 ${state.enemyTeam.some(et => et.id === p.id) ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white dark:bg-slate-900 border-transparent hover:border-rose-500'}`}>
                  <img src={p.image} className="w-8 h-8 md:w-12 md:h-12 object-contain" />
                  <span className="text-[7px] md:text-[10px] font-black uppercase mt-1 truncate w-full">{p.nom}</span>
               </button>
            ))}
         </div>
      </div>
    );
  }

  // Mode Combat : Interface de l'arène
  const pActive = state.playerTeam[state.playerActive];
  const eActive = state.enemyTeam[state.enemyActive];
  const isPlayerTurn = state.currentTurn === 'player';
  const showControls = (state.mode === 'ia' && isPlayerTurn) || (state.mode === 'pvp');

  return (
    <div className="space-y-6 md:space-y-12 pb-20 relative text-slate-900 dark:text-white animate-fade-in px-4">
       {!state.winner && (
         <button onClick={() => setBattleState(s => ({ ...s, mode: 'menu', isFighting: false, enemyTeam: [] }))} className="absolute -top-8 left-4 md:left-0 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500">
            <ChevronLeft size={16} /> Abandonner
         </button>
       )}

       {/* Overlay de Victoire */}
       <AnimatePresence>
          {state.winner && (
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
               <div className="relative text-center p-8 md:p-16 rounded-[2rem] md:rounded-[4rem] bg-white dark:bg-slate-900 shadow-2xl border-4 md:border-8 border-rose-500">
                  <Trophy size={48} className="text-amber-500 mx-auto mb-4 animate-bounce md:w-24 md:h-24" />
                  <h2 className="text-3xl md:text-7xl font-black uppercase tracking-tighter mb-2">WINNER !</h2>
                  <div className="text-lg md:text-4xl font-black text-rose-500 uppercase italic mb-6 md:mb-12">{state.winner}</div>
                  <button onClick={() => window.location.reload()} className="px-16 py-6 bg-rose-500 text-white rounded-[2rem] font-black text-2xl shadow-2xl">FERMER</button>
               </div>
            </motion.div>
          )}
       </AnimatePresence>

       {/* Interface de duel côte à côte */}
       <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 md:gap-12 relative min-h-[400px] lg:min-h-[500px] items-center p-6 md:p-16 bg-slate-900/5 dark:bg-slate-900/40 rounded-[2rem] md:rounded-[4rem] border-4 md:border-8 border-white shadow-inner">
          <div className={`w-full text-center space-y-4 md:space-y-6 transition-all duration-500 ${isPlayerTurn ? 'scale-105 md:scale-110' : 'opacity-40 grayscale blur-[1px]'}`}>
             <div className="relative">
                <div className={`absolute inset-0 blur-3xl rounded-full scale-150 transition-all ${isPlayerTurn ? 'bg-blue-500/30' : 'bg-transparent'}`} />
                <motion.img key={pActive?.id} initial={{ x: -50 }} animate={{ x: 0 }} src={pActive?.image} className="w-32 h-32 md:w-64 md:h-64 lg:w-80 object-contain relative mx-auto drop-shadow-2xl" />
             </div>
             <div className="w-full max-w-sm mx-auto bg-slate-200 dark:bg-slate-800 h-4 md:h-6 rounded-full overflow-hidden border-2 md:border-4 border-white shadow-lg relative">
                <motion.div animate={{ width: `${pActive?.currentHP}%` || 0 }} className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                <span className="absolute inset-0 flex items-center justify-center text-[8px] md:text-[10px] font-black">{Math.round(pActive?.currentHP || 0)}%</span>
             </div>
             <div className="text-lg md:text-2xl font-black uppercase tracking-tighter">{pActive?.nom}</div>
             
             {showControls && isPlayerTurn && (
                <div className="flex justify-center gap-2 md:gap-4 mt-4">
                   <button onClick={() => onManualMove('normal')} className="px-6 py-4 bg-white dark:bg-slate-800 border-2 md:border-4 border-slate-100 rounded-xl md:rounded-2xl font-black text-xs uppercase hover:border-rose-500 shadow-xl transition-all">Attaque</button>
                   <button onClick={() => onManualMove('special')} className="px-6 py-4 bg-rose-500 text-white rounded-xl md:rounded-2xl font-black text-xs uppercase shadow-xl hover:scale-105 transition-all">Spécial</button>
                </div>
             )}
          </div>

          <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 p-6 bg-rose-500 rounded-full shadow-2xl text-white font-black text-3xl italic animate-bounce border-8 border-white">VS</div>
          
          <div className={`w-full text-center space-y-4 md:space-y-6 transition-all duration-500 ${!isPlayerTurn ? 'scale-105 md:scale-110' : 'opacity-40 grayscale blur-[1px]'}`}>
            <div className="relative">
                <div className={`absolute inset-0 blur-3xl rounded-full scale-150 transition-all ${!isPlayerTurn ? 'bg-rose-500/30' : 'bg-transparent'}`} />
                <motion.img key={eActive?.id} initial={{ x: 50 }} animate={{ x: 0 }} src={eActive?.image} className="w-32 h-32 md:w-64 md:h-64 lg:w-80 object-contain relative mx-auto drop-shadow-2xl" />
            </div>
            <div className="w-full max-w-sm mx-auto bg-slate-200 dark:bg-slate-800 h-4 md:h-6 rounded-full overflow-hidden border-2 md:border-4 border-white shadow-lg relative">
               <motion.div animate={{ width: `${eActive?.currentHP}%` || 0 }} className="h-full bg-gradient-to-r from-rose-500 to-orange-400" />
               <span className="absolute inset-0 flex items-center justify-center text-[8px] md:text-[10px] font-black">{Math.round(eActive?.currentHP || 0)}%</span>
            </div>
            <div className="text-lg md:text-2xl font-black uppercase tracking-tighter">{eActive?.nom}</div>
          </div>
       </div>

       {/* Journal des logs de combat */}
       <div className="bg-slate-900 text-white p-6 md:p-10 rounded-[2rem] md:rounded-[4rem] shadow-2xl border-t-8 border-rose-500 overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4">
             <h4 className="font-black uppercase tracking-widest text-slate-500 flex items-center gap-4 text-[10px] md:text-sm"><Activity size={18} className="text-rose-500" /> Journal de Combat</h4>
          </div>
          <div className="space-y-3 md:space-y-6 max-h-[150px] md:max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
             {state.logs.map((log, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-4 rounded-xl md:rounded-2xl border-l-4 ${i === 0 ? 'bg-rose-500/10 border-rose-500 text-rose-500 text-xl font-bold' : 'bg-white/5 border-slate-800 text-slate-400 text-sm'}`}>
                   {log}
                </motion.div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default BattleArena;
