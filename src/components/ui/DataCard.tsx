import clsx from "clsx";
import React from "react";

type Props = {
  label: string;
  buttonLabel?: string;
  note?: string;
  children: React.ReactNode;
  onButtonClick?: () => void;
  className?: string;
  loading?: boolean;
};

/**
 * Card component for displaying data sections with optional action button
 * Responsive and accessible
 */
export default function DataCard({
  label,
  buttonLabel,
  note,
  children,
  onButtonClick,
  className,
  loading = false,
}: Props) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-neutral-300 bg-white p-4 sm:p-6 shadow-md",
        className
      )}
    >
      {/* Title */}
      <div className="text-sm sm:text-base font-semibold text-neutral-700">
        {label}
      </div>

      {/* Optional warning/note */}
      {note && (
        <div
          className="mt-1 block text-xs text-red-500"
          role="alert"
          aria-live="polite"
        >
          {note}
        </div>
      )}

      {/* Custom body (table, list, form, etc.) */}
      <div className="mt-4 sm:mt-5">{children}</div>

      {/* Bottom button */}
      {buttonLabel && onButtonClick && (
        <div className="mt-4 sm:mt-6">
          <button
            type="button"
            onClick={onButtonClick}
            disabled={loading}
            className="w-full sm:w-auto rounded-lg bg-neutral-500 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-busy={loading}
          >
            {loading ? 'Memuat...' : buttonLabel}
          </button>
        </div>
      )}
    </div>
  );
}
