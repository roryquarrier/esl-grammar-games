# ESL Grammar Games

Connect 4 grammar game for ESL learners aged 5–11 in Hong Kong.

## Tech Stack

- Vite + React + TypeScript
- Framer Motion (M3 Expressive spring animations)
- Zustand (game state machine)
- CSS Modules + custom properties
- Supabase (scoreboard, persistence)
- Clerk (auth)
- SVG + Lottie (hybrid animations)

## Design

- Material 3 Expressive + minimal retro
- Monochromatic green palette: #22613e, #28ba72, #99dbb0, #def3e4, #121212
- Responsive: iPad landscape (primary), iPad portrait, mobile portrait/landscape, desktop
- Fullscreen mode with mute toggle

## Grammar

- Cambridge "Grammar in Use" trilogy (Red/Blue/Green)
- LLM-generated original questions, British English, HK-culture references
- Text-only (no image references)

## Turn Flow

Question → wrong = new Q (retry) → 3 wrong = 5s cooldown then reset → correct = unlock Connect 4 move → turn never forfeited

## Books

- Red (A1–B1, beginner, ages 5–7)
- Blue (B1–B2, intermediate, ages 8–9)
- Green (C1–C2, advanced, ages 10–11)
