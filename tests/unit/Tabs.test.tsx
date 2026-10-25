import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from '../../src/components/Tabs/Tabs';

const tabs = [
  { id: 'stats', label: 'Stats' },
  { id: 'moves', label: 'Moves' },
  { id: 'about', label: 'About' },
];

const Example = () => {
  const [active, setActive] = useState('stats');
  return <Tabs label="Pokémon details" tabs={tabs} activeTab={active} onChange={setActive}>{active} panel</Tabs>;
};

it('switches tabs with keyboard navigation and updates the active panel', async () => {
  const user = userEvent.setup();
  render(<Example />);

  const stats = screen.getByRole('tab', { name: 'Stats' });
  stats.focus();
  await user.keyboard('{ArrowRight}');

  expect(screen.getByRole('tab', { name: 'Moves' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('tabpanel')).toHaveTextContent('moves panel');

  await user.keyboard('{End}');
  expect(screen.getByRole('tab', { name: 'About' })).toHaveFocus();
  expect(screen.getByRole('tabpanel')).toHaveTextContent('about panel');
});
