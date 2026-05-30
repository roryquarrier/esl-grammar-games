/**
 * Question type — shared across data and UI layers.
 */

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  topic: string;
  level: 'easy' | 'medium' | 'hard';
}
