import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useKeyboardControls } from './useKeyboardControls';
import { ControlBar, type NavAction } from './ControlBar';
import { DIM_FADE_MS, DIM_OPACITY, EASE_IN_OUT } from '../motion';

interface StageProps {
  children: ReactNode;
  /** Advance / retreat / restart, invoked by the keyboard. Optional so the Stage
   *  can wrap content that has nothing to navigate. */
  onNext?: () => void;
  onPrevious?: () => void;
  onRestart?: () => void;
  /** Small readout shown in the control bar: scene title and position. */
  status?: { title: string; step: number; total: number };
}

/** The classroom-respect layer. Owns how the screen presents — normal, dimmed,
 *  or blanked — and whether the control overlay is showing, independent of what
 *  scene is rendered. The scene (its children) sits beneath these layers. */
export function Stage({ children, onNext, onPrevious, onRestart, status }: StageProps) {
  const [dimmed, setDimmed] = useState(false);
  const [blanked, setBlanked] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [pulse, setPulse] = useState<{ action: NavAction; nonce: number } | null>(null);

  const acknowledge = (action: NavAction) => setPulse({ action, nonce: Date.now() });

  useKeyboardControls({
    // The pulse acknowledges the tap on screen; the callback advances the scene.
    onNext: () => {
      acknowledge('next');
      onNext?.();
    },
    onPrevious: () => {
      acknowledge('prev');
      onPrevious?.();
    },
    onRestart: () => {
      acknowledge('restart');
      onRestart?.();
    },
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
        <ControlBar dimmed={dimmed} pulse={pulse} status={status} />
      </motion.div>

      {/* Blank: fully black, instant. Covers everything, including the controls. */}
      {blanked && <div aria-hidden className="absolute inset-0 z-30 bg-black" />}
    </div>
  );
}
