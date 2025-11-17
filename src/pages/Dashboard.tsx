import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useIsMobile } from "../hooks";
import clsx from "clsx";
import { DashboardProvider } from "../contexts/DashboardContext";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const tabs = [
    { label: "Profil", to: "profile" },
    { label: "Struktur", to: "struktur" },
    { label: "Legalitas", to: "legalitas" },
  ];

  return (
    <div className="flex h-screen">
      {/* left rail */}
      <Sidebar
        isOpen={sidebarOpen || !isMobile}
        onClose={handleSidebarClose}
      />

      {/* main column */}
      <div className="w-full overflow-y-auto">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* body */}
        <main>
          <section className="bg-white p-6">
            <div className="rounded-lg shadow-md">
              {/* tabs */}
              <nav>
                {tabs.map((tab) => (
                  <NavLink
                    key={tab.to}
                    to={tab.to}
                    end
                    className={({ isActive }) =>
                      clsx(
                        "inline-flex px-6 py-2 text-sm border border-gray-200 font-medium rounded-t-md",
                        isActive
                          ? "bg-white text-gray-900 border-b-0"
                          : "text-emerald-700 hover:text-emerald-800 hover:border-emerald-300 hover:bg-emerald-50"
                      )
                    }
                  >
                    {tab.label}
                  </NavLink>
                ))}
              </nav>

              {/* active tab content */}
              <div className="border border-gray-200 rounded-b-lg border-t-0 bg-white">
                <DashboardProvider>
                  <Outlet />
                </DashboardProvider>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
