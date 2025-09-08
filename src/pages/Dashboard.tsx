import { Outlet } from "react-router-dom";
import { TabsInCard } from "../components/ui/Tabs"; // adjust the path if needed

export default function Dashboard() {
  return (
    <section className="mx-auto max-w-7xl px-4">
      {/* One unified card that contains the tabs and the page content */}
      <div className="rounded-xl border bg-white shadow-sm">
        {/* Tabs row */}
        <div className="px-4 pt-3">
          <TabsInCard
            items={[
              { label: "Profil", to: "profile" },
              { label: "Struktur", to: "struktur" },
              { label: "Legalitas", to: "legalitas" },
            ]}
          />
        </div>

        {/* Content of the active tab */}
        <div className="px-4 pb-4 pt-4">
          <Outlet />
        </div>
      </div>
    </section>
  );
}
