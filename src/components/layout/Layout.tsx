import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  return (
    <div className="flex h-dvh w-dvw overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        {/* tighter padding so content is closer to the topbar/sidebar */}
        <main className="min-h-0 flex-1 overflow-auto px-4 pt-3 pb-8 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
