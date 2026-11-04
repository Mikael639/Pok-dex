import { TYPE_CHART } from '../constants/pokemon';

const MOVE_LABELS = { normal: 'ATTAQUE', special: 'SPECIAL' };

/** Dégâts d'une attaque : ratio Attaque/Défense, puissance de l'attaque et efficacité du 1er type. */
export function computeDamage(attacker, defender, moveType) {
  const typeMultiplier = TYPE_CHART[attacker.types[0].nom]?.[defender.types[0].nom] ?? 1;
  const power = moveType === 'special' ? 40 : 25;
  const damage = Math.floor((attacker.base.Attack / defender.base.Defense) * power * typeMultiplier);
  return { damage, typeMultiplier };
}

/**
 * Résout un tour de combat et renvoie le nouvel état, sans jamais modifier l'état reçu
 * (indispensable avec React : un updater doit être pur, notamment sous <StrictMode>).
 *
 * Les effets de bord (statistiques, journal d'activité) sont à déclencher par l'appelant
 * à partir de `winner` / `winnerPokemon`.
 */
export function resolveMove(state, moveType) {
  if (!state.isFighting || state.winner) return state;

  const { playerTeam, enemyTeam, playerActive, enemyActive, currentTurn, logs, mode } = state;
  const isPlayerTurn = currentTurn === 'player';

  const attackerTeam = isPlayerTurn ? playerTeam : enemyTeam;
  const defenderTeam = isPlayerTurn ? enemyTeam : playerTeam;
  const attackerIndex = isPlayerTurn ? playerActive : enemyActive;
  const defenderIndex = isPlayerTurn ? enemyActive : playerActive;
  const defenderKey = isPlayerTurn ? 'enemyTeam' : 'playerTeam';
  const defenderActiveKey = isPlayerTurn ? 'enemyActive' : 'playerActive';

  const attacker = attackerTeam[attackerIndex];
  const defender = defenderTeam[defenderIndex];
  const { damage } = computeDamage(attacker, defender, moveType);
  const remainingHP = Math.max(0, defender.currentHP - damage);

  const nextDefenderTeam = defenderTeam.map((pokemon, index) =>
    index === defenderIndex ? { ...pokemon, currentHP: remainingHP } : pokemon
  );
  const moveLog = `${attacker.nom} utilise ${MOVE_LABELS[moveType] ?? moveType.toUpperCase()} ! -${damage} HP`;
  const nextTurn = isPlayerTurn ? (mode === 'pvp' ? 'enemy' : 'ia_move') : 'player';
  const nextLogs = [moveLog, ...logs.slice(0, 4)];

  if (remainingHP > 0) {
    return { ...state, [defenderKey]: nextDefenderTeam, currentTurn: nextTurn, logs: nextLogs };
  }

  const isLastPokemon = defenderIndex + 1 >= defenderTeam.length;

  if (!isLastPokemon) {
    return {
      ...state,
      [defenderKey]: nextDefenderTeam,
      [defenderActiveKey]: defenderIndex + 1,
      currentTurn: nextTurn,
      logs: [`${defender.nom} est K.O. !`, ...nextLogs]
    };
  }

  const winner = isPlayerTurn ? 'Joueur 1' : mode === 'pvp' ? 'Joueur 2' : 'Ordinateur';
  return {
    ...state,
    [defenderKey]: nextDefenderTeam,
    winner,
    winnerPokemon: attacker,
    isFighting: false,
    logs: [isPlayerTurn ? 'VICTOIRE !' : 'DÉFAITE...']
  };
}
