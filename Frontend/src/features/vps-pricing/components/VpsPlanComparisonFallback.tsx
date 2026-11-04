/**
 * Specs table placeholder while searchParams hydrate.
 */
export function VpsPlanComparisonFallback() {
  return (
    <section
      id="compare-plans"
      className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
      aria-busy="true"
      aria-label="Loading plan comparison"
    >
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto h-3 w-28 rounded bg-muted/40" />
        <div className="mx-auto mt-3 h-9 w-64 max-w-full rounded bg-muted/50" />
        <div className="mx-auto mt-3 h-4 w-full max-w-md rounded bg-muted/30" />
      </div>
      <div className="mt-8 min-h-[28rem] overflow-hidden rounded-xl border border-border bg-card/40">
        <div className="grid h-14 grid-cols-3 border-b border-border bg-muted/10">
          <div className="border-r border-border" />
          <div className="border-r border-border" />
          <div />
        </div>
        <div className="space-y-3 p-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="h-10 rounded bg-muted/25" />
          ))}
        </div>
      </div>
    </section>
  );
}
