import { supabase } from '../lib/supabase';
import type { DBQuestion as DbQuestion } from '../lib/database.types';
import type { Question } from './types';
import { QUESTION_BANK } from './questionBank';

function difficultyToLevel(difficulty: number): Question['level'] {
  if (difficulty <= 2) return 'easy';
  if (difficulty === 3) return 'medium';
  return 'hard';
}

function mapDbQuestionToLocal(db: DbQuestion): Question {
  return {
    id: db.id,
    question: db.stem,
    options: db.options as unknown as string[],
    correctIndex: db.correct_index,
    topic: db.topic,
    level: difficultyToLevel(db.difficulty),
  };
}

function localFallbackRandom(bookLevel?: string, topic?: string): Question {
  let bank = QUESTION_BANK;

  if (bookLevel) {
    const levelMap: Record<string, Question['level']> = {
      red: 'easy',
      blue: 'medium',
      green: 'hard',
    };
    const localLevel = levelMap[bookLevel];
    if (localLevel) {
      bank = bank.filter(q => q.level === localLevel);
    }
  }

  if (topic) {
    bank = bank.filter(q => q.topic === topic);
  }

  if (bank.length === 0) {
    bank = QUESTION_BANK;
  }

  return bank[Math.floor(Math.random() * bank.length)];
}

export async function getRandomQuestion(
  bookLevel?: string,
  topic?: string,
): Promise<Question> {
  try {
    let query = supabase.from('questions').select('*');

    if (bookLevel) {
      query = query.eq('book_level', bookLevel);
    }
    if (topic) {
      query = query.eq('topic', topic);
    }

    const { data, error } = await query;

    if (error) throw error;

    if (data && data.length > 0) {
      const dbQuestion = data[Math.floor(Math.random() * data.length)];
      return mapDbQuestionToLocal(dbQuestion);
    }

    return localFallbackRandom(bookLevel, topic);
  } catch {
    return localFallbackRandom(bookLevel, topic);
  }
}

export async function getQuestionsByTopic(topic: string): Promise<Question[]> {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('topic', topic);

    if (error) throw error;

    if (data && data.length > 0) {
      return data.map(mapDbQuestionToLocal);
    }

    return QUESTION_BANK.filter(q => q.topic === topic);
  } catch {
    return QUESTION_BANK.filter(q => q.topic === topic);
  }
}

export async function getQuestionsByLevel(level: string): Promise<Question[]> {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('book_level', level);

    if (error) throw error;

    if (data && data.length > 0) {
      return data.map(mapDbQuestionToLocal);
    }

    const levelMap: Record<string, Question['level']> = {
      red: 'easy',
      blue: 'medium',
      green: 'hard',
    };
    const localLevel = levelMap[level];
    if (localLevel) {
      return QUESTION_BANK.filter(q => q.level === localLevel);
    }
    return QUESTION_BANK;
  } catch {
    const levelMap: Record<string, Question['level']> = {
      red: 'easy',
      blue: 'medium',
      green: 'hard',
    };
    const localLevel = levelMap[level];
    if (localLevel) {
      return QUESTION_BANK.filter(q => q.level === localLevel);
    }
    return QUESTION_BANK;
  }
}
