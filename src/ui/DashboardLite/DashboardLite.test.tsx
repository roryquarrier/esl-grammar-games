import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DashboardLite } from './DashboardLite';
import type { Progress, Student } from '../../lib/database.types';

vi.mock('@clerk/clerk-react', () => ({
  useUser: vi.fn(),
}));

vi.mock('../../lib/supabase', () => ({
  supabase: { from: vi.fn() },
}));

vi.mock('../../services/progressService', () => ({
  getClassProgress: vi.fn(),
}));

import { useUser } from '@clerk/clerk-react';
import { supabase } from '../../lib/supabase';
import { getClassProgress } from '../../services/progressService';

const mockStudent = (overrides: Partial<Student> = {}): Student => ({
  id: 'stu-001',
  display_name: 'Sophie Wong',
  avatar_key: 'panda',
  book_level: 'green',
  teacher_id: 'teacher-1',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-06-01T00:00:00Z',
  deleted_at: null,
  pin_hash: null,
  ...overrides,
});

const mockProgress = (overrides: Partial<Progress> = {}): Progress => ({
  student_id: 'stu-001',
  total_attempts: 245,
  total_correct: 225,
  accuracy: 0.92,
  current_streak: 7,
  best_streak: 10,
  topic_stats: {},
  weak_topics: ['modals', 'prepositions', 'comparatives'],
  strong_topics: ['articles'],
  updated_at: '2025-06-01T00:00:00Z',
  ...overrides,
});

function setupMocks(options: {
  user: { id: string } | null;
  isLoaded: boolean;
  teacherName: string;
  students: Student[];
  progress: Progress[];
}) {
  const { user, isLoaded } = options;

  (useUser as ReturnType<typeof vi.fn>).mockReturnValue({ user, isLoaded });

  if (!user || !isLoaded) return;

  const teacherChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: { display_name: options.teacherName },
      error: null,
    }),
  };

  const studentsChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue({
      data: options.students,
      error: null,
    }),
  };

  (supabase.from as ReturnType<typeof vi.fn>)
    .mockReturnValueOnce(teacherChain)
    .mockReturnValueOnce(studentsChain);

  (getClassProgress as ReturnType<typeof vi.fn>).mockResolvedValue(options.progress);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('DashboardLite', () => {
  it('shows sign-in prompt when no user', () => {
    setupMocks({
      user: null,
      isLoaded: true,
      teacherName: '',
      students: [],
      progress: [],
    });

    render(<DashboardLite />);
    expect(screen.getByText('Sign in to view your dashboard.')).toBeInTheDocument();
  });

  it('shows loading while Clerk is loading', () => {
    setupMocks({
      user: null,
      isLoaded: false,
      teacherName: '',
      students: [],
      progress: [],
    });

    render(<DashboardLite />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('shows loading state while fetching data', () => {
    setupMocks({
      user: { id: 'teacher-1' },
      isLoaded: true,
      teacherName: '',
      students: [],
      progress: [],
    });

    render(<DashboardLite />);
    expect(screen.getByText('Loading student data…')).toBeInTheDocument();
  });

  it('shows empty state when no students exist', async () => {
    setupMocks({
      user: { id: 'teacher-1' },
      isLoaded: true,
      teacherName: 'Test Teacher',
      students: [],
      progress: [],
    });

    render(<DashboardLite />);

    await waitFor(() => {
      expect(
        screen.getByText('No students yet. Add students in the teacher dashboard.')
      ).toBeInTheDocument();
    });
  });

  it('renders student names from real data', async () => {
    const students = [
      mockStudent({ id: 's1', display_name: 'Sophie Wong' }),
      mockStudent({ id: 's2', display_name: 'Marcus Chen' }),
    ];
    const progress = [
      mockProgress({ student_id: 's1', weak_topics: ['modals'] }),
      mockProgress({ student_id: 's2', weak_topics: ['articles'] }),
    ];

    setupMocks({
      user: { id: 'teacher-1' },
      isLoaded: true,
      teacherName: 'P4A',
      students,
      progress,
    });

    render(<DashboardLite />);

    await waitFor(() => {
      expect(screen.getByText('Sophie Wong')).toBeInTheDocument();
      expect(screen.getByText('Marcus Chen')).toBeInTheDocument();
    });
  });

  it('renders the retention notice', async () => {
    setupMocks({
      user: { id: 'teacher-1' },
      isLoaded: true,
      teacherName: 'P4A',
      students: [mockStudent()],
      progress: [mockProgress()],
    });

    render(<DashboardLite />);

    await waitFor(() => {
      expect(
        screen.getByText(/Student data is deleted 30 days after account closure/)
      ).toBeInTheDocument();
    });
  });

  it('renders accuracy bars with correct aria attributes', async () => {
    const students = [
      mockStudent({ id: 's1', display_name: 'Sophie Wong' }),
      mockStudent({ id: 's2', display_name: 'Marcus Chen' }),
    ];
    const progress = [
      mockProgress({ student_id: 's1', accuracy: 0.92 }),
      mockProgress({ student_id: 's2', accuracy: 0.78 }),
    ];

    setupMocks({
      user: { id: 'teacher-1' },
      isLoaded: true,
      teacherName: 'P4A',
      students,
      progress,
    });

    render(<DashboardLite />);

    await waitFor(() => {
      const bars = screen.getAllByRole('progressbar');
      expect(bars).toHaveLength(2);
      expect(bars[0]).toHaveAttribute('aria-valuenow', '92');
      expect(bars[1]).toHaveAttribute('aria-valuenow', '78');
    });
  });

  it('renders weak topic chips', async () => {
    const students = [
      mockStudent({ id: 's1', display_name: 'Sophie Wong' }),
    ];
    const progress = [
      mockProgress({
        student_id: 's1',
        weak_topics: ['modals', 'prepositions', 'comparatives'],
      }),
    ];

    setupMocks({
      user: { id: 'teacher-1' },
      isLoaded: true,
      teacherName: 'P4A',
      students,
      progress,
    });

    render(<DashboardLite />);

    await waitFor(() => {
      expect(screen.getByText('modals')).toBeInTheDocument();
      expect(screen.getByText('prepositions')).toBeInTheDocument();
      expect(screen.getByText('comparatives')).toBeInTheDocument();
    });
  });

  it('renders dashboard heading with teacher name', async () => {
    setupMocks({
      user: { id: 'teacher-1' },
      isLoaded: true,
      teacherName: 'P4A',
      students: [mockStudent()],
      progress: [mockProgress()],
    });

    render(<DashboardLite />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Dashboard.*P4A/ })
      ).toBeInTheDocument();
    });
  });
});
