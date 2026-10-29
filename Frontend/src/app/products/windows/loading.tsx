/**
 * Instant nav feedback while the Windows route streams.
 */
export default function WindowsProductLoading() {
  return (
    <main className="phPage flex flex-1 flex-col" aria-busy="true">
      <div
        className="winHero"
        style={{ minHeight: "70vh" }}
        aria-hidden="true"
      />
      <p className="sr-only">Loading Windows VPS</p>
    </main>
  );
}
