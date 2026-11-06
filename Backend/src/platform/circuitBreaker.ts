/**
 * Measured failure isolation for slow upstreams. Open never invents success.
 */
export type BreakerState = "closed" | "open" | "half_open";

export type BreakerSnapshot = {
  name: string;
  state: BreakerState;
  failures: number;
  openedAt: number | null;
  lastFailureAt: number | null;
};

export type BreakerOptions = {
  name: string;
  failureThreshold?: number;
  openMs?: number;
  halfOpenMax?: number;
  now?: () => number;
};

type GateResult =
  | { kind: "run"; finish: (ok: boolean) => void }
  | { kind: "open" };

export class CircuitBreaker {
  readonly name: string;
  private readonly failureThreshold: number;
  private readonly openMs: number;
  private readonly halfOpenMax: number;
  private readonly now: () => number;
  private state: BreakerState = "closed";
  private failures = 0;
  private openedAt: number | null = null;
  private lastFailureAt: number | null = null;
  private halfOpenInFlight = 0;

  constructor(opts: BreakerOptions) {
    this.name = opts.name;
    this.failureThreshold = opts.failureThreshold ?? 5;
    this.openMs = opts.openMs ?? 30_000;
    this.halfOpenMax = opts.halfOpenMax ?? 1;
    this.now = opts.now ?? Date.now;
  }

  snapshot(): BreakerSnapshot {
    this.maybeHalfOpen();
    return {
      name: this.name,
      state: this.state,
      failures: this.failures,
      openedAt: this.openedAt,
      lastFailureAt: this.lastFailureAt,
    };
  }

  /** Acquire permission to run one call. */
  enter(): GateResult {
    this.maybeHalfOpen();
    if (this.state === "open") return { kind: "open" };
    if (this.state === "half_open") {
      if (this.halfOpenInFlight >= this.halfOpenMax) return { kind: "open" };
      this.halfOpenInFlight += 1;
    }
    return {
      kind: "run",
      finish: (ok: boolean) => {
        if (this.state === "half_open") {
          this.halfOpenInFlight = Math.max(0, this.halfOpenInFlight - 1);
          if (ok) {
            this.state = "closed";
            this.failures = 0;
            this.openedAt = null;
            return;
          }
          this.trip();
          return;
        }
        if (ok) {
          this.failures = 0;
          return;
        }
        this.failures += 1;
        this.lastFailureAt = this.now();
        if (this.failures >= this.failureThreshold) this.trip();
      },
    };
  }

  async exec<T>(fn: () => Promise<T>): Promise<
    { ok: true; value: T } | { ok: false; reason: "circuit_open" }
  > {
    const gate = this.enter();
    if (gate.kind === "open") return { ok: false, reason: "circuit_open" };
    try {
      const value = await fn();
      gate.finish(true);
      return { ok: true, value };
    } catch (err) {
      gate.finish(false);
      throw err;
    }
  }

  /** Record outcome when the caller already ran the work. */
  record(ok: boolean): void {
    const gate = this.enter();
    if (gate.kind === "open") return;
    gate.finish(ok);
  }

  private trip(): void {
    this.state = "open";
    this.openedAt = this.now();
    this.halfOpenInFlight = 0;
  }

  private maybeHalfOpen(): void {
    if (this.state !== "open" || this.openedAt == null) return;
    if (this.now() - this.openedAt < this.openMs) return;
    this.state = "half_open";
    this.halfOpenInFlight = 0;
  }
}

const registry = new Map<string, CircuitBreaker>();

export function getBreaker(name: string, opts?: Omit<BreakerOptions, "name">): CircuitBreaker {
  const existing = registry.get(name);
  if (existing) return existing;
  const created = new CircuitBreaker({ name, ...opts });
  registry.set(name, created);
  return created;
}

export function listBreakers(): BreakerSnapshot[] {
  return [...registry.values()].map((b) => b.snapshot());
}

/** Test helper — clears the process-wide registry. */
export function resetBreakersForTests(): void {
  registry.clear();
}
