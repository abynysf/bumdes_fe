import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import clsx from "clsx";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  required?: boolean;
};

const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { label, required, className, id, rows = 4, ...rest },
  ref
) {
  const autoId = useId();
  const textareaId = id ?? `textarea-${autoId}`;
  const isRequired = required ?? false;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-1 flex items-center gap-1 text-sm font-medium text-neutral-700"
        >
          {isRequired && <span className="text-red-600">*</span>}
          <span>{label}</span>
        </label>
      )}

      <textarea
        id={textareaId}
        ref={ref}
        required={isRequired}
        rows={rows}
        className={clsx(
          "block w-full resize-y rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm",
          "text-neutral-700 placeholder:text-neutral-400",
          "focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
          className
        )}
        {...rest}
      />
    </div>
  );
});

export default Textarea;
