/**
 * Module cart store — multi-line localStorage + same-tab listeners.
 */
import {
  CART_STORAGE_KEY,
  type CartLine,
  type CartState,
} from "@/features/cart/model/cartTypes";
import { readCartState, writeCartState } from "@/features/cart/lib/cartStorage";

const CART_EVENT = "runracks-cart";

type Listener = () => void;

const listeners = new Set<Listener>();

let cacheRaw: string | null | undefined;
let cacheLines: CartLine[] = [];
const EMPTY_LINES: CartLine[] = [];

function notify() {
  cacheRaw = undefined;
  for (const listener of listeners) listener();
}

function readCachedLines(): CartLine[] {
  if (typeof window === "undefined") return EMPTY_LINES;
  const raw = window.localStorage.getItem(CART_STORAGE_KEY);
  if (raw === cacheRaw) return cacheLines;
  cacheRaw = raw;
  const next = readCartState().lines;
  cacheLines = next.length === 0 ? EMPTY_LINES : next;
  return cacheLines;
}

export function getCartSnapshot(): CartLine[] {
  return readCachedLines();
}

export function getCartServerSnapshot(): CartLine[] {
  return EMPTY_LINES;
}

export function subscribeCart(onStoreChange: Listener): () => void {
  listeners.add(onStoreChange);
  function onStorage(event: StorageEvent) {
    if (event.key !== CART_STORAGE_KEY && event.key !== "runracks.cart.v1") {
      return;
    }
    notify();
  }
  function onLocal() {
    notify();
  }
  window.addEventListener("storage", onStorage);
  window.addEventListener(CART_EVENT, onLocal);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CART_EVENT, onLocal);
  };
}

export function commitCartLines(lines: CartLine[]): void {
  const next: CartState = { lines };
  writeCartState(next);
  cacheRaw = undefined;
  cacheLines = lines;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CART_EVENT));
  }
  for (const listener of listeners) listener();
}
