import { forwardRef, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  loading?: boolean;
};

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    disabled,
    loading,
    children,
    ...rest
  },
  ref
) {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<NonNullable<Props["variant"]>, string> = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700",
    secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
    ghost: "bg-transparent text-neutral-700 hover:bg-neutral-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes: Record<NonNullable<Props["size"]>, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
  };

  return (
    <button
      ref={ref}
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="mr-2 h-4 w-4 animate-spin"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            d="M4 12a8 8 0 018-8"
            fill="currentColor"
          />
        </svg>
      )}
      {children}
    </button>
  );
});

export default Button;
