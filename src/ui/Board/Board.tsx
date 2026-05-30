import { useRef, useState } from 'react';
import { Cell } from './Cell';
import { Board as BoardType, canDropInColumn } from '../../types/board';
import styles from './Board.module.css';

interface BoardProps {
  board: BoardType;
  onClick: (col: number) => void;
  lastMove?: { row: number; col: number } | null;
}

export function Board({ board, onClick, lastMove }: BoardProps) {
  const [focusedColumn, setFocusedColumn] = useState(-1);
  const cellRefs = useRef<(HTMLDivElement | null)[][]>(
    Array.from({ length: 6 }, () => Array(7).fill(null))
  );
  const numCols = 7;

  const handleColumnClick = (col: number) => {
    if (canDropInColumn(board, col)) {
      onClick(col);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    let newColumn = focusedColumn;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        newColumn = Math.max(0, focusedColumn - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        newColumn = Math.min(numCols - 1, focusedColumn + 1);
        break;
      case ' ':
      case 'Enter':
        event.preventDefault();
        handleColumnClick(focusedColumn);
        return;
      default:
        return;
    }

    if (newColumn !== focusedColumn) {
      setFocusedColumn(newColumn);
      // Focus the top cell in the new column (row 0)
      cellRefs.current[0][newColumn]?.focus();
    }
  };

  return (
    <div
      className={styles.board}
      role="grid"
      aria-label="Connect 4 board"
      onKeyDown={handleKeyDown}
    >
      {board.map((row, rowIdx) => (
        <div key={rowIdx} className={styles.row} role="row">
          {row.map((cellValue, colIdx) => (
            <Cell
              key={`${rowIdx}-${colIdx}`}
              ref={(el) => {
                cellRefs.current[rowIdx][colIdx] = el;
              }}
              value={cellValue}
              row={rowIdx}
              col={colIdx}
              onClick={() => handleColumnClick(colIdx)}
              isFocused={focusedColumn === colIdx && rowIdx === 0}
              isColumnFocused={focusedColumn === colIdx}
              isLastMove={lastMove?.row === rowIdx && lastMove?.col === colIdx}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
