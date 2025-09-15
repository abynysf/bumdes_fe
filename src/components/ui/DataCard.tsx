import clsx from "clsx";
import React from "react";

type Props = {
  label: string;
  buttonLabel?: string;
  note?: string;
  children: React.ReactNode;
  onButtonClick?: () => void;
  className?: string;
};

export default function DataCard({
  label,
  buttonLabel,
  note,
  children,
  onButtonClick,
  className,
}: Props) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-neutral-300 bg-white p-4 shadow-md",
        className
      )}
    >
      {/* Title */}
      <div className="text-sm font-semibold text-neutral-700 ">{label}</div>
      <span>
        {note ? (
          <span className="block font-light text-xs text-red-500">{note}</span>
        ) : (
          <span></span>
        )}
      </span>

      {/* Custom body (table, list, form, etc.) */}
      <div className="mt-5">{children}</div>

      {/* Bottom button */}
      <div className="mt-6">
        <button
          type="button"
          onClick={onButtonClick}
          className="rounded-lg bg-neutral-500 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-600"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
