import { NavLink, useLocation } from "react-router-dom";
import {
  Search,
  LayoutGrid,
  ListChecks,
  FileStack,
  IdCard,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import clsx from "clsx";
import { useDebounce } from "../../hooks";
import { useState } from "react";

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
    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
    active
      ? "bg-emerald-50 text-emerald-800"
      : "text-neutral-700 hover:bg-neutral-100"
  );

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * Responsive Sidebar component with mobile support
 * On mobile: renders as a slide-out overlay
 * On desktop: renders as a fixed sidebar
 */
export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filter items based on search
  const filteredPrimary = primary.filter((item) =>
    item.label.toLowerCase().includes(debouncedSearch.toLowerCase())
  );
  const filteredManage = manage.filter((item) =>
    item.label.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const sidebarContent = (
    <>
      {/* Header / Brand */}
      <div className="px-5 pt-6 pb-4 sm:pt-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid aspect-square w-7 grid-cols-2 grid-rows-2 gap-1">
              <span className="rounded-sm bg-emerald-600/90" />
              <span className="rounded-sm bg-emerald-600/90" />
              <span className="rounded-sm bg-emerald-600/90" />
              <span className="rounded-sm bg-emerald-600/90" />
            </div>
            <div className="text-lg sm:text-xl font-semibold text-neutral-900">
              BUM Desa GO
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden rounded-md p-2 text-neutral-600 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="mt-6 sm:mt-10">
          <label className="relative block">
            <Search className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 pr-9 text-sm placeholder:text-neutral-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              aria-label="Cari menu"
            />
          </label>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-1">
          {filteredPrimary.length > 0 ? (
            filteredPrimary.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) => itemClass(isActive)}
              >
                <Icon className="h-5 w-5 flex-shrink-0 text-neutral-500" />
                <span className="truncate">{label}</span>
              </NavLink>
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-neutral-400">Tidak ada hasil</p>
          )}
        </div>

        {/* Manage section */}
        <div className="space-y-1 pb-4">
          {filteredManage.map(({ label, to, icon: Icon }) => {
            const isActive = location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={() => itemClass(isActive)}
              >
                <Icon
                  className={clsx(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-emerald-700" : "text-neutral-500"
                  )}
                />
                <span className="truncate">{label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User card */}
      <div className="border-t bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="https://i.pravatar.cc/64?img=13"
              alt="Avatar Leonardo Davichi"
              className="h-10 w-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <div className="text-sm text-emerald-700 font-semibold leading-tight truncate">
                Leonardo Davichi
              </div>
              <div className="text-xs text-neutral-500 leading-tight truncate">
                BUM Desa Jaya Tani
              </div>
            </div>
          </div>
          <button
            aria-label="Keluar"
            className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-shrink-0"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-white shadow-xl transition-transform duration-300",
          "lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
