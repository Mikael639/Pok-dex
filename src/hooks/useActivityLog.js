import { useState, useCallback, useEffect } from 'react';

/**
 * Hook gérant la timeline d'activités épiques du Dresseur.
 * Stocke les données dans le LocalStorage de manière persistente.
 */
export function useActivityLog() {
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('pokedex_activity_log');
    return saved ? JSON.parse(saved) : [];
  });

  // Sauvegarde à chaque changement
  useEffect(() => {
    localStorage.setItem('pokedex_activity_log', JSON.stringify(logs));
  }, [logs]);

  /**
   * Ajoute une nouvelle entrée au journal.
   * eventTypes supportés: 'catch', 'favorite', 'battle_win', 'quiz_perfect', 'milestone'
   */
  const addLog = useCallback((type, message, metadata = null) => {
    const newLog = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      message,
      metadata,
      timestamp: new Date().toISOString()
    };
    
    setLogs(prev => {
      // Ne garde que les 50 dernières activités pour ne pas surcharger
      const updated = [newLog, ...prev];
      return updated.slice(0, 50);
    });
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return { logs, addLog, clearLogs };
}
