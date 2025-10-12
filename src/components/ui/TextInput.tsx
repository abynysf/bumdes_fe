import { forwardRef, useId, type InputHTMLAttributes } from "react";
import clsx from "clsx";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
};

const TextInput = forwardRef<HTMLInputElement, Props>(
  ({ label, required, error, touched, className, id, ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? `input-${autoId}`;
    const isRequired = required ?? false;

    // Show error if there's an explicit error message OR if field is required, touched, and empty
    const showError = touched && isRequired && !rest.value;
    const errorMessage = error || (showError ? "Data wajib diisi" : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1 flex gap-1 text-sm font-medium text-neutral-700"
          >
            {isRequired && <span className="text-red-600">*</span>}
            <span>{label}</span>
          </label>
        )}

        <input
          id={inputId}
          ref={ref}
          required={isRequired}
          className={clsx(
            "block w-full rounded-md border bg-white px-3 py-2 text-sm",
            "text-neutral-700 placeholder:text-neutral-400",
            errorMessage
              ? "border-red-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              : "border-neutral-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
            className
          )}
          {...rest}
        />

        {errorMessage && (
          <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
        )}
      </div>
    );
  }
);

export default TextInput;
