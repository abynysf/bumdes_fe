import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/Dashboard";
import ProfileTab from "../pages/dashboard/ProfileTab";
import StrukturTab from "../pages/dashboard/StrukturTab";
import LegalitasTab from "../pages/dashboard/LegalitasTab";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard/profile" replace />} />
          <Route path="dashboard" element={<Dashboard />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<ProfileTab />} />
            <Route path="struktur" element={<StrukturTab />} />
            <Route path="legalitas" element={<LegalitasTab />} />
          </Route>
        </Route>
        <Route
          path="*"
          element={<Navigate to="/dashboard/profile" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
