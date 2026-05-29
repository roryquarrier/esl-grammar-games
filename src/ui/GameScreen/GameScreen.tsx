import { useState, useEffect, useCallback } from 'react';
import { Board } from '../Board/Board';
import { QuestionModal, type Question } from '../QuestionModal/QuestionModal';
import { useGameStore } from '../../store/gameStore';
import { getRandomQuestion } from '../../questions/questionBank';
import styles from './GameScreen.module.css';

type GamePhase = 'idle' | 'asking' | 'cooldown';

const MAX_WRONG_ATTEMPTS = 3;
const COOLDOWN_MS = 5000;

export function GameScreen() {
  const {
    board, currentPlayer, status, winner, lastMove,
    mode, isAIThinking, aiPlayer,
    dropPiece, triggerAIMove, setGameMode, resetGame,
  } = useGameStore();

  const [phase, setPhase] = useState<GamePhase>('idle');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [pendingColumn, setPendingColumn] = useState<number | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  const resetTurn = () => {
    setPhase('idle');
    setCurrentQuestion(null);
    setWrongCount(0);
    setPendingColumn(null);
    setCooldownRemaining(0);
  };

  // Column click: start question round (only for human players)
  const handleColumnClick = useCallback((col: number) => {
    if (phase !== 'idle' || status !== 'playing') return;
    // Block clicks when it's AI's turn
    if (mode === 'pve' && currentPlayer === aiPlayer) return;
    setPendingColumn(col);
    setCurrentQuestion(getRandomQuestion());
    setWrongCount(0);
    setPhase('asking');
  }, [phase, status, mode, currentPlayer, aiPlayer]);

  // Answer handler
  const handleAnswer = (isCorrect: boolean) => {
    if (pendingColumn === null) return;

    if (isCorrect) {
      dropPiece(pendingColumn);
      resetTurn();
      return;
    }

    const nextWrongCount = wrongCount + 1;

    if (nextWrongCount >= MAX_WRONG_ATTEMPTS) {
      setWrongCount(nextWrongCount);
      setPhase('cooldown');
      setCooldownRemaining(COOLDOWN_MS);
      setCurrentQuestion(null);
    } else {
      setWrongCount(nextWrongCount);
      setCurrentQuestion(getRandomQuestion());
    }
  };

  // Trigger AI move after human player moves
  useEffect(() => {
    if (mode === 'pve' && status === 'playing' && currentPlayer === aiPlayer && phase === 'idle') {
      triggerAIMove();
    }
  }, [currentPlayer, mode, status, aiPlayer, phase, triggerAIMove]);

  // Cooldown timer
  useEffect(() => {
    if (phase !== 'cooldown') return;

    const interval = setInterval(() => {
      setCooldownRemaining(prev => {
        const next = prev - 1000;
        if (next <= 0) {
          clearInterval(interval);
          resetTurn();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  // Reset turn state on game reset
  useEffect(() => {
    if (status === 'playing') {
      resetTurn();
    }
  }, [status]);

  return (
    <div className={styles.container}>
      {/* Mode selector — only shown before game starts or can be always visible */}
      <div className={styles.modeSelector}>
        <button
          className={`${styles.modeButton} ${mode === 'pvp' ? styles.modeActive : ''}`}
          onClick={() => setGameMode('pvp')}
        >
          👥 2 Players
        </button>
        <button
          className={`${styles.modeButton} ${mode === 'pve' ? styles.modeActive : ''}`}
          onClick={() => setGameMode('pve', 'greedy')}
        >
          🤖 vs Computer
        </button>
      </div>

      <div className={styles.statusBar}>
        <div className={styles.turnIndicator}>
          {status === 'playing' && phase !== 'cooldown' && !isAIThinking && (
            <span className={styles.turn}>
              <span className={`${styles.playerDot} ${currentPlayer === 1 ? styles.p1 : styles.p2}`} />
              {mode === 'pve' && currentPlayer === aiPlayer
                ? 'Computer is thinking...'
                : `Player ${currentPlayer}'s turn — pick a column!`}
            </span>
          )}
          {status === 'playing' && isAIThinking && (
            <span className={styles.turn}>
              <span className={`${styles.playerDot} ${styles.p2}`} />
              🤖 Computer is thinking...
            </span>
          )}
          {phase === 'cooldown' && (
            <span className={styles.cooldown}>
              {MAX_WRONG_ATTEMPTS} wrong — cooling down for {Math.ceil(cooldownRemaining / 1000)}s ⏱️
            </span>
          )}
          {status === 'won' && (
            <span className={styles.winner}>
              🎉 {mode === 'pve' && winner === aiPlayer
                ? 'Computer wins!'
                : `Player ${winner} wins!`}
            </span>
          )}
          {status === 'draw' && (
            <span className={styles.draw}>Draw — board full!</span>
          )}
        </div>
        {status !== 'playing' && (
          <button className={styles.resetButton} onClick={resetGame}>
            New Game
          </button>
        )}
      </div>

      {wrongCount > 0 && phase === 'asking' && (
        <div className={styles.wrongCounter}>
          {wrongCount}/{MAX_WRONG_ATTEMPTS} wrong attempts — {MAX_WRONG_ATTEMPTS - wrongCount} more and you'll cool down!
        </div>
      )}

      <Board board={board} onClick={handleColumnClick} lastMove={lastMove} />

      {phase === 'asking' && currentQuestion && (
        <QuestionModal
          question={currentQuestion}
          onAnswer={handleAnswer}
          playerId={mode === 'pve' ? 'You' : `Player ${currentPlayer}`}
        />
      )}
    </div>
  );
}
