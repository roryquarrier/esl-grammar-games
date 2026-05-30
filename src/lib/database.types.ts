export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      game_moves: {
        Row: {
          column_idx: number
          created_at: string
          game_id: string
          id: string
          move_number: number
          player: number
          question_attempt_id: string
          row_idx: number
        }
        Insert: {
          column_idx: number
          created_at?: string
          game_id: string
          id?: string
          move_number: number
          player: number
          question_attempt_id: string
          row_idx: number
        }
        Update: {
          column_idx?: number
          created_at?: string
          game_id?: string
          id?: string
          move_number?: number
          player?: number
          question_attempt_id?: string
          row_idx?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_moves_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_moves_question_attempt_id_fkey"
            columns: ["question_attempt_id"]
            isOneToOne: false
            referencedRelation: "question_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          board: Json
          book_level: string
          current_turn: number
          ended_at: string | null
          id: string
          mode: string
          player1_id: string
          player2_id: string | null
          player2_is_ai: boolean
          started_at: string
          teacher_id: string
          topic_filter: Json | null
          winner: number | null
        }
        Insert: {
          board: Json
          book_level: string
          current_turn: number
          ended_at?: string | null
          id?: string
          mode: string
          player1_id: string
          player2_id?: string | null
          player2_is_ai?: boolean
          started_at?: string
          teacher_id: string
          topic_filter?: Json | null
          winner?: number | null
        }
        Update: {
          board?: Json
          book_level?: string
          current_turn?: number
          ended_at?: string | null
          id?: string
          mode?: string
          player1_id?: string
          player2_id?: string | null
          player2_is_ai?: boolean
          started_at?: string
          teacher_id?: string
          topic_filter?: Json | null
          winner?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "games_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      progress: {
        Row: {
          accuracy: number
          best_streak: number
          current_streak: number
          strong_topics: string[]
          student_id: string
          topic_stats: Json
          total_attempts: number
          total_correct: number
          updated_at: string
          weak_topics: string[]
        }
        Insert: {
          accuracy?: number
          best_streak?: number
          current_streak?: number
          strong_topics?: string[]
          student_id: string
          topic_stats?: Json
          total_attempts?: number
          total_correct?: number
          updated_at?: string
          weak_topics?: string[]
        }
        Update: {
          accuracy?: number
          best_streak?: number
          current_streak?: number
          strong_topics?: string[]
          student_id?: string
          topic_stats?: Json
          total_attempts?: number
          total_correct?: number
          updated_at?: string
          weak_topics?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      question_attempts: {
        Row: {
          chosen_index: number | null
          created_at: string
          game_id: string | null
          id: string
          is_correct: boolean
          question_id: string
          student_id: string
          time_spent_ms: number | null
          wrong_in_row: number
        }
        Insert: {
          chosen_index?: number | null
          created_at?: string
          game_id?: string | null
          id?: string
          is_correct: boolean
          question_id: string
          student_id: string
          time_spent_ms?: number | null
          wrong_in_row?: number
        }
        Update: {
          chosen_index?: number | null
          created_at?: string
          game_id?: string | null
          id?: string
          is_correct?: boolean
          question_id?: string
          student_id?: string
          time_spent_ms?: number | null
          wrong_in_row?: number
        }
        Relationships: [
          {
            foreignKeyName: "question_attempts_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_attempts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          accuracy: number
          book_level: string
          correct_index: number
          created_at: string
          deleted_at: string | null
          difficulty: number
          explanation: string | null
          hk_culture_ref: boolean
          id: string
          options: Json
          published_at: string | null
          seed_id: string | null
          source: string
          stem: string
          subtopic: string | null
          topic: string
          usage_count: number
          validated: boolean
          validation_notes: Json | null
        }
        Insert: {
          accuracy?: number
          book_level: string
          correct_index: number
          created_at?: string
          deleted_at?: string | null
          difficulty: number
          explanation?: string | null
          hk_culture_ref?: boolean
          id?: string
          options: Json
          published_at?: string | null
          seed_id?: string | null
          source: string
          stem: string
          subtopic?: string | null
          topic: string
          usage_count?: number
          validated?: boolean
          validation_notes?: Json | null
        }
        Update: {
          accuracy?: number
          book_level?: string
          correct_index?: number
          created_at?: string
          deleted_at?: string | null
          difficulty?: number
          explanation?: string | null
          hk_culture_ref?: boolean
          id?: string
          options?: Json
          published_at?: string | null
          seed_id?: string | null
          source?: string
          stem?: string
          subtopic?: string | null
          topic?: string
          usage_count?: number
          validated?: boolean
          validation_notes?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_seed_id_fkey"
            columns: ["seed_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          avatar_key: string
          book_level: string
          created_at: string
          deleted_at: string | null
          display_name: string
          id: string
          pin_hash: string | null
          teacher_id: string
          updated_at: string
        }
        Insert: {
          avatar_key: string
          book_level: string
          created_at?: string
          deleted_at?: string | null
          display_name: string
          id?: string
          pin_hash?: string | null
          teacher_id: string
          updated_at?: string
        }
        Update: {
          avatar_key?: string
          book_level?: string
          created_at?: string
          deleted_at?: string | null
          display_name?: string
          id?: string
          pin_hash?: string | null
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          created_at: string
          deleted_at: string | null
          display_name: string
          email: string
          id: string
          settings_json: Json | null
          tier: string
          timezone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          display_name: string
          email: string
          id?: string
          settings_json?: Json | null
          tier?: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          display_name?: string
          email?: string
          id?: string
          settings_json?: Json | null
          tier?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ─── Convenience type aliases ──────────────────────────────────────
// These make imports cleaner — use these in service files.

export type Teacher = Database['public']['Tables']['teachers']['Row']
export type Student = Database['public']['Tables']['students']['Row']
export type DBQuestion = Database['public']['Tables']['questions']['Row']
export type QuestionAttempt = Database['public']['Tables']['question_attempts']['Row']
export type Game = Database['public']['Tables']['games']['Row']
export type GameMove = Database['public']['Tables']['game_moves']['Row']
export type Progress = Database['public']['Tables']['progress']['Row']
