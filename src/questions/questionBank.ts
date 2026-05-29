import type { Question } from '../ui/QuestionModal/QuestionModal';

// Demo question bank (will be replaced with a real system later)
const QUESTION_BANK: Question[] = [
  {
    id: 'q1',
    question: 'What is the past tense of "go"?',
    options: ['goed', 'went', 'going', 'gone'],
    correctIndex: 1,
    topic: 'past-tense',
    level: 'easy',
  },
  {
    id: 'q2',
    question: 'Fill in the blank: "She _____ to school every day."',
    options: ['go', 'goes', 'going', 'gone'],
    correctIndex: 1,
    topic: 'present-simple',
    level: 'easy',
  },
  {
    id: 'q3',
    question: 'Which is correct?',
    options: ["I am good at maths.", "I am good in maths.", "I am good on maths.", "I am good at mathses."],
    correctIndex: 0,
    topic: 'prepositions',
    level: 'medium',
  },
  {
    id: 'q4',
    question: 'What is the opposite of "early"?',
    options: ['soon', 'late', 'first', 'last'],
    correctIndex: 1,
    topic: 'antonyms',
    level: 'easy',
  },
  {
    id: 'q5',
    question: 'Choose the correct sentence:',
    options: ["He don't like it.", "He doesn't likes it.", "He doesn't like it.", "He not like it."],
    correctIndex: 2,
    topic: 'present-simple',
    level: 'easy',
  },
  {
    id: 'q6',
    question: 'Fill in the blank: "By the time she arrived, we _____ dinner."',
    options: ['have eaten', 'had eaten', 'has eaten', 'were eating'],
    correctIndex: 1,
    topic: 'past-perfect',
    level: 'hard',
  },
  {
    id: 'q7',
    question: 'What does "mutton" mean?',
    options: ['Lamb', 'Beef', 'Pork', 'Chicken'],
    correctIndex: 0,
    topic: 'vocabulary',
    level: 'medium',
  },
  {
    id: 'q8',
    question: 'Which article is correct: "_____ honest man"',
    options: ['a', 'an', 'the', 'no article'],
    correctIndex: 1,
    topic: 'articles',
    level: 'easy',
  },
  {
    id: 'q9',
    question: 'Choose the correct plural form of "child":',
    options: ['childs', 'childes', 'children', 'chields'],
    correctIndex: 2,
    topic: 'plurals',
    level: 'easy',
  },
  {
    id: 'q10',
    question: 'Fill in the blank: "If I _____ rich, I would travel the world."',
    options: ['am', 'was', 'were', 'be'],
    correctIndex: 2,
    topic: 'subjunctive',
    level: 'hard',
  },
];

export function getRandomQuestion(): Question {
  return QUESTION_BANK[Math.floor(Math.random() * QUESTION_BANK.length)];
}

export function getQuestionBankSize(): number {
  return QUESTION_BANK.length;
}
