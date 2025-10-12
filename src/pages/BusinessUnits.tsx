import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useIsMobile } from "../hooks";

export default function BusinessUnits() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      <Sidebar
        isOpen={sidebarOpen || !isMobile}
        onClose={handleSidebarClose}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <section className="bg-neutral-50 p-4 sm:p-6 lg:p-8">
            <div className="rounded-lg shadow-sm bg-white border border-neutral-200 p-6">
              <h1 className="text-2xl font-bold text-neutral-900">Unit Usaha BUM Desa</h1>
              <p className="mt-2 text-neutral-600">
                Halaman ini akan menampilkan data unit usaha BUM Desa.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
