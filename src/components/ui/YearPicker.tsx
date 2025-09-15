import { useEffect, useId, useState, forwardRef } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

type Props = {
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
  value?: number | undefined;
  onChange?: (year: number | undefined) => void;
};

const MIN_YEAR = 1981;
const MAX_YEAR = 2050;
const PAGE_SIZE = 20;

function startOfPage(year: number, pageSize = PAGE_SIZE) {
  const offset = (year - MIN_YEAR) % pageSize;
  return year - offset;
}

const YearPicker = forwardRef<HTMLButtonElement, Props>(function YearPicker(
  { placeholder = "Pilih tahun", label, required, className, value, onChange },
  ref
) {
  const id = useId();
  const [open, setOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const safeCurrent = Math.min(Math.max(currentYear, MIN_YEAR), MAX_YEAR);

  // Compute initial page based on selected value or current year
  const initialStart = startOfPage(value ?? safeCurrent);
  const [pageStart, setPageStart] = useState(initialStart);

  // If the selected year changes (via parent), keep the pager aligned
  useEffect(() => {
    if (typeof value === "number") {
      setPageStart(startOfPage(value));
    }
  }, [value]);

  // Close popup on scroll / resize / Esc to prevent “floating”
  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    // capture = true so inner scroll containers also trigger it
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const years = Array.from(
    { length: PAGE_SIZE },
    (_, i) => pageStart + i
  ).filter((y) => y >= MIN_YEAR && y <= MAX_YEAR);

  const labelText = typeof value === "number" ? String(value) : placeholder;
  const isPlaceholder = typeof value !== "number";

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1 flex items-center gap-1 text-sm font-medium text-neutral-700"
        >
          {required && <span className="text-red-600">*</span>}
          <span>{label}</span>
        </label>
      )}

      <div className="relative">
        {/* Trigger */}
        <button
          id={id}
          ref={ref}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={clsx(
            "flex w-full items-center justify-between rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm",
            "focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
            className
          )}
        >
          <span
            className={clsx(
              "truncate",
              isPlaceholder ? "text-neutral-400" : "text-neutral-700"
            )}
          >
            {labelText}
          </span>
          <CalendarDays className="h-4 w-4 text-neutral-600" />
        </button>

        {/* Overlay */}
        {open && (
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Popup */}
        {open && (
          <div
            role="dialog"
            aria-modal="true"
            className="absolute left-0 top-full z-50 mt-2 w-72 rounded-lg bg-white shadow-lg ring-1 ring-neutral-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2">
              <button
                type="button"
                className="rounded p-1 hover:bg-neutral-100 disabled:opacity-40"
                onClick={() =>
                  setPageStart((s) => Math.max(s - PAGE_SIZE, MIN_YEAR))
                }
                disabled={pageStart <= MIN_YEAR}
              >
                <ChevronLeft className="h-4 w-4 text-neutral-600" />
              </button>

              <div className="text-sm font-semibold text-neutral-800">
                {Math.max(pageStart, MIN_YEAR)} –{" "}
                {Math.min(pageStart + PAGE_SIZE - 1, MAX_YEAR)}
              </div>

              <button
                type="button"
                className="rounded p-1 hover:bg-neutral-100 disabled:opacity-40"
                onClick={() =>
                  setPageStart((s) =>
                    Math.min(s + PAGE_SIZE, MAX_YEAR - PAGE_SIZE + 1)
                  )
                }
                disabled={pageStart + PAGE_SIZE - 1 >= MAX_YEAR}
              >
                <ChevronRight className="h-4 w-4 text-neutral-600" />
              </button>
            </div>

            {/* Year grid */}
            <div className="grid grid-cols-4 gap-x-6 gap-y-3 px-4 pb-4 pt-1">
              {years.map((y) => {
                const isSelected = y === value;
                const isCurrent = y === safeCurrent;
                return (
                  <button
                    key={y}
                    type="button"
                    onClick={() => {
                      onChange?.(y);
                      setOpen(false);
                    }}
                    className={clsx(
                      "relative rounded-md px-2 py-2 text-left text-sm transition",
                      "hover:bg-neutral-100",
                      isSelected &&
                        "bg-neutral-50 font-semibold text-neutral-900",
                      !isSelected && "text-neutral-800"
                    )}
                  >
                    {y}
                    {isCurrent && (
                      <span className="pointer-events-none absolute inset-0 -z-10 rounded-md bg-emerald-500/15" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default YearPicker;
