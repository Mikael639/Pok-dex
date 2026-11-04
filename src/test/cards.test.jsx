import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PokemonSkeleton } from '../components/common/Cards';

describe('Common cards', () => {
  it('affiche le squelette de chargement', () => {
    const { container } = render(<PokemonSkeleton />);

    expect(container.querySelectorAll('.skeleton-box')).toHaveLength(4);
  });
});
