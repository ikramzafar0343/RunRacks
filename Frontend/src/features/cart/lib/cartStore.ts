/**
 * Module cart store — localStorage + same-tab listeners for useSyncExternalStore.
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
let cacheLine: CartLine | null = null;

function notify() {
  cacheRaw = undefined;
  for (const listener of listeners) listener();
}

function readCachedLine(): CartLine | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(CART_STORAGE_KEY);
  if (raw === cacheRaw) return cacheLine;
  cacheRaw = raw;
  cacheLine = readCartState().line;
  return cacheLine;
}

export function getCartSnapshot(): CartLine | null {
  return readCachedLine();
}

export function getCartServerSnapshot(): CartLine | null {
  return null;
}

export function subscribeCart(onStoreChange: Listener): () => void {
  listeners.add(onStoreChange);
  function onStorage(event: StorageEvent) {
    if (event.key !== CART_STORAGE_KEY) return;
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

export function commitCartLine(line: CartLine | null): void {
  const next: CartState = { line };
  writeCartState(next);
  cacheRaw = undefined;
  cacheLine = line;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CART_EVENT));
  }
  for (const listener of listeners) listener();
}
