import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MoveRecord } from '../../store/gameStore';
import styles from './MoveHistory.module.css';

interface MoveHistoryProps {
  moves: MoveRecord[];
  gameMode: 'pvp' | 'pve';
}

const COLUMN_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

export function MoveHistory({ moves, gameMode }: MoveHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new moves are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moves.length]);

  if (moves.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Move Log</h3>
        <div className={styles.empty}>No moves yet — pick a column!</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Move Log</h3>
      <div className={styles.scrollArea} ref={scrollRef}>
        <AnimatePresence initial={false}>
          {moves.map((move) => (
            <motion.div
              key={move.moveNumber}
              className={styles.entry}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className={styles.moveNum}>#{move.moveNumber}</span>
              <span
                className={`${styles.playerDot} ${
                  move.player === 1 ? styles.p1 : styles.p2
                }`}
              />
              <span className={styles.detail}>
                {gameMode === 'pve' && move.isAI ? '🤖 ' : ''}
                Column {COLUMN_LABELS[move.col]}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
