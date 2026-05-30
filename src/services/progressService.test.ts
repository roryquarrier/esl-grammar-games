import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../lib/supabase';
import {
  recordAttempt,
  getProgress,
  getClassProgress,
  updateProgressStats,
} from './progressService';
import type { QuestionAttempt, Progress } from '../lib/database.types';

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

function mockChain<T>(data: T, error: unknown = null) {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {
    eq: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
    in: vi.fn(),
    select: vi.fn(),
    insert: vi.fn(),
    upsert: vi.fn(),
    then: vi.fn((resolve: (v: { data: T; error: unknown }) => void) =>
      resolve({ data, error }),
    ),
  };
  chain.eq.mockReturnValue(chain);
  chain.order.mockReturnValue(chain);
  chain.limit.mockReturnValue(chain);
  chain.single.mockReturnValue(chain);
  chain.maybeSingle.mockReturnValue(chain);
  chain.in.mockReturnValue(chain);
  chain.select.mockReturnValue(chain);
  chain.insert.mockReturnValue(chain);
  chain.upsert.mockReturnValue(chain);
  return chain;
}

function mockFrom<T>(data: T, error: unknown = null) {
  const chain = mockChain(data, error);
  return {
    select: vi.fn().mockReturnValue(chain),
    insert: vi.fn().mockReturnValue(chain),
    upsert: vi.fn().mockReturnValue(chain),
  };
}

const baseAttempt: QuestionAttempt = {
  id: '',
  student_id: 'student-1',
  question_id: 'q-1',
  game_id: null,
  chosen_index: 0,
  is_correct: true,
  wrong_in_row: 0,
  time_spent_ms: 1000,
  created_at: '2025-01-01T00:00:00Z',
};

const mockProgress: Progress = {
  student_id: 'student-1',
  total_attempts: 10,
  total_correct: 7,
  accuracy: 0.7,
  current_streak: 3,
  best_streak: 5,
  topic_stats: {
    articles: { attempts: 5, correct: 4, last_seen: '2025-06-01T00:00:00Z' },
  },
  weak_topics: [],
  strong_topics: ['articles'],
  updated_at: '2025-06-01T00:00:00Z',
};

interface MockAttempt extends QuestionAttempt {
  questions?: { topic: string };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('recordAttempt', () => {
  it('inserts a question attempt and returns it', async () => {
    const insertedAttempt: QuestionAttempt = {
      ...baseAttempt,
      id: 'attempt-1',
      is_correct: true,
      wrong_in_row: 0,
    };

    (supabase.from as unknown as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce(mockFrom(insertedAttempt))
      .mockReturnValueOnce(mockFrom([]))
      .mockReturnValueOnce(mockFrom(null));

    const result = await recordAttempt(
      'student-1', 'q-1', undefined, 0, true, 1000,
    );

    expect(result).toEqual(insertedAttempt);
    expect(supabase.from).toHaveBeenCalledWith('question_attempts');
  });

  it('increments wrong_in_row for incorrect answers', async () => {
    const lastAttempt = { wrong_in_row: 1 };

    const insertedAttempt: QuestionAttempt = {
      ...baseAttempt,
      id: 'attempt-2',
      is_correct: false,
      wrong_in_row: 2,
    };

    (supabase.from as unknown as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce(mockFrom(lastAttempt))
      .mockReturnValueOnce(mockFrom(insertedAttempt))
      .mockReturnValueOnce(mockFrom([]))
      .mockReturnValueOnce(mockFrom(null));

    const result = await recordAttempt(
      'student-1', 'q-1', undefined, 1, false, 2000,
    );

    expect(result.wrong_in_row).toBe(2);
  });

  it('resets wrong_in_row to 0 on correct answer', async () => {
    const insertedAttempt: QuestionAttempt = {
      ...baseAttempt,
      id: 'attempt-3',
      is_correct: true,
      wrong_in_row: 0,
    };

    (supabase.from as unknown as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce(mockFrom(insertedAttempt))
      .mockReturnValueOnce(mockFrom([]))
      .mockReturnValueOnce(mockFrom(null));

    const result = await recordAttempt(
      'student-1', 'q-1', undefined, 2, true, 500,
    );

    expect(result.wrong_in_row).toBe(0);
  });

  it('caps wrong_in_row at 2', async () => {
    const lastAttempt = { wrong_in_row: 2 };

    const insertedAttempt: QuestionAttempt = {
      ...baseAttempt,
      id: 'attempt-4',
      is_correct: false,
      wrong_in_row: 2,
    };

    (supabase.from as unknown as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce(mockFrom(lastAttempt))
      .mockReturnValueOnce(mockFrom(insertedAttempt))
      .mockReturnValueOnce(mockFrom([]))
      .mockReturnValueOnce(mockFrom(null));

    const result = await recordAttempt(
      'student-1', 'q-1', undefined, 1, false, 2000,
    );

    expect(result.wrong_in_row).toBe(2);
  });

  it('calls updateProgressStats after insert', async () => {
    const insertedAttempt: QuestionAttempt = {
      ...baseAttempt,
      id: 'attempt-5',
      is_correct: true,
      wrong_in_row: 0,
    };

    (supabase.from as unknown as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce(mockFrom(insertedAttempt))
      .mockReturnValueOnce(mockFrom([]))
      .mockReturnValueOnce(mockFrom(null));

    await recordAttempt('student-1', 'q-1');

    expect(supabase.from).toHaveBeenCalledTimes(3);
    expect(supabase.from).toHaveBeenNthCalledWith(1, 'question_attempts');
    expect(supabase.from).toHaveBeenNthCalledWith(2, 'question_attempts');
    expect(supabase.from).toHaveBeenNthCalledWith(3, 'progress');
  });
});

describe('getProgress', () => {
  it('returns progress for a student', async () => {
    (supabase.from as unknown as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce(mockFrom(mockProgress));

    const result = await getProgress('student-1');

    expect(result).toEqual(mockProgress);
  });

  it('throws when progress is not found', async () => {
    (supabase.from as unknown as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce(mockFrom(null));

    await expect(getProgress('nonexistent')).rejects.toThrow('Progress not found');
  });
});

describe('getClassProgress', () => {
  it('returns progress for all students of a teacher', async () => {
    const mockStudents = [{ id: 's1' }, { id: 's2' }];
    const mockProgressList: Progress[] = [
      { ...mockProgress, student_id: 's1' },
      { ...mockProgress, student_id: 's2', total_attempts: 5 },
    ];

    (supabase.from as unknown as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce(mockFrom(mockStudents))
      .mockReturnValueOnce(mockFrom(mockProgressList));

    const result = await getClassProgress('teacher-1');

    expect(result).toHaveLength(2);
    expect(result[0].student_id).toBe('s1');
    expect(result[1].student_id).toBe('s2');
  });

  it('returns empty array when teacher has no students', async () => {
    (supabase.from as unknown as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce(mockFrom([]));

    const result = await getClassProgress('teacher-empty');

    expect(result).toEqual([]);
  });
});

describe('updateProgressStats', () => {
  function captureUpsertData() {
    const fromResults = (supabase.from as ReturnType<typeof vi.fn>).mock
      .results as { value: ReturnType<typeof mockFrom> }[];
    const upsertBuilder = fromResults[1].value;
    return (upsertBuilder.upsert as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as Record<string, unknown>;
  }

  it('calculates streaks correctly', async () => {
    const attempts: MockAttempt[] = [
      { ...baseAttempt, id: 'a1', is_correct: true, wrong_in_row: 0, questions: { topic: 'articles' }, created_at: '2025-01-01T00:00:00Z' },
      { ...baseAttempt, id: 'a2', is_correct: true, wrong_in_row: 0, questions: { topic: 'articles' }, created_at: '2025-01-02T00:00:00Z' },
      { ...baseAttempt, id: 'a3', is_correct: false, wrong_in_row: 1, questions: { topic: 'tenses' }, created_at: '2025-01-03T00:00:00Z' },
      { ...baseAttempt, id: 'a4', is_correct: true, wrong_in_row: 0, questions: { topic: 'articles' }, created_at: '2025-01-04T00:00:00Z' },
      { ...baseAttempt, id: 'a5', is_correct: true, wrong_in_row: 0, questions: { topic: 'tenses' }, created_at: '2025-01-05T00:00:00Z' },
      { ...baseAttempt, id: 'a6', is_correct: true, wrong_in_row: 0, questions: { topic: 'articles' }, created_at: '2025-01-06T00:00:00Z' },
    ];

    (supabase.from as unknown as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce(mockFrom(attempts))
      .mockReturnValueOnce(mockFrom(null));

    await updateProgressStats('student-1');

    const data = captureUpsertData();
    expect(data.current_streak).toBe(3);
    expect(data.best_streak).toBe(3);
    expect(data.total_attempts).toBe(6);
    expect(data.total_correct).toBe(5);
    expect(data.accuracy).toBeCloseTo(5 / 6);
  });

  it('resets streak to 0 on wrong answer', async () => {
    const attempts: MockAttempt[] = [
      { ...baseAttempt, id: 'a1', is_correct: true, questions: { topic: 'articles' }, created_at: '2025-01-01T00:00:00Z' },
      { ...baseAttempt, id: 'a2', is_correct: true, questions: { topic: 'articles' }, created_at: '2025-01-02T00:00:00Z' },
      { ...baseAttempt, id: 'a3', is_correct: false, questions: { topic: 'tenses' }, created_at: '2025-01-03T00:00:00Z' },
    ];

    (supabase.from as unknown as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce(mockFrom(attempts))
      .mockReturnValueOnce(mockFrom(null));

    await updateProgressStats('student-1');

    const data = captureUpsertData();
    expect(data.current_streak).toBe(0);
    expect(data.best_streak).toBe(2);
  });

  it('detects weak topics', async () => {
    const attempts: MockAttempt[] = [
      { ...baseAttempt, id: 'a1', is_correct: true, questions: { topic: 'articles' }, created_at: '2025-01-01T00:00:00Z' },
      { ...baseAttempt, id: 'a2', is_correct: false, questions: { topic: 'articles' }, created_at: '2025-01-02T00:00:00Z' },
      { ...baseAttempt, id: 'a3', is_correct: false, questions: { topic: 'articles' }, created_at: '2025-01-03T00:00:00Z' },
      { ...baseAttempt, id: 'a4', is_correct: true, questions: { topic: 'tenses' }, created_at: '2025-01-04T00:00:00Z' },
      { ...baseAttempt, id: 'a5', is_correct: true, questions: { topic: 'tenses' }, created_at: '2025-01-05T00:00:00Z' },
      { ...baseAttempt, id: 'a6', is_correct: true, questions: { topic: 'tenses' }, created_at: '2025-01-06T00:00:00Z' },
      { ...baseAttempt, id: 'a7', is_correct: false, questions: { topic: 'tenses' }, created_at: '2025-01-07T00:00:00Z' },
      { ...baseAttempt, id: 'a8', is_correct: true, questions: { topic: 'tenses' }, created_at: '2025-01-08T00:00:00Z' },
      { ...baseAttempt, id: 'a9', is_correct: true, questions: { topic: 'prepositions' }, created_at: '2025-01-09T00:00:00Z' },
      { ...baseAttempt, id: 'a10', is_correct: true, questions: { topic: 'prepositions' }, created_at: '2025-01-10T00:00:00Z' },
    ];

    (supabase.from as unknown as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce(mockFrom(attempts))
      .mockReturnValueOnce(mockFrom(null));

    await updateProgressStats('student-1');

    const data = captureUpsertData();
    expect(data.weak_topics).toContain('articles');
    expect(data.weak_topics).not.toContain('tenses');
    expect(data.weak_topics).not.toContain('prepositions');
  });

  it('detects strong topics', async () => {
    const attempts: MockAttempt[] = [
      { ...baseAttempt, id: 'a1', is_correct: true, questions: { topic: 'tenses' }, created_at: '2025-01-01T00:00:00Z' },
      { ...baseAttempt, id: 'a2', is_correct: true, questions: { topic: 'tenses' }, created_at: '2025-01-02T00:00:00Z' },
      { ...baseAttempt, id: 'a3', is_correct: true, questions: { topic: 'tenses' }, created_at: '2025-01-03T00:00:00Z' },
      { ...baseAttempt, id: 'a4', is_correct: true, questions: { topic: 'tenses' }, created_at: '2025-01-04T00:00:00Z' },
      { ...baseAttempt, id: 'a5', is_correct: true, questions: { topic: 'tenses' }, created_at: '2025-01-05T00:00:00Z' },
      { ...baseAttempt, id: 'a6', is_correct: true, questions: { topic: 'articles' }, created_at: '2025-01-06T00:00:00Z' },
      { ...baseAttempt, id: 'a7', is_correct: false, questions: { topic: 'articles' }, created_at: '2025-01-07T00:00:00Z' },
      { ...baseAttempt, id: 'a8', is_correct: true, questions: { topic: 'articles' }, created_at: '2025-01-08T00:00:00Z' },
      { ...baseAttempt, id: 'a9', is_correct: false, questions: { topic: 'articles' }, created_at: '2025-01-09T00:00:00Z' },
      { ...baseAttempt, id: 'a10', is_correct: true, questions: { topic: 'articles' }, created_at: '2025-01-10T00:00:00Z' },
      { ...baseAttempt, id: 'a11', is_correct: true, questions: { topic: 'prepositions' }, created_at: '2025-01-11T00:00:00Z' },
      { ...baseAttempt, id: 'a12', is_correct: true, questions: { topic: 'prepositions' }, created_at: '2025-01-12T00:00:00Z' },
      { ...baseAttempt, id: 'a13', is_correct: true, questions: { topic: 'prepositions' }, created_at: '2025-01-13T00:00:00Z' },
      { ...baseAttempt, id: 'a14', is_correct: true, questions: { topic: 'prepositions' }, created_at: '2025-01-14T00:00:00Z' },
    ];

    (supabase.from as unknown as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce(mockFrom(attempts))
      .mockReturnValueOnce(mockFrom(null));

    await updateProgressStats('student-1');

    const data = captureUpsertData();
    expect(data.strong_topics).toContain('tenses');
    expect(data.strong_topics).not.toContain('articles');
    expect(data.strong_topics).not.toContain('prepositions');
  });

  it('resets progress to zero when no attempts exist', async () => {
    (supabase.from as unknown as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce(mockFrom([]))
      .mockReturnValueOnce(mockFrom(null));

    await updateProgressStats('student-1');

    const data = captureUpsertData();
    expect(data.total_attempts).toBe(0);
    expect(data.total_correct).toBe(0);
    expect(data.accuracy).toBe(0);
    expect(data.current_streak).toBe(0);
    expect(data.best_streak).toBe(0);
    expect(data.weak_topics).toEqual([]);
    expect(data.strong_topics).toEqual([]);
  });
});
