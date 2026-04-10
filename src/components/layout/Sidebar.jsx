import React from 'react';
import { Home, Archive, Users, Activity, Brain, Trophy, Gamepad2, GitBranch, BarChart3, Sun, Moon, ChevronLeft, ChevronRight, Zap, X } from 'lucide-react';

const TABS = [
  { id: 'accueil', icon: Home, label: 'Tableau de Bord' },
  { id: 'collection', icon: Archive, label: 'Archives 1025' },
  { id: 'equipe', icon: Users, label: 'Mon Équipe', usesTeamCount: true },
  { id: 'combat', icon: Activity, label: 'Arène Battle' },
  { id: 'memory', icon: Brain, label: 'Poké-Memory' },
  { id: 'quiz', icon: Trophy, label: 'Master Type' },
  { id: 'jeu', icon: Gamepad2, label: 'Silhouette' },
  { id: 'evolution-rush', icon: GitBranch, label: 'Evolution Rush' },
  { id: 'stat-clash', icon: BarChart3, label: 'Stat Clash' }
];

export default function Sidebar({
  isSidebarVisible,
  isSidebarOpen,
  setIsSidebarOpen,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isDarkMode,
  setIsDarkMode,
  activeTab,
  setActiveTab,
  teamCount
}) {
  return (
    <aside aria-label="Navigation principale" aria-hidden={!isSidebarVisible} {...(!isSidebarVisible ? { inert: "" } : {})} className={`fixed inset-y-0 left-0 z-[70] transition-all duration-700 transform border-r-[6px] flex flex-col ${isSidebarOpen ? 'w-80' : 'w-24'} ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 shadow-2xl text-slate-900'}`}>
      <div className="p-5 flex items-center justify-between lg:justify-start gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-rose-500 p-3 rounded-[1.5rem] shadow-xl shadow-rose-500/20 rotate-3"><Zap className="text-white h-8 w-8" /></div>
          {(isSidebarOpen || isMobileMenuOpen) && <span className="font-black text-3xl tracking-tighter uppercase">Poké-Master</span>}
        </div>
        <button type="button" aria-label="Fermer le menu" onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-rose-500"><X size={24} /></button>
      </div>

      <nav className="p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {TABS.map((item) => {
            const count = item.usesTeamCount ? teamCount : undefined;
            return (
              <button type="button" key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} aria-current={activeTab === item.id ? 'page' : undefined} aria-label={count !== undefined ? `${item.label} ${count}/6` : item.label} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-[1.5rem] font-black transition-all duration-300 relative group ${activeTab === item.id ? 'bg-rose-500 text-white shadow-2xl shadow-rose-500/40 scale-[1.02]' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
                <item.icon size={22} className={activeTab === item.id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
                {(isSidebarOpen || isMobileMenuOpen) && <span className="tracking-tight uppercase text-xs">{item.label}</span>}
                {count !== undefined && (isSidebarOpen || isMobileMenuOpen) && <span className={`ml-auto px-2 py-0.5 rounded-lg text-[10px] font-black ${activeTab === item.id ? 'bg-white text-rose-500' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>{count}/6</span>}
              </button>
            )
          })}
        </nav>

      <div className="mt-auto p-4 space-y-2">
         <button type="button" aria-label={isDarkMode ? 'Activer le theme clair' : 'Activer le theme sombre'} onClick={() => setIsDarkMode(!isDarkMode)} className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center gap-3">
            {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>} {(isSidebarOpen || isMobileMenuOpen) && <span className="text-sm font-bold">Thème</span>}
         </button>
         <button type="button" aria-label={isSidebarOpen ? 'Reduire la barre laterale' : 'Etendre la barre laterale'} onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:flex w-full p-4 rounded-2xl bg-rose-100 dark:bg-slate-800 text-rose-500 items-center justify-center gap-3">
            {isSidebarOpen ? <ChevronLeft size={20}/> : <ChevronRight size={20}/>}
         </button>
      </div>
    </aside>
  );
}
