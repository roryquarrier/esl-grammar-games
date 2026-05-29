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
  const { board, currentPlayer, status, winner, dropPiece } = useGameStore();

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

  // Column click: start question round
  const handleColumnClick = useCallback((col: number) => {
    if (phase !== 'idle' || status !== 'playing') return;
    setPendingColumn(col);
    setCurrentQuestion(getRandomQuestion());
    setWrongCount(0);
    setPhase('asking');
  }, [phase, status]);

  // Answer handler
  const handleAnswer = (isCorrect: boolean) => {
    if (!pendingColumn) return;

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

  const { resetGame } = useGameStore.getState();

  return (
    <div className={styles.container}>
      <div className={styles.statusBar}>
        <div className={styles.turnIndicator}>
          {status === 'playing' && phase !== 'cooldown' && (
            <span className={styles.turn}>
              <span className={`${styles.playerDot} ${currentPlayer === 1 ? styles.p1 : styles.p2}`} />
              Player {currentPlayer}'s turn — pick a column!
            </span>
          )}
          {phase === 'cooldown' && (
            <span className={styles.cooldown}>
              {MAX_WRONG_ATTEMPTS} wrong — cooling down for {Math.ceil(cooldownRemaining / 1000)}s ⏱️
            </span>
          )}
          {status === 'won' && (
            <span className={styles.winner}>
              🎉 Player {winner} wins!
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

      <Board board={board} onClick={handleColumnClick} />

      {phase === 'asking' && currentQuestion && (
        <QuestionModal
          question={currentQuestion}
          onAnswer={handleAnswer}
          playerId={`Player ${currentPlayer}`}
        />
      )}
    </div>
  );
}
