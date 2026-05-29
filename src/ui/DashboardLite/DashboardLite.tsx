import type { ClassInfo } from '../../types/teacher';
import { mockClassInfo } from '../../data/mockClassData';
import { ClassCodeDisplay } from './ClassCodeDisplay';
import { StudentRow } from './StudentRow';
import styles from './DashboardLite.module.css';

interface DashboardLiteProps {
  classInfo?: ClassInfo;
}

export function DashboardLite({ classInfo = mockClassInfo }: DashboardLiteProps) {
  return (
    <main className={styles.dashboard} aria-label="Teacher dashboard">
      <header className={styles.header}>
        <h1 className={styles.title}>
          📚 Dashboard — {classInfo.name}
        </h1>
      </header>

      <ClassCodeDisplay code={classInfo.classCode} />

      <section aria-label="Student list" className={styles.studentList}>
        {classInfo.students.map((student) => (
          <StudentRow key={student.id} student={student} />
        ))}
      </section>

      <footer className={styles.retentionNotice}>
        <p>Student data is deleted 30 days after account closure.</p>
      </footer>
    </main>
  );
}
