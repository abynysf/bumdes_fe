import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  autoCloseMs?: number;
};

export default function WarningModal({
  open,
  onClose,
  title = "Peringatan",
  autoCloseMs,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !autoCloseMs) return;
    const t = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(t);
  }, [open, autoCloseMs, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-[101] w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded p-1 hover:bg-neutral-100"
          aria-label="Tutup"
          title="Tutup"
        >
          <X className="h-4 w-4 text-neutral-500" />
        </button>

        {/* ✅ checkmark icon */}
        <div className="mb-3 flex items-center justify-center">
          <CheckCircle2 className="h-15 w-15 text-emerald-600" />
        </div>

        <h3 className="text-center text-base font-semibold text-neutral-800">
          {title}
        </h3>

        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700"
          >
            Oke
          </button>
        </div>
      </div>
    </div>
  );
}
