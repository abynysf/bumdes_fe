import { useEffect, useId, useMemo, useRef, useState, forwardRef } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

type Props = {
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
  value?: number | undefined;
  onChange?: (year: number | undefined) => void;
  error?: string;
  touched?: boolean;
};

const MIN_YEAR = 1981;
const MAX_YEAR = 2050;
const PAGE_SIZE = 20;

function startOfPage(year: number, pageSize = PAGE_SIZE) {
  const offset = (year - MIN_YEAR) % pageSize;
  return year - offset;
}

export const YearPicker = forwardRef<HTMLButtonElement, Props>(
  function YearPicker(
    {
      placeholder = "Pilih tahun",
      label,
      required,
      className,
      value,
      onChange,
      error,
      touched = false,
    },
    ref
  ) {
    const id = useId();
    const [open, setOpen] = useState(false);

    // Auto-generate error message if required and empty
    const showError = touched && required && !value;
    const errorMessage = error || (showError ? 'Tahun wajib dipilih' : undefined);

    // anchor (trigger) DOM node to compute viewport position
    const anchorRef = useRef<HTMLButtonElement | null>(null);

    // current year & initial page
    const currentYear = new Date().getFullYear();
    const safeCurrent = Math.min(Math.max(currentYear, MIN_YEAR), MAX_YEAR);
    const initialStart = startOfPage(value ?? safeCurrent);
    const [pageStart, setPageStart] = useState(initialStart);

    // keep pager aligned with external value
    useEffect(() => {
      if (typeof value === "number") {
        setPageStart(startOfPage(value));
      }
    }, [value]);

    // lock body scroll while open
    useEffect(() => {
      if (!open) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }, [open]);

    // close on Esc / resize / scroll
    useEffect(() => {
      if (!open) return;

      const close = () => setOpen(false);
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);

      window.addEventListener("resize", close);
      window.addEventListener("keydown", onKey);
      // catch scrolls anywhere (capture helps for nested scrollers)
      window.addEventListener("scroll", close, { capture: true });
      document.addEventListener("scroll", close, { capture: true });

      return () => {
        window.removeEventListener("resize", close);
        window.removeEventListener("keydown", onKey);
        window.removeEventListener(
          "scroll",
          close as any,
          { capture: true } as any
        );
        document.removeEventListener(
          "scroll",
          close as any,
          { capture: true } as any
        );
      };
    }, [open]);

    const years = useMemo(
      () =>
        Array.from({ length: PAGE_SIZE }, (_, i) => pageStart + i).filter(
          (y) => y >= MIN_YEAR && y <= MAX_YEAR
        ),
      [pageStart]
    );

    const labelText = typeof value === "number" ? String(value) : placeholder;
    const isPlaceholder = typeof value !== "number";

    // ---- popup positioning (fixed, via portal) ----
    const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
    useEffect(() => {
      if (!open) return;
      const el = anchorRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const gap = 8; // space between trigger & popup
      const popupWidth = 288; // ~w-72
      const popupHeight = 280; // rough; adjusted after open if needed

      // Try to place below; if not enough space, place above
      const viewportH = window.innerHeight;
      const belowTop = rect.bottom + gap;
      const aboveTop = Math.max(8, rect.top - gap - popupHeight);

      const placeBelow = belowTop + popupHeight <= viewportH;

      // Clamp horizontally so it stays on-screen
      const left = Math.min(
        Math.max(8, rect.left),
        Math.max(8, window.innerWidth - popupWidth - 8)
      );

      setPopupStyle({
        position: "fixed",
        top: placeBelow ? belowTop : aboveTop,
        left,
        width: popupWidth,
        zIndex: 50,
      });
    }, [open]);

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

        {/* Trigger */}
        <button
          id={id}
          ref={(node) => {
            anchorRef.current = node;
            if (typeof ref === "function") ref(node as HTMLButtonElement);
            else if (ref && "current" in (ref as any))
              (ref as any).current = node;
          }}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? `${id}-error` : undefined}
          onClick={() => setOpen((o) => !o)}
          className={clsx(
            "flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm",
            "focus:outline-none focus:ring-2",
            errorMessage
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
              : "border-neutral-300 focus:border-emerald-500 focus:ring-emerald-500/20",
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
          <CalendarDays className={clsx(
            "h-4 w-4",
            errorMessage ? "text-red-600" : "text-neutral-600"
          )} />
        </button>

        {/* Error message */}
        {errorMessage && (
          <p
            id={`${id}-error`}
            className="mt-1 text-xs text-red-600"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {/* Overlay + Popup via portal */}
        {open &&
          createPortal(
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 z-40 bg-black/20"
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />
              {/* Popup (fixed) */}
              <div
                role="dialog"
                aria-modal="true"
                className="rounded-lg bg-white shadow-lg ring-1 ring-neutral-200"
                style={popupStyle}
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
                <div className="grid grid-cols-4 gap-x-6 gap-y-3 px-4 pb-4 pt-1 w-72">
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
                          isSelected
                            ? "bg-neutral-50 font-semibold text-neutral-900"
                            : "text-neutral-800"
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
            </>,
            // portal target
            document.body
          )}
      </div>
    );
  }
);

export default YearPicker;
