import { describe, it, expect } from 'vitest';
import {
  getQuestionBankSize,
  getQuestionsByTopic,
  getQuestionsByLevel,
  getAllTopics,
  getQuestionById,
} from './questionBank';

describe('questionBank', () => {
  it('has 70 questions', () => {
    expect(getQuestionBankSize()).toBe(70);
  });

  it('every question has exactly 4 options', () => {
    const bank = Array.from({ length: getQuestionBankSize() }, (_, i) =>
      getQuestionById(`q${String(i + 1).padStart(3, '0')}`)!,
    );
    bank.forEach(q => expect(q.options).toHaveLength(4));
  });

  it('every question has a valid correctIndex (0-3)', () => {
    const bank = Array.from({ length: getQuestionBankSize() }, (_, i) =>
      getQuestionById(`q${String(i + 1).padStart(3, '0')}`)!,
    );
    bank.forEach(q => {
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
    });
  });

  it('every question has a unique id', () => {
    const ids = new Set<string>();
    const bank = Array.from({ length: getQuestionBankSize() }, (_, i) =>
      getQuestionById(`q${String(i + 1).padStart(3, '0')}`)!,
    );
    bank.forEach(q => ids.add(q.id));
    expect(ids.size).toBe(getQuestionBankSize());
  });

  it('getQuestionsByTopic returns correct results', () => {
    const pastTense = getQuestionsByTopic('past-tense');
    expect(pastTense.length).toBeGreaterThan(0);
    pastTense.forEach(q => expect(q.topic).toBe('past-tense'));
  });

  it('getQuestionsByLevel returns correct results', () => {
    const easy = getQuestionsByLevel('easy');
    expect(easy.length).toBeGreaterThan(0);
    easy.forEach(q => expect(q.level).toBe('easy'));
  });

  it('getAllTopics returns a non-empty list', () => {
    const topics = getAllTopics();
    expect(topics.length).toBeGreaterThan(5);
    expect(topics).toContain('past-tense');
    expect(topics).toContain('present-simple');
    expect(topics).toContain('plurals');
  });

  it('getQuestionById returns the correct question', () => {
    const q = getQuestionById('q001');
    expect(q).toBeDefined();
    expect(q!.topic).toBe('present-simple');
  });

  it('getQuestionById returns undefined for unknown ID', () => {
    expect(getQuestionById('nonexistent')).toBeUndefined();
  });
});
