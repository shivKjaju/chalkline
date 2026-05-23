import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useKeyboardControls } from './useKeyboardControls';
import { ControlBar, type NavAction } from './ControlBar';
import { DIM_FADE_MS, DIM_OPACITY, EASE_IN_OUT } from '../motion';

/** The classroom-respect layer. Owns how the screen presents — normal, dimmed,
 *  or blanked — and whether the control overlay is showing, independent of what
 *  scene is rendered. The scene (its children) sits beneath these layers. */
export function Stage({ children }: { children: ReactNode }) {
  const [dimmed, setDimmed] = useState(false);
  const [blanked, setBlanked] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [pulse, setPulse] = useState<{ action: NavAction; nonce: number } | null>(null);

  const acknowledge = (action: NavAction) => setPulse({ action, nonce: Date.now() });

  useKeyboardControls({
    // No scene to navigate yet; acknowledged on screen here, wired to the scene
    // player in session 4.
    onNext: () => acknowledge('next'),
    onPrevious: () => acknowledge('prev'),
    onRestart: () => acknowledge('restart'),
    onDim: () => setDimmed((d) => !d),
    onBlank: () => setBlanked((b) => !b),
    onToggleControls: () => setControlsVisible((v) => !v),
  });

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0a0a]">
      {/* Scene */}
      <div className="relative z-0 h-full w-full">{children}</div>

      {/* Dim: the scene quiets but stays visible. Animate opacity only. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-black"
        initial={false}
        animate={{ opacity: dimmed ? DIM_OPACITY : 0 }}
        transition={{ duration: DIM_FADE_MS / 1000, ease: EASE_IN_OUT }}
      />

      {/* Control overlay. Above the dim layer so it stays readable; Esc hides it. */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-20 flex justify-center"
        initial={false}
        animate={{ opacity: controlsVisible ? 1 : 0 }}
        transition={{ duration: 0.25, ease: EASE_IN_OUT }}
        style={{ pointerEvents: controlsVisible ? 'auto' : 'none' }}
      >
        <ControlBar dimmed={dimmed} pulse={pulse} />
      </motion.div>

      {/* Blank: fully black, instant. Covers everything, including the controls. */}
      {blanked && <div aria-hidden className="absolute inset-0 z-30 bg-black" />}
    </div>
  );
}
