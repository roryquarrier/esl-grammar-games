import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameScreen } from './GameScreen';

const createEmptyBoard = () => Array.from({ length: 6 }, () => Array(7).fill(0));

const mockQuestion = {
  id: 'test-q',
  question: 'What is the past tense of "go"?',
  options: ['goed', 'went', 'going', 'gone'],
  correctIndex: 1,
  topic: 'past-tense',
  level: 'easy',
};

const mockDropPiece = vi.fn();
const mockSetGameMode = vi.fn();
const mockResetGame = vi.fn();
const mockTriggerAIMove = vi.fn();

let mockStoreState: Record<string, unknown>;

vi.mock('../../store/gameStore', () => ({
  useGameStore: () => mockStoreState,
}));

vi.mock('../../questions/questionBank', () => ({
  getRandomQuestion: () => mockQuestion,
}));

describe('GameScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStoreState = {
      board: createEmptyBoard(),
      currentPlayer: 1,
      status: 'playing',
      winner: null,
      lastMove: null,
      moveHistory: [],
      mode: 'pvp',
      aiDifficulty: 'greedy',
      aiPlayer: 2,
      isAIThinking: false,
      dropPiece: mockDropPiece,
      setGameMode: mockSetGameMode,
      resetGame: mockResetGame,
      triggerAIMove: mockTriggerAIMove,
    };
  });

  it('renders mode selector with 2 Players and vs Computer buttons', () => {
    render(<GameScreen />);
    expect(screen.getByText(/2 Players/)).toBeInTheDocument();
    expect(screen.getByText(/vs Computer/)).toBeInTheDocument();
  });

  it('mode selector has role group and proper aria-label', () => {
    render(<GameScreen />);
    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('aria-label', 'Game mode');
  });

  it('active mode button has aria-pressed true', () => {
    render(<GameScreen />);
    const pvpBtn = screen.getByText(/2 Players/);
    const pveBtn = screen.getByText(/vs Computer/);
    expect(pvpBtn).toHaveAttribute('aria-pressed', 'true');
    expect(pveBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('clicking vs Computer sets game mode to pve', () => {
    render(<GameScreen />);
    fireEvent.click(screen.getByText(/vs Computer/));
    expect(mockSetGameMode).toHaveBeenCalledWith('pve', 'greedy');
  });

  it('shows Player 1 turn on fresh game', () => {
    render(<GameScreen />);
    expect(screen.getByText(/Player 1.*turn/i)).toBeInTheDocument();
  });

  it('column click opens question modal', () => {
    render(<GameScreen />);
    const cells = screen.getAllByRole('gridcell');
    fireEvent.click(cells[0]);
    expect(screen.getByText(mockQuestion.question)).toBeInTheDocument();
  });

  it('correct answer drops piece', () => {
    render(<GameScreen />);
    const cells = screen.getAllByRole('gridcell');
    fireEvent.click(cells[0]);
    const correctButton = screen.getByText('went').closest('button');
    fireEvent.click(correctButton!);
    expect(mockDropPiece).toHaveBeenCalledTimes(1);
    expect(mockDropPiece).toHaveBeenCalledWith(0);
  });

  it('3 wrong answers trigger cooldown', () => {
    render(<GameScreen />);
    const cells = screen.getAllByRole('gridcell');
    fireEvent.click(cells[0]);
    for (let i = 0; i < 3; i++) {
      const wrongButton = screen.getByText('goed').closest('button');
      fireEvent.click(wrongButton!);
    }
    expect(screen.getByText(/cooling down/i)).toBeInTheDocument();
  });

  it('New Game button appears when game is won', () => {
    mockStoreState = {
      ...mockStoreState,
      status: 'won',
      winner: 1,
    };
    render(<GameScreen />);
    expect(screen.getByText('New Game')).toBeInTheDocument();
    expect(screen.getByText(/Player 1 wins/i)).toBeInTheDocument();
  });
});
