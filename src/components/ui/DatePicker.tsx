import { useEffect, useId, useMemo, useRef, useState, forwardRef } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

type Props = {
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
  value?: string | undefined; // YYYY-MM-DD format
  onChange?: (date: string | undefined) => void;
  error?: string;
  touched?: boolean;
};

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const DAYS_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export const DatePicker = forwardRef<HTMLButtonElement, Props>(
  function DatePicker(
    {
      placeholder = "Pilih tanggal",
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
    const errorMessage = error || (showError ? "Tanggal wajib dipilih" : undefined);

    // anchor (trigger) DOM node to compute viewport position
    const anchorRef = useRef<HTMLButtonElement | null>(null);

    // Parse value or use today
    const today = new Date();
    const parsedDate = value ? new Date(value) : today;
    const isValidDate = !isNaN(parsedDate.getTime());

    const [currentYear, setCurrentYear] = useState(
      isValidDate ? parsedDate.getFullYear() : today.getFullYear()
    );
    const [currentMonth, setCurrentMonth] = useState(
      isValidDate ? parsedDate.getMonth() : today.getMonth()
    );

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
      window.addEventListener("scroll", close, { capture: true });
      document.addEventListener("scroll", close, { capture: true });

      return () => {
        window.removeEventListener("resize", close);
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("scroll", close as any, {
          capture: true,
        } as any);
        document.removeEventListener("scroll", close as any, {
          capture: true,
        } as any);
      };
    }, [open]);

    // Format display date as DD/MM/YYYY
    const formatDate = (dateStr: string | undefined): string => {
      if (!dateStr) return placeholder;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return placeholder;

      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const labelText = formatDate(value);
    const isPlaceholder = !value;

    // Generate calendar days
    const calendarDays = useMemo(() => {
      const daysInMonth = getDaysInMonth(currentYear, currentMonth);
      const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

      const days: (number | null)[] = [];

      // Add empty cells for days before first day of month
      for (let i = 0; i < firstDay; i++) {
        days.push(null);
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(day);
      }

      return days;
    }, [currentYear, currentMonth]);

    // Check if a day is selected
    const isSelectedDay = (day: number): boolean => {
      if (!value) return false;
      const selected = new Date(value);
      return (
        selected.getDate() === day &&
        selected.getMonth() === currentMonth &&
        selected.getFullYear() === currentYear
      );
    };

    // Check if a day is today
    const isTodayDay = (day: number): boolean => {
      return (
        today.getDate() === day &&
        today.getMonth() === currentMonth &&
        today.getFullYear() === currentYear
      );
    };

    // Handle day selection
    const handleDayClick = (day: number) => {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      onChange?.(dateStr);
      setOpen(false);
    };

    // Navigation handlers
    const handlePrevMonth = () => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    };

    const handleNextMonth = () => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    };

    // ---- popup positioning (fixed, via portal) ----
    const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
    useEffect(() => {
      if (!open) return;
      const el = anchorRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const gap = 8;
      const popupWidth = 320;
      const popupHeight = 380;

      const viewportH = window.innerHeight;
      const belowTop = rect.bottom + gap;
      const aboveTop = Math.max(8, rect.top - gap - popupHeight);

      const placeBelow = belowTop + popupHeight <= viewportH;

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
          <CalendarDays
            className={clsx(
              "h-4 w-4",
              errorMessage ? "text-red-600" : "text-neutral-600"
            )}
          />
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
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
                  <button
                    type="button"
                    className="rounded p-1 hover:bg-neutral-100"
                    onClick={handlePrevMonth}
                  >
                    <ChevronLeft className="h-5 w-5 text-neutral-600" />
                  </button>

                  <div className="text-sm font-semibold text-neutral-800">
                    {MONTHS[currentMonth]} {currentYear}
                  </div>

                  <button
                    type="button"
                    className="rounded p-1 hover:bg-neutral-100"
                    onClick={handleNextMonth}
                  >
                    <ChevronRight className="h-5 w-5 text-neutral-600" />
                  </button>
                </div>

                {/* Calendar */}
                <div className="p-4">
                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {DAYS_SHORT.map((day) => (
                      <div
                        key={day}
                        className="text-center text-xs font-medium text-neutral-500 py-1"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Days grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, idx) => {
                      if (day === null) {
                        return <div key={`empty-${idx}`} className="h-9" />;
                      }

                      const isSelected = isSelectedDay(day);
                      const isToday = isTodayDay(day);

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDayClick(day)}
                          className={clsx(
                            "relative h-9 rounded-md text-sm transition",
                            "hover:bg-neutral-100",
                            isSelected
                              ? "bg-emerald-500 text-white font-semibold hover:bg-emerald-600"
                              : "text-neutral-800"
                          )}
                        >
                          {day}
                          {isToday && !isSelected && (
                            <span className="pointer-events-none absolute inset-0 -z-10 rounded-md bg-emerald-500/15" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer with today button */}
                <div className="border-t border-neutral-200 px-4 py-2">
                  <button
                    type="button"
                    onClick={() => {
                      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
                      onChange?.(todayStr);
                      setOpen(false);
                    }}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Hari ini
                  </button>
                </div>
              </div>
            </>,
            document.body
          )}
      </div>
    );
  }
);

export default DatePicker;
