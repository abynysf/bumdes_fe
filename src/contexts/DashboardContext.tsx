import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react";

/**
 * ===========================
 * Profile Types
 * ===========================
 */
export type BaseProfile = {
  namaLengkap: string;
  statusBadanHukum: string;
  tahunPendirian: number | "";
  alamatKantor: string;
  jumlahPengurus: number | "";
  pengurusL: number | "";
  pengurusP: number | "";
  skBadanHukumFile: string | null;
};

export type DokumenPerdes = {
  tahun: number;
  nama: string;
  nomor: string;
  file?: string;
};

export type RekeningBUM = {
  bank: string;
  nama: string;
  nomor: string;
  ketahananPangan?: boolean;
  keterangan?: string;
  file?: string;
};

export type ProfileState = {
  form: BaseProfile;
  dokumen: DokumenPerdes[];
  rekening: RekeningBUM[];
};

export type ProfileAction =
  | {
      type: "form/update";
      key: keyof BaseProfile;
      value: BaseProfile[keyof BaseProfile];
    }
  | { type: "rekening/add"; payload: RekeningBUM }
  | { type: "rekening/update"; index: number; payload: RekeningBUM }
  | { type: "rekening/remove"; index: number }
  | { type: "dokumen/add"; payload: DokumenPerdes }
  | { type: "dokumen/update"; index: number; payload: DokumenPerdes }
  | { type: "dokumen/remove"; index: number }
  | { type: "sk/set"; payload: string | null }
  | { type: "reset" };

/**
 * ===========================
 * Struktur Types
 * ===========================
 */
export type PengurusBUM = {
  jabatan: string;
  namaPengurus: string;
  pekerjaan: string;
  nomorTelepon: string;
  gaji: string;
  keterangan: string;
};

export type SKPengawas = {
  periode?: string;
  tahun?: string;
  nomor: string;
  file: string;
};

export type SKDirektur = {
  periode?: string;
  tahun?: string;
  nomor: string;
  file: string;
};

export type SKPegawai = {
  periode?: string;
  tahun?: string;
  nomor: string;
  file: string;
};

export type SKPengurus = {
  periode?: string;
  tahun?: string;
  nomor: string;
  file: string;
};

export type BeritaAcaraBUM = {
  periode?: string;
  tahun?: string;
  nomor: string;
  file: string;
};

export type StrukturState = {
  pengurus: PengurusBUM[];
  skPengawas: SKPengawas[];
  skDirektur: SKDirektur[];
  skPegawai: SKPegawai[];
  skPengurus: SKPengurus[];
  beritaAcara: BeritaAcaraBUM[];
};

export type StrukturAction =
  | { type: "pengurus/add"; payload: PengurusBUM }
  | { type: "pengurus/update"; index: number; payload: PengurusBUM }
  | { type: "pengurus/remove"; index: number }
  | { type: "skPengawas/add"; payload: SKPengawas }
  | { type: "skPengawas/update"; index: number; payload: SKPengawas }
  | { type: "skPengawas/remove"; index: number }
  | { type: "skDirektur/add"; payload: SKDirektur }
  | { type: "skDirektur/update"; index: number; payload: SKDirektur }
  | { type: "skDirektur/remove"; index: number }
  | { type: "skPegawai/add"; payload: SKPegawai }
  | { type: "skPegawai/update"; index: number; payload: SKPegawai }
  | { type: "skPegawai/remove"; index: number }
  | { type: "skPengurus/add"; payload: SKPengurus }
  | { type: "skPengurus/update"; index: number; payload: SKPengurus }
  | { type: "skPengurus/remove"; index: number }
  | { type: "ba/add"; payload: BeritaAcaraBUM }
  | { type: "ba/update"; index: number; payload: BeritaAcaraBUM }
  | { type: "ba/remove"; index: number }
  | { type: "reset" };

/**
 * ===========================
 * Legalitas Types
 * ===========================
 */
export type BaseDokumen = {
  tahun: number;
  nama: string;
  nominal?: number | "";
  file: string;
};

export type DokumenART = {
  tahun: number;
  nama: string;
  nominal?: number | "";
  file: string;
};

export type DokumenPerdesModal = {
  tahun: number;
  nama: string;
  nomor: string;
  nominal?: number | "";
  file: string;
};

export type DokumenSimple = {
  tahun: number;
  nomor: string;
  file: string;
};

export type DokumenAsetDesa = {
  tahun: number;
  nama: string;
  file: string;
};

export type LegalitasState = {
  anggaranDasar: BaseDokumen[];
  anggaranRumahTangga: DokumenART[];
  ahuBadanHukum: DokumenSimple[];
  npwp: DokumenSimple[];
  nib: DokumenSimple[];
  dokumenAsetDesa: DokumenAsetDesa[];
  perdesPenyertaanModal: DokumenPerdesModal[];
};

export type LegalitasAction =
  | { type: "ad/add"; payload: BaseDokumen }
  | { type: "ad/update"; index: number; payload: BaseDokumen }
  | { type: "ad/remove"; index: number }
  | { type: "art/add"; payload: DokumenART }
  | { type: "art/update"; index: number; payload: DokumenART }
  | { type: "art/remove"; index: number }
  | { type: "ahu/add"; payload: DokumenSimple }
  | { type: "ahu/update"; index: number; payload: DokumenSimple }
  | { type: "ahu/remove"; index: number }
  | { type: "npwp/add"; payload: DokumenSimple }
  | { type: "npwp/update"; index: number; payload: DokumenSimple }
  | { type: "npwp/remove"; index: number }
  | { type: "nib/add"; payload: DokumenSimple }
  | { type: "nib/update"; index: number; payload: DokumenSimple }
  | { type: "nib/remove"; index: number }
  | { type: "aset/add"; payload: DokumenAsetDesa }
  | { type: "aset/update"; index: number; payload: DokumenAsetDesa }
  | { type: "aset/remove"; index: number }
  | { type: "perdes/add"; payload: DokumenPerdesModal }
  | { type: "perdes/update"; index: number; payload: DokumenPerdesModal }
  | { type: "perdes/remove"; index: number }
  | { type: "reset" };

/**
 * ===========================
 * Initial States
 * ===========================
 */
const INITIAL_PROFILE: ProfileState = {
  form: {
    namaLengkap: "BUM Desa Sejahtera Makmur",
    statusBadanHukum: "terbit",
    tahunPendirian: 2022,
    alamatKantor: "Jl. Pahlawan No. 45, Desa Pulutan, Kec. Purwodadi, Kab. Grobogan",
    jumlahPengurus: 5,
    pengurusL: 3,
    pengurusP: 2,
    skBadanHukumFile: null,
  },
  dokumen: [
    {
      tahun: 2022,
      nama: "Perdes Pendirian BUM Desa",
      nomor: "01/2022",
    },
  ],
  rekening: [
    {
      bank: "BRI",
      nama: "BUMDES SEJAHTERA MAKMUR",
      nomor: "012345678901234",
      keterangan: "-",
    },
    {
      bank: "BPD Jateng",
      nama: "BUMDES KETAHANAN PANGAN",
      nomor: "9876543210987",
      keterangan: "Ketahanan Pangan",
    },
  ],
};

const INITIAL_STRUKTUR: StrukturState = {
  pengurus: [
    {
      jabatan: "Direktur",
      namaPengurus: "Budi Santoso",
      pekerjaan: "Wiraswasta",
      nomorTelepon: "081234567890",
      gaji: "Rp 2.500.000",
      keterangan: "Penanggung Jawab Umum",
    },
    {
      jabatan: "Sekretaris",
      namaPengurus: "Siti Aminah",
      pekerjaan: "Perangkat Desa",
      nomorTelepon: "081223344556",
      gaji: "Rp 2.000.000",
      keterangan: "-",
    },
    {
      jabatan: "Bendahara",
      namaPengurus: "Agus Wijoyo",
      pekerjaan: "Petani",
      nomorTelepon: "085678901234",
      gaji: "Rp 2.000.000",
      keterangan: "-",
    },
    {
      jabatan: "Pegawai BUM Desa",
      namaPengurus: "Dewi Lestari",
      pekerjaan: "Swasta",
      nomorTelepon: "087654321098",
      gaji: "Rp 1.800.000",
      keterangan: "Staf Unit Perdagangan",
    },
  ],
  skPengawas: [
    {
      periode: "2022-02-01 to 2027-01-31",
      nomor: "SK/02/KADES/II/2022",
      file: "",
    },
  ],
  skDirektur: [],
  skPegawai: [],
  skPengurus: [],
  beritaAcara: [],
};

const INITIAL_LEGALITAS: LegalitasState = {
  anggaranDasar: [],
  anggaranRumahTangga: [],
  ahuBadanHukum: [],
  npwp: [],
  nib: [],
  dokumenAsetDesa: [],
  perdesPenyertaanModal: [
    {
      tahun: 2022,
      nama: "Perdes Modal Awal",
      nomor: "02/2022",
      nominal: 50000000,
      file: "",
    },
    {
      tahun: 2024,
      nama: "Perdes Modal Tambahan",
      nomor: "05/2024",
      nominal: 25000000,
      file: "",
    },
  ],
};

/**
 * ===========================
 * Reducers
 * ===========================
 */
function profileReducer(
  state: ProfileState,
  action: ProfileAction
): ProfileState {
  switch (action.type) {
    case "form/update":
      return { ...state, form: { ...state.form, [action.key]: action.value } };
    case "rekening/add":
      return { ...state, rekening: [...state.rekening, action.payload] };
    case "rekening/update":
      return {
        ...state,
        rekening: state.rekening.map((r, i) =>
          i === action.index ? action.payload : r
        ),
      };
    case "rekening/remove":
      return {
        ...state,
        rekening: state.rekening.filter((_, i) => i !== action.index),
      };
    case "dokumen/add":
      return { ...state, dokumen: [...state.dokumen, action.payload] };
    case "dokumen/update":
      return {
        ...state,
        dokumen: state.dokumen.map((d, i) =>
          i === action.index ? action.payload : d
        ),
      };
    case "dokumen/remove":
      return {
        ...state,
        dokumen: state.dokumen.filter((_, i) => i !== action.index),
      };
    case "sk/set":
      return {
        ...state,
        form: { ...state.form, skBadanHukumFile: action.payload },
      };
    case "reset":
      return INITIAL_PROFILE;
    default:
      return state;
  }
}

function strukturReducer(
  state: StrukturState,
  action: StrukturAction
): StrukturState {
  switch (action.type) {
    case "pengurus/add":
      return { ...state, pengurus: [...state.pengurus, action.payload] };
    case "pengurus/update":
      return {
        ...state,
        pengurus: state.pengurus.map((p, i) =>
          i === action.index ? action.payload : p
        ),
      };
    case "pengurus/remove":
      return {
        ...state,
        pengurus: state.pengurus.filter((_, i) => i !== action.index),
      };
    case "skPengawas/add":
      return { ...state, skPengawas: [...state.skPengawas, action.payload] };
    case "skPengawas/update":
      return {
        ...state,
        skPengawas: state.skPengawas.map((s, i) =>
          i === action.index ? action.payload : s
        ),
      };
    case "skPengawas/remove":
      return {
        ...state,
        skPengawas: state.skPengawas.filter((_, i) => i !== action.index),
      };
    case "skDirektur/add":
      return { ...state, skDirektur: [...state.skDirektur, action.payload] };
    case "skDirektur/update":
      return {
        ...state,
        skDirektur: state.skDirektur.map((s, i) =>
          i === action.index ? action.payload : s
        ),
      };
    case "skDirektur/remove":
      return {
        ...state,
        skDirektur: state.skDirektur.filter((_, i) => i !== action.index),
      };
    case "skPegawai/add":
      return { ...state, skPegawai: [...state.skPegawai, action.payload] };
    case "skPegawai/update":
      return {
        ...state,
        skPegawai: state.skPegawai.map((s, i) =>
          i === action.index ? action.payload : s
        ),
      };
    case "skPegawai/remove":
      return {
        ...state,
        skPegawai: state.skPegawai.filter((_, i) => i !== action.index),
      };
    case "skPengurus/add":
      return { ...state, skPengurus: [...state.skPengurus, action.payload] };
    case "skPengurus/update":
      return {
        ...state,
        skPengurus: state.skPengurus.map((s, i) =>
          i === action.index ? action.payload : s
        ),
      };
    case "skPengurus/remove":
      return {
        ...state,
        skPengurus: state.skPengurus.filter((_, i) => i !== action.index),
      };
    case "ba/add":
      return { ...state, beritaAcara: [...state.beritaAcara, action.payload] };
    case "ba/update":
      return {
        ...state,
        beritaAcara: state.beritaAcara.map((b, i) =>
          i === action.index ? action.payload : b
        ),
      };
    case "ba/remove":
      return {
        ...state,
        beritaAcara: state.beritaAcara.filter((_, i) => i !== action.index),
      };
    case "reset":
      return INITIAL_STRUKTUR;
    default:
      return state;
  }
}

function legalitasReducer(
  state: LegalitasState,
  action: LegalitasAction
): LegalitasState {
  switch (action.type) {
    case "ad/add":
      return {
        ...state,
        anggaranDasar: [...state.anggaranDasar, action.payload],
      };
    case "ad/update":
      return {
        ...state,
        anggaranDasar: state.anggaranDasar.map((item, i) =>
          i === action.index ? action.payload : item
        ),
      };
    case "ad/remove":
      return {
        ...state,
        anggaranDasar: state.anggaranDasar.filter((_, i) => i !== action.index),
      };
    case "art/add":
      return {
        ...state,
        anggaranRumahTangga: [...state.anggaranRumahTangga, action.payload],
      };
    case "art/update":
      return {
        ...state,
        anggaranRumahTangga: state.anggaranRumahTangga.map((item, i) =>
          i === action.index ? action.payload : item
        ),
      };
    case "art/remove":
      return {
        ...state,
        anggaranRumahTangga: state.anggaranRumahTangga.filter(
          (_, i) => i !== action.index
        ),
      };
    case "ahu/add":
      return {
        ...state,
        ahuBadanHukum: [...state.ahuBadanHukum, action.payload],
      };
    case "ahu/update":
      return {
        ...state,
        ahuBadanHukum: state.ahuBadanHukum.map((item, i) =>
          i === action.index ? action.payload : item
        ),
      };
    case "ahu/remove":
      return {
        ...state,
        ahuBadanHukum: state.ahuBadanHukum.filter((_, i) => i !== action.index),
      };
    case "npwp/add":
      return {
        ...state,
        npwp: [...state.npwp, action.payload],
      };
    case "npwp/update":
      return {
        ...state,
        npwp: state.npwp.map((item, i) =>
          i === action.index ? action.payload : item
        ),
      };
    case "npwp/remove":
      return {
        ...state,
        npwp: state.npwp.filter((_, i) => i !== action.index),
      };
    case "nib/add":
      return {
        ...state,
        nib: [...state.nib, action.payload],
      };
    case "nib/update":
      return {
        ...state,
        nib: state.nib.map((item, i) =>
          i === action.index ? action.payload : item
        ),
      };
    case "nib/remove":
      return {
        ...state,
        nib: state.nib.filter((_, i) => i !== action.index),
      };
    case "aset/add":
      return {
        ...state,
        dokumenAsetDesa: [...state.dokumenAsetDesa, action.payload],
      };
    case "aset/update":
      return {
        ...state,
        dokumenAsetDesa: state.dokumenAsetDesa.map((item, i) =>
          i === action.index ? action.payload : item
        ),
      };
    case "aset/remove":
      return {
        ...state,
        dokumenAsetDesa: state.dokumenAsetDesa.filter(
          (_, i) => i !== action.index
        ),
      };
    case "perdes/add":
      return {
        ...state,
        perdesPenyertaanModal: [
          ...state.perdesPenyertaanModal,
          action.payload,
        ],
      };
    case "perdes/update":
      return {
        ...state,
        perdesPenyertaanModal: state.perdesPenyertaanModal.map((item, i) =>
          i === action.index ? action.payload : item
        ),
      };
    case "perdes/remove":
      return {
        ...state,
        perdesPenyertaanModal: state.perdesPenyertaanModal.filter(
          (_, i) => i !== action.index
        ),
      };
    case "reset":
      return INITIAL_LEGALITAS;
    default:
      return state;
  }
}

/**
 * ===========================
 * Context Type
 * ===========================
 */
type DashboardContextType = {
  profileState: ProfileState;
  profileDispatch: Dispatch<ProfileAction>;
  strukturState: StrukturState;
  strukturDispatch: Dispatch<StrukturAction>;
  legalitasState: LegalitasState;
  legalitasDispatch: Dispatch<LegalitasAction>;
};

/**
 * ===========================
 * Create Context
 * ===========================
 */
const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

/**
 * ===========================
 * Provider Component
 * ===========================
 */
export function DashboardProvider({ children }: { children: ReactNode }) {
  const [profileState, profileDispatch] = useReducer(
    profileReducer,
    INITIAL_PROFILE
  );
  const [strukturState, strukturDispatch] = useReducer(
    strukturReducer,
    INITIAL_STRUKTUR
  );
  const [legalitasState, legalitasDispatch] = useReducer(
    legalitasReducer,
    INITIAL_LEGALITAS
  );

  return (
    <DashboardContext.Provider
      value={{
        profileState,
        profileDispatch,
        strukturState,
        strukturDispatch,
        legalitasState,
        legalitasDispatch,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

/**
 * ===========================
 * Custom Hook
 * ===========================
 */
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
