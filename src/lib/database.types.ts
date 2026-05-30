export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      teachers: {
        Row: Teacher;
        Insert: Omit<Teacher, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Teacher, 'id'>>;
      };
      students: {
        Row: Student;
        Insert: Omit<Student, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Student, 'id'>>;
      };
      questions: {
        Row: Question;
        Insert: Omit<Question, 'id' | 'created_at' | 'usage_count' | 'accuracy'>;
        Update: Partial<Omit<Question, 'id'>>;
      };
      question_attempts: {
        Row: QuestionAttempt;
        Insert: Omit<QuestionAttempt, 'id' | 'created_at'>;
        Update: Partial<Omit<QuestionAttempt, 'id'>>;
      };
      games: {
        Row: Game;
        Insert: Omit<Game, 'id' | 'started_at'>;
        Update: Partial<Omit<Game, 'id'>>;
      };
      game_moves: {
        Row: GameMove;
        Insert: Omit<GameMove, 'id' | 'created_at'>;
        Update: Partial<Omit<GameMove, 'id'>>;
      };
      progress: {
        Row: Progress;
        Insert: Omit<Progress, 'updated_at'>;
        Update: Partial<Omit<Progress, 'student_id'>>;
      };
    };
    Functions: Record<string, unknown>;
    Enums: Record<string, unknown>;
  };
}

// ─── Row Types ─────────────────────────────────────────────────────

export interface Teacher {
  id: string;
  email: string;
  display_name: string;
  timezone: string;
  tier: 'free' | 'pro';
  settings_json: Json | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Student {
  id: string;
  teacher_id: string;
  display_name: string;
  avatar_key: string;
  book_level: 'red' | 'blue' | 'green';
  pin_hash: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Question {
  id: string;
  seed_id: string | null;
  book_level: 'red' | 'blue' | 'green';
  topic: string;
  subtopic: string | null;
  stem: string;
  options: string[];
  correct_index: number;
  explanation: string | null;
  difficulty: number;
  source: 'seed' | 'llm_expansion' | 'llm_runtime';
  validated: boolean;
  validation_notes: Json | null;
  hk_culture_ref: boolean;
  usage_count: number;
  accuracy: number;
  created_at: string;
  published_at: string | null;
  deleted_at: string | null;
}

export interface QuestionAttempt {
  id: string;
  student_id: string;
  question_id: string;
  game_id: string | null;
  chosen_index: number | null;
  is_correct: boolean;
  wrong_in_row: number;
  time_spent_ms: number | null;
  created_at: string;
}

export interface Game {
  id: string;
  teacher_id: string;
  player1_id: string;
  player2_id: string | null;
  player2_is_ai: boolean;
  book_level: 'red' | 'blue' | 'green';
  mode: 'hotseat' | 'vs_ai' | 'online';
  board: number[][];
  current_turn: 1 | 2;
  winner: 0 | 1 | 2 | null;
  topic_filter: Json | null;
  started_at: string;
  ended_at: string | null;
}

export interface GameMove {
  id: string;
  game_id: string;
  player: 1 | 2;
  column_idx: number;
  row_idx: number;
  question_attempt_id: string;
  move_number: number;
  created_at: string;
}

export interface Progress {
  student_id: string;
  total_attempts: number;
  total_correct: number;
  accuracy: number;
  current_streak: number;
  best_streak: number;
  topic_stats: Record<string, { attempts: number; correct: number; last_seen: string }>;
  weak_topics: string[];
  strong_topics: string[];
  updated_at: string;
}
