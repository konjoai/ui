type ToastTone = "success" | "info" | "warn";

/** Fire a toast notification. Handled by ToastProvider in the layout. */
export function toast(message: string, tone: ToastTone = "info") {
  if (typeof document === "undefined") return;
  document.dispatchEvent(new CustomEvent("konjo:toast", { detail: { message, tone } }));
}
