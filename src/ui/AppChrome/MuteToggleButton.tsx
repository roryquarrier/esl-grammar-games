import { useState, useEffect } from 'react';
import styles from './MuteToggleButton.module.css';

const STORAGE_KEY = 'esl-connect-4-muted';

function getStoredMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function setStoredMuted(value: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // localStorage unavailable (private browsing, tests, etc.)
  }
}

export function MuteToggleButton() {
  const [muted, setMuted] = useState(getStoredMuted);

  useEffect(() => {
    setStoredMuted(muted);
  }, [muted]);

  const handleClick = () => {
    setMuted(prev => !prev);
  };

  return (
    <button
      type="button"
      className={styles.button}
      aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
      aria-pressed={muted}
      onClick={handleClick}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        {muted ? (
          <path d="M9.383 3.076C9.446 3.023 9.526 3 9.617 3H12V17H9.617C9.526 17 9.446 16.977 9.383 16.924L5.124 13H2.5C2.224 13 2 12.776 2 12.5V7.5C2 7.224 2.224 7 2.5 7H5.124L9.383 3.076ZM14.293 7.293C14.48 7.105 14.786 7.105 14.973 7.293C15.16 7.48 15.16 7.786 14.973 7.973L13.946 9L14.973 10.027C15.16 10.214 15.16 10.52 14.973 10.707C14.786 10.894 14.48 10.894 14.293 10.707L13.266 9.68L12.239 10.707C12.052 10.894 11.746 10.894 11.559 10.707C11.372 10.52 11.372 10.214 11.559 10.027L12.586 9L11.559 7.973C11.372 7.786 11.372 7.48 11.559 7.293C11.746 7.105 12.052 7.105 12.239 7.293L13.266 8.32L14.293 7.293Z" />
        ) : (
          <>
            <path d="M9.383 3.076C9.446 3.023 9.526 3 9.617 3H12V17H9.617C9.526 17 9.446 16.977 9.383 16.924L5.124 13H2.5C2.224 13 2 12.776 2 12.5V7.5C2 7.224 2.224 7 2.5 7H5.124L9.383 3.076Z" />
            <path d="M14.5 10C14.5 8.619 13.619 7.5 12.5 7.5V12.5C13.619 12.5 14.5 11.381 14.5 10Z" />
          </>
        )}
      </svg>
    </button>
  );
}
