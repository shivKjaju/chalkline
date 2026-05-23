// Shared motion defaults from CLAUDE.md. Every animated element uses the same
// quiet ease-in-out curve — no spring, no overshoot, no bounce.

/** Cubic-bezier ease-in-out. The single easing curve for the whole app. */
export const EASE_IN_OUT: [number, number, number, number] = [0.4, 0, 0.2, 1];

/** How long the scene takes to dim down or back up (ms). */
export const DIM_FADE_MS = 700;

/** Opacity of the black scrim when the scene is dimmed. Quiet, still visible. */
export const DIM_OPACITY = 0.6;
