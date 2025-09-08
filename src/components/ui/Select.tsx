import { forwardRef, type SelectHTMLAttributes } from "react";
import clsx from "clsx";

type Option = { label: string; value: string };
type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  options?: Option[];
};

const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { className, options, children, ...rest },
  ref
) {
  return (
    <select
      ref={ref}
      className={clsx(
        "block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm",
        "focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
        className
      )}
      {...rest}
    >
      {options?.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      )) || children}
    </select>
  );
});

export default Select;
