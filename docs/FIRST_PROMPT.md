# First session prompt for Claude Code

Paste the message below into a fresh Claude Code session, after dropping the files in this bundle into your empty repo. Do not modify `CLAUDE.md`, `README.md`, or `docs/` first — Claude Code should read them as-is.

---

## The prompt

> Read `CLAUDE.md` and `README.md` in full before doing anything else. Confirm by stating, in one sentence each, what this project is and what it explicitly is not.
>
> Then bootstrap the project skeleton:
>
> 1. Initialize a Vite + React + TypeScript project in this directory. Do not overwrite the existing `CLAUDE.md`, `README.md`, `docs/`, or `src/types/` and `src/scenes/` directories.
> 2. Add Tailwind CSS, Framer Motion, and configure TypeScript with strict mode enabled.
> 3. Create the empty directories described in `CLAUDE.md` (`src/player/`, `src/primitives/`, `src/assets/`) if they don't exist.
> 4. Create a minimal `App.tsx` that renders a full-screen near-black background (`#0a0a0a`) with the text "Chalkline — ready" centered in a large light-colored font (48px+, high contrast, readable from across a classroom).
> 5. Add a way to toggle into a `/dev` view (a query param like `?dev=1` or a key shortcut works fine for now). The dev view should be empty for now with placeholder text — it will house primitive previews later.
> 6. Configure the dev server so the content fills the viewport with no browser chrome competing for attention.
> 7. Add a `.gitignore`, a sensible `tsconfig.json` with strict mode, and any other standard config files Vite needs.
>
> Do **not**:
> - Build any visual primitives yet
> - Parse or render scene JSON yet
> - Add a router library
> - Add a state management library
> - Add any UI library beyond Tailwind and Framer Motion
>
> When done, list what you built and what you skipped. Then stop and wait for further instructions before touching the primitives.

---

## After bootstrap succeeds, the next prompts to consider

In rough order:

**Session 2 — keyboard controls and dim/blank states.** Build the global keyboard handler (Space, arrows, D, B, R, Esc) and the dim and blank overlay states. No scenes yet. Test by triggering states with keys and watching the screen respond. This is the classroom-respect layer; build it before any visual primitive so the controls aren't an afterthought.

**Session 3 — the first primitive.** Build the cause-effect chain primitive. It is the simplest: boxes connected by arrows, revealed sequentially. Render it on the `/dev` view in every state (initial, mid-animation, complete, dimmed, blanked). Read `docs/SCENE_FORMAT.md` for the `cause_effect_node` step type.

**Session 4 — the scene player shell.** Build the runtime that takes a scene JSON, walks through steps, and dispatches each step to the right primitive. Use `src/scenes/silk_road.example.json` as the test scene, even though most of its steps won't render yet (only `cause_effect_node` will work; others should be silently ignored with a console warning).

**Session 5 — the map primitive.** Largest primitive. Background loading, region highlighting, route tracing. Requires creating or sourcing a real SVG map asset. Discuss the asset source before this session.

After that, the remaining primitives (timeline, annotation, before/after, image-with-highlight) can be built in any order based on what the chosen chapter needs.

## Anti-patterns to watch for

Claude Code is excellent at this kind of project but tends to drift in specific ways. Catch them early:

- **Bouncy motion.** It will reach for spring physics by default. Reject this every time. The motion in this product is deliberately quiet.
- **Decorative animation.** It will add hover effects, micro-interactions, and gradient pulses to make the UI "feel polished." Reject all of it. The classroom is not a SaaS dashboard.
- **Over-building primitives.** It may want to make the map primitive support 12 configuration options when 3 are enough. Push back until you actually need a feature.
- **Generating scenes.** Do not let it write scene JSON for you. You author scenes by hand to learn the visual language. Once a chapter is done, then automation can be discussed.
- **Skipping the projector test.** It will declare animations complete based on how they look in its head. They need to look right on an actual projector before anything is "done."
