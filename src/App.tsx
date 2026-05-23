import DevView from './dev/DevView';

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

  return (
    <main className="flex h-full w-full items-center justify-center bg-[#0a0a0a] text-neutral-100">
      <h1 className="text-6xl font-light tracking-tight">Chalkline — ready</h1>
    </main>
  );
}
