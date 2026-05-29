export interface StudentSummary {
  id: string;
  displayName: string;
  avatarKey: string; // e.g. 'panda', 'tiger', 'fox'
  bookLevel: 'red' | 'blue' | 'green';
  lastSeen: string; // ISO timestamp
  accuracy: number; // 0-100, rolling 30-day
  totalAttempts: number;
  weakTopics: string[]; // top 3 weakest topic slugs, e.g. ['past_simple', 'articles', 'prepositions']
  currentStreak: number;
}

export interface ClassInfo {
  id: string;
  name: string; // e.g. "P4A"
  classCode: string; // 6-char join code
  students: StudentSummary[];
}
