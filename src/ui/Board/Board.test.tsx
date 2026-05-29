import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Board } from './Board';
import { createEmptyBoard } from '../../types/board';

describe('Board', () => {
  it('renders empty board with correct structure', () => {
    const board = createEmptyBoard();
    render(<Board board={board} onClick={() => {}} />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByRole('grid')).toHaveAttribute('aria-label', 'Connect 4 board');

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(6);

    rows.forEach(row => {
      const cells = row.querySelectorAll('[role="gridcell"]');
      expect(cells).toHaveLength(7);
    });
  });

  it('renders board with pieces', () => {
    const board = createEmptyBoard();
    board[5][0] = 1; // emerald at bottom-left
    board[5][1] = 2; // amber next to it
    board[4][0] = 2; // amber above first emerald

    render(<Board board={board} onClick={() => {}} />);

    // Check for pieces with position info in aria-labels
    expect(screen.getByLabelText(/Row 6, column 1: emerald disc/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/amber disc/i)).toHaveLength(2);
  });

  it('makes first column focusable by default', () => {
    const board = createEmptyBoard();
    render(<Board board={board} onClick={() => {}} />);

    const cells = screen.getAllByRole('gridcell');
    
    // First cell (top of column 0) should be focusable (tabIndex="0")
    expect(cells[0]).toHaveAttribute('tabIndex', '0');

    // All other cells should not be focusable (tabIndex="-1")
    for (let i = 1; i < cells.length; i++) {
      expect(cells[i]).toHaveAttribute('tabIndex', '-1');
    }
  });

  it('calls onClick when clicking a non-full column', () => {
    const board = createEmptyBoard();
    let clickedCol = -1;

    render(<Board board={board} onClick={(col) => { clickedCol = col; }} />);

    const cells = screen.getAllByRole('gridcell');
    cells[0].click(); // click top-left cell

    expect(clickedCol).toBe(0);
  });

  it('does not call onClick when clicking a full column', () => {
    const board = createEmptyBoard();
    // Fill column 0
    for (let row = 0; row < 6; row++) {
      board[row][0] = 1;
    }

    let clickedCol = -1;
    render(<Board board={board} onClick={(col) => { clickedCol = col; }} />);

    const cells = screen.getAllByRole('gridcell');
    cells[0].click(); // click top-left cell (full column)

    expect(clickedCol).toBe(-1);
  });

  it('supports keyboard navigation with arrow keys', () => {
    const board = createEmptyBoard();
    render(<Board board={board} onClick={() => {}} />);

    const boardElement = screen.getByRole('grid');
    const cells = screen.getAllByRole('gridcell');

    // Initially, first column is focused
    expect(cells[0]).toHaveAttribute('tabIndex', '0');

    // Press ArrowRight using fireEvent (triggers React synthetic events)
    act(() => {
      fireEvent.keyDown(boardElement, { key: 'ArrowRight' });
    });
    
    // Now second column should be focused (cell at index 1 is top of column 1 in row-major order)
    expect(cells[1]).toHaveAttribute('tabIndex', '0');
    expect(cells[0]).toHaveAttribute('tabIndex', '-1');
  });

  it('supports Space and Enter to drop piece', () => {
    const board = createEmptyBoard();
    let clickedCol = -1;

    render(<Board board={board} onClick={(col) => { clickedCol = col; }} />);

    const boardElement = screen.getByRole('grid');

    // Press Space to drop piece in column 0
    boardElement.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(clickedCol).toBe(0);
  });
});
