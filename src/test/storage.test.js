import { describe, expect, it } from 'vitest';
import { readJSON } from '../lib/storage';

describe('readJSON', () => {
  it('retourne la valeur par defaut si la cle est absente', () => {
    expect(readJSON('absent', [])).toEqual([]);
  });

  it('parse un JSON valide', () => {
    localStorage.setItem('cle', JSON.stringify({ a: 1 }));
    expect(readJSON('cle', null)).toEqual({ a: 1 });
  });

  it('ne plante pas sur un JSON corrompu', () => {
    localStorage.setItem('cle', '{pas du json');
    expect(readJSON('cle', 'fallback')).toBe('fallback');
  });
});
