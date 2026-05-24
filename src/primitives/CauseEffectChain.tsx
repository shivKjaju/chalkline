import { forwardRef, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { EASE_IN_OUT } from '../motion';

export interface CauseEffectChainNode {
  /** The cause/effect statement shown in the box. */
  text: string;
  /** Reserved: icon name from a future icon set. Not rendered yet. */
  icon?: string;
}

interface CauseEffectChainProps {
  /** The full chain in causal order. All slots are laid out up front so that
   *  revealing a node never reflows the ones already shown. */
  nodes: CauseEffectChainNode[];
  /** How many nodes are revealed, 0..nodes.length. Raising it reveals the next
   *  node: its box fades and slides in, then the arrow leading into it traces
   *  from the previous box. */
  reveal: number;
  /** When false, revealed nodes and arrows appear instantly with no motion —
   *  for static previews and for jumping straight to a state. Default true. */
  animate?: boolean;
}

const BOX_FADE_S = 0.8;
const ARROW_TRACE_S = 0.6;
const ARROWHEAD_FADE_S = 0.2;
/** Pixels of clear space between a box edge and the arrow's tip/tail. */
const ARROW_GAP = 12;

interface ArrowGeom {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** A horizontal chain of boxes connected by arrows, read left to right as cause
 *  leading to effect. Boxes are HTML (wrapping text); arrows are an SVG layer
 *  beneath them. Chalk on a blackboard: light strokes on near-black, no fill,
 *  no colour — colour is reserved for places where it carries meaning. */
export function CauseEffectChain({ nodes, reveal, animate = true }: CauseEffectChainProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [arrows, setArrows] = useState<ArrowGeom[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Measure each gap between consecutive boxes so arrows can be drawn in SVG.
  // All boxes are always laid out, so geometry only changes on resize — not on
  // reveal — which is what keeps revealing a node from shifting the others.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const geoms: ArrowGeom[] = [];
      for (let i = 1; i < nodes.length; i++) {
        const prev = boxRefs.current[i - 1];
        const cur = boxRefs.current[i];
        if (!prev || !cur) continue;
        geoms.push({
          x1: prev.offsetLeft + prev.offsetWidth + ARROW_GAP,
          y1: prev.offsetTop + prev.offsetHeight / 2,
          x2: cur.offsetLeft - ARROW_GAP,
          y2: cur.offsetTop + cur.offsetHeight / 2,
        });
      }
      setSize({ w: container.clientWidth, h: container.clientHeight });
      setArrows(geoms);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [nodes]);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {/* Arrow layer, beneath the boxes. */}
      <svg
        className="pointer-events-none absolute left-0 top-0 z-0 text-neutral-300"
        width={size.w}
        height={size.h}
        aria-hidden
      >
        {arrows.map((geom, i) => (
          // arrows[i] connects box i to box i+1; drawn once box i+1 is revealed.
          <Arrow key={i} geom={geom} drawn={reveal > i + 1} animate={animate} />
        ))}
      </svg>

      {/* Boxes, on top. */}
      <div className="relative z-10 flex h-full items-center justify-center gap-16">
        {nodes.map((node, i) => (
          <Box
            key={i}
            ref={(el) => {
              boxRefs.current[i] = el;
            }}
            text={node.text}
            revealed={i < reveal}
            animate={animate}
          />
        ))}
      </div>
    </div>
  );
}

interface BoxProps {
  text: string;
  revealed: boolean;
  animate: boolean;
}

const Box = forwardRef<HTMLDivElement, BoxProps>(function Box({ text, revealed, animate }, ref) {
  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 8 }}
      transition={animate ? { duration: BOX_FADE_S, ease: EASE_IN_OUT } : { duration: 0 }}
      aria-hidden={!revealed}
      className="w-56 rounded-lg border-2 border-neutral-300 bg-[#0a0a0a] px-6 py-5 text-center text-[1.75rem] font-light leading-snug text-neutral-50"
    >
      {text}
    </motion.div>
  );
});

interface ArrowProps {
  geom: ArrowGeom;
  drawn: boolean;
  animate: boolean;
}

function Arrow({ geom, drawn, animate }: ArrowProps) {
  const { x1, y1, x2, y2 } = geom;
  const length = Math.hypot(x2 - x1, y2 - y1);
  const head = `M ${x2 - 11} ${y2 - 7} L ${x2} ${y2} L ${x2 - 11} ${y2 + 7}`;

  return (
    <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {/* The shaft traces from the previous box, after that box has appeared. */}
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        strokeDasharray={length}
        initial={false}
        animate={{ strokeDashoffset: drawn ? 0 : length }}
        transition={
          animate
            ? { duration: ARROW_TRACE_S, ease: 'linear', delay: drawn ? BOX_FADE_S : 0 }
            : { duration: 0 }
        }
      />
      {/* The arrowhead lands once the shaft finishes tracing. */}
      <motion.path
        d={head}
        initial={false}
        animate={{ opacity: drawn ? 1 : 0 }}
        transition={
          animate
            ? { duration: ARROWHEAD_FADE_S, ease: EASE_IN_OUT, delay: drawn ? BOX_FADE_S + ARROW_TRACE_S : 0 }
            : { duration: 0 }
        }
      />
    </g>
  );
}
