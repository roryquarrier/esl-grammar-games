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
| Teacher dashboard — **lite** | ✓ | P1 | Low | Teacher auth, progress table | To build (MVP) |
| Teacher dashboard — full (heatmap, trends, exports) | ✗ | P0 | High | Lite dashboard | Post-MVP |
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
| `deleted_at` | `timestamptz` | yes | Soft delete. 30-day grace → hard-wipe. |

**RLS**: `SELECT/UPDATE WHERE auth.uid() = id AND deleted_at IS NULL`. Teachers can soft-delete their own row (set `deleted_at`); the row is filtered out of queries by default. 30-day grace before hard-wipe via a scheduled job (post-MVP).

**Indexes**: `teachers(email)` unique (filtered by `deleted_at IS NULL`); `teachers(id)` PK.

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
| `deleted_at` | `timestamptz` | yes | Soft delete. Teacher-facing undo + 30-day grace. |

**RLS**: all `WHERE teacher_id = auth.uid() AND deleted_at IS NULL` (read, update, insert, delete). Students sign in via a signed JWT issued by the backend *after* the teacher's avatar tap; the JWT carries the student ID and lets them read/write their own progress and games. A separate `student_sessions` policy allows RLS by a `student_id` claim. The JWT is short-lived (default 4 hours, configurable per teacher) and is scoped only to the student's `id` + `teacher_id` to prevent lateral access.

**Indexes**: `students(teacher_id)` (with deleted_at filter); `students(display_name, teacher_id)` (class-wide name uniqueness).

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
| `deleted_at` | `timestamptz` | yes | Soft delete (deprecation: bad question, outdated, etc.). |

**RLS**: `SELECT WHERE validated = true AND published_at IS NOT NULL AND deleted_at IS NULL` (public for any authenticated teacher or student-session). Teacher-only `INSERT/UPDATE/DELETE WHERE ...` for curation post-MVP.

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

**Indexes**: `question_attempts(student_id, created_at)`; `question_attempts(question_id)` for aggregate accuracy; `question_attempts(student_id, question_id)` for per-question student performance (used by adaptive selector's cooldown check).

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
- **LLM runtime fallback**: Only used when the published pool is exhausted for a student's weak-topic bucket — typically on heavy usage days. Generated results are cached aggressively (6h TTL) and queued for human validation before being admitted to the permanent pool.

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
2. **Cold-start rule**: if the student has fewer than 10 total attempts, skip the weighted bucket entirely — draw 100% from the mixed pool. Once ≥10 attempts exist, the 20/30/50 split kicks in.
3. Roll a weighted bucket:
   - 20% chance → pick from `weak_topics` (topics with ≥3 attempts AND accuracy <50%)
   - 30% chance → pick from `strong_topics` (accuracy ≥80% with ≥5 attempts, to reinforce mastery)
   - 50% chance → pick from the mixed pool (any validated question at the book level, excluding recently-seen questions)
4. Apply topic filter if the game has one.
5. Exclude questions served in the last 5 attempts for this student (LRU cache of question IDs, kept client-side in Zustand, mirrored server-side in `question_attempts`).
6. Return the question with the lowest `usage_count` among candidates of the chosen bucket (to balance exposure).
7. **Pool exhaustion fallback**: if the chosen bucket has fewer than 3 candidates after filtering, widen to the full published pool at the requested `book_level`. If that is also near-exhausted (e.g. student has attempted >80% of published questions in their book level), call the runtime LLM fallback and cache the result for 6 hours (short TTL so validator-flagged questions age out fast).

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
- Runtime-LLM-fallback results have a **6h TTL** keyed on `(student_id, topic)` to limit blast radius if a flawed question slips through validation. (No explicit "flag this question" button in MVP; post-MVP teachers can review flagged-question queues.)

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
- LLM runtime fallback (cached 6h): at 1000 DAU and 5 games/day, ~2% cache miss rate → ~100 generation+validation calls/day → ~$0.10/day, **$3/month**.
- Grammar validator re-checks: same cost order as expansion.
- Total estimated burn at 1000 DAU: **under $10/month**, well within the budget constraint.

---

## 6. Component Tree

The UI is composed of small, focused React components. Each component owns its own styles (`*.module.css`) and exposes a narrow props interface. Game logic lives in `src/game/` (pure functions). State lives in Zustand stores (see section 7).

```
<App>                                 // Root: routes + providers
├── <ClerkProvider>                   // Teacher auth
│   ├── <MuteProvider>                // localStorage-backed audio toggle
│   └── <RouterProvider>
│       └── routes:
│           ├── /                     → <Landing>         (teacher: sign in)
│           ├── /teacher/*            → <TeacherShell>    (auth-gated)
│           │                           ├── /teacher/dashboard-lite   → <DashboardLite>
│           │                           ├── /teacher/class/:id       → <ClassView>
│           │                           └── /teacher/students/new    → <StudentOnboard>
│           └── /play                 → <StudentShell>    (JWT-gated)
│               ├── /play/lobby       → <Lobby>
│               ├── /play/game/:id    → <GameScreen>
│               └── /play/result/:id  → <GameResult>
│
├── <Landing>/<TeacherShell>/<StudentShell>
│   └── <GameErrorBoundary>           // wraps game components; catches render errors,
│       └── <AppChrome>               // resets to lobby with a friendly message
│           ├── <MuteToggle/>         // 48px, always visible
│           ├── <FullscreenButton/>   // Fullscreen API with Safari fallback
│           └── {children}            // page content
│
├── <Lobby>                           // pre-game configuration
│   ├── <BookSelector/>               // Red / Blue / Green
│   ├── <TopicSelector/>              // "Mixed" or specific grammar topic
│   ├── <ModeSelector/>               // Hotseat / vs AI / (online disabled in MVP)
│   ├── <StudentAvatarPicker/>        // sign-in via avatar tap
│   └── <StartButton/>                // M3 Expressive primary button
│
├── <GameScreen>                      // live game
│   ├── <TurnIndicator/>              // whose turn, colour-coded (emerald / amber)
│   ├── <Board/>                      // 7x6 Connect 4 grid
│   │   └── <Cell/> × 42              // drop target, spring animation on fill
│   ├── <DiscSprite/>                 // SVG (normal) or Lottie (celebration on win)
│   ├── <QuestionModal/>              // gates player move
│   │   ├── <QuestionStem/>
│   │   ├── <OptionList/>             // 3–4 tappable options
│   │   └── <FeedbackToast/>          // correct / wrong, with explanation
│   └── <CooldownTimer/>              // 5s overlay after 3 wrong answers
│
├── <GameResult>                      // post-game screen
│   ├── <WinnerBanner/>               // Lottie "confetti" for winner
│   ├── <StatsCard/>                  // accuracy, questions answered, streaks
│   ├── <WeakTopicHint/>              // "You picked 'goed' twice..."
│   └── <PlayAgainButton/>
│
└── <DashboardLite>                   // MVP teacher view
    ├── <StudentList/>
    │   └── <StudentRow/> × N         // name | last seen | accuracy | top 3 weak
    ├── <ClassCodeDisplay/>           // code students type to join
    └── <DataRetentionNotice/>        // "Student data is deleted 30 days after account closure."
                                      // Links to full retention policy; satisfies the transparency
                                      // requirement that the 30-day grace period is user-visible.
```

### Key design decisions

- **`<GameErrorBoundary>`** is a React error boundary that wraps every game-related component tree. On render crash (buggy Supabase response, malformed question JSON), it resets local game state, shows a friendly "Oops — let's start a new game" screen with a retry button, and logs the error to a `client_errors` table (post-MVP schema) for triage.
- **`<AppChrome>`** is a single wrapper used by every page so the mute toggle + fullscreen button are guaranteed present.
- **`<DiscSprite>`** is polymorphic: default SVG (Framer Motion spring-in), swaps to Lottie JSON when the disc is part of a winning line or celebrating the "67" easter egg.
- **`<QuestionModal>`** is a dialog (`role="dialog"`, `aria-modal`) that blocks board interaction until the question is answered. It is accessible via keyboard (tab through options, Enter to select).
- **`<CooldownTimer>`** is a purely visual 5-second overlay with a hidden `aria-live="polite"` region announcing the remaining time for screen readers. **Testing note**: this region must be tested manually with VoiceOver (Safari on iPad) and NVDA (desktop Chrome) to ensure it doesn't spam repeated announcements. If flaky, switch to a single announcement ("Cooldown started. You can answer again in 5 seconds.") instead of per-second updates.

### Routes & auth gates

- `/` is public; anyone can view the landing.
- `/teacher/*` is gated by Clerk authentication. Redirects to `/` with a sign-in modal if no session.
- `/play/*` is gated by a short-lived student JWT stored in `sessionStorage`. If missing or expired, redirects to `/play/sign-in` (avatar picker, requires a class code).

---

## 7. State Management (Zustand Store Shape)

State is split into four Zustand stores, each owning a single slice of concern. Each store is small (≤200 LOC) and composable. Persistence is only on the stores that benefit from it.

### `useAuthStore` — auth state

No persistence. Holds the current teacher or student session.

```ts
interface AuthStore {
  mode: 'teacher' | 'student' | 'unauthed';
  teacher: { id: string; email: string; displayName: string } | null;
  studentSession: {
    id: string;
    displayName: string;
    avatarKey: string;
    bookLevel: 'red' | 'blue' | 'green';
    jwtExpiresAt: number;
  } | null;
  signOut: () => void;
  refreshStudentJwt: () => Promise<void>;
}
```

### `useGameStore` — current game state

Persisted to IndexedDB via `idb-keyval` (keyed on `game.id`). This is the source of truth for offline resilience: if the student loses Wi-Fi mid-game, reloads the browser, or switches tabs, the board state survives. On every action (move, question answer, disc drop), the new state is written to IndexedDB *before* the Supabase call. If Supabase fails, a retry queue in `src/lib/retry-queue.ts` flushes on reconnect. Not cleared until the game ends (win/draw) or 7 days of inactivity.

```ts
interface GameStore {
  game: {
    id: string;
    mode: 'hotseat' | 'vs_ai';
    bookLevel: BookLevel;
    topicFilter: string[] | null;
    players: [PlayerInfo, PlayerInfo];
    currentTurn: 1 | 2;
    winner: 0 | 1 | 2 | null;        // 0 = draw
    moves: GameMove[];
  } | null;

  // turn flow sub-state
  questionState: {
    question: Question | null;
    wrongInRow: 0 | 1 | 2 | 3;
    cooldownUntil: number | null;     // epoch ms
    isFetching: boolean;
  };

  // actions
  startGame: (opts: StartGameOptions) => Promise<void>;
  selectColumn: (col: number) => Promise<void>;           // triggers question fetch
  answerQuestion: (chosenIndex: number) => Promise<void>; // validates + advances turn
}
```

### `useSettingsStore` — persisted user preferences

Persisted to `localStorage` via `zustand/middleware/persist`. Survives sign-out.

```ts
interface SettingsStore {
  muted: boolean;
  fullscreenEnabled: boolean;
  dyslexiaFont: boolean;             // post-MVP, but shape is here
  setMuted: (v: boolean) => void;
  setFullscreen: (v: boolean) => void;
}
```

### `useQuestionCacheStore` — client-side question cache

Not persisted. LRU cache of the last 20 question IDs per book level to prevent serving the same question back-to-back.

```ts
interface QuestionCacheStore {
  recentlySeen: Record<BookLevel, string[]>;            // LRU, max 20 per book
  markSeen: (bookLevel: BookLevel, questionId: string) => void;
  clear: () => void;                                     // on sign-out
}
```

### Boundaries with Supabase

- **Read**: Supabase client via an SDK wrapper in `src/lib/api/`. Every store action that needs remote data calls into this wrapper, not Supabase directly.
- **Write**: Only `useGameStore` and `useAuthStore` perform writes. The others are pure client-side state.
- **Optimistic UI + rollback**: when a student drops a disc, we (1) update `useGameStore` immediately for snappy feel, (2) persist to IndexedDB, (3) fire the Supabase INSERT. If (3) fails, we rollback the in-memory state to the prior snapshot (kept in a 1-element undo buffer), surface a toast "Move didn't save — try again", and keep the player's turn active so they can retry without losing their question credit.
- **Realtime** (post-MVP): Supabase Realtime subscriptions will live in `src/lib/realtime.ts` and will update `useGameStore` when remote board changes arrive. Not wired in MVP.

---

## 8. Animation Strategy

### SVG vs Lottie decision tree

Every animated element in the app is classified by complexity:

| Element | Complexity | Approach | Why |
|---|---|---|---|
| Disc placement (drop into column) | Low — translation + bounce | **SVG + Framer Motion** | Vector, palette-themeable, trivial |
| Disc hover state | Low — scale + hue shift | **SVG + CSS** | CSS :hover handles it |
| Column highlight on hover | Low — translucent fill | **SVG + CSS** | — |
| Winning line (4-in-a-row glow) | Medium — pulse + trail | **SVG + Framer Motion** | AnimateMotion for the glow line |
| Wrong-answer shake on modal | Low — translate wiggle | **CSS keyframes** | No state needed |
| Correct-answer "pop" | Low — scale bounce | **Framer Motion** | Spring config |
| Win celebration (confetti) | High — 50+ particles, varied timing | **Lottie** | After Effects authored; tiny JSON |
| "67" easter egg reveal | High — multi-stage, bespoke | **Lottie** | Bespoke art, not worth coding |
| Lobby "book cards" hover | Low — scale + shadow | **Framer Motion** | — |

**Rule of thumb**: if the animation is "spring a single property," use Framer Motion. If it's "many elements with authored timing," use Lottie. CSS for anything achievable without JS.

### Spring physics (Framer Motion)

M3 Expressive defines three curves; we use two:

```ts
// Emphasized decelerate — for entry animations (discs dropping, modals appearing).
// "Arrives with a little extra bounce."
export const emphasizedDecelerate = {
  type: 'spring',
  stiffness: 200,
  damping: 20,
  mass: 0.9,
};

// Standard decelerate — for interactive feedback (button presses, toasts).
// "Quiet and quick."
export const standardDecelerate = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
  mass: 0.7,
};
```

These are exposed as CSS vars too (`--spring-emphasized`, `--spring-standard`) for the rare case where CSS transitions need the same timing (e.g. hover state on a disc).

### Squircle corners

M3 Expressive uses "squircle" (continuous curvature) corners rather than circular arcs. We approximate via CSS:

```css
.squircle {
  border-radius: 28px;
  border-radius: round(50px, 20px);  /* Progressive enhancement for browsers that support it */
}
```

Squircle radii: 28px for cards, 16px for buttons, 8px for small chips. Discs stay circular (radius 50%).

### Lottie assets

Sourced from [lottiefiles.com](https://lottiefiles.com) (MIT-licensed) or commissioned per asset. Each asset must be under 80 KB gzipped and must respect the palette by overriding colours at runtime via `lottie-react`'s `colorFilters` or a palette-remap pass on the JSON.

---

## 9. Responsive Layout Strategy

### Breakpoints

Five breakpoints, named after the dominant device:

| Name | Min-width | Height strategy | Typical device |
|---|---|---|---|
| `mobile-portrait` | — | `100dvh` | Phone, portrait |
| `mobile-landscape` | 640px | `100dvh` | Phone, landscape |
| `ipad-portrait` | 768px | `100dvh` | iPad portrait |
| `ipad-landscape` | 1024px | `100dvh` | **iPad landscape — primary layout** |
| `desktop` | 1280px | `100vh` | Monitor / laptop |

iPad landscape (1024px+) is the **primary** design. We design it first and adapt the others from it, not the other way around.

### CSS Grid with named areas

Each page template uses Grid named areas that re-arrange per breakpoint:

```css
/* ipad-landscape (primary) */
@media (min-width: 1024px) {
  .game {
    display: grid;
    grid-template-areas:
      "header header"
      "board sidebar"
      "footer footer";
    grid-template-columns: 2fr 1fr;
    grid-template-rows: auto 1fr auto;
    height: 100dvh;
  }
}

/* mobile-portrait */
@media (max-width: 639px) {
  .game {
    grid-template-areas:
      "header"
      "board"
      "sidebar"
      "footer";
    grid-template-columns: 1fr;
  }
}
```

### Layout priorities per breakpoint

- **iPad landscape** (primary): Board takes ~60% width, sidebar (scoreboard + turn info) takes ~40%. Side-by-side.
- **iPad portrait**: Board takes full width with a sticky header. Sidebar slides in as a bottom drawer (touch-draggable, M3 bottom sheet).
- **Mobile landscape**: Board fills height; sidebar is a compact strip on the right.
- **Mobile portrait**: Board on top, sidebar below, full-screen modal for questions.
- **Desktop**: Same as iPad landscape but capped at 1200px max-width, centered.

### Dynamic viewport units

We use `dvh` instead of `vh` everywhere to handle mobile Safari's address-bar bounce. `100dvh` = full visible viewport. This matters especially for fullscreen mode on iPad.

### Touch vs mouse

`@media (pointer: coarse)` applies larger hit targets (≥ 60px for young learners). `@media (pointer: fine)` enables hover states and smaller targets for desktop.

### Fullscreen mode

The `<FullscreenButton>` triggers the Fullscreen API. Safari on iPad has historically been flaky with Fullscreen; fallback is a "kiosk-style" CSS mode that hides the page chrome and uses `100dvh` + `overscroll-behavior: none`.

```ts
async function requestFullscreen(el: HTMLElement) {
  if (el.requestFullscreen) return el.requestFullscreen();
  if ((el as any).webkitRequestFullscreen) return (el as any).webkitRequestFullscreen();
  // Fallback: toggle .kiosk class on <body>
  document.body.classList.add('kiosk');
}
```

---

## 10. Accessibility Requirements

Target: **WCAG 2.1 AA** across the entire app. See `references/accessibility-checklist.md` for the full checklist.

### Colour contrast

- Primary text (`#121212` on `#def3e4` background): contrast ratio **16.3:1** — AAA.
- Primary action (`#28ba72` on `#121212`): contrast ratio **8.2:1** — AAA.
- Player-2 amber disks (`#f5a623` on `#22613e` board): contrast ratio **6.4:1** — AAA.
- All interactive elements must maintain ≥ 4.5:1 against their background at every breakpoint.

### Not-colour-alone signals

- Player 1 discs are emerald; player 2 discs are amber. But player state is *also* indicated by a pulsing ring around the currently-active player name (not colour-only).
- Winning line is highlighted by a pulsing stroke (not just colour) and announced to screen readers.
- Turn indicator shows both a colour dot AND the player's name ("Amber's turn").

### Keyboard navigation

- Every interactive element reachable via Tab / Shift+Tab.
- Board columns navigable with ← → arrow keys (standard grid pattern). Space/Enter selects a column.
- Question modal: Tab cycles through options; Enter confirms. Focus is trapped inside the modal while open.
- Post-MVP: "Skip to main content" link in `<AppChrome>`.

### Screen readers

- `<QuestionStem>` uses `<h2>` with `aria-live="polite"` so the question is announced when displayed.
- Board state is announced via a visually-hidden `<div role="status">` updated after each move: "Emerald placed in column 3, row 4".
- Win is announced: "Amber wins with four in a row horizontally on row 2".

### Cognitive accessibility

- Question text uses `clamp(1rem, 2.5vw, 1.5rem)` so it scales smoothly.
- No time pressure for grammar questions: students can take as long as they like.
- 5-second cooldown after 3 wrong answers gives a visible breathing space and is announced.
- Error messages include the explanation ("Remember: 'go' becomes 'went'") rather than "Wrong."
- Post-MVP: dyslexia-friendly font toggle (font stack includes OpenDyslexic / Atkinson Hyperlegible).

### Touch targets

- **MVP requirement**: 60 × 60 px for question options (young learners, imprecise tapping).
- Board cells: min 44 × 44 px; preferred 60 × 60 when space allows.
- Mute toggle: fixed at 48 × 48 px.

### Reduced motion

`@media (prefers-reduced-motion: reduce)` swaps all spring animations for instant transitions and disables Lottie celebrations entirely (they render their first frame statically).

---

## 11. Security & Privacy

### Threat model

- A student should never see or modify another student's data, even within the same teacher's account, except in the context of an active game (where they see only the shared `games` and `game_moves` rows for that game).
- A teacher should never see another teacher's students, attempts, or games.
- A student should never be able to escalate to teacher privileges.
- LLM-generated questions that fail validation must never be served.

### Auth boundaries

- **Teachers**: Clerk-issued session tokens. Server-side verification via Clerk webhook + session secret. No role escalation possible (no "admin" role exists).
- **Students**: Short-lived (4h default) JWTs signed by our backend with a rotating secret (daily rotation via cron). JWT payload = `{ studentId, teacherId, bookLevel, issuedAt, expiresAt }`. Server-side verification on every request.
### JWT revocation

- **JWT rotation**: a `student_sessions` table tracks issued JWTs; a revoked JWT (teacher deletes the student, or explicitly revokes the session) is rejected.

### Emergency revocation

If a JWT leak or systemic breach is suspected:
1. Rotate the signing secret for student JWTs (cron job `rotate-student-jwt-secret`, or manual `supabase secrets set STUDENT_JWT_SECRET=...`). All outstanding student JWTs are invalidated instantly because verification requires the current secret.
2. Trigger the `invalidate_all_student_sessions` RPC (supabase function) to wipe the `student_sessions` table.
3. Rotate the Clerk secret key via the Clerk dashboard; outstanding teacher sessions are invalidated.
4. Publish a post-incident note to affected teachers via the status page.

The runbook lives in `docs/security-incident-runbook.md` (post-MVP document). Drilled at least once per quarter.

### RLS recap

Summarised in section 4. All writes and most reads require a matching `teacher_id = auth.uid()` or `current_student()`. No cross-teacher access is possible at the RLS layer; the application layer also checks, defence in depth.

### Kid PII

- `students.display_name` is first-name only, capped at 32 chars. No last name, no DOB, no email.
- `students.avatar_key` is a bundled set — no user uploads (eliminates inappropriate-image vector).
- No IP logging of student sessions at the application layer (Supabase Postgres logs only, rotated at 30 days by Supabase Cloud defaults).
- Observers (parents) receive a signed, expiring link (7-day TTL) to a read-only progress page. The link is derived from a one-time token; once opened, a new one must be issued.

### COPPA and HK PDPO

- **COPPA (US)**: Students have no account, no email, and the product is only used under teacher supervision. No direct contract with the child.
- **HK PDPO**: Students are identified to a single teacher by first name only. The teacher is the data controller; the product is a data processor (documented in Terms of Service + DPA with each teacher).
- **Right to erasure**: soft-delete on `students` + 30-day grace before hard-wipe, with all FK-cascading aggregates (game_moves, question_attempts) deleted too.

### Secrets management

- Clerk secret, Supabase service-role key, SiliconFlow API key (for server-side LLM expansion): stored in GitHub Secrets for CI/CD, Supabase Secrets for runtime.
- **No secrets in code**, ever. All API calls to LLM services are routed through a Supabase Edge Function (`question-generate`), never from the client.
- `.env` is in `.gitignore`. Dev uses `.env.local` which is also gitignored.

### Input validation

All user-input strings (display_name, topic_filter, etc.) are validated by Zod at the API boundary and by CHECK constraints in Postgres. XSS risk is nil: React auto-escapes all rendered strings; no `dangerouslySetInnerHTML` allowed by ESLint config.

### Supply-chain

- `npm audit` runs on every PR; CI fails on high or critical (unless an override is documented).
- Pin major versions in `package.json` for transitive deps with known security history (currently no such deps, but future additions should be pinned).

---

## 12. API Contracts

### Module boundaries

The codebase is organised as a set of isolated modules. Each module exposes a narrow API (TypeScript types); cross-module calls go only through these exports.

```
src/
├── api/              ← Supabase client wrapper (public: fetchQuestion, recordAttempt, etc.)
├── auth/             ← Clerk + student JWT helpers (public: signIn, signOut, refreshJwt)
├── game/             ← Pure game logic (public: makeMove, detectWin, aiTurn)
├── questions/        ← Question system (public: fetchNextQuestion, validateQuestion)
├── questions/admin/  ← Question authoring APIs (post-MVP)
├── ui/               ← React components (see §6)
└── styles/           ← Design tokens (see Appendix A)
```

### Key contracts

#### `src/api/questions.ts`

```ts
export interface FetchQuestionOpts {
  studentId: string;
  bookLevel: BookLevel;
  topicFilter?: string[];
  excludeQuestionIds?: string[];   // client-side LRU
}

export async function fetchQuestion(opts: FetchQuestionOpts): Promise<Payload<Question>>;
export async function recordAttempt(a: AttemptInput): Promise<Payload<GameMove>>;
```

Errors: `Payload<T> = { ok: true; data: T } | { ok: false; error: KnownError }`. Network errors are wrapped in `NetworkError` for offline handling; validation errors carry a structured `code`.

#### `src/game/board.ts`

```ts
export type Board = number[][];                       // 6 rows × 7 cols
export type Player = 1 | 2;

export function emptyBoard(): Board;
export function dropDisc(board: Board, player: Player, column: number): Board | null;  // null = column full
export function detectWin(board: Board): { winner: 0 | 1 | 2; line: [number, number][] | null };
```

Pure, deterministic, fully unit-tested. Board is immutable — every drop returns a new Board.

#### `src/questions/select.ts`

```ts
export function pickQuestion(ctx: SelectContext): PickedQuestion;
// pure; uses ctx.progress + ctx.pool + ctx.coldStart rule
```

### Error semantics

Every API export returns a `Payload<T>` discriminated union. Components never throw; they handle the `ok: false` branch with a `<ErrorToast>`.

### Versioning

Single API version for MVP (`v1`). When breaking changes are required, we add `v2` endpoints alongside `v1` and migrate consumers; no silent breakage.

---

## 13. Testing Strategy

See `references/testing-patterns.md` for full patterns.

### Test pyramid

- **80% unit tests** (`vitest`): game logic, question selector, state stores, API wrappers, helpers.
- **15% component tests** (`@testing-library/react`): `<QuestionModal>`, `<Board>`, `<DiscSprite>` (interaction + accessibility), turn flow with mocked Supabase.
- **5% end-to-end** (`playwright`): smoke tests for sign-in, create-student, complete-a-game, view-dashboard.

### Coverage targets

- `src/game/`: 100% branch coverage (win detection is life-or-death).
- `src/questions/`: ≥ 95% line coverage overall; **100% branch coverage on the adaptive selection algorithm** (`src/questions/select.ts`), including explicit tests for: cold-start (<10 attempts), weak-topic bucket selection with ≥3 candidates, strong-topic reinforcement, mixed-pool fallback, topic-filter intersection, pool exhaustion → runtime-LLM fallback. This path determines the product's pedagogical effectiveness.
- `src/api/`: ≥ 80% line coverage.
- `src/ui/`: Component-library coverage ≥ 60%.

### Mocking strategy

- Supabase: use `msw` (Mock Service Worker) at the component-test boundary. Real Supabase calls in playwright E2E only (against a seeded test DB).
- Clerk: mock the session object; real Clerk only in E2E.
- LLM calls: always mocked in tests; no network calls to SiliconFlow during CI.

### Browser testing

Playwright against the four browsers that matter:
- Safari on iPad (primary)
- Chrome on iPad
- Safari on macOS
- Chrome on macOS

Matrix runs on every merge to `main`.

### Accessibility testing

- `axe-core` + `@axe-core/playwright` on every page; CI fails on new issues.
- Manual keyboard navigation pass before each milestone.

---

## 14. Performance Targets

### Core Web Vitals (GitHub Pages deployment)

| Metric | Target | Measured by |
|---|---|---|
| LCP | ≤ 2.0s on 4G | Lighthouse CI |
| FID / INP | ≤ 100ms | Lighthouse CI |
| CLS | ≤ 0.05 | Lighthouse CI |
| Lighthouse Performance score | ≥ 90 | CI, every merge to main |

### Bundle budget

- Initial JS (gzipped): ≤ 180 KB
- Lottie JSON files (gzipped): ≤ 20 KB each, total ≤ 150 KB across app
- CSS (gzipped): ≤ 15 KB

Enforced by `bundlesize` in CI. Any PR that exceeds the budget fails and requires either code reduction or a documented override.

### Interaction latency

- Disc-drop animation start: ≤ 50ms from tap (Framer Motion spring config, no JS blocking).
- Question-modal appearance: ≤ 200ms including network fetch (cached in client).
- Move submission round-trip: ≤ 500ms on 4G (optimistic UI with Supabase rollback on failure).

### Offline resilience

- Game state (board, moves, current question) is persisted to IndexedDB via `idb-keyval`. Brief Wi-Fi drops during a school day do not lose progress.
- On reconnect, a queued `recordAttempt` flushes automatically.
- No offline support for teacher dashboard in MVP; it requires Supabase auth each load. Post-MVP: a service-worker precached shell.

---

## 15. Open Questions / Decisions Needed

### Resolved this document

- ✅ Hybrid question system (seed + LLM expansion + validation)
- ✅ Teacher-managed auth with student JWT
- ✅ Amber player-2 discs (breaks monochrome only for legibility)
- ✅ MVP scope including teacher dashboard-lite
- ✅ 6h runtime LLM cache TTL
- ✅ Observer persona stays read-only in MVP; email-digest post-MVP
- ✅ "67" easter egg — **unlockable disc skin**: when any of the player's move count, correct-answer count, or current streak equals 67, the student's discs briefly gain a gold "67" foil stamp for the rest of the game, play a one-time "67 reveal" Lottie animation (gold sparks) on the first winning drop, and permanently award a "67 Club" profile badge visible to teacher + classmates on the leaderboard. Detection hook in Appendix D; asset specs in Appendix E.

### Open — requires further input

1. **Grammar topic taxonomy source** — use Cambridge's published topic list verbatim (risk: copyright, may need a licence), or author our own taxonomy that *aligns* with Cambridge but is our own wording?
   - *Decision owner*: Rory + education advisor (if any)
   - *Deadline*: before seed authoring begins

2. **Supabase project region** — Singapore (`ap-southeast-1`) is closest to Hong Kong; verify against the chosen plan tier and PDPO data-residency requirements.
   - *Decision owner*: Rory

3. **Clerk plan tier** — free tier is sufficient for MVP (<10k MAU); if we expect >10k students in first 12 months, evaluate the paid plan before public launch.
   - *Decision owner*: Rory

4. **Lottie asset sourcing** — commission bespoke vs. licence from lottiefiles. Commissioned is more branded; licensed is faster. Budget TBD.
   - *Decision owner*: Rory

5. **AI opponent difficulty** — MVP specifies "deterministic heuristic". Do we want a minimax with depth-3 lookahead (stronger, but slower on big boards) or a rule-based play-to-block + prefer-centre approach (weaker, but fast and predictable)?
   - *Decision owner*: foreman (decide during build phase 5.2); easy to swap if wrong

---

## Appendix A: Design Tokens

```css
:root {
  /* Colour */
  --color-forest: #22613e;        /* board bg, deep surfaces */
  --color-emerald: #28ba72;       /* primary action, player 1 discs */
  --color-mint: #99dbb0;          /* secondary UI, hover states */
  --color-sage: #def3e4;          /* background, player 2 discs light surfaces */
  --color-night: #121212;         /* main text, outlines, dark bg */
  --color-amber: #f5a623;         /* player 2 discs (breaks palette) */

  /* Spacing (4px grid) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;

  /* Squircle radii */
  --radius-card: 28px;
  --radius-button: 16px;
  --radius-chip: 8px;

  /* Motion */
  --spring-emphasized: cubic-bezier(0.05, 0.7, 0.2, 1);
  --spring-standard: cubic-bezier(0.2, 0, 0, 1);

  /* Touch targets */
  --hit-target-small: 44px;     /* desktop / fine pointer */
  --hit-target-large: 60px;     /* iPad / coarse pointer */
  --hit-target-mute: 48px;     /* mute button (constant) */
}
```

## Appendix B: Grammar Question Examples

<!-- TO BE FILLED after seed authoring phase: 6-8 examples per book level with distractor rationale -->

## Appendix C: Soft-Delete & CASCADE Policy

### Soft-delete scope

| Table | Has `deleted_at`? | Rationale |
|---|---|---|
| `teachers` | ✅ | SaaS off-boarding grace (30-day) |
| `students` | ✅ | Teacher undo for accidental delete |
| `questions` | ✅ | Deprecate bad questions without orphaning history |
| `question_attempts` | ❌ | Aggregate data; cascade-deleted when student is hard-deleted |
| `games` | ❌ | Same as attempts |
| `game_moves` | ❌ | Same as attempts |
| `progress` | ❌ | Recomputed from attempts; cascade-deleted with student |

### CASCADE behaviour

| FK | ON DELETE | Rationale |
|---|---|---|
| `students.teacher_id` → `teachers(id)` | `CASCADE` | Teacher gone = students gone |
| `questions.seed_id` → `questions(id)` (self) | `SET NULL` | Seed deprecated; variants can live independently as seeds |
| `question_attempts.student_id` → `students(id)` | `CASCADE` | Student hard-deleted = attempts wiped |
| `question_attempts.question_id` → `questions(id)` | `CASCADE` | Question hard-deleted = historical attempts wiped (soft-deleted questions keep their attempts) |
| `games.player1_id` / `player2_id` → `students(id)` | `SET NULL` | Student gone, game history preserved as anonymous aggregate |
| `game_moves.game_id` → `games(id)` | `CASCADE` | Game gone = moves gone |
| `progress.student_id` → `students(id)` | `CASCADE` | Derived data; recomputable but we just drop |

## Appendix D: Easter Egg Specification

The "67" easter egg detection framework MUST exist in MVP. The specific surprise is **resolved** (see §15): an unlockable disc skin with a profile badge.

**Detection hook**:

```ts
function shouldTriggerEasterEgg(ctx: {
  totalMovesInGame: number;
  totalCorrectAnswers: number;
  currentStreak: number;
}): boolean {
  return [ctx.totalMovesInGame, ctx.totalCorrectAnswers, ctx.currentStreak].includes(67);
}
```

**Surprise mechanics**:

1. On trigger, set `game.easterEggActiveForPlayer = <playerId>` in `useGameStore`.
2. The triggering player's discs immediately gain a gold "67" foil stamp overlay (SVG filter on top of the existing disc sprite — palette-respecting).
3. On the first winning drop of the game (by either player), play a one-time "67 reveal" Lottie animation (gold sparks erupting from the winning disc). Respects mute.
4. Award a permanent `badge: '67_club'` on the triggering student's progress row. Badge is visible on the leaderboard and in `<DashboardLite>`.
5. If the same student triggers "67" again in a later game, the badge gains a counter (e.g. "67 Club × 3").

Logged via `easter_egg_events` table (post-MVP schema) for analytics.

## Appendix E: "67" Easter Egg Asset Specification

- **Disc overlay**: a 64×64 SVG layer composited above the player's disc sprite. Gold gradient (palette-extended: `#ffd86b` → `#f5a623`) with a tiny "67" numeral in the centre. Opacity 0.85 so the underlying disc colour still shows.
- **Lottie reveal**: a 1.5-second JSON animation (≤40 KB gzipped) of gold sparks expanding outward from a centre point. Must be palette-overridable via `lottie-react`'s `colorFilters`. Source: commissioned asset OR a palette-adapted lottiefiles.com licence with clear credit in `LICENSE-ASSETS.md`.
- **Badge icon**: 24×24 SVG, gold medal with "67" engraved.
- **Sound**: a short 0.8s chime (MP3, ≤20 KB) played once at trigger moment, respects mute. Asset commissioned with the Lottie.

## Appendix F: Security Incident Runbook (Pointer)

Full runbook lives in `docs/security-incident-runbook.md` (created before public launch). It walks through:
1. Rotate `STUDENT_JWT_SECRET` via `supabase secrets set`.
2. Execute `invalidate_all_student_sessions` RPC.
3. Rotate Clerk secret key.
4. Notify affected teachers via status page.
5. Post-incident review within 72 hours.

Drilled quarterly.

