import { useEffect, useState } from 'react';

/** Navigation actions that have no scene to act on yet (session 4). Pressing
 *  one briefly highlights its key here so the binding is verifiable on screen. */
export type NavAction = 'next' | 'prev' | 'restart';

interface ControlBarProps {
  /** Whether the scene is currently dimmed; shown as a persistent active state. */
  dimmed: boolean;
  /** A navigation key press to acknowledge. The nonce changes on every press so
   *  repeated presses of the same key re-trigger the highlight. */
  pulse: { action: NavAction; nonce: number } | null;
  /** Optional scene title and position readout. */
  status?: { title: string; step: number; total: number };
}

/** How long a navigation key stays highlighted after it is pressed (ms). */
const PULSE_MS = 450;

/** The control overlay: a quiet legend of the locked key bindings, shown along
 *  the bottom edge and hidden with Esc. Operator chrome, not scene content. */
export function ControlBar({ dimmed, pulse, status }: ControlBarProps) {
  const [active, setActive] = useState<NavAction | null>(null);

  useEffect(() => {
    if (!pulse) return;
    setActive(pulse.action);
    const id = window.setTimeout(() => setActive(null), PULSE_MS);
    return () => window.clearTimeout(id);
  }, [pulse]);

  return (
    <div className="mb-8 flex select-none items-center gap-6 rounded-2xl bg-neutral-900/85 px-6 py-4">
      {status && (
        <>
          <span className="flex items-center gap-2 text-sm">
            <span className="text-neutral-300">{status.title}</span>
            <span className="tabular-nums text-neutral-500">
              {status.step}/{status.total}
            </span>
          </span>
          <Divider />
        </>
      )}
      <Control keys={['Space', '→']} label="Next" highlight={active === 'next'} />
      <Control keys={['←']} label="Back" highlight={active === 'prev'} />
      <Divider />
      <Control keys={['D']} label="Dim" toggled={dimmed} />
      <Control keys={['B']} label="Blank" />
      <Control keys={['R']} label="Restart" highlight={active === 'restart'} />
      <Divider />
      <Control keys={['Esc']} label="Hide" />
    </div>
  );
}

function Divider() {
  return <span aria-hidden className="h-5 w-px bg-neutral-700" />;
}

interface ControlProps {
  keys: string[];
  label: string;
  /** Persistent active state, e.g. the screen is dimmed. */
  toggled?: boolean;
  /** Momentary acknowledgement that the key was just pressed. */
  highlight?: boolean;
}

function Control({ keys, label, toggled = false, highlight = false }: ControlProps) {
  const accent = toggled || highlight;
  return (
    <span className="flex items-center gap-2">
      {keys.map((k) => (
        <kbd
          key={k}
          className={[
            'inline-flex min-w-[1.75rem] items-center justify-center rounded-md border px-2 py-1',
            'text-sm font-medium transition-colors duration-200',
            accent
              ? 'border-amber-400 bg-amber-400/10 text-amber-200'
              : 'border-neutral-600 text-neutral-200',
          ].join(' ')}
        >
          {k}
        </kbd>
      ))}
      <span
        className={[
          'text-sm transition-colors duration-200',
          accent ? 'text-amber-200' : 'text-neutral-400',
        ].join(' ')}
      >
        {label}
      </span>
    </span>
  );
}
