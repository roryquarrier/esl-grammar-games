import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MoveHistory } from './MoveHistory';
import type { MoveRecord } from '../../store/gameStore';

describe('MoveHistory', () => {
  it('renders No moves yet when moves array is empty', () => {
    render(<MoveHistory moves={[]} gameMode="pvp" />);
    expect(screen.getByText(/No moves yet/i)).toBeInTheDocument();
  });

  it('renders move entries with correct player dots', () => {
    const moves: MoveRecord[] = [
      { moveNumber: 1, player: 1, col: 0, row: 5, isAI: false },
      { moveNumber: 2, player: 2, col: 1, row: 5, isAI: false },
    ];
    const { container } = render(<MoveHistory moves={moves} gameMode="pvp" />);

    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
    expect(screen.getByText('Column A')).toBeInTheDocument();
    expect(screen.getByText('Column B')).toBeInTheDocument();

    const dot1 = container.querySelector('.playerDot.p1');
    const dot2 = container.querySelector('.playerDot.p2');
    expect(dot1).toBeInTheDocument();
    expect(dot2).toBeInTheDocument();
  });

  it('shows robot emoji for AI moves in pve mode', () => {
    const moves: MoveRecord[] = [
      { moveNumber: 1, player: 2, col: 0, row: 5, isAI: true },
    ];
    render(<MoveHistory moves={moves} gameMode="pve" />);
    expect(screen.getByText(/🤖/)).toBeInTheDocument();
  });

  it('renders column labels correctly (A-G)', () => {
    const moves: MoveRecord[] = [0, 1, 2, 3, 4, 5, 6].map(col => ({
      moveNumber: col + 1,
      player: 1,
      col,
      row: 5,
      isAI: false,
    }));
    render(<MoveHistory moves={moves} gameMode="pvp" />);
    expect(screen.getByText('Column A')).toBeInTheDocument();
    expect(screen.getByText('Column B')).toBeInTheDocument();
    expect(screen.getByText('Column C')).toBeInTheDocument();
    expect(screen.getByText('Column D')).toBeInTheDocument();
    expect(screen.getByText('Column E')).toBeInTheDocument();
    expect(screen.getByText('Column F')).toBeInTheDocument();
    expect(screen.getByText('Column G')).toBeInTheDocument();
  });
});
