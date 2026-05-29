// Board type definition for Connect 4 grid
// 0 = empty cell, 1 = player 1 (emerald), 2 = player 2 (amber)
export type CellValue = 0 | 1 | 2;
export type Board = CellValue[][];

// Create an empty 6x7 board
export function createEmptyBoard(): Board {
  return Array(6)
    .fill(null)
    .map(() => Array(7).fill(0));
}

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
