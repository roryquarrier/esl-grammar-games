import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppChrome } from './AppChrome';

describe('AppChrome', () => {
  it('renders children', () => {
    render(
      <AppChrome>
        <div>Test content</div>
      </AppChrome>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<AppChrome>Content</AppChrome>);
    expect(screen.getByText('Grammar Connect 4')).toBeInTheDocument();
  });

  it('renders mute toggle', () => {
    render(<AppChrome>Content</AppChrome>);
    expect(screen.getByRole('button', { name: /mute/i })).toBeInTheDocument();
  });
});
