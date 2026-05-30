import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../../lib/supabase';
import type { Student } from '../../lib/database.types';
import styles from './ClassStudents.module.css';

const AVATAR_OPTIONS = ['panda', 'cat', 'dog', 'rabbit', 'fox', 'bear'] as const;
const BOOK_LEVEL_OPTIONS = ['red', 'blue', 'green'] as const;

const AVATAR_EMOJI: Record<string, string> = {
  panda: '🐼',
  cat: '🐱',
  dog: '🐶',
  rabbit: '🐰',
  fox: '🦊',
  bear: '🐻',
};

export function ClassStudents() {
  const { user } = useUser();
  const [students, setStudents] = useState<Student[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [avatarKey, setAvatarKey] = useState<string>('panda');
  const [bookLevel, setBookLevel] = useState<string>('green');
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const loadStudents = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('teacher_id', user.id);

    if (error) {
      console.error('Failed to load students', error);
      return;
    }
    setStudents(data ?? []);
  };

  useEffect(() => {
    loadStudents();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !displayName.trim()) return;

    setAdding(true);
    setMessage(null);

    const { error: insertError } = await supabase.from('students').insert({
      teacher_id: user.id,
      display_name: displayName.trim(),
      avatar_key: avatarKey,
      book_level: bookLevel,
    });

    setAdding(false);

    if (insertError) {
      setMessage({
        type: 'error',
        text: `Failed to add student: ${insertError.message}`,
      });
      return;
    }

    setMessage({ type: 'success', text: `${displayName.trim()} added!` });
    setDisplayName('');
    setAvatarKey('panda');
    setBookLevel('green');
    await loadStudents();
  };

  return (
    <section className={styles.container} aria-label="Class students">
      <h2 className={styles.heading}>Students</h2>

      {message && (
        <p
          className={
            message.type === 'success' ? styles.successMsg : styles.errorMsg
          }
        >
          {message.text}
        </p>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Name
          <input
            className={styles.input}
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Student name"
            required
          />
        </label>

        <label className={styles.label}>
          Avatar
          <select
            className={styles.select}
            value={avatarKey}
            onChange={(e) => setAvatarKey(e.target.value)}
          >
            {AVATAR_OPTIONS.map((key) => (
              <option key={key} value={key}>
                {AVATAR_EMOJI[key]} {key}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.label}>
          Book Level
          <select
            className={styles.select}
            value={bookLevel}
            onChange={(e) => setBookLevel(e.target.value)}
          >
            {BOOK_LEVEL_OPTIONS.map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <button
          className={styles.addButton}
          type="submit"
          disabled={adding || !displayName.trim()}
        >
          {adding ? 'Adding…' : 'Add Student'}
        </button>
      </form>

      {students.length > 0 && (
        <ul className={styles.list}>
          {students.map((s) => (
            <li key={s.id} className={styles.listItem}>
              <span className={styles.avatar}>
                {AVATAR_EMOJI[s.avatar_key] ?? '👤'}
              </span>
              <span className={styles.name}>{s.display_name}</span>
              <span className={styles.level}>{s.book_level}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
