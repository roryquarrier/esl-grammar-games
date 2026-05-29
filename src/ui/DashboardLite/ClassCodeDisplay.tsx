import { useState } from 'react';
import styles from './DashboardLite.module.css';

interface ClassCodeDisplayProps {
  code: string;
}

export function ClassCodeDisplay({ code }: ClassCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may be unavailable in test environments
    }
  };

  return (
    <div className={styles.codeCard} aria-label="Class code">
      <span className={styles.codeLabel}>Class Code</span>
      <span className={styles.codeValue}>{code}</span>
      <button
        className={styles.copyButton}
        onClick={handleCopy}
        aria-label={copied ? 'Copied!' : `Copy class code ${code}`}
        type="button"
      >
        {copied ? '✓' : '📋'}
      </button>
    </div>
  );
}
