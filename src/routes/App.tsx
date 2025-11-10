import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProfileTab from "../pages/dashboard/ProfileTab";
import StrukturTab from "../pages/dashboard/StrukturTab";
import LegalitasTab from "../pages/dashboard/LegalitasTab";
import Assets from "../pages/Assets";
import BusinessUnits from "../pages/BusinessUnits";
import DaftarUnitUsahaTab from "../pages/business-units/DaftarUnitUsahaTab";
import SOPUnitUsahaTab from "../pages/business-units/SOPUnitUsahaTab";
import DokumentasiKegiatanTab from "../pages/business-units/DokumentasiKegiatanTab";
import Laporan from "../pages/Laporan";
import RingkasanTab from "../pages/laporan/RingkasanTab";
import ProgramKerjaTab from "../pages/laporan/ProgramKerjaTab";
import LaporanPengawasTab from "../pages/laporan/LaporanPengawasTab";
import LaporanBulananTab from "../pages/laporan/LaporanBulananTab";
import LaporanSemesteranTab from "../pages/laporan/LaporanSemesteranTab";
import LaporanTahunanTab from "../pages/laporan/LaporanTahunanTab";
import Others from "../pages/Others";

// Root redirect component that checks authentication
function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return (
    <Navigate to={isAuthenticated ? "/dashboard/profile" : "/login"} replace />
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Login page - public route */}
          <Route path="/login" element={<Login />} />

          {/* Root redirect - checks auth status */}
          <Route path="/" element={<RootRedirect />} />

          {/* Protected routes - require authentication */}
          {/* Dashboard (Profil BUM Desa) - with tabs */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<ProfileTab />} />
            <Route path="struktur" element={<StrukturTab />} />
            <Route path="legalitas" element={<LegalitasTab />} />
          </Route>

          {/* Business Units (Unit Usaha BUM Desa) - with tabs */}
          <Route
            path="business-units"
            element={
              <ProtectedRoute>
                <BusinessUnits />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="daftar" replace />} />
            <Route path="daftar" element={<DaftarUnitUsahaTab />} />
            <Route path="sop" element={<SOPUnitUsahaTab />} />
            <Route path="dokumentasi" element={<DokumentasiKegiatanTab />} />
          </Route>

          {/* Laporan BUM Desa - with tabs */}
          <Route
            path="laporan"
            element={
              <ProtectedRoute>
                <Laporan />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="ringkasan" replace />} />
            <Route path="ringkasan" element={<RingkasanTab />} />
            <Route path="program-kerja" element={<ProgramKerjaTab />} />
            <Route path="laporan-pengawas" element={<LaporanPengawasTab />} />
            <Route path="laporan-bulanan" element={<LaporanBulananTab />} />
            <Route
              path="laporan-semesteran"
              element={<LaporanSemesteranTab />}
            />
            <Route path="laporan-tahunan" element={<LaporanTahunanTab />} />
          </Route>

          {/* Standalone pages with sidebar */}
          <Route
            path="assets"
            element={
              <ProtectedRoute>
                <Assets />
              </ProtectedRoute>
            }
          />
          <Route
            path="others"
            element={
              <ProtectedRoute>
                <Others />
              </ProtectedRoute>
            }
          />

          {/* catch-all */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
