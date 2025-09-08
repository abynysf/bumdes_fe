import { Link, useLocation } from "react-router-dom";

export default function Topbar() {
  const location = useLocation();

  // Map routes -> labels
  const crumbs: Record<string, string> = {
    "/dashboard/profile": "Profil",
    "/dashboard/struktur": "Struktur",
    "/dashboard/legalitas": "Legalitas",
  };

  const currentLabel = crumbs[location.pathname] ?? "";

  return (
    <header className="sticky top-0 border-b bg-white backdrop-blur">
      <div className="mx-auto max-w-7xl px-6">
        <div className="py-6">
          <h1 className="text-4xl font-semibold leading-tight text-neutral-800">
            Manajemen Profil BUM Desa
          </h1>

          {/* dynamic breadcrumb */}
          <nav className="mt-3 text-sm">
            <ol className="flex items-center gap-2">
              <li>
                <Link
                  to="/dashboard/profile"
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  Profil BUM Desa
                </Link>
              </li>
              <li className="text-neutral-300">/</li>
              <li className="text-neutral-400">{currentLabel}</li>
            </ol>
          </nav>
        </div>
      </div>
    </header>
  );
}
