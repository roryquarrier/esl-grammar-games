import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock localStorage since it's not available in jsdom by default
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Import after mocking
import { MuteToggleButton } from './MuteToggleButton';

describe('MuteToggleButton', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders with accessible name when unmuted (default)', () => {
    render(<MuteToggleButton />);
    expect(screen.getByRole('button', { name: /mute sound effects/i })).toBeInTheDocument();
  });

  it('renders with accessible name when muted', () => {
    localStorage.setItem('esl-connect-4-muted', 'true');
    render(<MuteToggleButton />);
    expect(screen.getByRole('button', { name: /unmute sound effects/i })).toBeInTheDocument();
  });

  it('toggles state and persists to localStorage on click', () => {
    render(<MuteToggleButton />);
    const button = screen.getByRole('button');
    
    // Initially unmuted
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('aria-label', 'Mute sound effects');
    
    // Click to mute
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('aria-label', 'Unmute sound effects');
    expect(localStorage.setItem).toHaveBeenCalledWith('esl-connect-4-muted', 'true');
    
    // Click to unmute
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('aria-label', 'Mute sound effects');
    expect(localStorage.setItem).toHaveBeenCalledWith('esl-connect-4-muted', 'false');
  });

  it('restores state from localStorage on mount', () => {
    localStorage.setItem('esl-connect-4-muted', 'true');
    render(<MuteToggleButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('aria-label', 'Unmute sound effects');
  });
});
