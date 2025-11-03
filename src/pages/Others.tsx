import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useIsMobile } from "../hooks";

export default function Others() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      <div className="flex min-h-screen flex-col lg:ml-64">
        <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 bg-neutral-50 p-6">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <h1 className="mb-4 text-2xl font-bold text-neutral-800">
                Lain-lain
              </h1>
              <p className="text-neutral-600">
                Halaman ini sedang dalam pengembangan. Fitur tambahan akan
                ditambahkan di masa mendatang.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
