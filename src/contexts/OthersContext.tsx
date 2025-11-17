import { createContext, useContext, useState, type ReactNode } from "react";

// Ketahanan Pangan Info (read-only header data)
export type KetahananPanganInfo = {
  namaDesa: string;
  namaBumDesa: string;
  tahun: number;
};

// Ketahanan Pangan Document (example document in table)
export type KetahananPanganDocument = {
  id: string;
  no: string;
  kelengkapan: string;
  pelaksana: string;
  fileUrl?: string;
  fileName?: string;
  keterangan?: string;
};

// Dokumen Lain (CRUD documents)
export type DokumenLain = {
  id: string;
  namaDokumen: string;
  tanggalUpload: string;
  fileUrl: string;
  fileName: string;
};

type OthersContextType = {
  // Ketahanan Pangan
  ketahananPanganInfo: KetahananPanganInfo;
  setKetahananPanganInfo: React.Dispatch<React.SetStateAction<KetahananPanganInfo>>;
  ketahananPanganDocuments: KetahananPanganDocument[];
  setKetahananPanganDocuments: React.Dispatch<React.SetStateAction<KetahananPanganDocument[]>>;

  // Dokumen Lain
  dokumenLain: DokumenLain[];
  setDokumenLain: React.Dispatch<React.SetStateAction<DokumenLain[]>>;
};

const OthersContext = createContext<OthersContextType | undefined>(undefined);

export function OthersProvider({ children }: { children: ReactNode }) {
  // Ketahanan Pangan - header info (read-only, will be fetched from DB later)
  const [ketahananPanganInfo, setKetahananPanganInfo] = useState<KetahananPanganInfo>({
    namaDesa: "Desa Maju Jaya",
    namaBumDesa: "BUM Desa Sejahtera Bersama",
    tahun: 2025,
  });

  // Ketahanan Pangan - example document
  const [ketahananPanganDocuments, setKetahananPanganDocuments] = useState<KetahananPanganDocument[]>([
    {
      id: "1",
      no: "1",
      kelengkapan: "SK TIM RKP",
      pelaksana: "Pemerintah Desa",
      fileUrl: "https://example.com/documents/sk_tim_rkp.pdf",
      fileName: "sk_tim_rkp.pdf",
      keterangan: "",
    },
  ]);

  // Dokumen Lain - CRUD documents
  const [dokumenLain, setDokumenLain] = useState<DokumenLain[]>([
    {
      id: "1",
      namaDokumen: "Surat Perjanjian Kerjasama",
      tanggalUpload: "2025-05-20",
      fileUrl: "https://example.com/documents/spk_supplier.pdf",
      fileName: "spk_supplier.pdf",
    },
    {
      id: "2",
      namaDokumen: "Sertifikat Pelatihan",
      tanggalUpload: "2025-06-11",
      fileUrl: "https://example.com/documents/sertifikat_pelatihan.pdf",
      fileName: "sertifikat_pelatihan.pdf",
    },
  ]);

  return (
    <OthersContext.Provider
      value={{
        ketahananPanganInfo,
        setKetahananPanganInfo,
        ketahananPanganDocuments,
        setKetahananPanganDocuments,
        dokumenLain,
        setDokumenLain,
      }}
    >
      {children}
    </OthersContext.Provider>
  );
}

export function useOthers() {
  const context = useContext(OthersContext);
  if (context === undefined) {
    throw new Error("useOthers must be used within an OthersProvider");
  }
  return context;
}
