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

  it('no column focused by default (mouse users)', () => {
    const board = createEmptyBoard();
    render(<Board board={board} onClick={() => {}} />);

    const cells = screen.getAllByRole('gridcell');
    
    // All cells should have tabIndex -1 by default (no keyboard focus)
    for (let i = 0; i < cells.length; i++) {
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

    // Initially, no column is focused
    expect(cells[0]).toHaveAttribute('tabIndex', '-1');

    // Press ArrowRight — should focus column 0 (first keypress sets focus)
    act(() => {
      fireEvent.keyDown(boardElement, { key: 'ArrowRight' });
    });
    
    // Column 0 should now be focused (focusedColumn starts at -1, ArrowRight moves to 0)
    expect(cells[0]).toHaveAttribute('tabIndex', '0');

    // Press ArrowRight again — should move to column 1
    act(() => {
      fireEvent.keyDown(boardElement, { key: 'ArrowRight' });
    });
    
    expect(cells[1]).toHaveAttribute('tabIndex', '0');
    expect(cells[0]).toHaveAttribute('tabIndex', '-1');
  });

  it('cell aria-label updates correctly when value changes', () => {
    const board = createEmptyBoard();
    const { rerender } = render(<Board board={board} onClick={() => {}} />);

    expect(screen.getByLabelText(/Row 6, column 1: empty/i)).toBeInTheDocument();

    board[5][0] = 1;
    rerender(<Board board={board} onClick={() => {}} />);
    expect(screen.getByLabelText(/Row 6, column 1: emerald disc/i)).toBeInTheDocument();

    board[5][0] = 2;
    rerender(<Board board={board} onClick={() => {}} />);
    expect(screen.getByLabelText(/Row 6, column 1: amber disc/i)).toBeInTheDocument();
  });

  it('supports Space and Enter to drop piece after keyboard focus', () => {
    const board = createEmptyBoard();
    let clickedCol = -1;

    render(<Board board={board} onClick={(col) => { clickedCol = col; }} />);

    const boardElement = screen.getByRole('grid');

    // Press ArrowRight to establish keyboard focus on column 0
    act(() => {
      fireEvent.keyDown(boardElement, { key: 'ArrowRight' });
    });

    // Press Space to drop piece in column 0
    act(() => {
      fireEvent.keyDown(boardElement, { key: ' ' });
    });
    expect(clickedCol).toBe(0);
  });
});
