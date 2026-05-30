import { create } from 'zustand';
import { getAIMove, type AIDifficulty } from '../game/ai';

// Board is 6 rows x 7 columns
export type Cell = 0 | 1 | 2; // 0 = empty, 1 = player 1, 2 = player 2
export type Board = Cell[][];
export type Player = 1 | 2;
export type GameStatus = 'playing' | 'won' | 'draw';
export type GameMode = 'pvp' | 'pve';

export interface MoveRecord {
  moveNumber: number;
  player: Player;
  col: number;
  row: number;
  isAI: boolean;
}

export interface GameState {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  lastMove: { row: number; col: number } | null;

  // Move history
  moveHistory: MoveRecord[];

  // AI mode
  mode: GameMode;
  aiDifficulty: AIDifficulty;
  aiPlayer: Player;
  isAIThinking: boolean;

  // Actions
  dropPiece: (col: number) => boolean; // Returns false if invalid move
  resetGame: () => void;
  setGameMode: (mode: GameMode, difficulty?: AIDifficulty) => void;
  triggerAIMove: () => void; // Called after player moves to trigger AI response
}

const ROWS = 6;
const COLS = 7;

export const createEmptyBoard = (): Board => {
  return Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(0) as Cell[]);
};

const checkWin = (board: Board, row: number, col: number, player: Player): boolean => {
  const directions = [
    { dr: 0, dc: 1 },   // horizontal
    { dr: 1, dc: 0 },   // vertical
    { dr: 1, dc: 1 },   // diagonal down-right
    { dr: 1, dc: -1 },  // diagonal down-left
  ];

  for (const { dr, dc } of directions) {
    let count = 1;

    // Check positive direction
    for (let i = 1; i < 4; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        count++;
      } else {
        break;
      }
    }

    // Check negative direction
    for (let i = 1; i < 4; i++) {
      const r = row - dr * i;
      const c = col - dc * i;
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        count++;
      } else {
        break;
      }
    }

    if (count >= 4) return true;
  }

  return false;
};

const checkDraw = (board: Board): boolean => {
  return board[0].every(cell => cell !== 0);
};

export const useGameStore = create<GameState>((set, get) => ({
  board: createEmptyBoard(),
  currentPlayer: 1,
  status: 'playing',
  winner: null,
  lastMove: null,
  moveHistory: [],

  // AI defaults
  mode: 'pvp',
  aiDifficulty: 'greedy',
  aiPlayer: 2,
  isAIThinking: false,

  dropPiece: (col: number) => {
    const { board, currentPlayer, status, moveHistory, mode, aiPlayer } = get();

    // Game is over
    if (status !== 'playing') return false;

    // Column is full
    if (board[0][col] !== 0) return false;

    // Find lowest empty row in column
    let row = ROWS - 1;
    while (row >= 0 && board[row][col] !== 0) {
      row--;
    }

    // Create new board with piece placed
    const newBoard = board.map(r => [...r]) as Board;
    newBoard[row][col] = currentPlayer;

    // Record the move
    const newMove: MoveRecord = {
      moveNumber: moveHistory.length + 1,
      player: currentPlayer,
      col,
      row,
      isAI: mode === 'pve' && currentPlayer === aiPlayer,
    };

    // Check for win
    if (checkWin(newBoard, row, col, currentPlayer)) {
      set({
        board: newBoard,
        status: 'won',
        winner: currentPlayer,
        lastMove: { row, col },
        moveHistory: [...moveHistory, newMove],
      });
      return true;
    }

    // Check for draw
    if (checkDraw(newBoard)) {
      set({
        board: newBoard,
        status: 'draw',
        lastMove: { row, col },
        moveHistory: [...moveHistory, newMove],
      });
      return true;
    }

    // Switch player
    set({
      board: newBoard,
      currentPlayer: currentPlayer === 1 ? 2 : 1,
      lastMove: { row, col },
      moveHistory: [...moveHistory, newMove],
    });
    return true;
  },

  resetGame: () => {
    const { mode, aiDifficulty, aiPlayer } = get();
    set({
      board: createEmptyBoard(),
      currentPlayer: 1,
      status: 'playing',
      winner: null,
      lastMove: null,
      moveHistory: [],
      isAIThinking: false,
      mode,
      aiDifficulty,
      aiPlayer,
    });
  },

  setGameMode: (mode: GameMode, difficulty?: AIDifficulty) => {
    set({
      mode,
      aiDifficulty: difficulty ?? 'greedy',
      aiPlayer: 2, // AI is always player 2 (goes second)
    });
    // Reset the game when switching modes
    get().resetGame();
  },

  triggerAIMove: () => {
    const { status, mode, aiPlayer, currentPlayer, isAIThinking } = get();

    // Only trigger in PvE mode, when it's AI's turn, game is playing, and not already thinking
    if (mode !== 'pve' || status !== 'playing' || currentPlayer !== aiPlayer || isAIThinking) {
      return;
    }

    set({ isAIThinking: true });

    // Small delay to make AI feel natural (not instant)
    setTimeout(() => {
      const { board: currentBoard, status: currentStatus, currentPlayer: turn, aiPlayer: ai, aiDifficulty: diff } = get();
      // Re-check state hasn't changed
      if (currentStatus !== 'playing' || turn !== ai) {
        set({ isAIThinking: false });
        return;
      }

      const col = getAIMove(currentBoard, ai, diff);
      set({ isAIThinking: false });
      if (col >= 0) {
        get().dropPiece(col);
      }
    }, 600); // 600ms "thinking" delay
  },
}));
