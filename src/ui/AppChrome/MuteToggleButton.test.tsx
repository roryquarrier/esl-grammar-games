import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MuteToggleButton } from './MuteToggleButton';

describe('MuteToggleButton', () => {
  it('renders with accessible name', () => {
    render(<MuteToggleButton />);
    expect(screen.getByRole('button', { name: /toggle mute/i })).toBeInTheDocument();
  });

  it('has correct aria-label', () => {
    render(<MuteToggleButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Toggle mute');
  });
});
