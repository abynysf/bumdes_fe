import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ProfileTab from "../pages/dashboard/ProfileTab";
import StrukturTab from "../pages/dashboard/StrukturTab";
import LegalitasTab from "../pages/dashboard/LegalitasTab";
import Assets from "../pages/Assets";
import BusinessUnits from "../pages/BusinessUnits";
import FinancialReports from "../pages/FinancialReports";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* send / to the default tab */}
        <Route
          path="/"
          element={<Navigate to="/dashboard/profile" replace />}
        />

        {/* Dashboard (Profil BUM Desa) - with tabs */}
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfileTab />} />
          <Route path="struktur" element={<StrukturTab />} />
          <Route path="legalitas" element={<LegalitasTab />} />
        </Route>

        {/* Standalone pages with sidebar */}
        <Route path="assets" element={<Assets />} />
        <Route path="business-units" element={<BusinessUnits />} />
        <Route path="financial-reports" element={<FinancialReports />} />

        {/* catch-all */}
        <Route
          path="*"
          element={<Navigate to="/dashboard/profile" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
