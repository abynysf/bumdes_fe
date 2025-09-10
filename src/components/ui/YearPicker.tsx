import { useEffect, useId, useState, forwardRef } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

type Props = {
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
};

const MIN_YEAR = 1981;
const MAX_YEAR = 2050;
const PAGE_SIZE = 20;

// Snap a year to the beginning of its 20-year page, but clamp within bounds
function startOfPage(year: number, pageSize = PAGE_SIZE) {
  const offset = (year - MIN_YEAR) % pageSize;
  return year - offset;
}

const YearPicker = forwardRef<HTMLButtonElement, Props>(function YearPicker(
  { placeholder = "Pilih tahun", label, required, className },
  ref
) {
  const id = useId();
  const [open, setOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const safeCurrent = Math.min(Math.max(currentYear, MIN_YEAR), MAX_YEAR);

  const [year, setYear] = useState<number | undefined>(undefined);

  // Ensure initial page starts within range
  const initialStart = startOfPage(year ?? safeCurrent);
  const [pageStart, setPageStart] = useState(initialStart);

  useEffect(() => {
    if (year) setPageStart(startOfPage(year));
  }, [year]);

  // Generate 20 years, clamp to min/max
  const years = Array.from(
    { length: PAGE_SIZE },
    (_, i) => pageStart + i
  ).filter((y) => y >= MIN_YEAR && y <= MAX_YEAR);

  const labelText = year ? String(year) : placeholder;
  const isPlaceholder = !year;

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
            className="fixed inset-0 z-10 bg-black/20"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Popup */}
        {open && (
          <div className="absolute left-0 top-full z-20 mt-2 w-72 rounded-lg bg-white shadow-lg ring-1 ring-neutral-200">
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
                const isSelected = y === year;
                const isCurrent = y === safeCurrent;
                return (
                  <button
                    key={y}
                    type="button"
                    onClick={() => {
                      setYear(y);
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
                      <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-emerald-500/15"></span>
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
