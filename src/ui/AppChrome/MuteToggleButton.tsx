import styles from './MuteToggleButton.module.css';
import { MuteIcon } from '../MuteIcon/MuteIcon';

export function MuteToggleButton() {
  return (
    <button
      type="button"
      className={styles.button}
      aria-label="Toggle mute"
    >
      <MuteIcon />
    </button>
  );
}
