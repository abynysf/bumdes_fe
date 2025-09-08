import { NavLink, useLocation } from "react-router-dom";
import {
  Search,
  LayoutGrid,
  ListChecks,
  FileStack,
  IdCard,
  Settings,
  LogOut,
} from "lucide-react";
import clsx from "clsx";

type Item = {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
};

const primary: Item[] = [
  { label: "Beranda", to: "/home", icon: LayoutGrid },
  { label: "Kegiatan", to: "/activities", icon: ListChecks },
  { label: "Laporan dan Dokumentasi", to: "/reports", icon: FileStack },
];

const manage: Item[] = [
  { label: "Profil BUM Desa", to: "/dashboard/", icon: IdCard },
  { label: "Pengaturan", to: "/settings", icon: Settings },
];

const itemClass = (active: boolean) =>
  clsx(
    "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
    active
      ? "bg-emerald-50 text-emerald-800"
      : "text-neutral-700 hover:bg-neutral-100"
  );

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="flex z-10 w-72 flex-col border-r bg-white shadow-xl">
      {/* Header / Brand */}
      <div className="px-5 pt-8 pb-4">
        <div className="flex items-center gap-3">
          <div className="grid aspect-square w-7 grid-cols-2 grid-rows-2 gap-1">
            <span className="rounded-sm bg-emerald-600/90" />
            <span className="rounded-sm bg-emerald-600/90" />
            <span className="rounded-sm bg-emerald-600/90" />
            <span className="rounded-sm bg-emerald-600/90" />
          </div>
          <div className="text-xl font-semibold text-neutral-900">
            BUM Desa GO
          </div>
        </div>

        {/* Search */}
        <div className="mt-10 ">
          <label className="relative block">
            <Search className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari"
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 pr-9 text-sm placeholder:text-neutral-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </label>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 flex flex-col justify-between">
        <div className="space-y-1">
          {primary.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => itemClass(isActive)}
            >
              <Icon className="h-5 w-5 text-neutral-500" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Active “Profil BUM Desa” section */}
        <div className="space-y-1">
          {manage.map(({ label, to, icon: Icon }) => {
            const isActive = location.pathname.startsWith(to);
            return (
              <NavLink key={to} to={to} className={() => itemClass(isActive)}>
                <Icon
                  className={clsx(
                    "h-5 w-5",
                    isActive ? "text-emerald-700" : "text-neutral-500"
                  )}
                />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User card */}
      <div className="border-t bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/64?img=13"
              alt="User avatar"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <div className="text-emerald-700 font-semibold leading-tight">
                Leonardo Davichi
              </div>
              <div className="text-xs text-neutral-500 leading-tight">
                BUM Desa Jaya Tani
              </div>
            </div>
          </div>
          <button
            aria-label="Open profile"
            className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
