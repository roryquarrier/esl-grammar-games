import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Student } from '../../lib/database.types';
import { StudentAvatar } from './StudentAvatar';
import styles from './StudentSelect.module.css';

interface StudentSelectProps {
  onSelect: (student: Student) => void;
}

export function StudentSelect({ onSelect }: StudentSelectProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .is('deleted_at', null);

      if (!cancelled) {
        if (error) {
          console.error('Failed to load students', error);
        } else {
          setStudents(data ?? []);
        }
        setLoading(false);
      }
    };

    load();

    return () => { cancelled = true; };
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Who are you?</h1>
        <p className={styles.subtitle}>Tap your avatar to sign in</p>

        {loading ? (
          <p className={styles.empty}>Loading...</p>
        ) : students.length === 0 ? (
          <p className={styles.empty}>Ask your teacher to add you!</p>
        ) : (
          <ul className={styles.grid}>
            {students.map((s) => (
              <li key={s.id}>
                <button
                  className={styles.card}
                  onClick={() => onSelect(s)}
                  aria-label={`Sign in as ${s.display_name}`}
                >
                  <span className={styles.avatar}>
                    <StudentAvatar
                      avatarKey={s.avatar_key}
                      displayName={s.display_name}
                    />
                  </span>
                  <span className={styles.name}>{s.display_name}</span>
                  <span className={styles.level}>{s.book_level}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
