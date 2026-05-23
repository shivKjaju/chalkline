# Chalkline

A visual companion app for a single textbook chapter. As a teacher reads from the textbook in a classroom, they tap to advance through pages on a laptop driving a projector. Each page has a corresponding scene that builds up visually as the teacher teaches.

The teacher is the narrator. The app is the wall.

## Project goals (MVP)

- One textbook, one chapter (chosen during a Book + Classroom Access Sprint before content authoring begins)
- 5–8 hand-authored scenes (one per page in the chapter)
- Manual page advance via keyboard, mouse, or touch
- Dim and blank controls so the screen yields when the teacher needs it
- Runs offline in a browser on a classroom laptop driving a projector

## What's intentionally not in scope

See `CLAUDE.md` for the full list. In short: no AI generation, no voice recognition, no camera detection, no quizzes, no student app, no backend, no authentication.

## Tech stack

- React 18 + TypeScript (strict)
- Vite
- Tailwind CSS
- Framer Motion (animation)
- SVG (all visual primitives)
- Static deployment, offline-capable via service worker

## Setup

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

## Keyboard controls (locked design)

- `Space` or `→` : advance to next step / next page
- `←` : previous step / previous page
- `D` : dim the screen (lower brightness, scene visible but quiet)
- `B` : blank the screen (fully black, instant)
- `R` : restart current scene from the beginning
- `Esc` : hide control overlay
- `/dev` : (or a dev toggle) view every primitive in every state for debugging

## Project structure

See `CLAUDE.md` for the canonical structure and constraints.

## Authoring a new scene

See `docs/SCENE_FORMAT.md` for the complete authoring guide. The short version: copy `src/scenes/silk_road.example.json`, change the steps to suit your page, and add it to the chapter manifest.

## Pilot plan (context for design decisions)

This MVP exists to answer one question: **after the novelty of the first lesson wears off, do teachers want to use this for the next chapter?**

It is not designed to demo well at conferences. It is designed to be usable on a Wednesday morning in a real classroom, on a real projector, with a teacher who has not opened a help doc.

Pilot target: 3–5 teachers or tutors, one textbook chapter, two weeks of real classroom use.
