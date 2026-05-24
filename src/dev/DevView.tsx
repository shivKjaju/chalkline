import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CauseEffectChain, type CauseEffectChainNode } from '../primitives/CauseEffectChain';
import { ScenePlayer } from '../player/ScenePlayer';
import type { Scene } from '../types/scene';
import { DIM_FADE_MS, DIM_OPACITY } from '../motion';

/** A short causal chain from the sample chapter, used to exercise the primitive. */
const SAMPLE: CauseEffectChainNode[] = [
  { text: 'Silk woven in China' },
  { text: 'Caravans carry it across Central Asia' },
  { text: 'Roman markets pay high prices' },
  { text: 'Trade routes flourish for centuries' },
];

/** How long a single node's full reveal takes (box fade + arrow trace + slack). */
const STEP_MS = 1600;

/** Dev fixture (not chapter content): exercises the player with cause-effect
 *  nodes plus one unimplemented step that should be skipped with a warning. */
const FIXTURE: Scene = {
  id: 'dev-pipeline',
  page: 0,
  title: 'Pipeline demo',
  topic: 'Dev fixture exercising the player end to end.',
  steps: [
    { type: 'cause_effect_node', text: 'Silk woven in China' },
    { type: 'cause_effect_node', text: 'Caravans carry it across Central Asia' },
    { type: 'annotation', text: 'Goods, ideas, and faiths travel too', position: 'midpoint' },
    { type: 'cause_effect_node', text: 'Roman markets pay high prices' },
    { type: 'cause_effect_node', text: 'Trade routes flourish for centuries' },
  ],
};

/** Debug-only view (reachable at `?dev=1`) for inspecting primitives and the
 *  player pipeline on a real projector, without playing the chapter. */
export default function DevView() {
  return (
    <div className="h-full overflow-y-auto bg-[#0a0a0a] px-10 py-8 text-neutral-100">
      <header className="mb-8">
        <h1 className="text-3xl font-light">/dev — previews</h1>
        <p className="mt-1 text-neutral-500">Inspect primitives and the scene player on a real projector.</p>
      </header>
      <ChainSection />
      <PlayerSection />
    </div>
  );
}

/** The cause-effect chain on its own, in every state. */
function ChainSection() {
  const [reveal, setReveal] = useState(0);
  const [instant, setInstant] = useState(false);
  const [dimmed, setDimmed] = useState(false);
  const [blanked, setBlanked] = useState(false);
  const replayTimer = useRef<number | null>(null);

  const stopReplay = () => {
    if (replayTimer.current !== null) {
      window.clearTimeout(replayTimer.current);
      replayTimer.current = null;
    }
  };
  useEffect(() => stopReplay, []);

  const go = (n: number) => {
    stopReplay();
    setReveal(n);
  };

  // Rebuild the chain from empty, one node at a time, so the sequential
  // box-fade-then-arrow-trace can be watched end to end.
  const replay = () => {
    stopReplay();
    setInstant(false);
    setReveal(0);
    let n = 0;
    const tick = () => {
      n += 1;
      setReveal(n);
      replayTimer.current = n < SAMPLE.length ? window.setTimeout(tick, STEP_MS) : null;
    };
    replayTimer.current = window.setTimeout(tick, 400);
  };

  return (
    <section>
      <h2 className="text-2xl font-light">Cause-effect chain</h2>
      <p className="mt-1 text-neutral-500">
        Trigger each state. Steps animate (box fades in, then the arrow traces); turn on Instant for
        static snapshots.
      </p>

      <div className="my-4 flex flex-wrap items-center gap-x-8 gap-y-3">
        <Group label="Reveal">
          {Array.from({ length: SAMPLE.length + 1 }, (_, n) => (
            <Btn key={n} active={reveal === n} onClick={() => go(n)}>
              {n}
            </Btn>
          ))}
        </Group>
        <Group label="Play">
          <Btn onClick={replay}>Replay ↺</Btn>
        </Group>
        <Group label="Screen">
          <Btn active={dimmed} onClick={() => setDimmed((v) => !v)}>
            Dim
          </Btn>
          <Btn active={blanked} onClick={() => setBlanked((v) => !v)}>
            Blank
          </Btn>
        </Group>
        <Group label="Motion">
          <Btn active={instant} onClick={() => setInstant((v) => !v)}>
            Instant
          </Btn>
        </Group>
        <span className="text-sm text-neutral-500">
          {reveal} / {SAMPLE.length} revealed
        </span>
      </div>

      <div className="relative h-[60vh] min-h-[360px] overflow-hidden rounded-xl border border-neutral-800 bg-[#0a0a0a]">
        <CauseEffectChain nodes={SAMPLE} reveal={reveal} animate={!instant} />

        {/* Dim and blank mirror the Stage overlays, scoped to this preview box. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black"
          style={{ opacity: dimmed ? DIM_OPACITY : 0, transition: `opacity ${DIM_FADE_MS}ms ease-in-out` }}
        />
        {blanked && <div aria-hidden className="absolute inset-0 bg-black" />}
      </div>
    </section>
  );
}

/** The scene player walking a fixture scene the way the keyboard would. */
function PlayerSection() {
  const [revealed, setRevealed] = useState(0);
  const total = FIXTURE.steps.length;
  const lastType = revealed > 0 ? FIXTURE.steps[revealed - 1].type : null;
  const skipped = lastType !== null && lastType !== 'cause_effect_node';

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-light">Scene player — pipeline</h2>
      <p className="mt-1 text-neutral-500">
        Steps through a fixture scene as the keyboard does. The chain holds while the unimplemented
        annotation step is walked over (and logged to the console).
      </p>

      <div className="my-4 flex flex-wrap items-center gap-x-8 gap-y-3">
        <Group label="Step">
          <Btn onClick={() => setRevealed((r) => Math.max(r - 1, 0))}>◀ Prev</Btn>
          <Btn onClick={() => setRevealed((r) => Math.min(r + 1, total))}>Next ▶</Btn>
          <Btn onClick={() => setRevealed(0)}>Restart</Btn>
        </Group>
        <span className="text-sm text-neutral-500">
          {revealed} / {total}
          {lastType && (
            <span className={skipped ? 'text-amber-300' : 'text-neutral-400'}>
              {' · '}
              {lastType}
              {skipped ? ' (skipped)' : ''}
            </span>
          )}
        </span>
      </div>

      <div className="relative h-[60vh] min-h-[360px] overflow-hidden rounded-xl border border-neutral-800 bg-[#0a0a0a]">
        <ScenePlayer scene={FIXTURE} revealed={revealed} />
      </div>
    </section>
  );
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs uppercase tracking-wider text-neutral-600">{label}</span>
      <div className="flex gap-1.5">{children}</div>
    </div>
  );
}

function Btn({
  children,
  onClick,
  active = false,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'rounded-md border px-3 py-1.5 text-sm transition-colors',
        active
          ? 'border-amber-400 bg-amber-400/10 text-amber-200'
          : 'border-neutral-700 text-neutral-300 hover:border-neutral-500',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
