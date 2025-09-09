import { NavLink } from "react-router-dom";
import clsx from "clsx";

type Item = { label: string; to: string };

export function TabsInCard({ items }: { items: Item[] }) {
  return (
    <div className="flex">
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          end
          className={({ isActive }) =>
            clsx(
              "rounded-sm px-4 py-2 text-sm font-medium",
              // active = gray, inactive = green (like your figma)
              isActive
                ? "text-neutral-700"
                : "text-emerald-700 hover:bg-emerald-100"
            )
          }
        >
          {it.label}
        </NavLink>
      ))}
    </div>
  );
}
