/**
 * AI opponent logic for Connect 4.
 * Pure functions — no side effects, no React dependencies.
 *
 * Three difficulty levels:
 *   random  — picks a random valid column (great for young learners)
 *   greedy  — wins/blocks/prefer-center (medium challenge)
 *   minimax — alpha-beta pruning, depth-limited (hard)
 */

import type { Board, Player, Cell } from '../store/gameStore';

const ROWS = 6;
const COLS = 7;

// ─── helpers ────────────────────────────────────────────────────────

/** Return list of columns that still have space. */
export function getValidColumns(board: Board): number[] {
  const cols: number[] = [];
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === 0) cols.push(c);
  }
  return cols;
}

/** Find the lowest empty row in a column (assumes column is not full). */
function getDropRow(board: Board, col: number): number {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === 0) return r;
  }
  return -1; // should not happen if column is valid
}

/** Deep-clone a board. */
function cloneBoard(board: Board): Board {
  return board.map(row => [...row]) as Board;
}

/** Simulate dropping a piece and return the new board + landing row. */
function simulateDrop(board: Board, col: number, player: Player): { board: Board; row: number } {
  const newBoard = cloneBoard(board);
  const row = getDropRow(newBoard, col);
  newBoard[row][col] = player as Cell;
  return { board: newBoard, row };
}

// ─── win detection (mirrors gameStore.checkWin) ─────────────────────

function checkWinAt(board: Board, row: number, col: number, player: Player): boolean {
  const directions = [
    { dr: 0, dc: 1 },   // horizontal
    { dr: 1, dc: 0 },   // vertical
    { dr: 1, dc: 1 },   // diagonal down-right
    { dr: 1, dc: -1 },  // diagonal down-left
  ];

  for (const { dr, dc } of directions) {
    let count = 1;
    for (let i = 1; i < 4; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        count++;
      } else break;
    }
    for (let i = 1; i < 4; i++) {
      const r = row - dr * i;
      const c = col - dc * i;
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        count++;
      } else break;
    }
    if (count >= 4) return true;
  }
  return false;
}

// ─── random AI ──────────────────────────────────────────────────────

export function randomAI(board: Board): number {
  const cols = getValidColumns(board);
  return cols[Math.floor(Math.random() * cols.length)];
}

// ─── greedy AI ──────────────────────────────────────────────────────

export function greedyAI(board: Board, aiPlayer: Player): number {
  const valid = getValidColumns(board);
  const opponent = aiPlayer === 1 ? 2 : 1;

  // 1. Win if possible
  for (const col of valid) {
    const { board: newBoard, row } = simulateDrop(board, col, aiPlayer);
    if (checkWinAt(newBoard, row, col, aiPlayer)) return col;
  }

  // 2. Block opponent win
  for (const col of valid) {
    const { board: newBoard, row } = simulateDrop(board, col, opponent);
    if (checkWinAt(newBoard, row, col, opponent)) return col;
  }

  // 3. Prefer center columns (3 is best, then 2/4, then 1/5, then 0/6)
  const centerPriority = [3, 2, 4, 1, 5, 0, 6];
  for (const col of centerPriority) {
    if (valid.includes(col)) return col;
  }

  // Fallback (shouldn't reach here)
  return valid[0];
}

// ─── minimax AI ─────────────────────────────────────────────────────

/**
 * Score a window of 4 cells for the minimax heuristic.
 * Positive = good for aiPlayer, negative = good for opponent.
 */
function scoreWindow(cells: Cell[], aiPlayer: Player): number {
  const opponent = aiPlayer === 1 ? 2 : 1;
  const aiCount = cells.filter(c => c === aiPlayer).length;
  const oppCount = cells.filter(c => c === opponent).length;
  const emptyCount = cells.filter(c => c === 0).length;

  if (aiCount === 4) return 1000;
  if (oppCount === 4) return -1000;
  if (aiCount === 3 && emptyCount === 1) return 50;
  if (oppCount === 3 && emptyCount === 1) return -80;
  if (aiCount === 2 && emptyCount === 2) return 10;
  if (oppCount === 2 && emptyCount === 2) return -10;
  return 0;
}

/**
 * Heuristic evaluation of the board position.
 * Higher = better for aiPlayer.
 */
function evaluateBoard(board: Board, aiPlayer: Player): number {
  let score = 0;

  // Center column preference
  const centerCol = 3;
  for (let r = 0; r < ROWS; r++) {
    if (board[r][centerCol] === aiPlayer) score += 6;
  }

  // Horizontal windows
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const cells = [board[r][c], board[r][c + 1], board[r][c + 2], board[r][c + 3]] as Cell[];
      score += scoreWindow(cells, aiPlayer);
    }
  }

  // Vertical windows
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r <= ROWS - 4; r++) {
      const cells = [board[r][c], board[r + 1][c], board[r + 2][c], board[r + 3][c]] as Cell[];
      score += scoreWindow(cells, aiPlayer);
    }
  }

  // Diagonal (down-right) windows
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const cells = [board[r][c], board[r + 1][c + 1], board[r + 2][c + 2], board[r + 3][c + 3]] as Cell[];
      score += scoreWindow(cells, aiPlayer);
    }
  }

  // Diagonal (down-left) windows
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 3; c < COLS; c++) {
      const cells = [board[r][c], board[r + 1][c - 1], board[r + 2][c - 2], board[r + 3][c - 3]] as Cell[];
      score += scoreWindow(cells, aiPlayer);
    }
  }

  return score;
}

/**
 * Minimax with alpha-beta pruning.
 * `lastMoveRow`/`lastMoveCol` track the move that led to this board state
 * so we can check if it was a winning move.
 */
function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  lastMoveRow: number,
  lastMoveCol: number,
  lastMovePlayer: Player,
): number {
  const opponent = aiPlayer === 1 ? 2 : 1;
  const valid = getValidColumns(board);

  // Terminal checks
  if (lastMoveRow >= 0 && lastMoveCol >= 0) {
    if (checkWinAt(board, lastMoveRow, lastMoveCol, lastMovePlayer)) {
      // The player who just moved won. Good for aiPlayer if they moved, bad otherwise.
      return lastMovePlayer === aiPlayer ? 100000 + depth : -100000 - depth;
    }
  }
  if (valid.length === 0) return 0; // draw
  if (depth === 0) return evaluateBoard(board, aiPlayer);

  const currentMovingPlayer = isMaximizing ? aiPlayer : opponent;

  if (isMaximizing) {
    let value = -Infinity;
    for (const col of valid) {
      const { board: newBoard, row } = simulateDrop(board, col, currentMovingPlayer);
      const childScore = minimax(newBoard, depth - 1, alpha, beta, false, aiPlayer, row, col, currentMovingPlayer);
      value = Math.max(value, childScore);
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return value;
  } else {
    let value = Infinity;
    for (const col of valid) {
      const { board: newBoard, row } = simulateDrop(board, col, currentMovingPlayer);
      const childScore = minimax(newBoard, depth - 1, alpha, beta, true, aiPlayer, row, col, currentMovingPlayer);
      value = Math.min(value, childScore);
      beta = Math.min(beta, value);
      if (alpha >= beta) break;
    }
    return value;
  }
}

/**
 * Minimax AI — picks the best column using depth-limited search.
 * Depth 5 is a good balance for Connect 4 (fast enough, strong enough).
 */
export function minimaxAI(board: Board, aiPlayer: Player, depth: number = 5): number {
  const valid = getValidColumns(board);
  if (valid.length === 0) return -1; // shouldn't happen

  // If only one valid move, return it immediately
  if (valid.length === 1) return valid[0];

  let bestScore = -Infinity;
  let bestCol = valid[0];

  // Try center columns first for tiebreaking
  const sorted = [...valid].sort((a, b) => Math.abs(a - 3) - Math.abs(b - 3));

  for (const col of sorted) {
    const { board: newBoard, row } = simulateDrop(board, col, aiPlayer);
    if (checkWinAt(newBoard, row, col, aiPlayer)) return col; // instant win
    const score = minimax(newBoard, depth - 1, -Infinity, Infinity, false, aiPlayer, row, col, aiPlayer);
    if (score > bestScore) {
      bestScore = score;
      bestCol = col;
    }
  }

  return bestCol;
}

// ─── unified interface ──────────────────────────────────────────────

export type AIDifficulty = 'random' | 'greedy' | 'minimax';

/**
 * Pick a column for the AI opponent.
 * @param board   Current board state
 * @param player  Which player the AI is (1 or 2)
 * @param difficulty  AI difficulty level
 */
export function getAIMove(board: Board, player: Player, difficulty: AIDifficulty): number {
  switch (difficulty) {
    case 'random':
      return randomAI(board);
    case 'greedy':
      return greedyAI(board, player);
    case 'minimax':
      return minimaxAI(board, player);
  }
}
