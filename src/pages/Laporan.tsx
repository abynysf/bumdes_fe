import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useIsMobile } from "../hooks";
import { LaporanProvider } from "../contexts/LaporanContext";

// Main container component
function LaporanContainer() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const tabs = [
    { label: "Ringkasan", to: "ringkasan" },
    { label: "Program Kerja", to: "program-kerja" },
    { label: "Laporan Pengawas", to: "laporan-pengawas" },
    { label: "Laporan Bulanan", to: "laporan-bulanan" },
    { label: "Laporan Semesteran", to: "laporan-semesteran" },
    { label: "Laporan Tahunan", to: "laporan-tahunan" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen || !isMobile} onClose={handleSidebarClose} />

      {/* Main column */}
      <div className="w-full overflow-y-auto">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Body */}
        <main>
          <section className="min-h-screen bg-white p-6">
            {/* Tabs */}
            <div className="rounded-lg bg-white shadow-sm">
              {/* Tab Navigation */}
              <div className="border-b border-neutral-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <NavLink
                      key={tab.to}
                      to={tab.to}
                      className={({ isActive }) =>
                        `border-b-2 px-1 py-4 text-sm font-medium ${
                          isActive
                            ? "border-emerald-500 text-emerald-600"
                            : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                        }`
                      }
                    >
                      {tab.label}
                    </NavLink>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="rounded-b-lg border-t-0 bg-white">
                <Outlet />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

// Wrap with provider
export default function Laporan() {
  return (
    <LaporanProvider>
      <LaporanContainer />
    </LaporanProvider>
  );
}
