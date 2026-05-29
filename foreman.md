# Foreman Config — ESL Grammar Games

This file describes how the foreman (Hermes Agent) orchestrates the build
pipeline. It is NOT read automatically by opencode or cline — it's a reference
for the foreman across sessions.

## Pipeline

```
     ┌─────────────────┐
     │   FOREMAN       │
     │   (Hermes Agent)│
     │   qwen 3.7 max  │
     └────────┬────────┘
              │ task spec
              ▼
     ┌─────────────────┐
     │   BUILDER       │
     │   opencode CLI  │
     │   qwen 3.7 max  │
     └────────┬────────┘
              │ code + tests + commit
              ▼
     ┌─────────────────┐
     │   VERIFIER      │
     │   cline CLI     │
     │   deepseek      │
     └────────┬────────┘
              │ review report
              ▼
     ┌─────────────────┐
     │   FOREMAN       │
     │   review + decide│
     │   → merge or rework│
     └─────────────────┘
```

## Invocation

### opencode (builder)
```bash
opencode run "<task prompt>" ~/esl-grammar-games
```
- Reads `AGENTS.md` automatically from the project root
- Skills auto-discovered from `skills/` directory
- Working dir is the project itself

### cline (verifier)
```bash
cline "Review this slice: <description>" \
  -c ~/esl-grammar-games \
  -P <provider-for-deepseek> \
  -m deepseek/deepseek-chat
```
- Reads `.clinerules` automatically
- Skills available in `skills/` for reviewer reference

## Per-Task Flow

For each task the foreman assigns:

1. **Write task spec** — a markdown block with:
   - Slice name
   - Which skill(s) to follow
   - Files to create/modify
   - Acceptance criteria
   - Definition of done (tests, build, lint green)

2. **Invoke opencode** with the task spec. Capture output.

3. **Verify builder output** — did it commit? Did tests pass? Did build pass?

4. **Invoke cline** with a review prompt referencing the slice.

5. **Decide**:
   - PASS or PASS_WITH_NITS → merge, move to next task
   - CHANGES_REQUESTED → route back to opencode with verbatim feedback
   - BLOCKED → stop, surface to user

6. **Commit** is already done by opencode. Foreman merges to main after
   verifier sign-off.

## Task Tracker

Active tasks live in Hermes's todo list (not in this file — it's not
source-controlled truth).
