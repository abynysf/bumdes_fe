import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

        {/* Business Units (Unit Usaha BUM Desa) - with tabs */}
        <Route path="business-units" element={<BusinessUnits />}>
          <Route index element={<Navigate to="daftar" replace />} />
          <Route path="daftar" element={<DaftarUnitUsahaTab />} />
          <Route path="sop" element={<SOPUnitUsahaTab />} />
          <Route path="dokumentasi" element={<DokumentasiKegiatanTab />} />
        </Route>

        {/* Laporan BUM Desa - with tabs */}
        <Route path="laporan" element={<Laporan />}>
          <Route index element={<Navigate to="ringkasan" replace />} />
          <Route path="ringkasan" element={<RingkasanTab />} />
          <Route path="program-kerja" element={<ProgramKerjaTab />} />
          <Route path="laporan-pengawas" element={<LaporanPengawasTab />} />
          <Route path="laporan-bulanan" element={<LaporanBulananTab />} />
          <Route path="laporan-semesteran" element={<LaporanSemesteranTab />} />
          <Route path="laporan-tahunan" element={<LaporanTahunanTab />} />
        </Route>

        {/* Standalone pages with sidebar */}
        <Route path="assets" element={<Assets />} />
        <Route path="others" element={<Others />} />

        {/* catch-all */}
        <Route
          path="*"
          element={<Navigate to="/dashboard/profile" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
