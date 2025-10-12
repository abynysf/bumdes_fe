import { forwardRef, useId, useState, type HTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

type Option = { label: string; value: string };

// 👇 Omit the DOM onChange to avoid type clash
type Props = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  label?: string;
  required?: boolean;
  options: Option[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void; // your API
  error?: string;
  touched?: boolean;
};

const Dropdown = forwardRef<HTMLButtonElement, Props>(function Dropdown(
  {
    label,
    required,
    className,
    id,
    options,
    placeholder,
    value,
    onChange,
    error,
    touched,
    ...rest
  },
  ref
) {
  const autoId = useId();
  const dropdownId = id ?? `dropdown-${autoId}`;
  const isRequired = required ?? false;
  const [open, setOpen] = useState(false);

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? placeholder;

  // Show error if there's an explicit error message OR if field is required, touched, and empty
  const showError = touched && isRequired && !value;
  const errorMessage = error || (showError ? "Data wajib dipilih" : undefined);

  return (
    <div className="w-full" {...rest}>
      {label && (
        <label
          htmlFor={dropdownId}
          className="mb-1 flex gap-1 text-sm font-medium text-neutral-700"
        >
          {isRequired && <span className="text-red-600">*</span>}
          <span>{label}</span>
        </label>
      )}

      <div className="relative">
        <button
          id={dropdownId}
          ref={ref}
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={clsx(
            "flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm",
            errorMessage
              ? "border-red-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              : "border-neutral-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
            className
          )}
        >
          <span
            className={clsx(
              "truncate",
              value ? "text-neutral-700" : "text-neutral-400"
            )}
          >
            {selectedLabel}
          </span>
          <ChevronDown className={clsx(
            "h-4 w-4",
            errorMessage ? "text-red-500" : "text-neutral-500"
          )} />
        </button>

        {open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 bg-black/20"
          />
        )}

        {open && (
          <div className="absolute left-0 top-full z-20 mt-1 w-auto rounded-lg bg-white shadow-lg ring-1 ring-neutral-200">
            {label && (
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                {label}
              </div>
            )}
            <div className="py-1">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange?.(opt.value); // now typed as string
                    setOpen(false);
                  }}
                  className={clsx(
                    "block w-full cursor-pointer px-3 py-2 text-left text-sm",
                    value === opt.value
                      ? "bg-neutral-50 text-neutral-900"
                      : "text-neutral-800 hover:bg-neutral-100"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {errorMessage && (
        <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
});

export default Dropdown;
