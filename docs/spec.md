# ESL Grammar Games — Product Requirements Document

**Version**: 1.0
**Status**: Draft
**Last Updated**: 2026-05-29
**Author**: Foreman (Hermes Agent) drafting for review
**Single Source of Truth**: This document drives all build decisions.

---

## 1. Overview & Objectives

### What we're building

ESL Grammar Games is a web-based Connect 4 game in which every disc drop is gated by a grammar question. A player must answer a multiple-choice English grammar question correctly before being allowed to place a disc. The game targets ESL learners aged 5–11 in Hong Kong, used under teacher supervision in class or at home with parent oversight. The product lives at https://roryquarrier.github.io/esl-grammar-games/ and is deployed via GitHub Pages.

The core pedagogical insight: grammar practice is most effective in short, repeated, high-stakes bursts. By tying a grammar question to every game move, we convert a beloved leisure activity into dense, low-friction practice while keeping the *game* feeling like a game, not a drill.

### Target audience

- **Primary**: ESL learners aged 5–11 in Hong Kong, at CEFR A1–C2, studying via Cambridge's "Grammar in Use" trilogy.
- **Buyer/account holder**: The student's English teacher (one adult, one Clerk account) who onboards the student as a profile under their account.
- **Secondary observers**: Parents and administrators viewing aggregated progress.

### Success metrics

| Metric | Target | Why it matters |
|---|---|---|
| Session length | 10–20 min median | Long enough for 3–5 games, short enough for attention span |
| Games per session | 3–5 | Enough repetitions to reinforce grammar |
| Question accuracy (per student, rolling 30-day) | 65%–85% | Below 65% → too hard/frustrating. Above 85% → not stretching |
| Return within 7 days | 60% | Retention signal |
| Weak-topic improvement | +15 pp after 10 attempts | Proof the adaptive system works |
| Teacher on-board time | < 3 minutes to first class | Low friction drives adoption |
| Lighthouse Performance (Pages) | ≥ 90 | Must feel fast on iPads over school Wi-Fi |
| Zero grammar errors in shipped question bank | 100% | Trust is non-negotiable for a grammar product |

### Key constraints

- **Offline-tolerant**: Schools in HK have spotty Wi-Fi between classrooms. Game state must persist across brief disconnects.
- **Teacher-managed auth**: Students never create their own accounts. Only teachers authenticate with Clerk. Avoids COPPA and HK PDPO exposure.
- **Design system**: Must follow Material 3 Expressive + minimal retro — monochromatic green palette with amber player-2 discs. See design tokens.
- **Browser-only deployment**: No native app. Must run well on iPad Safari (primary), Chrome on desktop, Safari/Chrome on mobile.
- **Text-only questions**: No image references. LLM-generated questions must not depend on visual context.
- **Budget**: Question generation cost must stay under ~$10/month at 1000 DAU.

### Non-goals

- Real-time multiplayer in MVP (postponed to post-MVP).
- Native iOS/Android apps (web-first).
- A teacher-authored question marketplace.
- Speech-based interaction (voice recognition, text-to-speech of questions).
- Integration with school LMS systems (Google Classroom, etc.) in MVP.

---

## 2. User Personas

### P1: Ms. Chan — the Teacher

**Context**: 28-year-old Hong Kong primary school English teacher. Teaches three P3–P5 classes of 30 students each. Uses a school-issued iPad and her own MacBook. Has 45-minute lesson slots and wants grammar practice to feel like a reward, not a punishment. She is not technically sophisticated but is comfortable with Google Classroom and basic web forms.

**Goals**:
- Assign targeted grammar practice aligned to the Cambridge book each class is using.
- See a weekly summary of each student's progress without having to check manually.
- Identify weak students quickly so she can intervene.

**Pain points**:
- Existing homework platforms feel designed for native speakers and don't match the Cambridge "Grammar in Use" syllabus.
- Setting up class accounts on multiple platforms is a time sink.
- She cannot tell whether students actually learned anything from a homework assignment, only whether they completed it.

**Workflow**:
1. Signs up once with email + password (Clerk).
2. Creates a class ("P4A"), adds students by name + book level + optional avatar.
3. Shares a class code with students. On their iPad, student taps "Join class", enters the code, then taps their avatar to sign in.
4. During class: opens the game, selects a grammar topic or "mixed", picks a book level, starts a hotseat game with two students playing on one iPad.
5. After class: views a progress view per student (accuracy, weak topics, streaks) and sees per-class aggregates.

**Accessibility considerations**:
- High-contrast mode for low-vision students in class (rare but real).
- Readable at 200% zoom on a projected display.
- Keyboard navigable for teacher dashboard (she uses a MacBook).

---

### P2: Leo — the Student

**Context**: 8-year-old Hong Kong boy in P3. ESL at CEFR A2, working through the Red book. Attends class twice a week. Uses his mother's iPad (shared device, not his own). Gets bored quickly with explicit grammar drills but loves games.

**Goals**:
- Have fun and feel skilled at the game.
- Beat his classmates on the leaderboard.
- See himself visibly improving.

**Pain points**:
- Grammar homework feels like a punishment.
- He forgets his password for every platform he uses, so he needs a no-password sign-in.
- He gets frustrated and quits when stuck on the same question three times.

**Workflow**:
1. Opens the game on Mum's iPad.
2. Taps "Sign in", sees his class, taps his avatar (a pixel-art panda).
3. From the lobby: picks Red book, picks "AI opponent" (or hotseat if his friend is over), picks topic "Past simple" or "Mixed".
4. Plays 3–5 games. Each turn: sees a grammar question, answers it, gets to drop a disc or gets a retry.
5. After a game: sees a quick "You got 4/5 past-tense questions right!" card, plus his weak topic ("irregular past forms — you picked 'goed' twice. Remember: 'go' → 'went'").
6. Next session, the adaptive algorithm gives him extra practice on irregular past forms.

**Accessibility considerations**:
- Must be finger-tappable at 60px minimum (young kids have large fingers and poor motor control).
- Reading level of prompts must match his CEFR level, not the interface's complexity.
- Optional dyslexia-friendly font toggle for question text.
- Audio pronunciation of questions via text-to-speech (post-MVP; for now, teacher reads aloud if needed).

---

### P3: Leo's mother — the Observer

**Context**: 40-year-old working parent. Checks her son's progress once a week. Wants to see whether the product is worth paying for, and whether Leo is actually learning.

**Goals**:
- A single weekly email or push notification saying "Leo practised X topic, got Y% right, improved Z pp vs last week".
- A read-only dashboard view of Leo's progress when she visits.
- To be able to ask the teacher meaningful questions ("Is Leo struggling with something specific?").

**Pain points**:
- Can't tell what her son is doing on educational apps without sitting next to him.
- Doesn't understand CEFR levels or grammar topic names.

**Workflow**:
- Gets a weekly email with plain-English summary ("Leo practised the past tense 23 times this week. He's good at regular verbs like 'walked' and still practising irregular ones like 'went'.").
- Clicks link in email → lands on a read-only progress page for Leo (no sign-in required because it's a signed, expiring link generated by Clerk).

**Accessibility considerations**:
- The email and dashboard must be comprehensible to a non-native English speaker herself (simple language, no jargon).

---

## 3. Feature Scope (MVP vs Post-MVP)

| Feature | MVP? | Priority | Complexity | Dependencies | Status |
|---|---|---|---|---|---|
| Connect 4 board (7x6) with win detection | ✓ | P0 | Medium | — | To build |
| Grammar question modal gating each move | ✓ | P0 | Medium | Question system | To build |
| Teacher auth via Clerk (email/password) | ✓ | P0 | Low | Clerk account | To build |
| Teacher-managed student profiles (no auth) | ✓ | P0 | Low | Teacher auth | To build |
| Avatar sign-in for students (tap to enter) | ✓ | P0 | Low | Student profiles | To build |
| Hotseat mode (2 students, 1 device) | ✓ | P0 | Low | Board, question system | To build |
| AI opponent (MVP: deterministic heuristic) | ✓ | P0 | Medium | Board, question system | To build |
| Seed question bank (≥200 questions per book, hand-curated) | ✓ | P0 | High | Schema, admin tooling | To build |
| LLM expansion (10–20 variations per seed) | ✓ | P1 | High | Seed bank, validation pipeline | To build |
| Question validation pipeline (correctness, age-filter) | ✓ | P0 | High | LLM expansion | To build |
| Adaptive question selection (20/30/50 split) | ✓ | P1 | Medium | Wrong-answer tracking | To build |
| Wrong-answer + distractor tracking | ✓ | P1 | Low | Question attempts table | To build |
| Personal scoreboard (wins, accuracy, streaks, topic breakdown) | ✓ | P1 | Medium | Progress table | To build |
| Leaderboard per class (student names visible) | ✓ | P2 | Medium | Progress table, teacher auth | To build |
| Turn flow (question → retry/cooldown → disc drop) | ✓ | P0 | Medium | Board, question system | To build |
| 5s cooldown after 3 wrong answers, then reset | ✓ | P1 | Low | Turn flow | To build |
| Lobby (topic + book + opponent selection) | ✓ | P0 | Low | Teacher auth, student profiles | To build |
| Responsive layout (iPad landscape primary) | ✓ | P0 | Medium | CSS grid tokens | To build |
| Fullscreen mode (browser UI hidden) | ✓ | P2 | Low | Fullscreen API | To build |
| Mute toggle, localStorage-persisted | ✓ | P2 | Low | — | To build |
| Material 3 Expressive design + minimal retro palette | ✓ | P0 | High | Design tokens | To build |
| SVG + Framer Motion discs with spring physics | ✓ | P1 | Medium | Framer Motion, SVG | To build |
| Lottie animations for celebrations / special events | ✓ | P2 | Medium | lottie-web, assets | To build |
| "67" easter egg detection + surprise | ✓ | P2 | Low | General easter egg framework | To build |
| Teacher dashboard (class progress, per-student view) | ✗ | P0 | High | Progress data, Clerk | Post-MVP |
| Online multiplayer (Supabase Realtime) | ✗ | P0 | High | Supabase Realtime | Post-MVP |
| Question authoring UI for teachers | ✗ | P1 | High | Question bank admin | Post-MVP |
| Weekly email digest to parents | ✗ | P1 | Medium | Progress data, email service | Post-MVP |
| Additional game modes (Battleships, Snakes & Ladders) | ✗ | P2 | High | Modular engine | Post-MVP |
| TTS for questions | ✗ | P2 | Low | Browser SpeechSynthesis or Edge TTS | Post-MVP |
| Dyslexia-friendly font toggle | ✗ | P3 | Low | CSS variable | Post-MVP |

**MVP boundary principle**: everything a student needs to *play a game and learn grammar* is in MVP. Everything a teacher needs to *manage a class or author content* is post-MVP, except basic student onboarding which is required for the auth model to work.

---

## 4. Data Model (Supabase Schema)

### Tables

#### `teachers`

The Clerk-authenticated adult. One row per Clerk user.

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `id` | `uuid` PK | no | = Clerk `user_id`. Also auth.uid() for RLS. |
| `email` | `text` | no | From Clerk. Unique. |
| `display_name` | `text` | no | How students see them. |
| `timezone` | `text` | no | Default `'Asia/Hong_Kong'`. |
| `tier` | `text` | no | `'free' \| 'pro'`. Default `'free'`. |
| `settings_json` | `jsonb` | yes | Locale, default book, preferences. |
| `created_at` | `timestamptz` | no | Default `now()`. |
| `updated_at` | `timestamptz` | no | Trigger-maintained. |

**RLS**: `SELECT/UPDATE WHERE auth.uid() = id`.

**Indexes**: `teachers(email)` unique; `teachers(id)` PK.

---

#### `students`

Kid profile, teacher-managed. No Clerk account, no password, no email.

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `id` | `uuid` PK | no | |
| `teacher_id` | `uuid` FK → `teachers(id)` | no | Owner. |
| `display_name` | `text` | no | First name only, max 32 chars. |
| `avatar_key` | `text` | no | One of a fixed enum of bundled avatars (e.g. `'panda'`). |
| `book_level` | `text` | no | `'red' \| 'blue' \| 'green'`. |
| `pin_hash` | `text` | yes | Optional 4-digit PIN (SHA-256). |
| `created_at` | `timestamptz` | no | |
| `updated_at` | `timestamptz` | no | |
| `deleted_at` | `timestamptz` | yes | Soft delete. |

**RLS**: all `WHERE teacher_id = auth.uid()` (read, update, insert, delete). Students sign in via a signed JWT issued by the backend *after* the teacher's avatar tap; the JWT carries the student ID and lets them read/write their own progress and games. A separate `student_sessions` policy allows RLS by a `student_id` claim.

**Indexes**: `students(teacher_id)`; `students(display_name, teacher_id)` (class-wide name uniqueness).

---

#### `questions`

Grammar questions. Seed bank + LLM-expanded variants.

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `id` | `uuid` PK | no | |
| `seed_id` | `uuid` FK → `questions(id)` | yes | null if this row IS a seed. |
| `book_level` | `text` | no | `'red' \| 'blue' \| 'green'`. |
| `topic` | `text` | no | e.g. `'past_simple'`, `'articles'`. |
| `subtopic` | `text` | yes | Optional refinement. |
| `stem` | `text` | no | The question text (British English). |
| `options` | `jsonb` | no | Array of 3–4 option strings. |
| `correct_index` | `int` | no | 0-based index into `options`. |
| `explanation` | `text` | yes | Shown after a wrong answer. |
| `difficulty` | `int` | no | 1–5 scale. |
| `source` | `text` | no | `'seed' \| 'llm_expansion' \| 'llm_runtime'`. |
| `validated` | `boolean` | no | Has passed validation pipeline. Default false. |
| `validation_notes` | `jsonb` | yes | Validator output (confidence, issues). |
| `hk_culture_ref` | `boolean` | no | Default false. Tagged for adaptive mixing. |
| `usage_count` | `int` | no | How many times served. Default 0. |
| `accuracy` | `numeric` | no | Rolling accuracy across all attempts. |
| `created_at` | `timestamptz` | no | |
| `published_at` | `timestamptz` | yes | When it became visible to students. |

**RLS**: `SELECT WHERE validated = true AND published_at IS NOT NULL` (public for any authenticated teacher or student-session). Teacher-only `INSERT/UPDATE/DELETE WHERE ...` for curation post-MVP.

**Indexes**: `questions(book_level, topic, difficulty)` composite for adaptive selection; `questions(seed_id)` for variant lookups; `questions(validated, published_at)` for the published pool.

---

#### `question_attempts`

Every question shown to every student, answered or not.

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `id` | `uuid` PK | no | |
| `student_id` | `uuid` FK → `students(id)` | no | |
| `question_id` | `uuid` FK → `questions(id)` | no | |
| `game_id` | `uuid` FK → `games(id)` | yes | null if not in a game (standalone practice, post-MVP). |
| `chosen_index` | `int` | yes | null if timed-out or abandoned. |
| `is_correct` | `boolean` | no | |
| `wrong_in_row` | `int` | no | 0, 1, or 2 (resets on correct). |
| `time_spent_ms` | `int` | yes | Time from presentation to answer. |
| `created_at` | `timestamptz` | no | |

**RLS**: `INSERT/SELECT WHERE student_id = current_student()` (resolved from JWT).

**Indexes**: `question_attempts(student_id, created_at)`; `question_attempts(question_id)` for aggregate accuracy.

---

#### `games`

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `id` | `uuid` PK | no | |
| `teacher_id` | `uuid` FK → `teachers(id)` | no | For visibility in dashboard post-MVP. |
| `player1_id` | `uuid` FK → `students(id)` | no | |
| `player2_id` | `uuid` | yes | null for AI; `uuid` for hotseat 2nd student. |
| `player2_is_ai` | `boolean` | no | Default false. |
| `book_level` | `text` | no | Locked at game start. |
| `mode` | `text` | no | `'hotseat' \| 'vs_ai' \| 'online'` (last is post-MVP). |
| `board` | `int[][]` | no | 6x7 matrix. 0=empty, 1=p1, 2=p2. JSONB in practice. |
| `current_turn` | `int` | no | 1 or 2. |
| `winner` | `int` | yes | null=ongoing, 0=draw, 1=p1, 2=p2. |
| `topic_filter` | `jsonb` | yes | Optional topic restrictions for the game. |
| `started_at` | `timestamptz` | no | |
| `ended_at` | `timestamptz` | yes | |

**RLS**: `INSERT/SELECT/UPDATE WHERE teacher_id = auth.uid() OR player1_id = current_student() OR player2_id = current_student()`.

**Indexes**: `games(player1_id, ended_at DESC)`; `games(teacher_id, ended_at DESC)`.

---

#### `game_moves`

Every disc drop, linked to the question that gated it.

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `id` | `uuid` PK | no | |
| `game_id` | `uuid` FK → `games(id)` ON DELETE CASCADE | no | |
| `player` | `int` | no | 1 or 2. |
| `column_idx` | `int` | no | 0–6. |
| `row_idx` | `int` | no | Landing row, 0–5. |
| `question_attempt_id` | `uuid` FK → `question_attempts(id)` | no | |
| `move_number` | `int` | no | 1-based. |
| `created_at` | `timestamptz` | no | |

**RLS**: inherits from `games`.

**Indexes**: `game_moves(game_id, move_number)` unique.

---

#### `progress`

Materialised per-student stats, updated by a trigger on `question_attempts`.

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `student_id` | `uuid` PK FK → `students(id)` | no | |
| `total_attempts` | `int` | no | |
| `total_correct` | `int` | no | |
| `accuracy` | `numeric` | no | 0–1. |
| `current_streak` | `int` | no | Consecutive correct answers. |
| `best_streak` | `int` | no | |
| `topic_stats` | `jsonb` | no | `{ topic: { attempts, correct, last_seen } }`. |
| `weak_topics` | `text[]` | no | Top N by (attempts > 3 AND accuracy < 0.5). |
| `strong_topics` | `text[]` | no | Top N by accuracy ≥ 0.8 with ≥ 5 attempts. |
| `updated_at` | `timestamptz` | no | |

**RLS**: `SELECT WHERE student_id = current_student() OR student_id IN (SELECT id FROM students WHERE teacher_id = auth.uid())`. Teacher can see all their students; student only their own row.

**Indexes**: PK on `student_id`.

---

### Row-Level Security summary

- All teacher-owned resources: `WHERE teacher_id = auth.uid()`.
- All student-owned resources: `WHERE student_id = current_student()`, where `current_student()` reads from a JWT claim set by the teacher-initiated sign-in flow.
- Published questions (validated, visible): readable by anyone authenticated.
- Teachers cannot see other teachers' students, attempts, games, or progress.

### Migration strategy

Schema managed via `supabase/migrations/*.sql`. Each migration has a paired `rollback.sql`. Supabase CLI (`supabase db push`) is the single source of deployment truth.

---

## 5. Question System Design

### Architectural overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Seed Bank   │ ──▶ │  Expansion   │ ──▶ │  Validation  │
│  (authored,  │     │  (LLM batch) │     │  Pipeline    │
│   ~500/book) │     │              │     │              │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                                  ▼
                                   ┌────────────────────────────┐
                                   │  Published Question Pool   │
                                   │  (validated = true)        │
                                   └──────────────┬─────────────┘
                                                  │
                                                  ▼
┌──────────────────┐              ┌────────────────────────────┐
│  Question Serve  │ ◀────────────│  Adaptive Selection        │
│  with LRU Cache  │              │  (20 weak / 30 strong /    │
│                  │              │   50 mixed, per student)   │
└──────────────────┘              └────────────────────────────┘
```

### 5.1 The hybrid model

We reject pure-static (runs out, no adaptation) and pure-LLM-runtime (unpredictable, expensive, hallucination risk during a game). We use a hybrid:

- **Seed bank**: ~500 hand-curated questions per book. These are the quality anchor. Written by humans, reviewed by humans, validated forever.
- **LLM expansion**: For each seed, an LLM call generates 10–20 variations *at authoring time* (not runtime), with a hard requirement that the semantic intent, grammar topic, difficulty, and correct answer remain constant.
- **LLM runtime fallback**: Only used when the published pool is exhausted for a student's weak-topic bucket — typically on heavy usage days. Generated results are cached aggressively (48h TTL) and queued for human validation before being admitted to the permanent pool.

### 5.2 Question schema

Every question is a 4-option multiple-choice:

```json
{
  "stem": "Choose the correct sentence: 'Yesterday, I ___ to the MTR station.'",
  "options": ["goed", "went", "gone", "go"],
  "correct_index": 1,
  "explanation": "The past tense of 'go' is 'went'. 'Goed' is not a real English word.",
  "topic": "past_simple",
  "subtopic": "irregular_verbs",
  "difficulty": 3,
  "hk_culture_ref": true
}
```

Constraints:
- 3–4 options (4 preferred for Blue/Green, 3 acceptable for Red).
- Exactly one correct index.
- Distractors must be plausible errors (not joke options). For example, for verbs: regular overgeneralisation (`goed`), wrong tense (`gone`), base form (`go`).
- Stem ≤ 160 chars for A1–A2, ≤ 280 chars for B1+.
- No image references (text-only).
- British English spelling and vocabulary (`colour`, `lorry`, `pavement`).
- At least 20% of the bank per book tagged `hk_culture_ref = true`, referencing MTR, dim sum, typhoons, typhoon signals, tram, Star Ferry, Peak, dai pai dong, etc.

### 5.3 Grammar topics by book

**Red book (A1–B1, ages 5–7, beginner)**:
- present_simple, present_continuous
- articles (a/an/the)
- plural nouns (regular + common irregulars: children, teeth)
- personal_pronouns, possessive_adjectives
- there_is_there_are
- prepositions_of_place
- can_for_ability
- adjectives (comparative, superlative — basic)
- past_simple (regular)
- common irregular verbs (go/went, see/saw)

**Blue book (B1–B2, ages 8–9, intermediate)**:
- past_simple (irregular), past_continuous
- present_perfect (ever/never/already/yet)
- conditionals_0_and_1
- modal_verbs (must, should, have to)
- relative_clauses (who/which/that)
- comparatives_superlatives (full range)
- reported_speech_intro
- gerunds_vs_infinitives
- countable_uncountable_quantifiers

**Green book (C1–C2, ages 10–11, advanced)**:
- past_perfect, past_perfect_continuous
- conditionals_2_and_3, mixed_conditionals
- passive_voice (all tenses)
- subjunctive_mood
- advanced_modal_verbs
- noun_clauses, cleft_sentences
- phrasal_verbs (high-frequency)
- inversion_for_emphasis
- discourse_markers

### 5.4 Adaptive selection algorithm

Each request for a question, given `(student_id, book_level, topic_filter?)`:

1. Read the student's `progress.topic_stats` and `progress.weak_topics`/`progress.strong_topics`.
2. Roll a weighted bucket:
   - 20% chance → pick from `weak_topics` (topics with ≥3 attempts AND accuracy <50%)
   - 30% chance → pick from `strong_topics` (accuracy ≥80% with ≥5 attempts, to reinforce mastery)
   - 50% chance → pick from the mixed pool (any validated question at the book level, excluding recently-seen questions)
3. Apply topic filter if the game has one.
4. Exclude questions served in the last 5 attempts for this student (LRU cache of question IDs, kept client-side in Zustand, mirrored server-side in `question_attempts`).
5. Return the question with the lowest `usage_count` among candidates of the chosen bucket (to balance exposure).

### 5.5 Validation pipeline

Every LLM-generated or human-authored question goes through:

1. **Structural validator** (code):
   - Exactly 3–4 options, exactly one correct index.
   - Stem length within bounds.
   - No duplicate options.
   - No empty options.
   - British English spelling check (allowlist + GB dictionary).

2. **Grammar validator** (LLM call, independent of the generation LLM):
   - "Is this question grammatically correct?"
   - "Are all distractors implausible but not grammatically correct English for the target level, with exactly one correct option?"
   - "Is the explanation accurate and age-appropriate?"
   - Output: confidence 0–1, list of issues.
   - Rejected if confidence < 0.85 OR any "must-fix" issue.

3. **Cultural validator** (LLM call, HK-context-aware):
   - "Is this question appropriate for Hong Kong students aged X? Does it reference Hong Kong culture appropriately without stereotyping?"
   - Rejected if flagged inappropriate.

4. **Human review queue** (post-MVP):
   - Questions flagged low-confidence (<0.9 after LLM validators) go to a teacher review queue.
   - MVP: foreman (or designated reviewer) clears the queue manually.

Questions must clear ALL validators to set `validated = true` and be eligible for publication.

### 5.6 Caching strategy

**Client side**:
- Zustand store caches the last 20 fetched questions per student (LRU), with the `options` array shuffled client-side on retrieval to reduce predictability even if the same question ID reappears.
- Cache invalidated on book-level change.

**Server side**:
- Supabase materialised view or precomputed result set for `(book_level, topic)` slices.
- 5-minute TTL on the adaptive selector's candidate pool.
- Runtime-LLM-fallback results have a 48h TTL keyed on `(student_id, topic)` to avoid re-generation for the same student-topic pair in a heavy-usage day.

### 5.7 Turn-flow integration

```
Player's turn begins
       │
       ▼
┌──────────────────┐
│  Fetch question  │ (adaptive selector)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Present modal   │
│  wrong_in_row=0  │
└────────┬─────────┘
         │  student picks an option
         ▼
     ┌───┴────┐
    YES       NO (wrong)
     │         │
     ▼         ▼
  drop disc  wrong_in_row++
               │
               ├─ if wrong_in_row < 3 → fetch NEW question, present
               │
               └─ if wrong_in_row == 3 → 5s cooldown timer
                                          → reset wrong_in_row to 0
                                          → present fresh question
                                          (turn NEVER forfeited)
```

### 5.8 Tracking wrong answers & distractors

On every `question_attempt` we record:

- `question_id`
- `chosen_index` (the wrong option they picked)
- `is_correct`
- `wrong_in_row` at time of attempt
- `time_spent_ms`

This data feeds:
- Weak-topic computation (which topics, which *specific verb/structure*, cause errors)
- The student's post-game feedback screen ("You picked 'goed' twice. Remember: go → went.")
- Post-MVP: teacher dashboard's "class-wide confusing questions" view

### 5.9 Cost budget

- Seed authoring: human time, not LLM cost.
- LLM expansion: 500 seeds × 15 variations × 3 books = 22,500 generation calls + 22,500 validation calls. Using a cheap model (DeepSeek-V3 via SiliconFlow at ~$0.07/1M input, ~$0.28/1M output), one-shot cost is approximately **$3–5 total**.
- LLM runtime fallback (cached 48h): at 1000 DAU and 5 games/day, ~2% cache miss rate → ~100 generation+validation calls/day → ~$0.10/day, **$3/month**.
- Grammar validator re-checks: same cost order as expansion.
- Total estimated burn at 1000 DAU: **under $10/month**, well within the budget constraint.
