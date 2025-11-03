import { Outlet, NavLink } from "react-router-dom";
import { useState, useCallback } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useIsMobile } from "../hooks";
import { Building2, Wallet, TrendingUp } from "lucide-react";
import {
  BusinessUnitsProvider,
  useBusinessUnits,
} from "../contexts/BusinessUnitsContext";

// Summary cards component (needs access to context)
function SummaryCards() {
  const { units } = useBusinessUnits();

  const calculateTotalUnits = useCallback((): number => {
    return units.length;
  }, [units]);

  const calculateTotalModal = useCallback((): number => {
    return units.reduce((sum, unit) => {
      const value = typeof unit.totalModal === "number" ? unit.totalModal : 0;
      return sum + value;
    }, 0);
  }, [units]);

  const calculateTotalOmzet = useCallback((): number => {
    return units.reduce((sum, unit) => {
      const value =
        typeof unit.omzetTahunIni === "number" ? unit.omzetTahunIni : 0;
      return sum + value;
    }, 0);
  }, [units]);

  const formatCurrency = (value: number): string => {
    return "Rp " + new Intl.NumberFormat("id-ID").format(value);
  };

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 bg-white no-print">
      {/* Total Unit Usaha */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-600">
              Total Unit Usaha
            </p>
            <p className="mt-2 text-3xl font-bold text-neutral-900">
              {calculateTotalUnits()}
            </p>
          </div>
          <div className="rounded-full bg-blue-100 p-3">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Total Modal */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-600">Total Modal</p>
            <p className="mt-2 text-3xl font-bold text-neutral-900">
              {formatCurrency(calculateTotalModal())}
            </p>
          </div>
          <div className="rounded-full bg-emerald-100 p-3">
            <Wallet className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Omzet Tahun Ini */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-600">
              Omzet (Tahun Ini)
            </p>
            <p className="mt-2 text-3xl font-bold text-neutral-900">
              {formatCurrency(calculateTotalOmzet())}
            </p>
          </div>
          <div className="rounded-full bg-amber-100 p-3">
            <TrendingUp className="h-6 w-6 text-amber-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Main container component
function BusinessUnitsContainer() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const tabs = [
    { label: "Daftar Unit Usaha", to: "daftar" },
    { label: "SOP Unit Usaha", to: "sop" },
    { label: "Dokumentasi Kegiatan", to: "dokumentasi" },
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
            {/* Summary Cards */}
            <SummaryCards />

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
export default function BusinessUnits() {
  return (
    <BusinessUnitsProvider>
      <BusinessUnitsContainer />
    </BusinessUnitsProvider>
  );
}
