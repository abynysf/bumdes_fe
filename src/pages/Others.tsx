import { useState } from "react";
import { Outlet, NavLink } from "react-router";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useIsMobile } from "../hooks";
import { OthersProvider } from "../contexts/OthersContext";

function OthersContainer() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const tabs = [
    { label: "Ketahanan Pangan", to: "ketahanan-pangan" },
    { label: "Dokumen Lain", to: "dokumen-lain" },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen || !isMobile} onClose={handleSidebarClose} />
      <div className="w-full overflow-y-auto bg-white">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="min-h-[calc(100vh-64px)]">
          <section className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-neutral-800">Lain-lain</h1>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-white shadow-sm">
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

export default function Others() {
  return (
    <OthersProvider>
      <OthersContainer />
    </OthersProvider>
  );
}
