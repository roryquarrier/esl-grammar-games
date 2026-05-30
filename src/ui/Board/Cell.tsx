import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import styles from './Cell.module.css';

export type CellValue = 0 | 1 | 2;

interface CellProps {
  value: CellValue;
  row: number;
  col: number;
  onClick: () => void;
  isFocused?: boolean;
  isColumnFocused?: boolean;
  isLastMove?: boolean;
}

export const Cell = forwardRef<HTMLDivElement, CellProps>(
  ({ value, row, col, onClick, isFocused, isColumnFocused, isLastMove }, ref) => {
    const getDiscClass = () => {
      switch (value) {
        case 1:
          return styles.discEm;
        case 2:
          return styles.discAmber;
        default:
          return styles.discEmpty;
      }
    };

    const getAriaLabel = () => {
      switch (value) {
        case 1:
          return `Row ${row + 1}, column ${col + 1}: emerald disc`;
        case 2:
          return `Row ${row + 1}, column ${col + 1}: amber disc`;
        default:
          return `Row ${row + 1}, column ${col + 1}: empty`;
      }
    };

    const cellClasses = [
      styles.cell,
      isColumnFocused ? styles.columnFocused : '',
    ].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={cellClasses}
        role="gridcell"
        aria-label={getAriaLabel()}
        tabIndex={isFocused ? 0 : -1}
        onClick={onClick}
        data-row={row}
        data-col={col}
      >
        {value !== 0 && (
          <motion.div
            className={`${styles.disc} ${getDiscClass()}`}
            initial={isLastMove ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            key={`disc-${row}-${col}-${value}`}
          />
        )}
      </div>
    );
  }
);

Cell.displayName = 'Cell';
