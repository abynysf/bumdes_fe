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
  // === LOCAL FALLBACK MODE - Mock Data ===

  // Tab 1: Ringkasan - Laba Rugi
  const [labaRugiData, setLabaRugiData] = useState<LabaRugi[]>([
    {
      tahun: 2023,
      labaKotor: 150000000,
      bebanGaji: 36000000,
      bebanLainLain: 24000000,
      labaBersih: 90000000,
    },
    {
      tahun: 2024,
      labaKotor: 200000000,
      bebanGaji: 48000000,
      bebanLainLain: 32000000,
      labaBersih: 120000000,
    },
  ]);

  // Tab 1: Ringkasan - Hasil Musdes
  const [hasilMusdesData, setHasilMusdesData] = useState<HasilMusdes[]>([
    {
      tahun: 2023,
      labaBersih: 90000000,
      labaDitahan: 45000000,
      padDariBumDesa: 45000000,
      buktiPad: "bukti_pad_2023.pdf",
      kegiatanPadUntukApa: "Pembangunan Infrastruktur Desa",
    },
    {
      tahun: 2024,
      labaBersih: 120000000,
      labaDitahan: 60000000,
      padDariBumDesa: 60000000,
      buktiPad: "bukti_pad_2024.pdf",
      kegiatanPadUntukApa: "Program Kesejahteraan Masyarakat",
    },
  ]);

  // Tab 2: Program Kerja
  const [programKerjaData, setProgramKerjaData] = useState<ProgramKerja[]>([
    {
      nama: "Program Kerja Tahunan 2024",
      tahun: 2024,
      tanggalUpload: "2024-01-15",
      file: "proker_2024.pdf",
    },
    {
      nama: "Rencana Strategis 2024-2028",
      tahun: 2024,
      tanggalUpload: "2024-01-20",
      file: "renstra_2024_2028.pdf",
    },
  ]);

  // Tab 3: Laporan Pengawas
  const [laporanPengawasData, setLaporanPengawasData] = useState<LaporanPengawas[]>([
    {
      namaLaporan: "Laporan Pengawasan Triwulan I",
      bulan: "Maret",
      tahun: 2024,
      tanggalUpload: "2024-04-05",
      fileLaporan: "pengawas_tw1_2024.pdf",
      dokumentasi: "dok_pengawas_tw1.pdf",
    },
    {
      namaLaporan: "Laporan Pengawasan Triwulan II",
      bulan: "Juni",
      tahun: 2024,
      tanggalUpload: "2024-07-10",
      fileLaporan: "pengawas_tw2_2024.pdf",
      dokumentasi: "dok_pengawas_tw2.pdf",
    },
  ]);

  // Tab 4: Laporan Bulanan
  const [laporanBulananData, setLaporanBulananData] = useState<LaporanBulanan[]>([
    {
      namaLaporan: "Laporan Keuangan Oktober",
      unit: "Toko Sumber Rejeki",
      bulan: "Oktober",
      tahun: 2024,
      keterangan: "Laporan keuangan bulanan",
      tanggalUpload: "2024-11-05",
      file: "laporan_okt_2024.pdf",
    },
    {
      namaLaporan: "Laporan Keuangan November",
      unit: "Toko Sumber Rejeki",
      bulan: "November",
      tahun: 2024,
      keterangan: "Laporan keuangan bulanan",
      tanggalUpload: "2024-12-01",
      file: "laporan_nov_2024.pdf",
    },
  ]);

  // Tab 4: Rapat Internal
  const [rapatInternalData, setRapatInternalData] = useState<RapatInternal[]>([
    {
      namaKegiatan: "Rapat Koordinasi Bulanan",
      tanggal: "2024-10-15",
      judulNotulen: "Notulen Rapat Koordinasi Oktober",
      uploadNotulen: "notulen_rapat_okt.pdf",
      dokumentasi: "dok_rapat_okt.pdf",
    },
    {
      namaKegiatan: "Rapat Evaluasi Kinerja",
      tanggal: "2024-11-20",
      judulNotulen: "Notulen Rapat Evaluasi November",
      uploadNotulen: "notulen_eval_nov.pdf",
      dokumentasi: "dok_eval_nov.pdf",
    },
  ]);

  // Tab 5: Laporan Semesteran
  const [laporanSemesteranData, setLaporanSemesteranData] = useState<LaporanSemesteran[]>([
    {
      namaLaporan: "Laporan Semester I 2024",
      semester: "Ganjil (I)",
      tahun: 2024,
      tanggalUpload: "2024-07-15",
      file: "laporan_sem1_2024.pdf",
    },
    {
      namaLaporan: "Laporan Semester II 2023",
      semester: "Genap (II)",
      tahun: 2023,
      tanggalUpload: "2024-01-15",
      file: "laporan_sem2_2023.pdf",
    },
  ]);

  // Tab 5: Rapat Kinerja
  const [rapatKinerjaData, setRapatKinerjaData] = useState<RapatKinerja[]>([
    {
      namaKegiatan: "Rapat Evaluasi Kinerja Semester I",
      tanggal: "2024-07-20",
      judulNotulen: "Notulen Evaluasi Semester I 2024",
      uploadNotulen: "notulen_kinerja_sem1.pdf",
      dokumentasi: "dok_kinerja_sem1.pdf",
    },
  ]);

  // Tab 6: Laporan Tahunan
  const [laporanTahunanData, setLaporanTahunanData] = useState<LaporanTahunan[]>([
    {
      namaLaporan: "Laporan Tahunan 2023",
      tahun: 2023,
      tanggalUpload: "2024-01-30",
      file: "laporan_tahunan_2023.pdf",
    },
    {
      namaLaporan: "Laporan Pertanggungjawaban 2023",
      tahun: 2023,
      tanggalUpload: "2024-02-15",
      file: "lpj_2023.pdf",
    },
  ]);

  // Tab 6: Musyawarah Desa Tahunan
  const [musyawarahDesaData, setMusyawarahDesaData] = useState<MusyawarahDesaTahunan[]>([
    {
      namaKegiatan: "Musyawarah Desa Tahunan 2023",
      tanggal: "2024-02-10",
      judulBeritaAcara: "Berita Acara Musdes 2023",
      uploadBeritaAcara: "ba_musdes_2023.pdf",
      dokumentasi: "dok_musdes_2023.pdf",
    },
  ]);

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
