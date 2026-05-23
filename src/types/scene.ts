// Scene format types.
// Source of truth for the format is docs/SCENE_FORMAT.md.
// Keep these types in sync with the documentation; if you change one, change the other.

export type ThemeColor =
  | 'amber'
  | 'rose'
  | 'emerald'
  | 'sky'
  | 'violet'
  | 'slate';

export type Position =
  | 'midpoint'
  | 'top'
  | 'bottom'
  | { x: number; y: number };

/** Fields available on every step type. */
interface BaseStep {
  /** If present, advance to the next step automatically after this many ms. Use sparingly. */
  autoAdvance?: number;
  /** Minimum ms before a tap can advance from this step. Prevents accidental skipping. */
  pauseAfter?: number;
  /** Author's note about why this step exists. Required by convention; not displayed. */
  note?: string;
}

export interface SetBackgroundStep extends BaseStep {
  type: 'set_background';
  /** Asset name in src/assets/, without extension. */
  asset: string;
}

export interface HighlightRegionStep extends BaseStep {
  type: 'highlight_region';
  /** ID of the region inside the current background SVG. */
  region: string;
  label?: string;
  color?: ThemeColor;
  /** ms (default 1200) */
  duration?: number;
}

export interface TraceRouteStep extends BaseStep {
  type: 'trace_route';
  /** Waypoint ID inside the current background SVG. */
  from: string;
  /** Waypoint ID inside the current background SVG. */
  to: string;
  /** Intermediate waypoint IDs, in order. */
  via?: string[];
  /** ms (default 4000) */
  duration?: number;
  color?: ThemeColor;
  /** Optional label rendered at route midpoint after the trace completes. */
  label?: string;
}

export interface TimelineMarkerStep extends BaseStep {
  type: 'timeline_marker';
  year: string;
  event: string;
}

export interface CauseEffectNodeStep extends BaseStep {
  type: 'cause_effect_node';
  text: string;
  /** Optional icon name from the icon set. */
  icon?: string;
}

export interface AnnotationStep extends BaseStep {
  type: 'annotation';
  text: string;
  position?: Position;
  /** Fade-in duration in ms (default 800) */
  duration?: number;
}

export interface ClearStep extends BaseStep {
  type: 'clear';
}

export type SceneStep =
  | SetBackgroundStep
  | HighlightRegionStep
  | TraceRouteStep
  | TimelineMarkerStep
  | CauseEffectNodeStep
  | AnnotationStep
  | ClearStep;

export interface Scene {
  /** Kebab-case identifier, used as filename stem. */
  id: string;
  /** Textbook page number this scene corresponds to. */
  page: number;
  /** Short title shown briefly at scene start (unless showTitle is false). */
  title: string;
  /** One-line summary of instructional goal. For authors only; not displayed. */
  topic: string;
  /** If false, suppress the title card at scene start. */
  showTitle?: boolean;
  steps: SceneStep[];
}

export interface Chapter {
  id: string;
  textbook: string;
  chapter: string;
  scenes: Scene[];
}
