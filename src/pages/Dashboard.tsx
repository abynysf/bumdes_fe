import { Outlet, NavLink } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import clsx from "clsx";

export default function Dashboard() {
  const tabs = [
    { label: "Profil", to: "profile" },
    { label: "Struktur", to: "struktur" },
    { label: "Legalitas", to: "legalitas" },
  ];

  return (
    <div className="flex h-screen">
      {/* left rail */}
      <Sidebar />

      {/* main column */}
      <div className="w-full overflow-y-auto">
        <Topbar />

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
                <Outlet />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
