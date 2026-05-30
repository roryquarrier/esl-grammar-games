import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../lib/supabase';
import {
  getRandomQuestion,
  getQuestionsByTopic,
  getQuestionsByLevel,
} from './questionService';
import { QUESTION_BANK } from './questionBank';

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

function makeQuery(data: unknown[] | null, error: unknown = null) {
  const query = {
    eq: vi.fn(),
    then: (resolve: (value: { data: unknown[] | null; error: unknown }) => void) =>
      resolve({ data, error }),
  };
  query.eq.mockReturnValue(query);
  return query;
}

const mockDbQuestion = {
  id: 'test-001',
  seed_id: null,
  book_level: 'red',
  topic: 'articles',
  subtopic: null,
  stem: 'Which article is correct: "_____ honest man"?',
  options: ['a', 'an', 'the', 'no article'],
  correct_index: 1,
  explanation: 'Use "an" before vowel sounds',
  difficulty: 1,
  source: 'seed',
  validated: true,
  validation_notes: null,
  hk_culture_ref: false,
  usage_count: 10,
  accuracy: 0.85,
  created_at: '2025-01-01T00:00:00Z',
  published_at: null,
  deleted_at: null,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('questionService', () => {
  describe('getRandomQuestion', () => {
    it('returns a valid Question from Supabase', async () => {
      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue(makeQuery([mockDbQuestion], null)),
      });

      const question = await getRandomQuestion();

      expect(question).toMatchObject({
        id: 'test-001',
        question: 'Which article is correct: "_____ honest man"?',
        correctIndex: 1,
        topic: 'articles',
        level: 'easy',
      });
      expect(question.options).toHaveLength(4);
    });

    it('filters by bookLevel in Supabase query', async () => {
      const query = makeQuery([mockDbQuestion], null);
      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue(query),
      });

      await getRandomQuestion('red');

      expect(query.eq).toHaveBeenCalledWith('book_level', 'red');
    });

    it('filters by topic in Supabase query', async () => {
      const query = makeQuery([mockDbQuestion], null);
      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue(query),
      });

      await getRandomQuestion(undefined, 'articles');

      expect(query.eq).toHaveBeenCalledWith('topic', 'articles');
    });

    it('filters by both bookLevel and topic', async () => {
      const query = makeQuery([mockDbQuestion], null);
      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue(query),
      });

      await getRandomQuestion('red', 'articles');

      expect(query.eq).toHaveBeenCalledWith('book_level', 'red');
      expect(query.eq).toHaveBeenCalledWith('topic', 'articles');
    });

    it('falls back to local bank when Supabase errors', async () => {
      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi
          .fn()
          .mockReturnValue(makeQuery(null, new Error('Network error'))),
      });

      const question = await getRandomQuestion();

      expect(question).toBeDefined();
      expect(question.id).toMatch(/^q\d{3}$/);
      expect(question.options).toHaveLength(4);
    });

    it('falls back to local bank when Supabase returns empty data', async () => {
      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue(makeQuery([], null)),
      });

      const question = await getRandomQuestion();

      expect(question).toBeDefined();
      expect(question.id).toMatch(/^q\d{3}$/);
    });
  });

  describe('DB column mapping', () => {
    it('maps stem to question', async () => {
      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue(makeQuery([mockDbQuestion], null)),
      });

      const q = await getRandomQuestion();
      expect(q.question).toBe(mockDbQuestion.stem);
    });

    it('maps correct_index to correctIndex', async () => {
      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue(makeQuery([mockDbQuestion], null)),
      });

      const q = await getRandomQuestion();
      expect(q.correctIndex).toBe(mockDbQuestion.correct_index);
    });

    it('maps difficulty 1-2 to level "easy"', async () => {
      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue(makeQuery([{ ...mockDbQuestion, difficulty: 2 }], null)),
      });

      const q = await getRandomQuestion();
      expect(q.level).toBe('easy');
    });

    it('maps difficulty 3 to level "medium"', async () => {
      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue(makeQuery([{ ...mockDbQuestion, difficulty: 3 }], null)),
      });

      const q = await getRandomQuestion();
      expect(q.level).toBe('medium');
    });

    it('maps difficulty 4-5 to level "hard"', async () => {
      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue(makeQuery([{ ...mockDbQuestion, difficulty: 4 }], null)),
      });

      const q = await getRandomQuestion();
      expect(q.level).toBe('hard');
    });
  });

  describe('getQuestionsByTopic', () => {
    it('returns questions filtered by topic from Supabase', async () => {
      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue(makeQuery([mockDbQuestion], null)),
      });

      const questions = await getQuestionsByTopic('articles');

      expect(questions).toHaveLength(1);
      expect(questions[0].topic).toBe('articles');
      expect(questions[0].question).toBe(mockDbQuestion.stem);
    });

    it('uses eq filter on topic', async () => {
      const query = makeQuery([mockDbQuestion], null);
      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue(query),
      });

      await getQuestionsByTopic('articles');

      expect(query.eq).toHaveBeenCalledWith('topic', 'articles');
    });

    it('falls back to local bank on error', async () => {
      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue(makeQuery(null, new Error('fail'))),
      });

      const questions = await getQuestionsByTopic('articles');

      expect(questions.length).toBeGreaterThan(0);
      questions.forEach((q) => expect(q.topic).toBe('articles'));
    });

    it('falls back to local bank when Supabase returns empty', async () => {
      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue(makeQuery([], null)),
      });

      const questions = await getQuestionsByTopic('nonexistent-topic');

      expect(questions.length).toBe(0);
    });
  });

  describe('getQuestionsByLevel', () => {
    it('returns questions from Supabase filtered by book_level', async () => {
      const query = makeQuery([mockDbQuestion], null);
      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue(query),
      });

      await getQuestionsByLevel('red');

      expect(query.eq).toHaveBeenCalledWith('book_level', 'red');
    });

    it('returns mapped questions from Supabase', async () => {
      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue(makeQuery([mockDbQuestion], null)),
      });

      const questions = await getQuestionsByLevel('red');

      expect(questions).toHaveLength(1);
      expect(questions[0].level).toBe('easy');
    });

    it('falls back to local bank on Supabase error', async () => {
      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue(makeQuery(null, new Error('fail'))),
      });

      const questions = await getQuestionsByLevel('red');

      expect(questions.length).toBeGreaterThan(0);
      questions.forEach((q) => expect(q.level).toBe('easy'));
    });
  });

  describe('QUESTION_BANK export', () => {
    it('QUESTION_BANK is exported as an array', () => {
      expect(Array.isArray(QUESTION_BANK)).toBe(true);
      expect(QUESTION_BANK.length).toBe(70);
    });

    it('each question in QUESTION_BANK has required fields', () => {
      QUESTION_BANK.forEach((q) => {
        expect(q.id).toBeDefined();
        expect(q.question).toBeDefined();
        expect(q.options).toHaveLength(4);
        expect(q.correctIndex).toBeDefined();
        expect(q.topic).toBeDefined();
        expect(q.level).toBeDefined();
      });
    });
  });
});
