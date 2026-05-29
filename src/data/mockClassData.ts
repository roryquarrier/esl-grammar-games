import type { ClassInfo } from '../types/teacher';

function daysAgo(days: number, hours = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

export const mockClassInfo: ClassInfo = {
  id: 'cls-001',
  name: 'P4A',
  classCode: 'GR33NS',
  students: [
    {
      id: 'stu-001',
      displayName: 'Sophie Wong',
      avatarKey: 'panda',
      bookLevel: 'green',
      lastSeen: daysAgo(0, 2),
      accuracy: 92,
      totalAttempts: 245,
      weakTopics: ['modals', 'prepositions', 'comparatives'],
      currentStreak: 7,
    },
    {
      id: 'stu-002',
      displayName: 'Marcus Chen',
      avatarKey: 'tiger',
      bookLevel: 'blue',
      lastSeen: daysAgo(0, 5),
      accuracy: 78,
      totalAttempts: 189,
      weakTopics: ['articles', 'past_simple', 'plural_nouns'],
      currentStreak: 3,
    },
    {
      id: 'stu-003',
      displayName: 'Aisha Patel',
      avatarKey: 'fox',
      bookLevel: 'green',
      lastSeen: daysAgo(1),
      accuracy: 85,
      totalAttempts: 210,
      weakTopics: ['prepositions', 'modals', 'future_will'],
      currentStreak: 5,
    },
    {
      id: 'stu-004',
      displayName: 'Oliver Lam',
      avatarKey: 'cat',
      bookLevel: 'red',
      lastSeen: daysAgo(3),
      accuracy: 45,
      totalAttempts: 67,
      weakTopics: ['past_simple', 'present_continuous', 'articles'],
      currentStreak: 0,
    },
    {
      id: 'stu-005',
      displayName: 'Mia Zhang',
      avatarKey: 'dog',
      bookLevel: 'blue',
      lastSeen: daysAgo(0, 1),
      accuracy: 71,
      totalAttempts: 156,
      weakTopics: ['comparatives', 'plural_nouns', 'prepositions'],
      currentStreak: 2,
    },
    {
      id: 'stu-006',
      displayName: 'Ethan Kwok',
      avatarKey: 'rabbit',
      bookLevel: 'red',
      lastSeen: daysAgo(6),
      accuracy: 52,
      totalAttempts: 98,
      weakTopics: ['articles', 'present_continuous', 'modals'],
      currentStreak: 0,
    },
    {
      id: 'stu-007',
      displayName: 'Lily Tam',
      avatarKey: 'bear',
      bookLevel: 'green',
      lastSeen: daysAgo(0, 8),
      accuracy: 88,
      totalAttempts: 230,
      weakTopics: ['future_will', 'comparatives', 'articles'],
      currentStreak: 4,
    },
    {
      id: 'stu-008',
      displayName: 'Jayden Ho',
      avatarKey: 'owl',
      bookLevel: 'blue',
      lastSeen: daysAgo(2),
      accuracy: 63,
      totalAttempts: 124,
      weakTopics: ['plural_nouns', 'past_simple', 'present_continuous'],
      currentStreak: 1,
    },
  ],
};
