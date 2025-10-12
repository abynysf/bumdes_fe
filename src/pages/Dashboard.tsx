import { Outlet, NavLink } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import clsx from "clsx";
import { useState } from "react";
import { useIsMobile } from "../hooks";

/**
 * Dashboard layout with responsive sidebar and tabs
 */
export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const tabs = [
    { label: "Profil", to: "profile" },
    { label: "Struktur", to: "struktur" },
    { label: "Legalitas", to: "legalitas" },
  ];

  // Auto-close sidebar on mobile when route changes
  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen || !isMobile}
        onClose={handleSidebarClose}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Body */}
        <main className="flex-1 overflow-y-auto">
          <section className="bg-neutral-50 p-4 sm:p-6 lg:p-8">
            <div className="rounded-lg shadow-sm bg-white border border-neutral-200">
              {/* Tabs - scrollable on mobile */}
              <nav
                className="overflow-x-auto border-b border-neutral-200 bg-neutral-50"
                aria-label="Tabs"
              >
                <div className="flex min-w-max sm:min-w-0">
                  {tabs.map((tab) => (
                    <NavLink
                      key={tab.to}
                      to={tab.to}
                      end
                      className={({ isActive }) =>
                        clsx(
                          "inline-flex px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                          isActive
                            ? "border-emerald-600 text-emerald-700 bg-white"
                            : "border-transparent text-neutral-600 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50/50"
                        )
                      }
                    >
                      {tab.label}
                    </NavLink>
                  ))}
                </div>
              </nav>

              {/* Active tab content */}
              <div className="bg-white">
                <Outlet />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
