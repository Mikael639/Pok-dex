import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Zap } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { PokemonSkeleton, QuickCard } from '../components/common/Cards';

describe('Common cards', () => {
  it('declenche le callback de QuickCard au clic', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<QuickCard icon={<Zap />} title="Combat" text="Defiez la ligue" onClick={onClick} />);

    await user.click(screen.getByRole('button', { name: /Combat Defiez la ligue/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('affiche le squelette de chargement', () => {
    const { container } = render(<PokemonSkeleton />);

    expect(container.querySelectorAll('.skeleton-box')).toHaveLength(4);
  });
});
