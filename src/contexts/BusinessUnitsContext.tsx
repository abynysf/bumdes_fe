import { createContext, useContext, useState, type ReactNode } from "react";

// Types
export type BusinessUnit = {
  namaUnit: string;
  jenisUsaha: string;
  detailUsaha: string;
  tanggalBerdiri: string;
  totalModal: number | "";
  omzetTahunIni: number | "";
  status: "Aktif" | "Tidak Aktif";
  terakhirUpdate: string;
};

export type SOPDocument = {
  unitNama: string;
  tahun: number;
  nama: string;
  file: string;
};

export type ActivityDoc = {
  unitNama: string;
  tahun: number;
  nama: string;
  deskripsi: string;
  file: string;
};

// Context type
type BusinessUnitsContextType = {
  units: BusinessUnit[];
  setUnits: React.Dispatch<React.SetStateAction<BusinessUnit[]>>;
  sopDocuments: SOPDocument[];
  setSopDocuments: React.Dispatch<React.SetStateAction<SOPDocument[]>>;
  activityDocs: ActivityDoc[];
  setActivityDocs: React.Dispatch<React.SetStateAction<ActivityDoc[]>>;
};

// Create context
const BusinessUnitsContext = createContext<
  BusinessUnitsContextType | undefined
>(undefined);

// Provider component
export function BusinessUnitsProvider({ children }: { children: ReactNode }) {
  const [units, setUnits] = useState<BusinessUnit[]>([
    {
      namaUnit: "Toko Sumber Rejeki",
      jenisUsaha: "Perdagangan",
      detailUsaha: "Menjual berbagai kebutuhan sehari-hari",
      tanggalBerdiri: "2015-06-15",
      totalModal: 50000000,
      omzetTahunIni: 200000000,
      status: "Aktif",
      terakhirUpdate: "27/10/2025",
    },
  ]);
  // === LOCAL FALLBACK MODE - Mock Data ===
  const [sopDocuments, setSopDocuments] = useState<SOPDocument[]>([
    {
      unitNama: "Toko Sumber Rejeki",
      tahun: 2023,
      nama: "SOP Operasional Toko",
      file: "sop_operasional_toko.pdf",
    },
    {
      unitNama: "Toko Sumber Rejeki",
      tahun: 2023,
      nama: "SOP Pelayanan Pelanggan",
      file: "sop_pelayanan.pdf",
    },
    {
      unitNama: "Toko Sumber Rejeki",
      tahun: 2024,
      nama: "SOP Manajemen Stok",
      file: "sop_stok.pdf",
    },
  ]);
  const [activityDocs, setActivityDocs] = useState<ActivityDoc[]>([
    {
      unitNama: "Toko Sumber Rejeki",
      tahun: 2024,
      nama: "Laporan Kegiatan Bulanan",
      deskripsi: "Laporan aktivitas toko bulan Oktober 2024",
      file: "laporan_oktober_2024.pdf",
    },
    {
      unitNama: "Toko Sumber Rejeki",
      tahun: 2024,
      nama: "Dokumentasi Pembukaan Cabang",
      deskripsi: "Foto dan laporan pembukaan cabang baru",
      file: "pembukaan_cabang.pdf",
    },
    {
      unitNama: "Toko Sumber Rejeki",
      tahun: 2023,
      nama: "Pelatihan Karyawan",
      deskripsi: "Dokumentasi pelatihan pelayanan pelanggan",
      file: "pelatihan_2023.pdf",
    },
  ]);

  return (
    <BusinessUnitsContext.Provider
      value={{
        units,
        setUnits,
        sopDocuments,
        setSopDocuments,
        activityDocs,
        setActivityDocs,
      }}
    >
      {children}
    </BusinessUnitsContext.Provider>
  );
}

// Custom hook to use the context
export function useBusinessUnits() {
  const context = useContext(BusinessUnitsContext);
  if (context === undefined) {
    throw new Error(
      "useBusinessUnits must be used within a BusinessUnitsProvider"
    );
  }
  return context;
}
