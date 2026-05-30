# AGENTS.md — ESL Grammar Games

This file is read automatically by opencode. It defines the project context,
workflow rules, and skill-driven execution model.

## Project Overview

ESL Grammar Games is a Connect 4 game for ESL learners aged 5–11 in Hong Kong.
Grammar questions gate every turn. Correct answers unlock disc placement.

- **Repo**: https://github.com/roryquarrier/esl-grammar-games
- **Live site (GitHub Pages)**: https://roryquarrier.github.io/esl-grammar-games/
- **Spec**: ./docs/spec.md (create if not yet written)
- **Tech stack**: Vite + React + TypeScript, Framer Motion, Zustand, CSS Modules,
  Supabase, Clerk, SVG + Lottie (hybrid)
- **Design system**: Material 3 Expressive + minimal retro, monochromatic green
  palette with amber player-2 discs

See `./docs/spec.md` for the full PRD.

## Workflow Roles

You are the **builder**. The foreman (Hermes Agent) delegates tasks to you and
coordinates with a verifier (cline) who reviews your output.

Your job:
1. Receive a task spec from the foreman
2. Implement the task following the relevant skill
3. Produce evidence of correctness (tests, build output, screenshots)
4. Commit atomically and push

## Skill-Driven Execution

Skills live in `./skills/<skill-name>/SKILL.md`. They are mandatory.

### Intent → Skill Mapping

| Intent | Skill |
|---|---|
| New feature / design | `spec-driven-development` |
| Break feature into tasks | `planning-and-task-breakdown` |
| Implement a slice | `incremental-implementation` + `test-driven-development` |
| UI / component work | `frontend-ui-engineering` |
| API / module boundary | `api-and-interface-design` |
| Bug / build failure | `debugging-and-error-recovery` |
| Refactor / simplify | `code-simplification` |
| Security review | `security-and-hardening` |
| Performance | `performance-optimization` |
| Commit workflow | `git-workflow-and-versioning` |
| Deploy | `shipping-and-launch` |

### Lifecycle Mapping

Every request maps to a lifecycle phase. Never skip phases.

- **DEFINE** → `spec-driven-development` (write the PRD before code)
- **PLAN** → `planning-and-task-breakdown` (small atomic tasks with acceptance criteria)
- **BUILD** → `incremental-implementation` + `test-driven-development`
- **VERIFY** → tests pass, build succeeds, runtime evidence captured
- **REVIEW** → `code-review-and-quality` (the verifier runs this)
- **SHIP** → `shipping-and-launch` (Pages deploy)

### Hard Rules

1. If a skill applies, you MUST invoke it. There is no task "too small" for a skill.
2. Never implement before a plan exists for the slice.
3. Every commit must include tests (or a test plan committed alongside).
4. Every change must build and tests must pass before declaring done.
5. Commit atomically — one logical change per commit. Reference the skill used.
6. Push after each atomic commit.

### Anti-Rationalization

The following thoughts are wrong. Do not act on them:

- "This is too small for a skill"
- "I can just quickly implement this"
- "I'll add tests later"
- "I can skip the spec, I know what to build"
- "I'll gather context first"

## Build & Test Commands

```bash
npm run dev      # start dev server
npm run build    # production build (must pass)
npm run lint     # eslint (must pass)
npm run test     # vitest (must pass when tests exist)
```

## File Conventions

- Source: `src/`
- Tests: collocated `*.test.ts(x)` or in adjacent `__tests__/`
- Styles: `*.module.css` (CSS Modules)
- Components: one file per component, PascalCase
- Hooks: `useXxx.ts`
- Utilities: `src/lib/`
- Design tokens: `src/styles/tokens.css`
- Game logic: `src/game/` (pure functions, fully unit-tested)
- Question system: `src/questions/` (isolated, mocked in game tests)

## Pre-Merge Checklist

```bash
npm test -- --run
npm run build
```

- Remove `console.log` and `debugger` statements
- Review recent commits: `git log --oneline`

## References

- `references/testing-patterns.md`
- `references/security-checklist.md`
- `references/performance-checklist.md`
- `references/accessibility-checklist.md`
