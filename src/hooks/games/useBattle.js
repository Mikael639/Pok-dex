import { useState, useEffect, useCallback, useEffectEvent } from 'react';
import { INITIAL_BATTLE_STATE } from '../../constants/gameMeta';
import { TYPE_CHART } from '../../constants/pokemon';
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
    setBattleState(s => {
      if (!s.isFighting || s.winner) return s;
      const { playerTeam, enemyTeam, playerActive, enemyActive, currentTurn, logs, mode } = s;
      const isPlayerTurn = currentTurn === 'player';
      const attacker = isPlayerTurn ? playerTeam[playerActive] : enemyTeam[enemyActive];
      const defender = isPlayerTurn ? enemyTeam[enemyActive] : playerTeam[playerActive];
      const typeMult = (TYPE_CHART[attacker.types[0].nom] && TYPE_CHART[attacker.types[0].nom][defender.types[0].nom]) ?? 1;
      const damage = Math.floor((attacker.base.Attack / defender.base.Defense) * (moveType === 'special' ? 40 : 25) * typeMult);
      const newHP = Math.max(0, defender.currentHP - damage);
      const newLogs = [`${attacker.nom} utilise ${moveType.toUpperCase()} ! -${damage} HP`, ...logs.slice(0, 4)];
      
      const animData = { target: isPlayerTurn ? 'enemy' : 'player', damage, isSuper: typeMult > 1, isResisted: typeMult < 1, id: Date.now() };

      if (isPlayerTurn) {
        const nextEnemyTeam = [...enemyTeam]; nextEnemyTeam[enemyActive].currentHP = newHP;
        if (newHP <= 0) {
          newLogs.unshift(`${defender.nom} est K.O. !`);
          if (enemyActive + 1 >= 6) {
            setBattleStats(p => ({ ...p, wins: p.wins+1 }));
            if (addLog) addLog('win', `Ligue vaincue avec ${attacker.nom} !`, { image: attacker.image });
            return { ...s, enemyTeam: nextEnemyTeam, winner: 'Joueur 1', isFighting: false, logs: ['VICTOIRE !'], attackAnim: animData };
          } else return { ...s, enemyTeam: nextEnemyTeam, enemyActive: enemyActive+1, currentTurn: mode==='pvp'?'enemy':'ia_move', logs: newLogs, attackAnim: animData };
        } else return { ...s, enemyTeam: nextEnemyTeam, currentTurn: mode==='pvp'?'enemy':'ia_move', logs: newLogs, attackAnim: animData };
      } else {
        const nextPlayerTeam = [...playerTeam]; nextPlayerTeam[playerActive].currentHP = newHP;
        if (newHP <= 0) {
          newLogs.unshift(`${defender.nom} est K.O. !`);
          if (playerActive + 1 >= 6) {
            setBattleStats(p => ({ ...p, losses: p.losses+1 }));
            return { ...s, playerTeam: nextPlayerTeam, winner: mode==='pvp'?'Joueur 2':'Ordinateur', isFighting: false, logs: ['DÉFAITE...'], attackAnim: animData };
          } else return { ...s, playerTeam: nextPlayerTeam, playerActive: playerActive+1, currentTurn: 'player', logs: newLogs, attackAnim: animData };
        } else return { ...s, playerTeam: nextPlayerTeam, currentTurn: 'player', logs: newLogs, attackAnim: animData };
      }
    });
  }, [addLog]);

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
