import clsx from "clsx";
import type { ReactNode } from "react";

type Props = {
  headers: ReactNode[];
  rows: ReactNode[][];
  emptyText?: string;
  className?: string;
};

export default function Table({
  headers,
  rows,
  emptyText = "No data",
  className,
}: Props) {
  return (
    <div className={clsx("overflow-x-auto", className)}>
      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b bg-neutral-50">
            {headers.map((h, i) => (
              <th key={i} className="px-3 py-2 font-medium text-neutral-700">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="px-3 py-6 text-center text-neutral-500"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((cells, r) => (
              <tr key={r} className="border-b last:border-0">
                {cells.map((cell, c) => (
                  <td key={c} className="px-3 py-2 text-neutral-800">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
