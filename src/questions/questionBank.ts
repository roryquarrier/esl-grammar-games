/**
 * Question Bank for ESL Grammar Games
 *
 * Questions are organized by topic and difficulty level.
 * Designed for HK ESL learners aged 5–11.
 *
 * Schema:
 *   id: string          — unique identifier (q001, q002, ...)
 *   question: string    — the prompt shown to the student
 *   options: string[4]  — exactly 4 answer choices
 *   correctIndex: number — 0-3 index of the correct answer
 *   topic: string       — grammar topic category
 *   level: 'easy' | 'medium' | 'hard' — difficulty tier
 *   bookLevel?: string  — Cambridge Grammar in Use level (optional)
 */

import type { Question } from '../ui/QuestionModal/QuestionModal';

// ─── Question Bank ──────────────────────────────────────────────────

const QUESTION_BANK: Question[] = [
  // ── Present Simple (easy) ─────────────────────────────────────────
  {
    id: 'q001',
    question: 'Fill in the blank: "She _____ to school every day."',
    options: ['go', 'goes', 'going', 'gone'],
    correctIndex: 1,
    topic: 'present-simple',
    level: 'easy',
  },
  {
    id: 'q002',
    question: 'Choose the correct sentence:',
    options: ["He don't like it.", "He doesn't likes it.", "He doesn't like it.", "He not like it."],
    correctIndex: 2,
    topic: 'present-simple',
    level: 'easy',
  },
  {
    id: 'q003',
    question: '"They _____ football every weekend."',
    options: ['plays', 'play', 'playing', 'is play'],
    correctIndex: 1,
    topic: 'present-simple',
    level: 'easy',
  },
  {
    id: 'q004',
    question: '"My mother _____ dinner at 6 o\'clock."',
    options: ['cook', 'cooks', 'cooking', 'is cook'],
    correctIndex: 1,
    topic: 'present-simple',
    level: 'easy',
  },
  {
    id: 'q005',
    question: 'Which is correct?',
    options: ["I doesn't like ice cream.", "I don't likes ice cream.", "I don't like ice cream.", "I not like ice cream."],
    correctIndex: 2,
    topic: 'present-simple',
    level: 'easy',
  },

  // ── Past Tense (easy) ─────────────────────────────────────────────
  {
    id: 'q006',
    question: 'What is the past tense of "go"?',
    options: ['goed', 'went', 'going', 'gone'],
    correctIndex: 1,
    topic: 'past-tense',
    level: 'easy',
  },
  {
    id: 'q007',
    question: 'What is the past tense of "eat"?',
    options: ['eated', 'eat', 'ate', 'eaten'],
    correctIndex: 2,
    topic: 'past-tense',
    level: 'easy',
  },
  {
    id: 'q008',
    question: '"Yesterday, I _____ a book."',
    options: ['read', 'reads', 'reading', 'readed'],
    correctIndex: 0,
    topic: 'past-tense',
    level: 'easy',
  },
  {
    id: 'q009',
    question: 'What is the past tense of "play"?',
    options: ['play', 'plays', 'played', 'playing'],
    correctIndex: 2,
    topic: 'past-tense',
    level: 'easy',
  },
  {
    id: 'q010',
    question: '"She _____ her homework last night."',
    options: ['finish', 'finishes', 'finished', 'finishing'],
    correctIndex: 2,
    topic: 'past-tense',
    level: 'easy',
  },
  {
    id: 'q011',
    question: 'What is the past tense of "see"?',
    options: ['seed', 'saw', 'seen', 'seeing'],
    correctIndex: 1,
    topic: 'past-tense',
    level: 'easy',
  },

  // ── Plurals (easy) ────────────────────────────────────────────────
  {
    id: 'q012',
    question: 'Choose the correct plural form of "child":',
    options: ['childs', 'childes', 'children', 'chields'],
    correctIndex: 2,
    topic: 'plurals',
    level: 'easy',
  },
  {
    id: 'q013',
    question: 'What is the plural of "box"?',
    options: ['boxs', 'boxes', 'boxies', 'boxen'],
    correctIndex: 1,
    topic: 'plurals',
    level: 'easy',
  },
  {
    id: 'q014',
    question: 'What is the plural of "baby"?',
    options: ['babys', 'babyes', 'babies', 'babyies'],
    correctIndex: 2,
    topic: 'plurals',
    level: 'easy',
  },
  {
    id: 'q015',
    question: 'What is the plural of "tooth"?',
    options: ['tooths', 'teeth', 'toothes', 'teeths'],
    correctIndex: 1,
    topic: 'plurals',
    level: 'easy',
  },
  {
    id: 'q016',
    question: 'What is the plural of "fish"?',
    options: ['fishs', 'fishes', 'fish', 'fishies'],
    correctIndex: 2,
    topic: 'plurals',
    level: 'easy',
  },

  // ── Articles (easy) ───────────────────────────────────────────────
  {
    id: 'q017',
    question: 'Which article is correct: "_____ honest man"?',
    options: ['a', 'an', 'the', 'no article'],
    correctIndex: 1,
    topic: 'articles',
    level: 'easy',
  },
  {
    id: 'q018',
    question: '"I saw _____ elephant at the zoo."',
    options: ['a', 'an', 'the', 'no article'],
    correctIndex: 1,
    topic: 'articles',
    level: 'easy',
  },
  {
    id: 'q019',
    question: '"_____ sun rises in the east."',
    options: ['A', 'An', 'The', 'No article'],
    correctIndex: 2,
    topic: 'articles',
    level: 'easy',
  },
  {
    id: 'q020',
    question: '"She is _____ university student."',
    options: ['a', 'an', 'the', 'no article'],
    correctIndex: 0,
    topic: 'articles',
    level: 'easy',
  },

  // ── Prepositions (easy–medium) ────────────────────────────────────
  {
    id: 'q021',
    question: 'Which is correct?',
    options: ["I am good at maths.", "I am good in maths.", "I am good on maths.", "I am good at mathses."],
    correctIndex: 0,
    topic: 'prepositions',
    level: 'medium',
  },
  {
    id: 'q022',
    question: '"The cat is _____ the table."',
    options: ['in', 'on', 'at', 'to'],
    correctIndex: 1,
    topic: 'prepositions',
    level: 'easy',
  },
  {
    id: 'q023',
    question: '"We arrived _____ the airport at 8am."',
    options: ['in', 'on', 'at', 'to'],
    correctIndex: 2,
    topic: 'prepositions',
    level: 'easy',
  },
  {
    id: 'q024',
    question: '"She walked _____ the park."',
    options: ['in', 'on', 'at', 'through'],
    correctIndex: 3,
    topic: 'prepositions',
    level: 'medium',
  },
  {
    id: 'q025',
    question: '"The book is _____ the bag."',
    options: ['on', 'at', 'in', 'by'],
    correctIndex: 2,
    topic: 'prepositions',
    level: 'easy',
  },

  // ── Antonyms / Vocabulary (easy) ──────────────────────────────────
  {
    id: 'q026',
    question: 'What is the opposite of "early"?',
    options: ['soon', 'late', 'first', 'last'],
    correctIndex: 1,
    topic: 'antonyms',
    level: 'easy',
  },
  {
    id: 'q027',
    question: 'What is the opposite of "happy"?',
    options: ['glad', 'angry', 'sad', 'tired'],
    correctIndex: 2,
    topic: 'antonyms',
    level: 'easy',
  },
  {
    id: 'q028',
    question: 'What is the opposite of "big"?',
    options: ['huge', 'small', 'tall', 'long'],
    correctIndex: 1,
    topic: 'antonyms',
    level: 'easy',
  },
  {
    id: 'q029',
    question: 'What is the opposite of "hot"?',
    options: ['warm', 'cool', 'cold', 'wet'],
    correctIndex: 2,
    topic: 'antonyms',
    level: 'easy',
  },
  {
    id: 'q030',
    question: 'What is the opposite of "fast"?',
    options: ['quick', 'slow', 'hard', 'soft'],
    correctIndex: 1,
    topic: 'antonyms',
    level: 'easy',
  },

  // ── Vocabulary (medium) ───────────────────────────────────────────
  {
    id: 'q031',
    question: 'What does "mutton" mean?',
    options: ['Lamb', 'Beef', 'Pork', 'Chicken'],
    correctIndex: 0,
    topic: 'vocabulary',
    level: 'medium',
  },
  {
    id: 'q032',
    question: 'What does "brave" mean?',
    options: ['Scared', 'Not afraid', 'Tired', 'Lazy'],
    correctIndex: 1,
    topic: 'vocabulary',
    level: 'medium',
  },
  {
    id: 'q033',
    question: 'Which word means "a place to borrow books"?',
    options: ['Museum', 'Library', 'Hospital', 'Station'],
    correctIndex: 1,
    topic: 'vocabulary',
    level: 'medium',
  },

  // ── Present Continuous (medium) ───────────────────────────────────
  {
    id: 'q034',
    question: '"Look! The baby _____ ."',
    options: ['cry', 'cries', 'is crying', 'cried'],
    correctIndex: 2,
    topic: 'present-continuous',
    level: 'medium',
  },
  {
    id: 'q035',
    question: '"They _____ football right now."',
    options: ['play', 'plays', 'are playing', 'played'],
    correctIndex: 2,
    topic: 'present-continuous',
    level: 'medium',
  },
  {
    id: 'q036',
    question: '"I _____ my homework at the moment."',
    options: ['do', 'does', 'am doing', 'did'],
    correctIndex: 2,
    topic: 'present-continuous',
    level: 'medium',
  },
  {
    id: 'q037',
    question: 'Which sentence is correct?',
    options: ["She is cook dinner.", "She is cooking dinner.", "She are cooking dinner.", "She cooking dinner."],
    correctIndex: 1,
    topic: 'present-continuous',
    level: 'medium',
  },

  // ── Comparatives & Superlatives (medium) ──────────────────────────
  {
    id: 'q038',
    question: '"An elephant is _____ than a mouse."',
    options: ['big', 'bigger', 'biggest', 'more big'],
    correctIndex: 1,
    topic: 'comparatives',
    level: 'medium',
  },
  {
    id: 'q039',
    question: '"She is the _____ girl in the class."',
    options: ['tall', 'taller', 'tallest', 'most tall'],
    correctIndex: 2,
    topic: 'comparatives',
    level: 'medium',
  },
  {
    id: 'q040',
    question: '"This book is _____ than that one."',
    options: ['interesting', 'more interesting', 'most interesting', 'interestinger'],
    correctIndex: 1,
    topic: 'comparatives',
    level: 'medium',
  },
  {
    id: 'q041',
    question: '"Today is _____ day of the year."',
    options: ['hot', 'hotter', 'hottest', 'the hottest'],
    correctIndex: 3,
    topic: 'comparatives',
    level: 'medium',
  },

  // ── Adverbs (medium) ──────────────────────────────────────────────
  {
    id: 'q042',
    question: '"She sings _____ ."',
    options: ['beautiful', 'beautifully', 'beauty', 'beautifull'],
    correctIndex: 1,
    topic: 'adverbs',
    level: 'medium',
  },
  {
    id: 'q043',
    question: '"He drives _____ ."',
    options: ['careful', 'carefully', 'care', 'caring'],
    correctIndex: 1,
    topic: 'adverbs',
    level: 'medium',
  },
  {
    id: 'q044',
    question: 'Which is correct?',
    options: ["I did good on the test.", "I did well on the test.", "I did nicely on the test.", "I did fine on the test."],
    correctIndex: 1,
    topic: 'adverbs',
    level: 'medium',
  },

  // ── Question Forms (medium) ───────────────────────────────────────
  {
    id: 'q045',
    question: '"_____ you like chocolate?"',
    options: ['Do', 'Does', 'Are', 'Is'],
    correctIndex: 0,
    topic: 'questions',
    level: 'medium',
  },
  {
    id: 'q046',
    question: '"_____ she go to school by bus?"',
    options: ['Do', 'Does', 'Is', 'Are'],
    correctIndex: 1,
    topic: 'questions',
    level: 'medium',
  },
  {
    id: 'q047',
    question: '"Where _____ you born?"',
    options: ['do', 'does', 'was', 'is'],
    correctIndex: 2,
    topic: 'questions',
    level: 'medium',
  },
  {
    id: 'q048',
    question: '"_____ is your favourite colour?"',
    options: ['Who', 'Where', 'What', 'When'],
    correctIndex: 2,
    topic: 'questions',
    level: 'easy',
  },

  // ── Modal Verbs (medium) ──────────────────────────────────────────
  {
    id: 'q049',
    question: '"You _____ wear a seatbelt in the car."',
    options: ['can', 'should', 'may', 'would'],
    correctIndex: 1,
    topic: 'modals',
    level: 'medium',
  },
  {
    id: 'q050',
    question: '"_____ I borrow your pen?"',
    options: ['Must', 'Should', 'May', 'Would'],
    correctIndex: 2,
    topic: 'modals',
    level: 'medium',
  },
  {
    id: 'q051',
    question: '"She _____ swim when she was five."',
    options: ['can', 'could', 'may', 'must'],
    correctIndex: 1,
    topic: 'modals',
    level: 'medium',
  },
  {
    id: 'q052',
    question: '"You _____ eat too much sugar."',
    options: ['shouldn\'t', 'couldn\'t', 'wouldn\'t', 'mustn\'t'],
    correctIndex: 0,
    topic: 'modals',
    level: 'medium',
  },

  // ── Past Continuous (medium–hard) ─────────────────────────────────
  {
    id: 'q053',
    question: '"I _____ TV when the phone rang."',
    options: ['watch', 'watched', 'was watching', 'am watching'],
    correctIndex: 2,
    topic: 'past-continuous',
    level: 'hard',
  },
  {
    id: 'q054',
    question: '"They _____ in the park when it started to rain."',
    options: ['walk', 'walked', 'were walking', 'are walking'],
    correctIndex: 2,
    topic: 'past-continuous',
    level: 'hard',
  },

  // ── Future Forms (medium–hard) ────────────────────────────────────
  {
    id: 'q055',
    question: '"I _____ visit my grandma tomorrow."',
    options: ['will', 'am', 'was', 'do'],
    correctIndex: 0,
    topic: 'future',
    level: 'medium',
  },
  {
    id: 'q056',
    question: '"She _____ going to travel next month."',
    options: ['is', 'are', 'was', 'will'],
    correctIndex: 0,
    topic: 'future',
    level: 'medium',
  },

  // ── Conditionals (hard) ───────────────────────────────────────────
  {
    id: 'q057',
    question: 'Fill in the blank: "If I _____ rich, I would travel the world."',
    options: ['am', 'was', 'were', 'be'],
    correctIndex: 2,
    topic: 'subjunctive',
    level: 'hard',
  },
  {
    id: 'q058',
    question: '"If it rains, I _____ stay at home."',
    options: ['will', 'would', 'can', 'am'],
    correctIndex: 0,
    topic: 'conditionals',
    level: 'hard',
  },
  {
    id: 'q059',
    question: '"If I _____ you, I would study harder."',
    options: ['am', 'was', 'were', 'be'],
    correctIndex: 2,
    topic: 'conditionals',
    level: 'hard',
  },

  // ── Past Perfect (hard) ───────────────────────────────────────────
  {
    id: 'q060',
    question: '"By the time she arrived, we _____ dinner."',
    options: ['have eaten', 'had eaten', 'has eaten', 'were eating'],
    correctIndex: 1,
    topic: 'past-perfect',
    level: 'hard',
  },
  {
    id: 'q061',
    question: '"He _____ already left when I called."',
    options: ['has', 'had', 'have', 'was'],
    correctIndex: 1,
    topic: 'past-perfect',
    level: 'hard',
  },

  // ── Passive Voice (hard) ──────────────────────────────────────────
  {
    id: 'q062',
    question: '"The cake _____ by my mother."',
    options: ['was made', 'is made', 'made', 'did make'],
    correctIndex: 0,
    topic: 'passive',
    level: 'hard',
  },
  {
    id: 'q063',
    question: '"English _____ in many countries."',
    options: ['speaks', 'is spoke', 'is spoken', 'was speak'],
    correctIndex: 2,
    topic: 'passive',
    level: 'hard',
  },
  {
    id: 'q064',
    question: '"The homework _____ by the students yesterday."',
    options: ['was finished', 'is finished', 'finished', 'did finish'],
    correctIndex: 0,
    topic: 'passive',
    level: 'hard',
  },

  // ── Conjunctions (medium) ─────────────────────────────────────────
  {
    id: 'q065',
    question: '"I was tired, _____ I went to bed early."',
    options: ['but', 'so', 'because', 'and'],
    correctIndex: 1,
    topic: 'conjunctions',
    level: 'medium',
  },
  {
    id: 'q066',
    question: '"She likes cats _____ she is allergic to them."',
    options: ['and', 'so', 'but', 'because'],
    correctIndex: 2,
    topic: 'conjunctions',
    level: 'medium',
  },
  {
    id: 'q067',
    question: '"I stayed at home _____ it was raining."',
    options: ['so', 'but', 'and', 'because'],
    correctIndex: 3,
    topic: 'conjunctions',
    level: 'medium',
  },

  // ── Pronouns (easy) ───────────────────────────────────────────────
  {
    id: 'q068',
    question: '"_____ is a good student." (talking about a boy)',
    options: ['She', 'He', 'It', 'They'],
    correctIndex: 1,
    topic: 'pronouns',
    level: 'easy',
  },
  {
    id: 'q069',
    question: '"The books are on the table. _____ are mine."',
    options: ['It', 'He', 'They', 'She'],
    correctIndex: 2,
    topic: 'pronouns',
    level: 'easy',
  },
  {
    id: 'q070',
    question: '"This is _____ book." (belonging to me)',
    options: ['I', 'me', 'my', 'mine'],
    correctIndex: 2,
    topic: 'pronouns',
    level: 'easy',
  },
];

// ─── API ────────────────────────────────────────────────────────────

export function getRandomQuestion(): Question {
  return QUESTION_BANK[Math.floor(Math.random() * QUESTION_BANK.length)];
}

export function getQuestionBankSize(): number {
  return QUESTION_BANK.length;
}

export function getQuestionsByTopic(topic: string): Question[] {
  return QUESTION_BANK.filter(q => q.topic === topic);
}

export function getQuestionsByLevel(level: Question['level']): Question[] {
  return QUESTION_BANK.filter(q => q.level === level);
}

export function getAllTopics(): string[] {
  return [...new Set(QUESTION_BANK.map(q => q.topic))];
}

export function getQuestionById(id: string): Question | undefined {
  return QUESTION_BANK.find(q => q.id === id);
}
