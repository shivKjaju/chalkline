import { useState } from 'react';
import type { Scene } from '../types/scene';
import { Stage } from './Stage';
import { ScenePlayer } from './ScenePlayer';
import silkRoadJson from '../scenes/silk_road.example.json';

// The active scene. JSON is structurally validated by the Scene type at the
// boundary; the cast is the one place we trust the file matches the format.
const scene = silkRoadJson as unknown as Scene;

/** The main presentation: a single scene driven by the keyboard. Owns the step
 *  position and hands navigation to the Stage. */
export function Presentation() {
  const [revealed, setRevealed] = useState(0);
  const total = scene.steps.length;

  return (
    <Stage
      status={{ title: scene.title, step: revealed, total }}
      onNext={() => setRevealed((r) => Math.min(r + 1, total))}
      onPrevious={() => setRevealed((r) => Math.max(r - 1, 0))}
      onRestart={() => setRevealed(0)}
    >
      <ScenePlayer scene={scene} revealed={revealed} />
    </Stage>
  );
}
