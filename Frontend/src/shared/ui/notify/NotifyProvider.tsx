/**
 * Branded toast + confirm provider (Sage & Ink).
 */
"use client";

import Link from "next/link";
import type { Route } from "next";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  ConfirmInput,
  ConfirmRequest,
  ToastInput,
  ToastItem,
} from "@/shared/ui/notify/notifyTypes";
import "@/shared/ui/notify/notify-toast.css";
import "@/shared/ui/notify/notify-confirm.css";

type NotifyApi = {
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
  confirm: (input: ConfirmInput) => Promise<boolean>;
};

const NotifyContext = createContext<NotifyApi | null>(null);

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `n-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function NotifyProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmReq, setConfirmReq] = useState<ConfirmRequest | null>(null);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((input: ToastInput) => {
    const id = newId();
    const item: ToastItem = {
      id,
      tone: input.tone ?? "info",
      title: input.title,
      durationMs: input.durationMs ?? 4200,
      ...(input.description ? { description: input.description } : {}),
      ...(input.action ? { action: input.action } : {}),
    };
    setToasts((prev) => [...prev.slice(-4), item]);
    return id;
  }, []);

  useEffect(() => {
    const latest = toasts[toasts.length - 1];
    if (!latest) return;
    const timer = window.setTimeout(
      () => dismiss(latest.id),
      latest.durationMs ?? 4200,
    );
    return () => window.clearTimeout(timer);
  }, [toasts, dismiss]);

  const confirm = useCallback((input: ConfirmInput) => {
    return new Promise<boolean>((resolve) => {
      setConfirmReq({ ...input, resolve });
    });
  }, []);

  const closeConfirm = useCallback((result: boolean) => {
    setConfirmReq((prev) => {
      prev?.resolve(result);
      return null;
    });
  }, []);

  useEffect(() => {
    if (!confirmReq) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") closeConfirm(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmReq, closeConfirm]);

  const api = useMemo<NotifyApi>(
    () => ({ toast, dismiss, confirm }),
    [toast, dismiss, confirm],
  );

  return (
    <NotifyContext.Provider value={api}>
      {children}
      <div
        className="rrNotifyToasts"
        aria-live="polite"
        aria-relevant="additions"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            className="rrToast"
            data-tone={item.tone}
            role="status"
          >
            <p className="rrToastTitle">{item.title}</p>
            <button
              type="button"
              className="rrToastDismiss"
              aria-label="Dismiss"
              onClick={() => dismiss(item.id)}
            >
              ×
            </button>
            {item.description ? (
              <p className="rrToastDesc">{item.description}</p>
            ) : null}
            {item.action?.href ? (
              <Link
                href={item.action.href as Route}
                className="rrToastAction"
                onClick={() => {
                  item.action?.onClick?.();
                  dismiss(item.id);
                }}
              >
                {item.action.label}
              </Link>
            ) : item.action ? (
              <button
                type="button"
                className="rrToastAction"
                onClick={() => {
                  item.action?.onClick?.();
                  dismiss(item.id);
                }}
              >
                {item.action.label}
              </button>
            ) : null}
          </div>
        ))}
      </div>
      {confirmReq ? (
        <div className="rrConfirmRoot">
          <button
            type="button"
            className="rrConfirmBackdrop"
            aria-label="Cancel"
            onClick={() => closeConfirm(false)}
          />
          <div
            className="rrConfirmDialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="rr-confirm-title"
            aria-describedby={
              confirmReq.description ? "rr-confirm-desc" : undefined
            }
          >
            <h2 id="rr-confirm-title" className="rrConfirmTitle">
              {confirmReq.title}
            </h2>
            {confirmReq.description ? (
              <p id="rr-confirm-desc" className="rrConfirmDesc">
                {confirmReq.description}
              </p>
            ) : null}
            <div className="rrConfirmActions">
              <button
                type="button"
                className="rrConfirmCancel"
                onClick={() => closeConfirm(false)}
              >
                {confirmReq.cancelLabel ?? "Cancel"}
              </button>
              <button
                type="button"
                className="rrConfirmOk"
                data-tone={confirmReq.tone === "error" ? "error" : "brand"}
                onClick={() => closeConfirm(true)}
              >
                {confirmReq.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </NotifyContext.Provider>
  );
}

export function useNotify(): NotifyApi {
  const ctx = useContext(NotifyContext);
  if (!ctx) {
    throw new Error("useNotify must be used within NotifyProvider");
  }
  return ctx;
}
