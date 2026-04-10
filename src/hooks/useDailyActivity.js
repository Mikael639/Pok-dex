import { useState, useEffect, useMemo } from 'react';
import { getTodayKey, getInitialDailyActivity } from '../utils/gameLogic';
import { DAILY_CHALLENGE_ROTATION } from '../constants/gameMeta';

export function useDailyActivity(pokemons, selectedPokemon, favorites) {
  const [todayKey] = useState(() => getTodayKey());
  const [dailySpotlightSeed] = useState(() => new Date().getDate());
  const [dailyActivity, setDailyActivity] = useState(() => getInitialDailyActivity());

  useEffect(() => {
    localStorage.setItem('pokedexDailyActivity', JSON.stringify(dailyActivity));
  }, [dailyActivity]);

  const markDailyFlag = (flagName) => {
    setDailyActivity((prev) => prev[flagName] ? prev : { ...prev, [flagName]: true });
  };

  const dailyFeaturedPokemon = pokemons.length > 0 ? pokemons[dailySpotlightSeed % pokemons.length] : null;

  const dailyChallengeBase = DAILY_CHALLENGE_ROTATION[dailySpotlightSeed % DAILY_CHALLENGE_ROTATION.length];
  
  const dailyChallenge = useMemo(() => {
    if (!dailyChallengeBase) return {};
    switch (dailyChallengeBase.id) {
      case 'spotlight-view':
        return {
          ...dailyChallengeBase,
          description: dailyFeaturedPokemon ? `Ouvre la fiche de ${dailyFeaturedPokemon.nom} et ajoute-le a ta veille du jour.` : 'Ouvre la fiche du Pokemon du jour pour lancer ta session.',
          helper: 'Observation express',
          visualPokemon: dailyFeaturedPokemon
        };
      case 'spotlight-favorite':
        return {
          ...dailyChallengeBase,
          description: dailyFeaturedPokemon ? `Ajoute ${dailyFeaturedPokemon.nom} a tes favoris pour valider ton rituel collection.` : 'Ajoute le Pokemon du jour a tes favoris pour valider ce defi.',
          helper: 'Collection du jour',
          visualPokemon: dailyFeaturedPokemon
        };
      case 'quiz-answer':
        return { ...dailyChallengeBase, description: 'Reponds a une seule question de types pour debloquer ton badge strategiste.', helper: 'Precision tactique', visualPokemon: null };
      case 'stat-clash-reveal':
        return { ...dailyChallengeBase, description: 'Choisis un Pokemon dans Stat Clash et revele le verdict de la manche.', helper: 'Lecture des stats', visualPokemon: null };
      case 'evolution-validate':
        return { ...dailyChallengeBase, description: 'Remets une lignee dans le bon ordre puis valide-la pour marquer ton passage du jour.', helper: 'Chronologie evolutive', visualPokemon: null };
      default:
        return { ...dailyChallengeBase, description: 'Releve le defi du jour pour debloquer une recompense visuelle.', helper: 'Mission quotidienne', visualPokemon: null };
    }
  }, [dailyChallengeBase, dailyFeaturedPokemon]);

  const dailyChallengeConditionMet = useMemo(() => {
    switch (dailyChallenge.id) {
      case 'spotlight-view': return dailyFeaturedPokemon ? dailyActivity.viewedPokemonIds.includes(dailyFeaturedPokemon.id) : false;
      case 'spotlight-favorite': return dailyFeaturedPokemon ? favorites.includes(dailyFeaturedPokemon.id) : false;
      case 'quiz-answer': return dailyActivity.quizAnswered;
      case 'stat-clash-reveal': return dailyActivity.statClashRevealed;
      case 'evolution-validate': return dailyActivity.evolutionValidated;
      default: return false;
    }
  }, [dailyActivity, dailyChallenge.id, dailyFeaturedPokemon, favorites]);

  const isDailyChallengeComplete = dailyActivity.completedChallengeIds?.includes(dailyChallenge.id) || dailyChallengeConditionMet;

  useEffect(() => {
    if (!selectedPokemon || !dailyFeaturedPokemon) return;
    if (selectedPokemon.id !== dailyFeaturedPokemon.id) return;
    setDailyActivity((prev) => prev.viewedPokemonIds.includes(selectedPokemon.id) ? prev : { ...prev, viewedPokemonIds: [...prev.viewedPokemonIds, selectedPokemon.id] });
  }, [dailyFeaturedPokemon, selectedPokemon]);

  useEffect(() => {
    if (!dailyChallengeConditionMet) return;
    setDailyActivity((prev) => prev.completedChallengeIds.includes(dailyChallenge.id) ? prev : { ...prev, completedChallengeIds: [...prev.completedChallengeIds, dailyChallenge.id] });
  }, [dailyChallenge.id, dailyChallengeConditionMet]);

  return {
    todayKey,
    dailyActivity,
    markDailyFlag,
    dailyFeaturedPokemon,
    dailyChallenge,
    isDailyChallengeComplete
  };
}
