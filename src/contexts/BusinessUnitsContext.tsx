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
  const [sopDocuments, setSopDocuments] = useState<SOPDocument[]>([]);
  const [activityDocs, setActivityDocs] = useState<ActivityDoc[]>([]);

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
