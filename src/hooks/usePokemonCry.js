import { useState, useRef, useEffect, useCallback } from 'react';

export default function usePokemonCry(pokemonId) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (typeof Audio !== 'function') {
      return undefined;
    }

    // Stop any playing sound when the pokemon ID changes
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
    
    if (pokemonId) {
      // Use PokeAPI's latest high-quality ogg files
      const url = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`;
      if (!audioRef.current) {
        audioRef.current = new Audio(url);
      } else {
        audioRef.current.src = url;
      }
      
      const handleEnded = () => setIsPlaying(false);
      audioRef.current.addEventListener('ended', handleEnded);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, [pokemonId]); // Deliberately not including isPlaying

  const playCry = useCallback(() => {
    if (audioRef.current && pokemonId) {
      // Reset to start before playing to allow rapid replays
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.5; // Soft volume for ambience
      const playResult = audioRef.current.play();

      if (!playResult || typeof playResult.then !== 'function') {
        setIsPlaying(true);
        return;
      }

      playResult.then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Audio autoplay blocked or failed:", err);
        setIsPlaying(false);
      });
    }
  }, [pokemonId]);

  return { playCry, isPlaying };
}
