import { createContext, useContext, useState, type ReactNode } from "react";

// Types for Tab 1 - Ringkasan
export type LabaRugi = {
  tahun: number;
  labaKotor: number;
  bebanGaji: number;
  bebanLainLain: number;
  labaBersih: number;
};

export type HasilMusdes = {
  tahun: number;
  labaBersih: number;
  labaDitahan: number;
  padDariBumDesa: number;
  buktiPad: string; // File URL
  kegiatanPadUntukApa: string;
};

// Type for Tab 2 - Program Kerja
export type ProgramKerja = {
  nama: string;
  tahun: number;
  tanggalUpload: string; // YYYY-MM-DD
  file: string;
};

// Type for Tab 3 - Laporan Pengawas
export type LaporanPengawas = {
  namaLaporan: string;
  bulan: string;
  tahun: number;
  tanggalUpload: string; // YYYY-MM-DD
  fileLaporan: string;
  dokumentasi: string;
};

// Types for Tab 4 - Laporan Bulanan
export type LaporanBulanan = {
  namaLaporan: string;
  unit: string;
  bulan: string;
  tahun: number;
  keterangan: string;
  tanggalUpload: string; // YYYY-MM-DD
  file: string;
};

export type RapatInternal = {
  namaKegiatan: string;
  tanggal: string; // YYYY-MM-DD
  judulNotulen: string;
  uploadNotulen: string;
  dokumentasi: string;
};

// Types for Tab 5 - Laporan Semesteran
export type LaporanSemesteran = {
  namaLaporan: string;
  semester: string; // "Ganjil (I)" or "Genap (II)"
  tahun: number;
  tanggalUpload: string; // YYYY-MM-DD
  file: string;
};

export type RapatKinerja = {
  namaKegiatan: string;
  tanggal: string; // YYYY-MM-DD
  judulNotulen: string;
  uploadNotulen: string;
  dokumentasi: string;
};

// Types for Tab 6 - Laporan Tahunan
export type LaporanTahunan = {
  namaLaporan: string;
  tahun: number;
  tanggalUpload: string; // YYYY-MM-DD
  file: string;
};

export type MusyawarahDesaTahunan = {
  namaKegiatan: string;
  tanggal: string; // YYYY-MM-DD
  judulBeritaAcara: string;
  uploadBeritaAcara: string;
  dokumentasi: string;
};

// Context type
type LaporanContextType = {
  labaRugiData: LabaRugi[];
  setLabaRugiData: React.Dispatch<React.SetStateAction<LabaRugi[]>>;
  hasilMusdesData: HasilMusdes[];
  setHasilMusdesData: React.Dispatch<React.SetStateAction<HasilMusdes[]>>;
  programKerjaData: ProgramKerja[];
  setProgramKerjaData: React.Dispatch<React.SetStateAction<ProgramKerja[]>>;
  laporanPengawasData: LaporanPengawas[];
  setLaporanPengawasData: React.Dispatch<React.SetStateAction<LaporanPengawas[]>>;
  laporanBulananData: LaporanBulanan[];
  setLaporanBulananData: React.Dispatch<React.SetStateAction<LaporanBulanan[]>>;
  rapatInternalData: RapatInternal[];
  setRapatInternalData: React.Dispatch<React.SetStateAction<RapatInternal[]>>;
  laporanSemesteranData: LaporanSemesteran[];
  setLaporanSemesteranData: React.Dispatch<React.SetStateAction<LaporanSemesteran[]>>;
  rapatKinerjaData: RapatKinerja[];
  setRapatKinerjaData: React.Dispatch<React.SetStateAction<RapatKinerja[]>>;
  laporanTahunanData: LaporanTahunan[];
  setLaporanTahunanData: React.Dispatch<React.SetStateAction<LaporanTahunan[]>>;
  musyawarahDesaData: MusyawarahDesaTahunan[];
  setMusyawarahDesaData: React.Dispatch<React.SetStateAction<MusyawarahDesaTahunan[]>>;
};

// Create context
const LaporanContext = createContext<LaporanContextType | undefined>(undefined);

// Provider component
export function LaporanProvider({ children }: { children: ReactNode }) {
  const [labaRugiData, setLabaRugiData] = useState<LabaRugi[]>([]);
  const [hasilMusdesData, setHasilMusdesData] = useState<HasilMusdes[]>([]);
  const [programKerjaData, setProgramKerjaData] = useState<ProgramKerja[]>([]);
  const [laporanPengawasData, setLaporanPengawasData] = useState<LaporanPengawas[]>([]);
  const [laporanBulananData, setLaporanBulananData] = useState<LaporanBulanan[]>([]);
  const [rapatInternalData, setRapatInternalData] = useState<RapatInternal[]>([]);
  const [laporanSemesteranData, setLaporanSemesteranData] = useState<LaporanSemesteran[]>([]);
  const [rapatKinerjaData, setRapatKinerjaData] = useState<RapatKinerja[]>([]);
  const [laporanTahunanData, setLaporanTahunanData] = useState<LaporanTahunan[]>([]);
  const [musyawarahDesaData, setMusyawarahDesaData] = useState<MusyawarahDesaTahunan[]>([]);

  return (
    <LaporanContext.Provider
      value={{
        labaRugiData,
        setLabaRugiData,
        hasilMusdesData,
        setHasilMusdesData,
        programKerjaData,
        setProgramKerjaData,
        laporanPengawasData,
        setLaporanPengawasData,
        laporanBulananData,
        setLaporanBulananData,
        rapatInternalData,
        setRapatInternalData,
        laporanSemesteranData,
        setLaporanSemesteranData,
        rapatKinerjaData,
        setRapatKinerjaData,
        laporanTahunanData,
        setLaporanTahunanData,
        musyawarahDesaData,
        setMusyawarahDesaData,
      }}
    >
      {children}
    </LaporanContext.Provider>
  );
}

// Custom hook to use the context
export function useLaporan() {
  const context = useContext(LaporanContext);
  if (context === undefined) {
    throw new Error("useLaporan must be used within a LaporanProvider");
  }
  return context;
}
