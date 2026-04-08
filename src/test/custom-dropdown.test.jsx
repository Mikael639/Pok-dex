import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Filter } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import CustomDropdown from '../components/common/CustomDropdown';

describe('CustomDropdown', () => {
  it('ouvre la liste, affiche les options et selectionne une nouvelle valeur', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <CustomDropdown
        options={[
          { value: 'Tous', label: 'Tous les Types' },
          { value: 'Feu', label: 'Feu' },
          { value: 'Eau', label: 'Eau' }
        ]}
        value="Tous"
        onChange={onChange}
        icon={Filter}
        label="Type"
        isDarkMode={false}
      />
    );

    const trigger = screen.getByRole('button', { name: /Type: Tous les Types/i });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox', { name: 'Type' })).toBeInTheDocument();

    await user.click(screen.getByRole('option', { name: /Type Feu/i }));

    expect(onChange).toHaveBeenCalledWith('Feu');
    expect(screen.queryByRole('listbox', { name: 'Type' })).not.toBeInTheDocument();
  });
});
