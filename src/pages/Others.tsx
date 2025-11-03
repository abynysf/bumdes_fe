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
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen || !isMobile} onClose={handleSidebarClose} />
      <div className="w-full overflow-y-auto bg-white">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="min-h-[calc(100vh-64px)]">
          <section className="p-6">
            <div className="rounded-lg bg-neutral-50 p-8 shadow-sm">
              <h1 className="mb-4 text-2xl font-bold text-neutral-800">
                Lain-lain
              </h1>
              <p className="text-neutral-600">
                Halaman ini sedang dalam pengembangan. Fitur tambahan akan
                ditambahkan di masa mendatang.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
