// Board type re-exported from store + utility functions
// Avoids duplicate type definitions

export type { Cell as CellValue, Board } from '../store/gameStore';
import type { Board } from '../store/gameStore';

// Re-export createEmptyBoard from store
export { createEmptyBoard } from '../store/gameStore';

// Check if a column has space for a disc
export function canDropInColumn(board: Board, col: number): boolean {
  return board[0][col] === 0;
}

// Get the row where a disc would land in a given column
export function getDropRow(board: Board, col: number): number {
  for (let row = 5; row >= 0; row--) {
    if (board[row][col] === 0) {
      return row;
    }
  }
  return -1; // Column is full
}
