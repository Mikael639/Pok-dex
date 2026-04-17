import { useMemo } from 'react';

export function useTrainerStats({ team, favorites, battleStats, gameState, quizState, statClashState, cryQuizState }) {
  const trainerScore = useMemo(() => {
    const pointsTeam = (team?.length || 0) * 25;
    const pointsFavorites = (favorites?.length || 0) * 10;
    const pointsWins = (battleStats?.wins || 0) * 100;
    const pointsQuiz = (quizState?.highscore || 0) * 5;
    const pointsSilhouette = (gameState?.highscore || 0) * 5;
    const pointsClash = (statClashState?.bestStreak || 0) * 50;
    const pointsCry = (cryQuizState?.highscore || 0) * 40;

    return pointsTeam + pointsFavorites + pointsWins + pointsQuiz + pointsSilhouette + pointsClash + pointsCry;
  }, [team, favorites, battleStats, gameState, quizState, statClashState, cryQuizState]);

  const trainerTitle = useMemo(() => {
    if (trainerScore < 500) return 'Novice de Bourg-Palette';
    if (trainerScore < 1500) return 'Dresseur de l\'Élite';
    if (trainerScore < 3000) return 'Chercheur de Génie';
    if (trainerScore < 6000) return 'Maître des Légendes';
    if (trainerScore < 10000) return 'Commandant de la Ligue';
    return 'Légende Vivante NDJITEK';
  }, [trainerScore]);

  const nextTitleThreshold = useMemo(() => {
    if (trainerScore < 500) return 500;
    if (trainerScore < 1500) return 1500;
    if (trainerScore < 3000) return 3000;
    if (trainerScore < 6000) return 6000;
    if (trainerScore < 10000) return 10000;
    return trainerScore;
  }, [trainerScore]);

  return { trainerScore, trainerTitle, nextTitleThreshold };
}
