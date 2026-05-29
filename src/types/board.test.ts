import { createEmptyBoard, canDropInColumn, getDropRow } from './board';
import { describe, it, expect } from 'vitest';

describe('board types and helpers', () => {
  it('createEmptyBoard returns a 6x7 grid of zeros', () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(6);
    board.forEach(row => {
      expect(row).toHaveLength(7);
      row.forEach(cell => expect(cell).toBe(0));
    });
  });

  it('canDropInColumn returns true for empty column', () => {
    const board = createEmptyBoard();
    expect(canDropInColumn(board, 0)).toBe(true);
  });

  it('canDropInColumn returns false for full column', () => {
    const board = createEmptyBoard();
    for (let i = 0; i < 6; i++) {
      board[i][3] = 1;
    }
    expect(canDropInColumn(board, 3)).toBe(false);
  });

  it('getDropRow returns bottom row for empty column', () => {
    const board = createEmptyBoard();
    expect(getDropRow(board, 0)).toBe(5);
  });

  it('getDropRow returns correct row when discs are stacked', () => {
    const board = createEmptyBoard();
    board[5][0] = 1;
    board[4][0] = 2;
    expect(getDropRow(board, 0)).toBe(3);
  });

  it('getDropRow returns -1 for full column', () => {
    const board = createEmptyBoard();
    for (let i = 0; i < 6; i++) {
      board[i][0] = 1;
    }
    expect(getDropRow(board, 0)).toBe(-1);
  });
});
