import { Board } from '../Board/Board';
import { useGameStore } from '../../store/gameStore';
import styles from './GameScreen.module.css';

export function GameScreen() {
  const { board, currentPlayer, status, winner, makeMove, resetGame } = useGameStore();

  const handleColumnSelect = (col: number) => {
    // For now, direct move. Will be wrapped in question gating in a later slice.
    makeMove(col);
  };

  return (
    <div className={styles.container}>
      <div className={styles.statusBar}>
        <div className={styles.turnIndicator}>
          {status === 'playing' && (
            <span className={styles.turn}>
              <span className={`${styles.playerDot} ${currentPlayer === 1 ? styles.p1 : styles.p2}`} />
              Player {currentPlayer}'s turn
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
        {(status !== 'playing') && (
          <button className={styles.resetButton} onClick={resetGame}>
            New Game
          </button>
        )}
      </div>

      <Board board={board} onClick={handleColumnSelect} />
    </div>
  );
}
