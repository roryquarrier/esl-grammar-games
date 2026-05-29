import styles from './DashboardLite.module.css';

const AVATAR_EMOJI: Record<string, string> = {
  panda: '🐼',
  tiger: '🐯',
  fox: '🦊',
  cat: '🐱',
  dog: '🐶',
  rabbit: '🐰',
  bear: '🐻',
  owl: '🦉',
};

interface StudentRowProps {
  student: {
    displayName: string;
    avatarKey: string;
    bookLevel: 'red' | 'blue' | 'green';
    lastSeen: string;
    accuracy: number;
    totalAttempts: number;
    weakTopics: string[];
    currentStreak: number;
  };
}

const BOOK_LEVEL_COLORS: Record<string, string> = {
  red: '#e74c3c',
  blue: '#3498db',
  green: '#27ae60',
};

function formatTopicSlug(slug: string): string {
  return slug.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function relativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}

function accuracyColour(accuracy: number): string {
  if (accuracy >= 70) return '#27ae60';
  if (accuracy >= 50) return '#f5a623';
  return '#e74c3c';
}

function formatTopicForDisplay(slug: string): string {
  return slug.replace(/_/g, ' ');
}

export function StudentRow({ student }: StudentRowProps) {
  const emoji = AVATAR_EMOJI[student.avatarKey] ?? '👤';
  const levelColor = BOOK_LEVEL_COLORS[student.bookLevel] ?? '#999';
  const barColor = accuracyColour(student.accuracy);

  return (
    <article
      className={styles.studentRow}
      aria-label={`${student.displayName}: ${student.accuracy}% accuracy`}
    >
      <span className={styles.avatar} role="img" aria-label={student.avatarKey}>
        {emoji}
      </span>

      <span className={styles.displayName}>{student.displayName}</span>

      <span
        className={styles.bookLevel}
        style={{ backgroundColor: levelColor }}
      >
        {student.bookLevel}
      </span>

      <div className={styles.accuracyContainer}>
        <div
          className={styles.accuracyBar}
          role="progressbar"
          aria-valuenow={student.accuracy}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${student.displayName} accuracy: ${student.accuracy}%`}
        >
          <div
            className={styles.accuracyFill}
            style={{ width: `${student.accuracy}%`, backgroundColor: barColor }}
          />
        </div>
        <span className={styles.accuracyLabel}>{student.accuracy}%</span>
      </div>

      <div className={styles.weakTopics} aria-label="Weak topics">
        {student.weakTopics.map((topic) => (
          <span key={topic} className={styles.topicChip}>
            {formatTopicForDisplay(topic)}
          </span>
        ))}
      </div>

      <span className={styles.lastSeen}>{relativeTime(student.lastSeen)}</span>

      <span className={styles.streak} aria-label={`${student.currentStreak} day streak`}>
        {student.currentStreak > 0 ? `🔥 ${student.currentStreak}` : '—'}
      </span>
    </article>
  );
}

export { formatTopicSlug, relativeTime, accuracyColour };
