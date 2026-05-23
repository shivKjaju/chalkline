/** Debug-only view, reachable at `?dev=1`. It will grow to render every visual
 *  primitive in every state (initial, mid-animation, complete, dimmed, blanked)
 *  for review on a real projector. Empty placeholder for now. */
export default function DevView() {
  return (
    <main className="flex h-full w-full items-center justify-center bg-[#0a0a0a] text-neutral-500">
      <p className="text-2xl font-light">/dev — primitive previews will appear here</p>
    </main>
  );
}
