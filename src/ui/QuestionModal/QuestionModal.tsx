import styles from './QuestionModal.module.css';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  topic: string;
  level: 'easy' | 'medium' | 'hard';
}

interface QuestionModalProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  playerId: string;
}

export function QuestionModal({ question, onAnswer, playerId }: QuestionModalProps) {
  const handleOptionClick = (index: number) => {
    onAnswer(index === question.correctIndex);
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Grammar question">
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.playerTag}>{playerId}</span>
          <span className={styles.topicBadge}>{question.topic}</span>
          <span className={`${styles.levelBadge} ${styles[question.level]}`}>
            {question.level}
          </span>
        </div>

        <h2 className={styles.question}>{question.question}</h2>

        <div className={styles.options}>
          {question.options.map((option, index) => (
            <button
              key={index}
              className={styles.optionButton}
              onClick={() => handleOptionClick(index)}
              aria-label={`Option ${index + 1}: ${option}`}
            >
              <span className={styles.optionLetter}>
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
