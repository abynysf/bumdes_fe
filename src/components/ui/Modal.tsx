// components/ui/Modal.tsx
import type { ReactNode } from "react";
import clsx from "clsx";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={clsx(
          "relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg",
          className
        )}
      >
        {title && (
          <h2 className="mb-4 text-lg font-semibold text-neutral-800">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
