import { useState, useEffect, useCallback, useEffectEvent } from 'react';
import { INITIAL_BATTLE_STATE } from '../../constants/gameMeta';
import { resolveMove } from '../../utils/battleLogic';
import { readJSON } from '../../lib/storage';

export function useBattle({ pokemons, team, addLog }) {
  const [battleStats, setBattleStats] = useState(() => readJSON('pokedexBattleStats', { wins: 0, losses: 0 }));

  const [battleState, setBattleState] = useState(INITIAL_BATTLE_STATE);

  useEffect(() => { localStorage.setItem('pokedexBattleStats', JSON.stringify(battleStats)); }, [battleStats]);

  const startBattle = useCallback((mode = 'ia') => {
    if (team.length < 6 || pokemons.length === 0) return;
    const playerTeam = team.map(p => ({ ...p, currentHP: 100 }));
    if (mode === 'ia' || mode === 'auto') {
      const enemyTeam = Array.from({ length: 6 }).map(() => ({ ...pokemons[Math.floor(Math.random() * pokemons.length)], currentHP: 100 }));
      setBattleState({ ...INITIAL_BATTLE_STATE, playerTeam, enemyTeam, logs: ['Preparez-vous au combat !'], isFighting: true, mode, currentTurn: 'player' });
      return;
    }
    if (mode === 'pvp') {
      setBattleState({ ...INITIAL_BATTLE_STATE, playerTeam, enemyTeam: [], logs: [], winner: null, isFighting: false, playerActive: 0, enemyActive: 0, mode: 'selection', currentTurn: 'player' });
    }
  }, [team, pokemons]);

  const handleManualMove = useCallback((moveType) => {
    setBattleState((state) => resolveMove(state, moveType));
  }, []);

  // Effets de bord de fin de combat : statistiques et journal d'activité (une seule fois par victoire/défaite).
  const { winner, winnerPokemon } = battleState;
  useEffect(() => {
    if (!winner) return;
    if (winner === 'Joueur 1') {
      setBattleStats((stats) => ({ ...stats, wins: stats.wins + 1 }));
      if (addLog && winnerPokemon) addLog('win', `Ligue vaincue avec ${winnerPokemon.nom} !`, { image: winnerPokemon.image });
    } else {
      setBattleStats((stats) => ({ ...stats, losses: stats.losses + 1 }));
    }
  }, [winner, winnerPokemon, addLog]);

  const runAutomatedBattleTurn = useEffectEvent(() => {
    handleManualMove('normal');
  });

  useEffect(() => {
    let timer;
    if (battleState.isFighting && !battleState.winner) {
      if (battleState.mode === 'auto') timer = setTimeout(() => runAutomatedBattleTurn(), 1200);
      else if (battleState.mode === 'ia' && battleState.currentTurn === 'ia_move') timer = setTimeout(() => runAutomatedBattleTurn(), 1000);
    }
    return () => clearTimeout(timer);
  }, [battleState, runAutomatedBattleTurn]);

  return {
    battleState, setBattleState, battleStats, startBattle, handleManualMove
  };
}
