import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  IdCard,
  Building2,
  Briefcase,
  FileText,
  Ellipsis,
  LogOut,
  X,
} from "lucide-react";
import clsx from "clsx";
import { useDebounce } from "../../hooks";
import { useState, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import ConfirmDialog from "../ui/ConfirmDialog";

type Item = {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
};

const menuItems: Item[] = [
  { label: "Profil BUM Desa", to: "/dashboard/", icon: IdCard },
  { label: "Aset BUM Desa", to: "/assets", icon: Building2 },
  { label: "Unit Usaha BUM Desa", to: "/business-units", icon: Briefcase },
  { label: "Laporan BUM Desa", to: "/laporan", icon: FileText },
  { label: "Lain-lain", to: "/others", icon: Ellipsis },
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
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filter items based on search
  const filteredItems = menuItems.filter((item) =>
    item.label.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // Logout confirmation handler
  const handleLogoutClick = useCallback(() => {
    setShowLogoutConfirm(true);
  }, []);

  // Actual logout handler
  const confirmLogout = useCallback(() => {
    logout();
    showToast("success", "Logged out successfully");
    navigate("/login");
    setShowLogoutConfirm(false);
  }, [logout, navigate, showToast]);

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
            type="button"
            className="lg:hidden rounded-md border-2 border-emerald-600 p-2 text-emerald-600 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
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
              className={`w-full rounded-md border border-neutral-300 bg-white px-3 py-2 pr-9 text-sm placeholder:text-neutral-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                searchQuery ? "text-neutral-700" : "text-neutral-400"
              }`}
              aria-label="Cari menu"
            />
          </label>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-4 overflow-y-auto">
        <div className="space-y-1">
          {filteredItems.length > 0 ? (
            filteredItems.map(({ label, to, icon: Icon }) => {
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
            })
          ) : (
            <p className="px-3 py-2 text-sm text-neutral-400">
              Tidak ada hasil
            </p>
          )}
        </div>
      </nav>

      {/* User card */}
      <div className="border-t bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-700 font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-sm text-emerald-700 font-semibold leading-tight truncate">
                {user?.name || "Admin"}
              </div>
              <div className="text-xs text-neutral-500 leading-tight truncate">
                {user?.role || "Administrator"}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogoutClick}
            aria-label="Keluar"
            title="Logout"
            className="rounded-md p-2 text-neutral-600 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-shrink-0 transition-colors"
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
          "lg:relative lg:translate-x-0 lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="Keluar dari Akun"
        message="Apakah Anda yakin ingin keluar? Anda perlu login kembali untuk mengakses aplikasi."
        confirmText="Ya, Keluar"
        cancelText="Batal"
        variant="danger"
      />
    </>
  );
}
