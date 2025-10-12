import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

interface TopbarProps {
  onMenuClick?: () => void;
}

/**
 * Responsive Topbar with hamburger menu for mobile
 */
export default function Topbar({ onMenuClick }: TopbarProps) {
  const location = useLocation();

  // Map routes -> labels
  const crumbs: Record<string, string> = {
    "/dashboard/profile": "Profil",
    "/dashboard/struktur": "Struktur",
    "/dashboard/legalitas": "Legalitas",
  };

  const currentLabel = crumbs[location.pathname] ?? "";

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
            Manajemen Profil BUM Desa
          </h1>

          {/* dynamic breadcrumb */}
          <nav className="mt-2 sm:mt-3 text-xs sm:text-sm" aria-label="Breadcrumb">
            <ol className="flex gap-2 items-center">
              <li>
                <Link
                  to="/dashboard/profile"
                  className="text-neutral-500 hover:text-neutral-700 hover:underline transition-colors"
                >
                  Profil BUM Desa
                </Link>
              </li>
              <li className="text-neutral-300" aria-hidden="true">/</li>
              <li className="text-neutral-600 font-medium truncate" aria-current="page">
                {currentLabel || "Profil"}
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </header>
  );
}
