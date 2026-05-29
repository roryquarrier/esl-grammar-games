import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardLite } from './DashboardLite';
import { mockClassInfo } from '../../data/mockClassData';

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: vi.fn().mockResolvedValue(undefined) },
  writable: true,
});

describe('DashboardLite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all 8 student names', () => {
    render(<DashboardLite />);

    for (const student of mockClassInfo.students) {
      expect(screen.getByText(student.displayName)).toBeInTheDocument();
    }
  });

  it('renders the class code', () => {
    render(<DashboardLite />);

    expect(screen.getByText(mockClassInfo.classCode)).toBeInTheDocument();
    expect(screen.getByText('Class Code')).toBeInTheDocument();
  });

  it('renders the data retention notice', () => {
    render(<DashboardLite />);

    expect(
      screen.getByText(/Student data is deleted 30 days after account closure/)
    ).toBeInTheDocument();
  });

  it('shows accuracy bars with correct aria attributes', () => {
    render(<DashboardLite />);

    const progressbars = screen.getAllByRole('progressbar');
    expect(progressbars.length).toBe(mockClassInfo.students.length);

    for (let i = 0; i < mockClassInfo.students.length; i++) {
      const bar = progressbars[i];
      const student = mockClassInfo.students[i];
      expect(bar).toHaveAttribute('aria-valuenow', String(student.accuracy));
      expect(bar).toHaveAttribute('aria-valuemin', '0');
      expect(bar).toHaveAttribute('aria-valuemax', '100');
    }
  });

  it('weak topic chips render for each student', () => {
    render(<DashboardLite />);

    const allTopics = mockClassInfo.students.flatMap((s) => s.weakTopics);
    const uniqueTopics = [...new Set(allTopics)];

    for (const topic of uniqueTopics) {
      const display = topic.replace(/_/g, ' ');
      const elements = screen.getAllByText(display);
      expect(elements.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('copy button exists for class code', () => {
    render(<DashboardLite />);

    const copyButton = screen.getByRole('button', {
      name: /Copy class code/,
    });
    expect(copyButton).toBeInTheDocument();
  });

  it('copy button calls clipboard API on click', async () => {
    render(<DashboardLite />);

    const copyButton = screen.getByRole('button', {
      name: /Copy class code/,
    });
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      mockClassInfo.classCode
    );
  });

  it('renders the dashboard heading with class name', () => {
    render(<DashboardLite />);

    expect(
      screen.getByRole('heading', { name: /Dashboard.*P4A/ })
    ).toBeInTheDocument();
  });
});
