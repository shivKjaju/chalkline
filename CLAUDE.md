# CLAUDE.md

> Read this file at the start of every session. The constraints here apply to all code, design, and content decisions in this project. When in doubt, re-read this file rather than guessing.

## What this project is

This is **Chalkline** — a visual companion app for a single textbook chapter. As a teacher reads from the textbook in a classroom, they tap to advance through pages on a laptop driving a projector. Each page has a corresponding **scene** that builds up visually as the teacher teaches — maps populate, routes trace, timelines fill in, diagrams assemble.

**The teacher is the narrator. The app is the wall.**

We are not building a lesson generator, a quiz tool, a student app, or an LMS. We are building one quiet, beautiful, classroom-respecting visual layer.

## What this project is NOT

The following are explicitly out of scope and must never be added without explicit user instruction:

- AI-generated content (no LLM calls at runtime; no on-the-fly scene generation)
- Voice recognition or audio input
- Camera-based page detection
- Quiz, polling, or student-facing features
- Teacher accounts, authentication, or any backend
- LMS integration
- Cross-textbook generalization
- Real-time multiplayer / sync features
- Telemetry / analytics that require a network

If a feature request seems to require any of the above, surface the conflict before writing code.

## Visual language rules

These rules are strict.

**Allowed primitives** (build these as React components, one at a time, in `src/primitives/`):

- Map with region highlight, point marker, and route trace
- Timeline with sequential markers
- Cause-effect chain (boxes connected by arrows, revealed in sequence)
- Process diagram with sequential label reveals
- Before/after comparison (split view, revealed one side at a time)
- Image with zoom and region highlight
- Text annotation overlay

**Forbidden aesthetic patterns:**

- Decorative motion (motion that does not depict something specific)
- Cinematic camera pans
- Particle effects, sparkles, glows for emphasis
- Characters or faces, especially historical figures
- Crowds, soldiers, violence, or dramatic reenactments
- Hero/villain framing
- Emotional or atmospheric background music
- Loading spinners or progress bars during scene playback
- Bouncy or springy motion of any kind

The aesthetic target is **"a great teacher's blackboard drawing, brought to life slowly."** Not Pixar. Not YouTube. Not Duolingo. Not a SaaS landing page.

## Motion defaults

- Default duration: **800ms to 2000ms** depending on element complexity
- Default easing: **ease-in-out** — in Framer Motion, the cubic-bezier `[0.4, 0, 0.2, 1]`
- No spring physics
- No overshoot, no bounce, no elastic
- Route traces: linear easing, duration proportional to length (rough rule: 800ms per major waypoint)
- Element fade-ins: 600–1000ms, optional 8px upward slide on entry
- Element fade-outs are rare; prefer dimming the entire scene over removing individual elements

## Scene format philosophy

- Scenes are **pure data** (JSON files in `src/scenes/`)
- Scenes contain no executable logic, no expressions, no callbacks
- Authoring a scene = editing JSON. It must be possible for a non-programmer to author scenes after reading `docs/SCENE_FORMAT.md`
- A scene is an ordered list of `steps`. Each step is one visual change
- The teacher's tap advances to the next step
- A step may set `autoAdvance: <ms>` to chain to the next step automatically — use sparingly

If you ever find yourself wanting to put logic inside a scene file, instead create a new primitive or step type and keep the scene declarative.

## Performance and display constraints

- Target hardware: 5-year-old classroom laptops driving 1080p projectors
- Test on Chrome (Chromium) as primary target; Firefox and Safari are nice-to-have
- Animations must run smoothly at 60fps on the above
- Rendering technology:
  - SVG for spatial and geometric content: maps, routes, arrows, lines, shapes, regions
  - HTML + CSS for text-bearing content: boxes with wrapping text, labels, annotations, captions
  - Framer Motion handles animation for both
  - Never use Canvas or WebGL
- Animate `transform` and `opacity` only; avoid layout thrashing

## Projector design rules

- Default background: very dark (near-black, not pure black — `#0a0a0a` or similar)
- Default foreground: high contrast, saturated colors
- Default font size: minimum 24px for body text, 48px+ for headings and labels
- Default stroke width: 2px minimum for lines, 4px+ for routes and emphasis
- Test every scene on a real projector before declaring it done

## Offline and deployment

- The app must work fully offline once loaded
- Service worker caches all scene JSON and assets
- No runtime network calls in MVP
- Deploy as static files (Vercel, Netlify, or even `dist/` on a USB stick)

## Tech stack (locked for MVP — do not substitute without discussion)

- **React 18 + TypeScript** (strict mode)
- **Vite** for dev/build
- **Tailwind CSS** for layout and theming
- **Framer Motion** for animation
- **SVG** for all visual primitives
- No state management library (Zustand/Redux unnecessary at this scope)
- No router for MVP (single-page app; a `/dev` view can be a conditional render)
- No backend

## Project structure

```
/
├── CLAUDE.md                   ← this file
├── README.md                   ← project overview
├── docs/
│   ├── SCENE_FORMAT.md         ← scene authoring guide
│   └── FIRST_PROMPT.md         ← initial Claude Code instructions
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── player/                 ← scene player runtime
│   │   ├── ScenePlayer.tsx
│   │   ├── ControlBar.tsx
│   │   └── PageRail.tsx
│   ├── primitives/             ← visual primitives (one file per primitive)
│   │   ├── Map.tsx
│   │   ├── Timeline.tsx
│   │   ├── CauseEffectChain.tsx
│   │   └── ...
│   ├── scenes/                 ← scene JSON files (one per page)
│   │   └── *.json
│   ├── assets/                 ← SVG maps, illustrations
│   └── types/
│       └── scene.ts            ← TypeScript types for scene format
```

## Development workflow rules

- Build one primitive at a time. Never start a second primitive before the first works correctly on a projector.
- Maintain a `/dev` view that renders every primitive in every state (initial, mid-animation, complete, dimmed, blanked) for visual debugging. Update it whenever you add a primitive.
- Commit early and often. Each primitive is its own commit at minimum.
- Run `npm run dev` and look at the screen after every meaningful change. This is a visual product; code review alone does not tell you if it works.
- Never declare an animation "done" without watching it play in the browser yourself.

## When in doubt

Ask one question: **"What on the textbook page becomes easier to understand because of this visual?"**

If the answer is weak, the visual should be simpler or not exist.
