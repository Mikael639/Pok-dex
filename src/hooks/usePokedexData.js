import { useState, useEffect, useMemo } from 'react';
import { TYPE_COLORS, TYPE_CHART } from '../constants/pokemon';

export function usePokedexData({ addLog } = {}) {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [comparedPokemon, setComparedPokemon] = useState(null);
  
  const [team, setTeam] = useState(() => JSON.parse(localStorage.getItem('pokedexTeam') || '[]'));
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('pokedexFavorites') || '[]'));
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('Tous');
  const [isFavoritesOnly, setIsFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState('id');
  const [page, setPage] = useState(1);

  // Persistence
  useEffect(() => { localStorage.setItem('pokedexTeam', JSON.stringify(team)); }, [team]);
  useEffect(() => { localStorage.setItem('pokedexFavorites', JSON.stringify(favorites)); }, [favorites]);

  // Loading Data
  useEffect(() => {
    fetch('/pokedex.json')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.pokemons)) setPokemons(data.pokemons);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur de chargement des Pokémon:", err);
        setLoading(false);
      });
  }, []);

  const toggleTeam = (p) => {
    setTeam(prevTeam => {
      if (prevTeam.some(pt => pt.id === p.id)) {
        if (addLog) addLog('team_remove', `${p.nom} a quitte votre equipe.`, { id: p.id, nom: p.nom, image: p.image });
        return prevTeam.filter(pt => pt.id !== p.id);
      }
      if (prevTeam.length >= 6) return prevTeam;
      if (addLog) addLog('team_add', `${p.nom} a rejoint votre equipe prinicipale !`, { id: p.id, nom: p.nom, image: p.image });
      return [...prevTeam, p];
    });
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => {
       const isFav = prev.includes(id);
       if (isFav) return prev.filter(fid => fid !== id);
       
       const p = pokemons.find(x => x.id === id);
       if (p && addLog) addLog('favorite', `Vous etes desormais fan de ${p.nom} !`, { id: p.id, nom: p.nom, image: p.image });
       return [...prev, id];
    });
  };

  const getRandomPokemon = () => {
    if (pokemons.length > 0) {
      const randomIndex = Math.floor(Math.random() * pokemons.length);
      setSelectedPokemon(pokemons[randomIndex]);
    }
  };

  const filteredPokemons = useMemo(() => {
    let list = pokemons.filter(p =>
      (p.nom.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toString() === searchQuery) &&
      (typeFilter === 'Tous' || p.types.some(t => t.nom === typeFilter)) &&
      (!isFavoritesOnly || favorites.includes(p.id))
    );
    if (sortBy === 'nom') list = [...list].sort((a,b) => a.nom.localeCompare(b.nom));
    else if (sortBy === 'hp') list = [...list].sort((a,b) => (b.base?.HP || 0) - (a.base?.HP || 0));
    else if (sortBy === 'attack') list = [...list].sort((a,b) => (b.base?.Attack || 0) - (a.base?.Attack || 0));
    else if (sortBy === 'speed') list = [...list].sort((a,b) => (b.base?.Speed || 0) - (a.base?.Speed || 0));
    else list = [...list].sort((a,b) => a.id - b.id);
    return list;
  }, [pokemons, searchQuery, typeFilter, sortBy, isFavoritesOnly, favorites]);

  const suggestionPokemons = useMemo(
    () => pokemons.filter((pokemon) => pokemon.nom.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5),
    [pokemons, searchQuery]
  );

  const teamAnalysis = useMemo(() => {
    if (team.length === 0) return null;
    const covered = {};
    Object.keys(TYPE_COLORS).forEach(defType => {
      let best = 1;
      team.forEach(p => p.types.forEach(atk => {
        const mult = (TYPE_CHART[atk.nom] && TYPE_CHART[atk.nom][defType]) ?? 1;
        if (mult > best) best = mult;
      }));
      covered[defType] = best;
    });
    return covered;
  }, [team]);

  return {
    pokemons, loading, 
    selectedPokemon, setSelectedPokemon, 
    comparedPokemon, setComparedPokemon,
    team, toggleTeam, teamAnalysis,
    favorites, toggleFavorite,
    searchQuery, setSearchQuery, typeFilter, setTypeFilter, 
    isFavoritesOnly, setIsFavoritesOnly, sortBy, setSortBy, page, setPage,
    filteredPokemons, suggestionPokemons, getRandomPokemon
  };
}
