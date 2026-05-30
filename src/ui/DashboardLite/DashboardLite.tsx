import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getClassProgress } from '../../services/progressService';
import { supabase } from '../../lib/supabase';
import type { Progress } from '../../lib/database.types';
import type { StudentSummary } from '../../types/teacher';
import { StudentRow } from './StudentRow';
import styles from './DashboardLite.module.css';

export function DashboardLite() {
  const { user, isLoaded } = useUser();
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [teacherName, setTeacherName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [teacherResult, studentsResult] = await Promise.all([
          supabase
            .from('teachers')
            .select('display_name')
            .eq('id', user.id)
            .single(),
          supabase
            .from('students')
            .select('*')
            .eq('teacher_id', user.id),
        ]);

        if (teacherResult.error) throw teacherResult.error;
        if (studentsResult.error) throw studentsResult.error;

        setTeacherName(teacherResult.data?.display_name ?? '');

        const studentRows = studentsResult.data ?? [];
        if (studentRows.length === 0) {
          setStudents([]);
          return;
        }

        const progressRows = await getClassProgress(user.id);
        const progressByStudentId: Record<string, Progress> = {};
        for (const p of progressRows) {
          progressByStudentId[p.student_id] = p;
        }

        const merged: StudentSummary[] = studentRows.map((s) => {
          const progress = progressByStudentId[s.id];
          return {
            id: s.id,
            displayName: s.display_name,
            avatarKey: s.avatar_key,
            bookLevel: s.book_level as 'red' | 'blue' | 'green',
            lastSeen: progress?.updated_at ?? s.updated_at,
            accuracy: progress ? Math.round(progress.accuracy * 100) : 0,
            totalAttempts: progress?.total_attempts ?? 0,
            weakTopics: progress?.weak_topics ?? [],
            currentStreak: progress?.current_streak ?? 0,
          };
        });

        setStudents(merged);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isLoaded]);

  if (!isLoaded) {
    return (
      <main className={styles.dashboard} aria-label="Teacher dashboard">
        <p>Loading…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={styles.dashboard} aria-label="Teacher dashboard">
        <p>Sign in to view your dashboard.</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.dashboard} aria-label="Teacher dashboard">
        <p>{error}</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className={styles.dashboard} aria-label="Teacher dashboard">
        <p>Loading student data…</p>
      </main>
    );
  }

  return (
    <main className={styles.dashboard} aria-label="Teacher dashboard">
      <header className={styles.header}>
        <h1 className={styles.title}>
          📚 Dashboard{teacherName ? ` — ${teacherName}` : ''}
        </h1>
      </header>

      {students.length === 0 ? (
        <section aria-label="Student list" className={styles.studentList}>
          <p>No students yet. Add students in the teacher dashboard.</p>
        </section>
      ) : (
        <section aria-label="Student list" className={styles.studentList}>
          {students.map((student) => (
            <StudentRow key={student.id} student={student} />
          ))}
        </section>
      )}

      <footer className={styles.retentionNotice}>
        <p>Student data is deleted 30 days after account closure.</p>
      </footer>
    </main>
  );
}
