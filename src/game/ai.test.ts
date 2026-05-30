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

// ─── edge cases ──────────────────────────────────────────────────────

describe('edge cases', () => {
  it('minimax handles nearly-full board (41/42 filled) without hanging', () => {
    const board = emptyBoard();
    // Fill columns 0-5 completely (6 rows × 6 cols = 36 cells)
    for (let c = 0; c < 6; c++) {
      for (let r = 0; r < 6; r++) {
        board[r][c] = ((r + c) % 2 === 0 ? 1 : 2) as Cell;
      }
    }
    // Fill column 6 rows 1-5 (5 cells) — leaves board[0][6] as the only empty cell
    for (let r = 1; r < 6; r++) {
      board[r][6] = (r % 2 === 0 ? 1 : 2) as Cell;
    }
    // 41 cells filled, 1 empty at board[0][6] → only col 6 is valid
    expect(getValidColumns(board)).toEqual([6]);
    // minimaxAI short-circuits via `if (valid.length === 1) return valid[0]`
    const col = minimaxAI(board, 1);
    expect(col).toBe(6);
  });

  it('all AI levels pick the only available column', () => {
    const board = emptyBoard();
    // Fill columns 0-5 completely (36 cells)
    for (let c = 0; c < 6; c++) {
      for (let r = 0; r < 6; r++) {
        board[r][c] = ((r + c) % 2 === 0 ? 1 : 2) as Cell;
      }
    }
    // Only column 6 is valid
    expect(getValidColumns(board)).toEqual([6]);

    // randomAI — probabilistic: run 50 times, must always pick col 6
    for (let i = 0; i < 50; i++) {
      expect(randomAI(board)).toBe(6);
    }

    // greedyAI — deterministic, picks available center column
    expect(greedyAI(board, 1)).toBe(6);
    expect(greedyAI(board, 2)).toBe(6);

    // minimaxAI — short-circuits when only 1 valid column
    expect(minimaxAI(board, 1)).toBe(6);
    expect(minimaxAI(board, 2)).toBe(6);

    // unified interface
    expect(getAIMove(board, 1, 'random')).toBe(6);
    expect(getAIMove(board, 1, 'greedy')).toBe(6);
    expect(getAIMove(board, 1, 'minimax')).toBe(6);
  });

  it('minimax depth 5 completes under 2s with 20+ pieces on board', () => {
    const board = emptyBoard();
    // Simulate a mid-game board with 21 pieces (no winner)
    const pieces: [number, number, Cell][] = [
      [5, 0, 1], [5, 1, 2], [5, 2, 1], [5, 3, 2], [5, 4, 1], [5, 5, 2],
      [4, 0, 2], [4, 1, 1], [4, 2, 2], [4, 3, 1], [4, 4, 2], [4, 5, 1],
      [3, 0, 1], [3, 1, 2], [3, 2, 1], [3, 3, 2], [3, 4, 1],
      [2, 0, 2], [2, 1, 1], [2, 2, 2], [2, 3, 1],
    ];
    for (const [r, c, v] of pieces) {
      board[r][c] = v;
    }
    // Sanity check: board is mid-game, no winner, columns still open
    expect(getValidColumns(board).length).toBeGreaterThanOrEqual(3);

    const start = Date.now();
    minimaxAI(board, 1, 5);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(2000);
  });

  it('never picks a full column (property-based, 50 iterations per AI level)', () => {
    const board = emptyBoard();
    // Fill column 0 completely with alternating players
    for (let r = 0; r < 6; r++) {
      board[r][0] = (r % 2 === 0 ? 1 : 2) as Cell;
    }

    for (let i = 0; i < 50; i++) {
      expect(randomAI(board)).not.toBe(0);
      expect(greedyAI(board, 1)).not.toBe(0);
      expect(greedyAI(board, 2)).not.toBe(0);
      expect(minimaxAI(board, 1)).not.toBe(0);
      expect(minimaxAI(board, 2)).not.toBe(0);
    }
  });

  it('greedyAI blocks the first opponent threat when multiple immediate threats exist', () => {
    // Board (row 5 = bottom):
    //   Row 3:  1 . . . . . .
    //   Row 4:  1 . . . . . .
    //   Row 5:  1 1 1 . . 2 .
    //
    // P1 (opponent of greedy AI) has two immediate 3-in-a-row threats:
    //   1. Vertical   at col 0 — pieces at (5,0),(4,0),(3,0) need (2,0)
    //   2. Horizontal at col 3 — pieces at (5,0),(5,1),(5,2) need (5,3)
    //
    // greedyAI scans valid columns [0..6] in order. It simulates opponent
    // dropping at each column and returns the first blocking column (col 0).
    //
    // NOTE: This reveals a design gap — greedyAI uses simple 1-ply lookahead
    // and picks the first blocking column rather than evaluating which threat
    // is more dangerous. A future enhancement could evaluate threat severity
    // (e.g. a vertical threat that also enables a fork is more dangerous than
    // a single horizontal threat).

    const board = emptyBoard();
    setCell(board, 5, 0, 1);
    setCell(board, 4, 0, 1);
    setCell(board, 3, 0, 1);
    setCell(board, 5, 1, 1);
    setCell(board, 5, 2, 1);
    setCell(board, 5, 5, 2); // AI piece (irrelevant to threats)

    expect(greedyAI(board, 2)).toBe(0);
  });
});
