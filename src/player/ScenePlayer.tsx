import { useEffect, useRef } from 'react';
import type { CauseEffectNodeStep, Scene, SceneStep } from '../types/scene';
import { CauseEffectChain, type CauseEffectChainNode } from '../primitives/CauseEffectChain';

/** Step types that have a primitive today. Everything else is walked over with a
 *  console warning until its primitive lands. */
const IMPLEMENTED: ReadonlySet<SceneStep['type']> = new Set(['cause_effect_node']);

interface ScenePlayerProps {
  scene: Scene;
  /** How many of the scene's steps have been played, 0..steps.length. At 0 the
   *  title card shows; each advance applies the next step in order. */
  revealed: number;
}

/** Walks a scene's steps in order and renders the resulting visual state. The
 *  teacher's tap is what changes `revealed`; this component is otherwise a pure
 *  function of (scene, revealed). */
export function ScenePlayer({ scene, revealed }: ScenePlayerProps) {
  const warned = useRef<Set<number>>(new Set());

  // Warn once for each unimplemented step as it is first reached. Kept in an
  // effect so rendering stays pure and stepping backward never re-warns.
  useEffect(() => {
    for (let i = 0; i < revealed; i++) {
      const step = scene.steps[i];
      if (!IMPLEMENTED.has(step.type) && !warned.current.has(i)) {
        console.warn(`[ScenePlayer] step ${i + 1} ("${step.type}") has no primitive yet — skipped.`);
        warned.current.add(i);
      }
    }
  }, [scene, revealed]);

  if (revealed === 0 && scene.showTitle !== false) {
    return (
      <div className="flex h-full w-full items-center justify-center px-16 text-center">
        <h1 className="text-6xl font-light tracking-tight text-neutral-50">{scene.title}</h1>
      </div>
    );
  }

  // Cause-effect chain: every node in the scene, revealed up to the current step.
  const chainNodes: CauseEffectChainNode[] = scene.steps
    .filter((s): s is CauseEffectNodeStep => s.type === 'cause_effect_node')
    .map((s) => ({ text: s.text, icon: s.icon }));
  const chainReveal = scene.steps
    .slice(0, revealed)
    .filter((s) => s.type === 'cause_effect_node').length;

  return (
    <div className="h-full w-full">
      {chainNodes.length > 0 && <CauseEffectChain nodes={chainNodes} reveal={chainReveal} />}
    </div>
  );
}
