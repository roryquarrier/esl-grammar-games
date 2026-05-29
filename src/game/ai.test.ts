import { describe, it, expect } from 'vitest';
import {
  getValidColumns,
  randomAI,
  greedyAI,
  minimaxAI,
  getAIMove,
  type AIDifficulty,
} from './ai';
import type { Board, Cell } from '../store/gameStore';

// ─── test helpers ───────────────────────────────────────────────────

function emptyBoard(): Board {
  return Array(6).fill(null).map(() => Array(7).fill(0) as Cell[]) as Board;
}

/** Set a cell value directly (for building test positions). */
function setCell(board: Board, row: number, col: number, val: Cell): void {
  board[row][col] = val;
}

// ─── getValidColumns ────────────────────────────────────────────────

describe('getValidColumns', () => {
  it('returns all 7 columns on empty board', () => {
    expect(getValidColumns(emptyBoard())).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('excludes full columns', () => {
    const board = emptyBoard();
    for (let r = 0; r < 6; r++) board[r][0] = 1;
    expect(getValidColumns(board)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('returns empty array on full board', () => {
    const board = emptyBoard();
    for (let r = 0; r < 6; r++)
      for (let c = 0; c < 7; c++)
        board[r][c] = (c % 2 === 0 ? 1 : 2) as Cell;
    expect(getValidColumns(board)).toEqual([]);
  });
});

// ─── randomAI ───────────────────────────────────────────────────────

describe('randomAI', () => {
  it('returns a valid column', () => {
    const board = emptyBoard();
    const col = randomAI(board);
    expect(col).toBeGreaterThanOrEqual(0);
    expect(col).toBeLessThan(7);
  });

  it('never picks a full column', () => {
    const board = emptyBoard();
    for (let r = 0; r < 6; r++) board[r][0] = 1;
    for (let r = 0; r < 6; r++) board[r][1] = 1;
    // Only cols 2-6 available
    for (let i = 0; i < 100; i++) {
      const col = randomAI(board);
      expect(col).toBeGreaterThanOrEqual(2);
    }
  });
});

// ─── greedyAI ───────────────────────────────────────────────────────

describe('greedyAI', () => {
  it('takes the winning move', () => {
    // AI is player 2, has 3 in a row at bottom
    const board = emptyBoard();
    setCell(board, 5, 0, 2);
    setCell(board, 5, 1, 2);
    setCell(board, 5, 2, 2);
    // col 3 is open — AI should take it
    expect(greedyAI(board, 2)).toBe(3);
  });

  it('blocks opponent from winning', () => {
    // Player 1 has 3 in a row, AI is player 2
    const board = emptyBoard();
    setCell(board, 5, 0, 1);
    setCell(board, 5, 1, 1);
    setCell(board, 5, 2, 1);
    // AI should block at col 3
    expect(greedyAI(board, 2)).toBe(3);
  });

  it('prefers winning over blocking', () => {
    // AI (P2) can win at col 6 AND P1 threatens at col 3
    const board = emptyBoard();
    setCell(board, 5, 3, 2);
    setCell(board, 5, 4, 2);
    setCell(board, 5, 5, 2);
    // P1 also has a threat
    setCell(board, 5, 0, 1);
    setCell(board, 5, 1, 1);
    setCell(board, 5, 2, 1);
    // AI should win at col 6, not block at col 3
    expect(greedyAI(board, 2)).toBe(6);
  });

  it('prefers center columns when no immediate threat', () => {
    const board = emptyBoard();
    const col = greedyAI(board, 1);
    expect(col).toBe(3); // center is best
  });

  it('handles vertical threats', () => {
    const board = emptyBoard();
    setCell(board, 5, 2, 1);
    setCell(board, 4, 2, 1);
    setCell(board, 3, 2, 1);
    // AI should block at row 2, col 2
    expect(greedyAI(board, 2)).toBe(2);
  });
});

// ─── minimaxAI ──────────────────────────────────────────────────────

describe('minimaxAI', () => {
  it('takes an immediate win', () => {
    const board = emptyBoard();
    setCell(board, 5, 0, 2);
    setCell(board, 5, 1, 2);
    setCell(board, 5, 2, 2);
    expect(minimaxAI(board, 2)).toBe(3);
  });

  it('blocks an immediate opponent win (single threat)', () => {
    // Player 1 has 3 in a row with left end blocked by P2
    const board = emptyBoard();
    setCell(board, 5, 2, 2); // P2 blocks left end
    setCell(board, 5, 3, 1);
    setCell(board, 5, 4, 1);
    setCell(board, 5, 5, 1);
    // P1 only threat is col 6 — minimax should block there
    expect(minimaxAI(board, 2)).toBe(6);
  });

  it('blocks opponent vertical threat', () => {
    const board = emptyBoard();
    setCell(board, 5, 3, 1);
    setCell(board, 4, 3, 1);
    setCell(board, 3, 3, 1);
    // P1 threatens at (2,3) — minimax should block col 3
    expect(minimaxAI(board, 2)).toBe(3);
  });

  it('prefers center on empty board', () => {
    const board = emptyBoard();
    const col = minimaxAI(board, 1);
    expect(col).toBe(3);
  });

  it('returns valid column on nearly full board', () => {
    const board = emptyBoard();
    // Fill all but top row
    for (let r = 1; r < 6; r++)
      for (let c = 0; c < 7; c++)
        board[r][c] = (c % 2 === 0 ? 1 : 2) as Cell;
    const col = minimaxAI(board, 1);
    expect(col).toBeGreaterThanOrEqual(0);
    expect(col).toBeLessThan(7);
  });

  it('does not take too long (performance)', () => {
    const board = emptyBoard();
    // Make a few moves to create a non-trivial position
    setCell(board, 5, 3, 1);
    setCell(board, 5, 4, 2);
    setCell(board, 4, 3, 1);
    const start = Date.now();
    minimaxAI(board, 2, 5);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(3000); // should be well under 3s
  });
});

// ─── getAIMove (unified interface) ──────────────────────────────────

describe('getAIMove', () => {
  const board = emptyBoard();

  it.each<[AIDifficulty]>([['random'], ['greedy'], ['minimax']])(
    'returns valid column for %s difficulty',
    (difficulty) => {
      const col = getAIMove(board, 1, difficulty);
      expect(col).toBeGreaterThanOrEqual(0);
      expect(col).toBeLessThan(7);
    },
  );
});
