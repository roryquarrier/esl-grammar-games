import styles from './AppChrome.module.css';
import { MuteToggleButton } from './MuteToggleButton';

export function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <h1 className={styles.title}>Grammar Connect 4</h1>
        <MuteToggleButton />
      </header>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
