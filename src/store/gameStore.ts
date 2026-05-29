import { create } from 'zustand';
import { Board, CellValue, createEmptyBoard, canDropInColumn } from '../types/board';

export type Player = 1 | 2;
export type GameStatus = 'playing' | 'won' | 'draw';

export interface GameState {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  
  // Actions
  makeMove: (column: number) => boolean;
  resetGame: () => void;
}

const OTHER_PLAYER: Record<Player, Player> = { 1: 2, 2: 1 };

const checkWin = (board: Board, player: Player): boolean => {
  const rows = 6;
  const cols = 7;

  // Horizontal
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c <= cols - 4; c++) {
      if (board[r][c] === player && board[r][c+1] === player && board[r][c+2] === player && board[r][c+3] === player) {
        return true;
      }
    }
  }
  // Vertical
  for (let r = 0; r <= rows - 4; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === player && board[r+1][c] === player && board[r+2][c] === player && board[r+3][c] === player) {
        return true;
      }
    }
  }
  // Diagonal ↘
  for (let r = 0; r <= rows - 4; r++) {
    for (let c = 0; c <= cols - 4; c++) {
      if (board[r][c] === player && board[r+1][c+1] === player && board[r+2][c+2] === player && board[r+3][c+3] === player) {
        return true;
      }
    }
  }
  // Diagonal ↗
  for (let r = 3; r < rows; r++) {
    for (let c = 0; c <= cols - 4; c++) {
      if (board[r][c] === player && board[r-1][c+1] === player && board[r-2][c+2] === player && board[r-3][c+3] === player) {
        return true;
      }
    }
  }
  return false;
};

const checkDraw = (board: Board): boolean =>
  board.every(row => row.every(cell => cell !== 0));

export const useGameStore = create<GameState>((set, get) => ({
  board: createEmptyBoard(),
  currentPlayer: 1,
  status: 'playing',
  winner: null,

  makeMove: (column: number) => {
    const { board, currentPlayer, status } = get();
    
    if (status !== 'playing') return false;
    if (!canDropInColumn(board, column)) return false;

    // Find lowest empty row
    let targetRow = -1;
    for (let r = 5; r >= 0; r--) {
      if (board[r][column] === 0) { targetRow = r; break; }
    }
    if (targetRow === -1) return false;

    // Clone board and place disc
    const newBoard = board.map(row => [...row]) as Board;
    newBoard[targetRow][column] = currentPlayer;

    if (checkWin(newBoard, currentPlayer)) {
      set({ board: newBoard, winner: currentPlayer, status: 'won' });
      return true;
    }
    if (checkDraw(newBoard)) {
      set({ board: newBoard, status: 'draw' });
      return true;
    }

    set({ board: newBoard, currentPlayer: OTHER_PLAYER[currentPlayer] });
    return true;
  },

  resetGame: () => {
    set({
      board: createEmptyBoard(),
      currentPlayer: 1,
      status: 'playing',
      winner: null,
    });
  },
}));
