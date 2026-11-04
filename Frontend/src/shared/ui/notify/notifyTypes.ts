/**
 * Shared notify API types.
 */
export type NotifyTone = "success" | "info" | "error" | "warning";

export type ToastAction = {
  label: string;
  href?: string;
  onClick?: () => void;
};

export type ToastInput = {
  tone?: NotifyTone;
  title: string;
  description?: string;
  durationMs?: number;
  action?: ToastAction;
};

export type ToastItem = ToastInput & {
  id: string;
  tone: NotifyTone;
};

export type ConfirmInput = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: NotifyTone;
};

export type ConfirmRequest = ConfirmInput & {
  resolve: (confirmed: boolean) => void;
};
