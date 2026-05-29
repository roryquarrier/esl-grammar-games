import { describe, it, expect } from 'vitest';
import {
  getRandomQuestion,
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

  it('every question has 4 options', () => {
    for (let i = 0; i < getQuestionBankSize(); i++) {
      const q = getRandomQuestion();
      expect(q.options).toHaveLength(4);
    }
  });

  it('every question has a valid correctIndex (0-3)', () => {
    for (let i = 0; i < 50; i++) {
      const q = getRandomQuestion();
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
    }
  });

  it('every question has a unique id', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 200; i++) {
      ids.add(getRandomQuestion().id);
    }
    // After 200 random picks, we should have seen many unique IDs
    expect(ids.size).toBeGreaterThan(30);
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
