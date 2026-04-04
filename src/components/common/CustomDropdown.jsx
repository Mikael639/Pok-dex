// src/components/common/CustomDropdown.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/**
 * Menu déroulant stylisé avec animation et support du mode sombre.
 */
const CustomDropdown = ({ options, value, onChange, icon: Icon, label, isDarkMode, typeColors }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || label;

  return (
    <div className="relative z-20">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-black transition-all shadow-xl border-2 ${
          isOpen ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-transparent'
        } ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
      >
        <Icon size={18} className={isOpen ? 'text-rose-500' : 'text-slate-400'} />
        <span className="uppercase tracking-widest">{selectedLabel}</span>
        <ChevronDown size={16} className={`ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180 text-rose-500' : 'text-slate-400'}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 5, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`absolute top-full left-0 mt-2 w-64 rounded-[2rem] shadow-2xl border-2 overflow-hidden z-20 backdrop-blur-xl ${
                isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-100'
              }`}
            >
              <div className="max-h-80 overflow-y-auto p-2 custom-scrollbar">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { onChange(opt.value); setIsOpen(false); }}
                    className={`w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                      value === opt.value 
                        ? 'bg-rose-500 text-white shadow-lg' 
                        : isDarkMode ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {typeColors && typeColors[opt.value] && (
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: typeColors[opt.value] }} />
                    )}
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;
