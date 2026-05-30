-- 001_initial_schema.sql
-- ESL Grammar Games — Supabase schema
-- All tables, RLS policies, indexes, and triggers.
--
-- Table order: teachers → students → questions → games → question_attempts → game_moves → progress
-- (question_attempts FK→games, game_moves FK→games + FK→question_attempts)

-- ─── Shared: updated_at trigger ─────────────────────────────────────

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ─── teachers ──────────────────────────────────────────────────────

create table teachers (
  id            uuid         primary key default gen_random_uuid(),
  email         text         not null unique,
  display_name  text         not null,
  timezone      text         not null default 'Asia/Hong_Kong',
  tier          text         not null default 'free' check (tier in ('free', 'pro')),
  settings_json jsonb,
  created_at    timestamptz  not null default now(),
  updated_at    timestamptz  not null default now(),
  deleted_at    timestamptz
);

create unique index idx_teachers_email_active on teachers(email) where deleted_at is null;

create trigger trg_teachers_updated_at
  before update on teachers
  for each row
  execute function set_updated_at();

alter table teachers enable row level security;

create policy teachers_select_own
  on teachers for select
  using (auth.uid() = id and deleted_at is null);

create policy teachers_update_own
  on teachers for update
  using (auth.uid() = id and deleted_at is null);

-- ─── students ──────────────────────────────────────────────────────

create table students (
  id            uuid         primary key default gen_random_uuid(),
  teacher_id    uuid         not null references teachers(id),
  display_name  text         not null check (char_length(display_name) <= 32),
  avatar_key    text         not null,
  book_level    text         not null check (book_level in ('red', 'blue', 'green')),
  pin_hash      text,
  created_at    timestamptz  not null default now(),
  updated_at    timestamptz  not null default now(),
  deleted_at    timestamptz
);

create index idx_students_teacher_id on students(teacher_id) where deleted_at is null;
create unique index idx_students_name_per_class on students(display_name, teacher_id);

create trigger trg_students_updated_at
  before update on students
  for each row
  execute function set_updated_at();

alter table students enable row level security;

create policy students_select_own
  on students for select
  using (teacher_id = auth.uid() and deleted_at is null);

create policy students_insert_own
  on students for insert
  with check (teacher_id = auth.uid());

create policy students_update_own
  on students for update
  using (teacher_id = auth.uid() and deleted_at is null);

create policy students_delete_own
  on students for delete
  using (teacher_id = auth.uid() and deleted_at is null);

-- ─── questions ─────────────────────────────────────────────────────

create table questions (
  id               uuid         primary key default gen_random_uuid(),
  seed_id          uuid         references questions(id),
  book_level       text         not null check (book_level in ('red', 'blue', 'green')),
  topic            text         not null,
  subtopic         text,
  stem             text         not null,
  options          jsonb        not null,
  correct_index    int          not null,
  explanation      text,
  difficulty       int          not null check (difficulty between 1 and 5),
  source           text         not null check (source in ('seed', 'llm_expansion', 'llm_runtime')),
  validated        boolean      not null default false,
  validation_notes jsonb,
  hk_culture_ref   boolean      not null default false,
  usage_count      int          not null default 0,
  accuracy         numeric      not null default 0,
  created_at       timestamptz  not null default now(),
  published_at     timestamptz,
  deleted_at       timestamptz
);

create index idx_questions_book_topic_diff on questions(book_level, topic, difficulty);
create index idx_questions_seed_id on questions(seed_id);
create index idx_questions_validated_published on questions(validated, published_at);

alter table questions enable row level security;

create policy questions_select_published
  on questions for select
  using (validated = true and published_at is not null and deleted_at is null);

create policy questions_insert_teacher
  on questions for insert
  with check (
    auth.role() = 'authenticated' and
    exists (select 1 from teachers where id = auth.uid() and deleted_at is null)
  );

create policy questions_update_teacher
  on questions for update
  using (
    auth.role() = 'authenticated' and
    exists (select 1 from teachers where id = auth.uid() and deleted_at is null)
  );

create policy questions_delete_teacher
  on questions for delete
  using (
    auth.role() = 'authenticated' and
    exists (select 1 from teachers where id = auth.uid() and deleted_at is null)
  );

-- ─── games ─────────────────────────────────────────────────────────
-- (must come BEFORE question_attempts which FK→games)

create table games (
  id             uuid         primary key default gen_random_uuid(),
  teacher_id     uuid         not null references teachers(id),
  player1_id     uuid         not null references students(id),
  player2_id     uuid,
  player2_is_ai  boolean      not null default false,
  book_level     text         not null check (book_level in ('red', 'blue', 'green')),
  mode           text         not null check (mode in ('hotseat', 'vs_ai', 'online')),
  board          jsonb        not null,
  current_turn   int          not null check (current_turn in (1, 2)),
  winner         int          check (winner in (0, 1, 2)),
  topic_filter   jsonb,
  started_at     timestamptz  not null default now(),
  ended_at       timestamptz
);

create index idx_games_player1 on games(player1_id, ended_at desc);
create index idx_games_teacher on games(teacher_id, ended_at desc);

alter table games enable row level security;

create policy games_insert_own
  on games for insert
  with check (teacher_id = auth.uid() or player1_id = auth.uid());

create policy games_select_own
  on games for select
  using (
    teacher_id = auth.uid() or
    player1_id = auth.uid() or
    player2_id = auth.uid()
  );

create policy games_update_own
  on games for update
  using (
    teacher_id = auth.uid() or
    player1_id = auth.uid() or
    player2_id = auth.uid()
  );

-- ─── question_attempts ─────────────────────────────────────────────
-- (now games table exists for the FK)

create table question_attempts (
  id             uuid         primary key default gen_random_uuid(),
  student_id     uuid         not null references students(id),
  question_id    uuid         not null references questions(id),
  game_id        uuid         references games(id),
  chosen_index   int,
  is_correct     boolean      not null,
  wrong_in_row   int          not null default 0,
  time_spent_ms  int,
  created_at     timestamptz  not null default now()
);

create index idx_question_attempts_student_created
  on question_attempts(student_id, created_at);
create index idx_question_attempts_question
  on question_attempts(question_id);
create index idx_question_attempts_student_question
  on question_attempts(student_id, question_id);

alter table question_attempts enable row level security;

create policy question_attempts_insert_own
  on question_attempts for insert
  with check (student_id = auth.uid());

create policy question_attempts_select_own
  on question_attempts for select
  using (student_id = auth.uid());

-- ─── game_moves ────────────────────────────────────────────────────

create table game_moves (
  id                  uuid         primary key default gen_random_uuid(),
  game_id             uuid         not null references games(id) on delete cascade,
  player              int          not null check (player in (1, 2)),
  column_idx          int          not null check (column_idx between 0 and 6),
  row_idx             int          not null check (row_idx between 0 and 5),
  question_attempt_id uuid         not null references question_attempts(id),
  move_number         int          not null,
  created_at          timestamptz  not null default now()
);

create unique index idx_game_moves_game_move on game_moves(game_id, move_number);

alter table game_moves enable row level security;

create policy game_moves_select_own
  on game_moves for select
  using (
    exists (
      select 1 from games
      where games.id = game_moves.game_id
        and (games.teacher_id = auth.uid()
          or games.player1_id = auth.uid()
          or games.player2_id = auth.uid())
    )
  );

create policy game_moves_insert_own
  on game_moves for insert
  with check (
    exists (
      select 1 from games
      where games.id = game_moves.game_id
        and (games.teacher_id = auth.uid()
          or games.player1_id = auth.uid()
          or games.player2_id = auth.uid())
    )
  );

-- ─── progress ──────────────────────────────────────────────────────

create table progress (
  student_id      uuid         primary key references students(id),
  total_attempts  int          not null default 0,
  total_correct   int          not null default 0,
  accuracy        numeric      not null default 0,
  current_streak  int          not null default 0,
  best_streak     int          not null default 0,
  topic_stats     jsonb        not null default '{}'::jsonb,
  weak_topics     text[]       not null default '{}',
  strong_topics   text[]       not null default '{}',
  updated_at      timestamptz  not null default now()
);

create trigger trg_progress_updated_at
  before update on progress
  for each row
  execute function set_updated_at();

alter table progress enable row level security;

create policy progress_select_own
  on progress for select
  using (
    student_id = auth.uid() or
    student_id in (
      select id from students
      where teacher_id = auth.uid() and deleted_at is null
    )
  );
