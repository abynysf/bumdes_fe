import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface TopbarProps {
  onMenuClick?: () => void;
}

// Route configuration for dynamic headers and breadcrumbs
type RouteConfig = {
  title: string;
  breadcrumb?: {
    parent: { label: string; to: string };
    current: string;
  };
};

const routeConfigs: Record<string, RouteConfig> = {
  "/dashboard/profile": {
    title: "Manajemen Profil BUM Desa",
    breadcrumb: {
      parent: { label: "Profil BUM Desa", to: "/dashboard/profile" },
      current: "Profil",
    },
  },
  "/dashboard/struktur": {
    title: "Manajemen Profil BUM Desa",
    breadcrumb: {
      parent: { label: "Profil BUM Desa", to: "/dashboard/profile" },
      current: "Struktur",
    },
  },
  "/dashboard/legalitas": {
    title: "Manajemen Profil BUM Desa",
    breadcrumb: {
      parent: { label: "Profil BUM Desa", to: "/dashboard/profile" },
      current: "Legalitas",
    },
  },
  "/assets": {
    title: "Aset BUM Desa",
    breadcrumb: {
      parent: { label: "Aset BUM Desa", to: "/assets" },
      current: "Daftar Aset",
    },
  },
  "/business-units": {
    title: "Manajemen Unit Usaha BUM Desa",
    breadcrumb: {
      parent: { label: "Unit Usaha BUM Desa", to: "/business-units" },
      current: "Daftar Unit Usaha",
    },
  },
  "/business-units/daftar": {
    title: "Manajemen Unit Usaha BUM Desa",
    breadcrumb: {
      parent: { label: "Unit Usaha BUM Desa", to: "/business-units" },
      current: "Daftar Unit Usaha",
    },
  },
  "/business-units/sop": {
    title: "Manajemen Unit Usaha BUM Desa",
    breadcrumb: {
      parent: { label: "Unit Usaha BUM Desa", to: "/business-units" },
      current: "SOP Unit Usaha",
    },
  },
  "/business-units/dokumentasi": {
    title: "Manajemen Unit Usaha BUM Desa",
    breadcrumb: {
      parent: { label: "Unit Usaha BUM Desa", to: "/business-units" },
      current: "Dokumentasi Kegiatan",
    },
  },
  "/laporan": {
    title: "Laporan BUM Desa",
    breadcrumb: {
      parent: { label: "Laporan BUM Desa", to: "/laporan" },
      current: "Ringkasan",
    },
  },
  "/laporan/ringkasan": {
    title: "Laporan BUM Desa",
    breadcrumb: {
      parent: { label: "Laporan BUM Desa", to: "/laporan" },
      current: "Ringkasan",
    },
  },
  "/laporan/program-kerja": {
    title: "Laporan BUM Desa",
    breadcrumb: {
      parent: { label: "Laporan BUM Desa", to: "/laporan" },
      current: "Program Kerja",
    },
  },
  "/laporan/laporan-pengawas": {
    title: "Laporan BUM Desa",
    breadcrumb: {
      parent: { label: "Laporan BUM Desa", to: "/laporan" },
      current: "Laporan Pengawas",
    },
  },
  "/laporan/laporan-bulanan": {
    title: "Laporan BUM Desa",
    breadcrumb: {
      parent: { label: "Laporan BUM Desa", to: "/laporan" },
      current: "Laporan Bulanan",
    },
  },
  "/laporan/laporan-semesteran": {
    title: "Laporan BUM Desa",
    breadcrumb: {
      parent: { label: "Laporan BUM Desa", to: "/laporan" },
      current: "Laporan Semesteran",
    },
  },
  "/laporan/laporan-tahunan": {
    title: "Laporan BUM Desa",
    breadcrumb: {
      parent: { label: "Laporan BUM Desa", to: "/laporan" },
      current: "Laporan Tahunan",
    },
  },
  "/others": {
    title: "Lain-lain",
    breadcrumb: {
      parent: { label: "Lain-lain", to: "/others" },
      current: "Daftar Lain-lain",
    },
  },
};

/**
 * Responsive Topbar with hamburger menu for mobile
 */
export default function Topbar({ onMenuClick }: TopbarProps) {
  const location = useLocation();
  const { user } = useAuth();

  // Get route config or fallback
  const config = routeConfigs[location.pathname] || {
    title: "BUM Desa GO",
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-white backdrop-blur-sm px-4 py-4 sm:px-6 sm:py-6">
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Hamburger menu button (mobile only) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden rounded-md p-2 text-neutral-600 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Buka menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-neutral-800 truncate">
            {config.title}
          </h1>

          {/* dynamic breadcrumb - only show for dashboard routes */}
          {config.breadcrumb && (
            <nav
              className="mt-2 sm:mt-3 text-xs sm:text-sm"
              aria-label="Breadcrumb"
            >
              <ol className="flex gap-2 items-center">
                <li>
                  <Link
                    to={config.breadcrumb.parent.to}
                    className="text-neutral-500 hover:text-neutral-700 hover:underline transition-colors"
                  >
                    {config.breadcrumb.parent.label}
                  </Link>
                </li>
                <li className="text-neutral-300" aria-hidden="true">
                  /
                </li>
                <li
                  className="text-neutral-600 font-medium truncate"
                  aria-current="page"
                >
                  {config.breadcrumb.current}
                </li>
              </ol>
            </nav>
          )}
        </div>

        {/* User info - hidden on mobile, visible on desktop */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-semibold text-neutral-800">
              {user?.name || "Admin"}
            </div>
            <div className="text-xs text-neutral-500">{user?.role || "Administrator"}</div>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="text-emerald-700 font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
