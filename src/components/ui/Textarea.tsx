import { forwardRef, type TextareaHTMLAttributes } from "react";
import clsx from "clsx";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { className, rows = 4, ...rest },
  ref
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={clsx(
        "block w-full resize-y rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm",
        "placeholder:text-neutral-400",
        "focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
        className
      )}
      {...rest}
    />
  );
});

export default Textarea;
