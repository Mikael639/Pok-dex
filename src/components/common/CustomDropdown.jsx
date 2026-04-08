// src/components/common/CustomDropdown.jsx
import React, { useEffect, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/**
 * Menu déroulant stylisé avec animation et support du mode sombre.
 */
const CustomDropdown = ({ options, value, onChange, icon: TriggerIcon, label, isDarkMode, typeColors }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || label;
  const iconNode = TriggerIcon ? React.createElement(TriggerIcon, { size: 18, className: isOpen ? 'text-rose-500' : 'text-slate-400' }) : null;
  const dropdownId = `dropdown-${label.toLowerCase().replace(/\s+/g, '-')}`;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <div className="relative z-20 w-full sm:w-auto">
      <button 
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={dropdownId}
        aria-label={`${label}: ${selectedLabel}`}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full min-w-0 items-center justify-between gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all shadow-xl border-2 sm:px-5 ${
          isOpen ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-transparent'
        } ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
      >
        <span className="flex min-w-0 items-center gap-3">
          {iconNode}
          <span className="truncate uppercase tracking-widest">{selectedLabel}</span>
        </span>
        <ChevronDown size={16} className={`ml-2 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-rose-500' : 'text-slate-400'}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <Motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 5, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              id={dropdownId}
              role="listbox"
              aria-label={label}
              className={`absolute left-0 right-0 top-full mt-2 rounded-[2rem] shadow-2xl border-2 overflow-hidden z-20 backdrop-blur-xl sm:left-0 sm:right-auto sm:w-64 ${
                isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-100'
              }`}
            >
              <div className="max-h-80 overflow-y-auto p-2 custom-scrollbar">
                {options.map((opt) => (
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === opt.value}
                    aria-label={`${label} ${opt.label}`}
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
            </Motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;
