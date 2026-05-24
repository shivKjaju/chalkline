import DevView from './dev/DevView';
import { Presentation } from './player/Presentation';

/** The dev view is reachable only with a `?dev` (or `?dev=1`) query flag. There
 *  is deliberately no router: this is the single conditional branch the app
 *  takes, per the single-page constraint in CLAUDE.md. */
function isDevView(): boolean {
  return new URLSearchParams(window.location.search).has('dev');
}

export default function App() {
  if (isDevView()) {
    return <DevView />;
  }

  return <Presentation />;
}
