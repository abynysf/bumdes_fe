import { forwardRef, type InputHTMLAttributes } from "react";
import clsx from "clsx";

type Props = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className, ...rest },
  ref
) {
  return (
    <input
      ref={ref}
      className={clsx(
        "block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm",
        "placeholder:text-neutral-400",
        "focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
        className
      )}
      {...rest}
    />
  );
});

export default Input;
