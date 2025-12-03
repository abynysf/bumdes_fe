import {
  createContext,
  useContext,
  useReducer,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
  type Dispatch,
} from "react";
import {
  pagesApi,
  type ProfileApiResponse,
  type StrukturApiResponse,
  type LegalitasApiResponse,
} from "../utils/api";
import { useAuth } from "./AuthContext";

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
  id?: number; // from API
  tahun: number;
  nama: string;
  nomor: string;
  file?: string;
  fileBlob?: string; // temporary blob URL for preview (browser session only)
};

export type RekeningBUM = {
  id?: number; // from API
  bank: string;
  nama: string;
  nomor: string;
  ketahananPangan?: boolean;
  keterangan?: string;
  file?: string;
  fileBlob?: string; // temporary blob URL for preview (browser session only)
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
  | { type: "reset" }
  | { type: "SET_PROFILE"; payload: ProfileState };

/**
 * ===========================
 * Struktur Types
 * ===========================
 */
export type PengurusBUM = {
  id?: number; // from API
  jabatan: string;
  namaPengurus: string;
  pekerjaan: string;
  nomorTelepon: string;
  gaji: string;
  keterangan: string;
};

export type SKPengawas = {
  id?: number; // from API
  periode?: string;
  tahun?: string;
  nomor: string;
  file: string;
};

export type SKDirektur = {
  id?: number; // from API
  periode?: string;
  tahun?: string;
  nomor: string;
  file: string;
};

export type SKPegawai = {
  id?: number; // from API
  periode?: string;
  tahun?: string;
  nomor: string;
  file: string;
};

export type SKPengurus = {
  id?: number; // from API
  periode?: string;
  tahun?: string;
  nomor: string;
  file: string;
};

export type BeritaAcaraBUM = {
  id?: number; // from API
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
  | { type: "reset" }
  | { type: "SET_STRUKTUR"; payload: StrukturState };

/**
 * ===========================
 * Legalitas Types
 * ===========================
 */
export type BaseDokumen = {
  id?: number;
  tahun: number;
  nama: string;
  nominal?: number | "";
  file: string;
};

export type DokumenART = {
  id?: number;
  tahun: number;
  nama: string;
  nominal?: number | "";
  file: string;
};

export type DokumenPerdesModal = {
  id?: number;
  tahun: number;
  nama: string;
  nomor: string;
  nominal?: number | "";
  file: string;
};

export type DokumenSimple = {
  id?: number;
  tahun: number;
  nomor: string;
  file: string;
};

export type DokumenAsetDesa = {
  id?: number;
  tahun: number;
  nama: string;
  nomor: string;
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
  | { type: "reset" }
  | { type: "SET_LEGALITAS"; payload: LegalitasState };

/**
 * ===========================
 * Initial States
 * ===========================
 */
const INITIAL_PROFILE: ProfileState = {
  form: {
    namaLengkap: "",
    statusBadanHukum: "",
    tahunPendirian: "",
    alamatKantor: "",
    jumlahPengurus: "",
    pengurusL: "",
    pengurusP: "",
    skBadanHukumFile: null,
  },
  dokumen: [],
  rekening: [],
};

const INITIAL_STRUKTUR: StrukturState = {
  pengurus: [],
  skPengawas: [],
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
  perdesPenyertaanModal: [],
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
    case "SET_PROFILE":
      return action.payload;
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
    case "SET_STRUKTUR":
      return action.payload;
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
        perdesPenyertaanModal: [...state.perdesPenyertaanModal, action.payload],
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
    case "SET_LEGALITAS":
      return action.payload;
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
  isLoading: boolean;
  error: string | null;
  saveProfile: () => Promise<boolean>;
  saveStruktur: () => Promise<boolean>;
  saveLegalitas: () => Promise<boolean>;
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
// Helper to normalize single object or array to array
function normalizeToArray<T>(data: T | T[] | null | undefined): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return [data];
}

// Helper to map API response to frontend state
function mapProfileApiToState(data: ProfileApiResponse): ProfileState {
  const { bumdes, rekening, dokPeraturanDesaPendirianBumdes } = data;

  return {
    form: {
      namaLengkap: bumdes.namaBumdes || "",
      statusBadanHukum: bumdes.badanHukumSudahTerbit ? "terbit" : "proses",
      tahunPendirian: bumdes.tahunPendirian || "",
      alamatKantor: bumdes.alamatKantor || "",
      jumlahPengurus: (bumdes.pekerjaL || 0) + (bumdes.pekerjaP || 0) || "",
      pengurusL: bumdes.pekerjaL || "",
      pengurusP: bumdes.pekerjaP || "",
      skBadanHukumFile: null,
    },
    rekening: (rekening || []).map((r) => ({
      id: r.id,
      bank: r.bank,
      nama: r.nama,
      nomor: r.nomorRekening,
      ketahananPangan: r.ketahananPangan,
      keterangan: r.ketahananPangan ? "Ketahanan Pangan" : "",
      file: r.file || undefined,
    })),
    dokumen: normalizeToArray(dokPeraturanDesaPendirianBumdes).map((d) => ({
      id: d.id,
      tahun: d.tahunPerdesPendirian,
      nama: d.namaPerdesPendirian,
      nomor: d.nomorPerdesPendirian,
      file: d.dokumen || undefined,
    })),
  };
}

// Helper to map Struktur API response to frontend state
function mapStrukturApiToState(data: StrukturApiResponse): StrukturState {
  // Helper to format period from startPeriodeJabatan/endPeriodeJabatan
  const formatPeriode = (
    startPeriode?: number,
    endPeriode?: number
  ): string => {
    if (startPeriode && endPeriode) {
      return `${startPeriode}–${endPeriode}`;
    }
    return "";
  };

  // Helper to map single document or null to array
  const mapSingleDokumen = (
    dok: StrukturApiResponse["dokSuratKeputusanPengawas"]
  ) => {
    if (!dok) return [];
    return [
      {
        id: dok.id,
        periode: formatPeriode(dok.startPeriodeJabatan, dok.endPeriodeJabatan),
        tahun: dok.tahun?.toString() || "",
        nomor: dok.nomorSurat || "",
        file: dok.dokumen || "",
      },
    ];
  };

  // Helper to map array of documents
  const mapDokumenArray = (docs: StrukturApiResponse["dokSKPegawai"]) => {
    return (docs || []).map((dok) => ({
      id: dok.id,
      periode: formatPeriode(dok.startPeriodeJabatan, dok.endPeriodeJabatan),
      tahun: dok.tahun?.toString() || "",
      nomor: dok.nomorSurat || "",
      file: dok.dokumen || "",
    }));
  };

  return {
    pengurus: (data.pengurus || []).map((p) => ({
      id: p.id,
      jabatan: p.jabatan || "",
      namaPengurus: p.nama || "",
      pekerjaan: p.pekerjaan || "",
      nomorTelepon: p.nomorTelepon || "",
      gaji: p.gaji?.toString() || "",
      keterangan: p.keterangan || "",
    })),
    skPengawas: mapSingleDokumen(data.dokSuratKeputusanPengawas),
    skDirektur: mapSingleDokumen(data.dokSuratKeputusanDirekturBumdes),
    skPegawai: mapDokumenArray(data.dokSKPegawai),
    skPengurus: mapSingleDokumen(data.dokKeputusanPengurusBumdes),
    beritaAcara: mapSingleDokumen(data.dokBeritaAcaraSerahTerimaPengurusBumdes),
  };
}

// Helper to map Legalitas API response to frontend state
function mapLegalitasApiToState(data: LegalitasApiResponse): LegalitasState {
  // Helper to map single document with nominal (Anggaran Dasar, Anggaran Rumah Tangga)
  const mapSingleWithNominal = (
    dok: LegalitasApiResponse["dokAnggaranDasarBumdes"]
  ) => {
    if (!dok) return [];
    return [
      {
        id: dok.id,
        tahun: dok.tahun,
        nama: dok.namaDokumen,
        nominal: dok.nominal,
        file: dok.dokumen || "",
      },
    ];
  };

  // Helper to map single simple document (AHU, NPWP, NIB)
  const mapSingleSimple = (dok: LegalitasApiResponse["dokAHUBadanHukum"]) => {
    if (!dok) return [];
    return [
      {
        id: dok.id,
        tahun: dok.tahun,
        nomor: dok.nomor,
        file: dok.dokumen || "",
      },
    ];
  };

  return {
    anggaranDasar: mapSingleWithNominal(data.dokAnggaranDasarBumdes),
    anggaranRumahTangga: mapSingleWithNominal(
      data.dokAnggaranRumahTanggaBumdes
    ),
    ahuBadanHukum: mapSingleSimple(data.dokAHUBadanHukum),
    npwp: mapSingleSimple(data.dokNPWP),
    nib: mapSingleSimple(data.dokNIB),
    dokumenAsetDesa: (Array.isArray(data.dokPemanfaatanAsetDesa)
      ? data.dokPemanfaatanAsetDesa
      : data.dokPemanfaatanAsetDesa?.id
      ? [data.dokPemanfaatanAsetDesa]
      : []
    ).map((d) => ({
      id: d.id,
      tahun: d.tahun,
      nama: d.namaDokumen || "",
      nomor: d.nomor || "",
      file: d.dokumen || "",
    })),
    perdesPenyertaanModal: (Array.isArray(data.dokPerdesPenyertaanModalBumdes)
      ? data.dokPerdesPenyertaanModalBumdes
      : data.dokPerdesPenyertaanModalBumdes?.id
      ? [data.dokPerdesPenyertaanModalBumdes]
      : []
    ).map((d) => ({
      id: d.id,
      tahun: d.tahun,
      nama: d.namaDokumen || "",
      nomor: d.nomor || "",
      nominal: d.nominal || 0,
      file: d.dokumen || "",
    })),
  };
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [originalProfile, setOriginalProfile] =
    useState<ProfileApiResponse | null>(null);
  const [originalStruktur, setOriginalStruktur] =
    useState<StrukturApiResponse | null>(null);
  const [originalLegalitas, setOriginalLegalitas] =
    useState<LegalitasApiResponse | null>(null);

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      console.log("🔍 [DEMO] fetchData called");

      // === LOCAL FALLBACK MODE (DEMO) ===
      setIsLoading(true);

      // Mock Profile Data
      const mockProfile: ProfileState = {
        form: {
          namaLengkap: "BUM Desa Makmur Sejahtera",
          statusBadanHukum: "terbit",
          tahunPendirian: 2020,
          alamatKantor: "Jl. Desa Makmur No. 1, Kec. Sejahtera",
          jumlahPengurus: 5,
          pengurusL: 3,
          pengurusP: 2,
          skBadanHukumFile: "Prefix Trees and Tries.pdf",
        },
        dokumen: [
          {
            id: 1,
            tahun: 2020,
            nama: "Perdes Pendirian BUM Desa",
            nomor: "01/PERDES/2020",
            file: "Prefix Trees and Tries.pdf",
          },
        ],
        rekening: [
          {
            id: 1,
            bank: "Bank BRI",
            nama: "BUM Desa Makmur Sejahtera",
            nomor: "1234567890",
            ketahananPangan: false,
            keterangan: "",
            file: "Prefix Trees and Tries.pdf",
          },
        ],
      };

      // Mock Struktur Data
      const mockStruktur: StrukturState = {
        pengurus: [
          {
            id: 1,
            jabatan: "Direktur",
            namaPengurus: "Ahmad Sudirman",
            pekerjaan: "Wiraswasta",
            nomorTelepon: "081234567890",
            gaji: "3000000",
            keterangan: "",
          },
          {
            id: 2,
            jabatan: "Sekretaris",
            namaPengurus: "Siti Aminah",
            pekerjaan: "Guru",
            nomorTelepon: "081234567891",
            gaji: "2500000",
            keterangan: "",
          },
        ],
        skPengawas: [
          {
            id: 1,
            periode: "2020–2025",
            tahun: "2020",
            nomor: "SK/001/2020",
            file: "Prefix Trees and Tries.pdf",
          },
        ],
        skDirektur: [
          {
            id: 1,
            periode: "2020–2025",
            tahun: "2020",
            nomor: "SK/002/2020",
            file: "Prefix Trees and Tries.pdf",
          },
        ],
        skPegawai: [],
        skPengurus: [
          {
            id: 1,
            periode: "2020–2025",
            tahun: "2020",
            nomor: "SK/003/2020",
            file: "Prefix Trees and Tries.pdf",
          },
        ],
        beritaAcara: [],
      };

      // Mock Legalitas Data
      const mockLegalitas: LegalitasState = {
        anggaranDasar: [
          {
            id: 1,
            tahun: 2020,
            nama: "Anggaran Dasar BUM Desa",
            nominal: 100000000,
            file: "Prefix Trees and Tries.pdf",
          },
        ],
        anggaranRumahTangga: [
          {
            id: 1,
            tahun: 2020,
            nama: "ART BUM Desa",
            nominal: 0,
            file: "Prefix Trees and Tries.pdf",
          },
        ],
        ahuBadanHukum: [
          {
            id: 1,
            tahun: 2020,
            nomor: "AHU-001234",
            file: "Prefix Trees and Tries.pdf",
          },
        ],
        npwp: [
          {
            id: 1,
            tahun: 2020,
            nomor: "12.345.678.9-012.000",
            file: "Prefix Trees and Tries.pdf",
          },
        ],
        nib: [
          {
            id: 1,
            tahun: 2021,
            nomor: "1234567890123",
            file: "Prefix Trees and Tries.pdf",
          },
        ],
        dokumenAsetDesa: [],
        perdesPenyertaanModal: [
          {
            id: 1,
            tahun: 2020,
            nama: "Perdes Penyertaan Modal",
            nomor: "02/PERDES/2020",
            nominal: 50000000,
            file: "Prefix Trees and Tries.pdf",
          },
        ],
      };

      profileDispatch({ type: "SET_PROFILE", payload: mockProfile });
      strukturDispatch({ type: "SET_STRUKTUR", payload: mockStruktur });
      legalitasDispatch({ type: "SET_LEGALITAS", payload: mockLegalitas });

      console.log("✅ [DEMO] Mock data loaded");
      setIsLoading(false);
      // === END LOCAL FALLBACK MODE ===

      /* === ORIGINAL API CODE (commented for demo) ===
      console.log("🔍 fetchData called, user.id:", user?.id);

      if (!user?.id) {
        console.log("⚠️ No user.id, skipping fetch");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch profile, struktur, and legalitas in parallel
        console.log(
          "📡 Fetching profile, struktur, and legalitas for user:",
          user.id
        );
        const [profileData, strukturData, legalitasData] = await Promise.all([
          pagesApi.getProfile(user.id),
          pagesApi.getStruktur(user.id),
          pagesApi.getLegalitas(user.id),
        ]);

        console.log("✅ Profile data received:", profileData);
        console.log("✅ Struktur data received:", strukturData);
        console.log("✅ Legalitas data received:", legalitasData);

        // Set profile
        setOriginalProfile(profileData);
        const mappedProfile = mapProfileApiToState(profileData);
        profileDispatch({ type: "SET_PROFILE", payload: mappedProfile });
        console.log("📊 Profile state updated:", mappedProfile);

        // Set struktur
        setOriginalStruktur(strukturData);
        const mappedStruktur = mapStrukturApiToState(strukturData);
        strukturDispatch({ type: "SET_STRUKTUR", payload: mappedStruktur });
        console.log("📊 Struktur state updated:", mappedStruktur);

        // Set legalitas
        setOriginalLegalitas(legalitasData);
        const mappedLegalitas = mapLegalitasApiToState(legalitasData);
        legalitasDispatch({ type: "SET_LEGALITAS", payload: mappedLegalitas });
        console.log("📊 Legalitas state updated:", mappedLegalitas);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
      === END ORIGINAL API CODE === */
    }

    fetchData();
  }, [user?.id]);

  // Save profile function
  const saveProfile = useCallback(async (): Promise<boolean> => {
    // === LOCAL FALLBACK MODE (DEMO) ===
    console.log("🔄 [DEMO] saveProfile called - returning true");
    return true;
    // === END LOCAL FALLBACK MODE ===

    /* === ORIGINAL API CODE (commented for demo) ===
    console.log("🔄 saveProfile called", {
      userId: user?.id,
      hasOriginalProfile: !!originalProfile,
    });

    if (!user?.id) {
      console.error("❌ saveProfile: No user ID");
      return false;
    }
    if (!originalProfile) {
      console.error("❌ saveProfile: No original profile data loaded yet");
      return false;
    }

    try {
      // Build the PATCH payload
      const payload: Record<string, unknown> = {
        bumdes: {
          namaBumdes: profileState.form.namaLengkap,
          alamatKantor: profileState.form.alamatKantor,
          pekerjaL: Number(profileState.form.pengurusL) || 0,
          pekerjaP: Number(profileState.form.pengurusP) || 0,
          badanHukumSudahTerbit:
            profileState.form.statusBadanHukum === "terbit",
          tahunPendirian:
            Number(profileState.form.tahunPendirian) ||
            new Date().getFullYear(),
        },
      };

      // Handle rekening: create/update/delete
      const originalRekeningIds = new Set(
        (originalProfile.rekening || []).map((r) => r.id)
      );
      const currentRekeningIds = new Set(
        profileState.rekening.filter((r) => r.id).map((r) => r.id)
      );

      const rekeningCreate = profileState.rekening
        .filter((r) => !r.id)
        .map((r) => ({
          nama: r.nama,
          nomorRekening: r.nomor,
          bank: r.bank,
          ketahananPangan: r.ketahananPangan || false,
        }));

      const rekeningUpdate = profileState.rekening
        .filter((r) => r.id && originalRekeningIds.has(r.id))
        .map((r) => ({
          id: r.id,
          nama: r.nama,
          nomorRekening: r.nomor,
          bank: r.bank,
          ketahananPangan: r.ketahananPangan || false,
        }));

      const rekeningDelete = [...originalRekeningIds].filter(
        (id) => !currentRekeningIds.has(id)
      );

      if (
        rekeningCreate.length ||
        rekeningUpdate.length ||
        rekeningDelete.length
      ) {
        payload.rekening = {
          ...(rekeningCreate.length && { create: rekeningCreate }),
          ...(rekeningUpdate.length && { update: rekeningUpdate }),
          ...(rekeningDelete.length && { delete: rekeningDelete }),
        };
      }

      // Handle dokumen: create/update/delete
      const originalDokIds = new Set(
        normalizeToArray(originalProfile.dokPeraturanDesaPendirianBumdes).map(
          (d) => d.id
        )
      );
      const currentDokIds = new Set(
        profileState.dokumen.filter((d) => d.id).map((d) => d.id)
      );

      const dokCreate = profileState.dokumen
        .filter((d) => !d.id)
        .map((d) => ({
          tahunPerdesPendirian: d.tahun,
          namaPerdesPendirian: d.nama,
          nomorPerdesPendirian: d.nomor,
        }));

      const dokUpdate = profileState.dokumen
        .filter((d) => d.id && originalDokIds.has(d.id))
        .map((d) => ({
          id: d.id,
          tahunPerdesPendirian: d.tahun,
          namaPerdesPendirian: d.nama,
          nomorPerdesPendirian: d.nomor,
        }));

      const dokDelete = [...originalDokIds].filter(
        (id) => !currentDokIds.has(id)
      );

      if (dokCreate.length || dokUpdate.length || dokDelete.length) {
        payload.dokPeraturanDesaPendirianBumdes = {
          ...(dokCreate.length && { create: dokCreate }),
          ...(dokUpdate.length && { update: dokUpdate }),
          ...(dokDelete.length && { delete: dokDelete }),
        };
      }

      await pagesApi.updateProfile(user.id, payload);

      // Refresh data after save
      const newData = await pagesApi.getProfile(user.id);
      setOriginalProfile(newData);
      profileDispatch({
        type: "SET_PROFILE",
        payload: mapProfileApiToState(newData),
      });

      return true;
    } catch (err) {
      console.error("Failed to save profile:", err);
      return false;
    }
    === END ORIGINAL API CODE === */
  }, [user?.id, originalProfile, profileState]);

  // Save struktur function
  const saveStruktur = useCallback(async (): Promise<boolean> => {
    // === LOCAL FALLBACK MODE (DEMO) ===
    console.log("🔄 [DEMO] saveStruktur called - returning true");
    return true;
    // === END LOCAL FALLBACK MODE ===

    /* === ORIGINAL API CODE (commented for demo) ===
    console.log("🔄 saveStruktur called", {
      userId: user?.id,
      hasOriginalStruktur: !!originalStruktur,
    });

    if (!user?.id) {
      console.error("❌ saveStruktur: No user ID");
      return false;
    }
    if (!originalStruktur) {
      console.error("❌ saveStruktur: No original struktur data loaded yet");
      return false;
    }

    try {
      const payload: Record<string, unknown> = {};

      // Helper to parse periode string "YYYY–YYYY" back to startPeriodeJabatan/endPeriodeJabatan
      const parsePeriode = (periode?: string) => {
        if (!periode) return {};
        const parts = periode.split("–");
        if (parts.length === 2) {
          return {
            startPeriodeJabatan: parseInt(parts[0], 10) || undefined,
            endPeriodeJabatan: parseInt(parts[1], 10) || undefined,
          };
        }
        return {};
      };

      // Handle pengurus: create/update/delete
      const originalPengurusIds = new Set(
        (originalStruktur.pengurus || []).map((p) => p.id)
      );
      const currentPengurusIds = new Set(
        strukturState.pengurus.filter((p) => p.id).map((p) => p.id)
      );

      const pengurusCreate = strukturState.pengurus
        .filter((p) => !p.id)
        .map((p) => ({
          jabatan: p.jabatan,
          nama: p.namaPengurus,
          pekerjaan: p.pekerjaan,
          nomorTelepon: p.nomorTelepon,
          gaji: parseInt(p.gaji, 10) || 0,
          keterangan: p.keterangan || null,
        }));

      const pengurusUpdate = strukturState.pengurus
        .filter((p) => p.id && originalPengurusIds.has(p.id))
        .map((p) => ({
          id: p.id,
          jabatan: p.jabatan,
          nama: p.namaPengurus,
          pekerjaan: p.pekerjaan,
          nomorTelepon: p.nomorTelepon,
          gaji: parseInt(p.gaji, 10) || 0,
          keterangan: p.keterangan || null,
        }));

      const pengurusDelete = [...originalPengurusIds].filter(
        (id) => !currentPengurusIds.has(id)
      );

      if (
        pengurusCreate.length ||
        pengurusUpdate.length ||
        pengurusDelete.length
      ) {
        payload.pengurus = {
          ...(pengurusCreate.length && { create: pengurusCreate }),
          ...(pengurusUpdate.length && { update: pengurusUpdate }),
          ...(pengurusDelete.length && { delete: pengurusDelete }),
        };
      }

      // Helper for single document fields (SK Pengawas, SK Direktur, SK Pengurus, Berita Acara)
      const handleSingleDokumen = (
        currentArray: {
          id?: number;
          periode?: string;
          tahun?: string;
          nomor: string;
          file: string;
        }[],
        originalDok: { id: number } | null,
        apiKey: string
      ) => {
        const current = currentArray[0]; // Only first item matters for single documents
        const originalId = originalDok?.id;

        if (!current && !originalId) {
          // Nothing to do
          return;
        }

        if (!current && originalId) {
          // Delete existing
          payload[apiKey] = { delete: [originalId] };
        } else if (current && !current.id) {
          // Create new
          payload[apiKey] = {
            create: [
              {
                ...parsePeriode(current.periode),
                tahun: current.tahun ? parseInt(current.tahun, 10) : undefined,
                nomorSurat: current.nomor,
                file: current.file,
              },
            ],
          };
        } else if (current && current.id) {
          // Update existing
          payload[apiKey] = {
            update: [
              {
                id: current.id,
                ...parsePeriode(current.periode),
                tahun: current.tahun ? parseInt(current.tahun, 10) : undefined,
                nomorSurat: current.nomor,
                file: current.file,
              },
            ],
          };
        }
      };

      // Handle single document fields
      handleSingleDokumen(
        strukturState.skPengawas,
        originalStruktur.dokSuratKeputusanPengawas,
        "dokSuratKeputusanPengawas"
      );
      handleSingleDokumen(
        strukturState.skDirektur,
        originalStruktur.dokSuratKeputusanDirekturBumdes,
        "dokSuratKeputusanDirekturBumdes"
      );
      handleSingleDokumen(
        strukturState.skPengurus,
        originalStruktur.dokKeputusanPengurusBumdes,
        "dokKeputusanPengurusBumdes"
      );
      handleSingleDokumen(
        strukturState.beritaAcara,
        originalStruktur.dokBeritaAcaraSerahTerimaPengurusBumdes,
        "dokBeritaAcaraSerahTerimaPengurusBumdes"
      );

      // Handle SK Pegawai (array)
      const originalSkPegawaiIds = new Set(
        (originalStruktur.dokSKPegawai || []).map((d) => d.id)
      );
      const currentSkPegawaiIds = new Set(
        strukturState.skPegawai.filter((d) => d.id).map((d) => d.id)
      );

      const skPegawaiCreate = strukturState.skPegawai
        .filter((d) => !d.id)
        .map((d) => ({
          ...parsePeriode(d.periode),
          tahun: d.tahun ? parseInt(d.tahun, 10) : undefined,
          nomorSurat: d.nomor,
          file: d.file,
        }));

      const skPegawaiUpdate = strukturState.skPegawai
        .filter((d) => d.id && originalSkPegawaiIds.has(d.id))
        .map((d) => ({
          id: d.id,
          ...parsePeriode(d.periode),
          tahun: d.tahun ? parseInt(d.tahun, 10) : undefined,
          nomorSurat: d.nomor,
          file: d.file,
        }));

      const skPegawaiDelete = [...originalSkPegawaiIds].filter(
        (id) => !currentSkPegawaiIds.has(id)
      );

      if (
        skPegawaiCreate.length ||
        skPegawaiUpdate.length ||
        skPegawaiDelete.length
      ) {
        payload.dokSKPegawai = {
          ...(skPegawaiCreate.length && { create: skPegawaiCreate }),
          ...(skPegawaiUpdate.length && { update: skPegawaiUpdate }),
          ...(skPegawaiDelete.length && { delete: skPegawaiDelete }),
        };
      }

      console.log("📤 Struktur PATCH payload:", payload);
      await pagesApi.updateStruktur(user.id, payload);

      // Refresh data after save
      const newData = await pagesApi.getStruktur(user.id);
      setOriginalStruktur(newData);
      strukturDispatch({
        type: "SET_STRUKTUR",
        payload: mapStrukturApiToState(newData),
      });

      return true;
    } catch (err) {
      console.error("Failed to save struktur:", err);
      return false;
    }
    === END ORIGINAL API CODE === */
  }, [user?.id, originalStruktur, strukturState]);

  // Save legalitas function
  const saveLegalitas = useCallback(async (): Promise<boolean> => {
    // === LOCAL FALLBACK MODE (DEMO) ===
    console.log("🔄 [DEMO] saveLegalitas called - returning true");
    return true;
    // === END LOCAL FALLBACK MODE ===

    /* === ORIGINAL API CODE (commented for demo) ===
    console.log("🔄 saveLegalitas called", {
      userId: user?.id,
      hasOriginalLegalitas: !!originalLegalitas,
    });

    if (!user?.id) {
      console.error("❌ saveLegalitas: No user ID");
      return false;
    }
    if (!originalLegalitas) {
      console.error("❌ saveLegalitas: No original legalitas data loaded yet");
      return false;
    }

    try {
      const payload: Record<string, unknown> = {};

      // Helper for single document fields with nominal (Anggaran Dasar, Anggaran Rumah Tangga)
      const handleSingleWithNominal = (
        currentArray: BaseDokumen[],
        originalDok: { id: number } | null,
        apiKey: string
      ) => {
        const current = currentArray[0];
        const originalId = originalDok?.id;

        if (!current && !originalId) return;

        if (!current && originalId) {
          payload[apiKey] = { delete: [originalId] };
        } else if (current && !current.id) {
          payload[apiKey] = {
            create: [
              {
                tahun: current.tahun,
                namaDokumen: current.nama,
                nominal: Number(current.nominal) || 0,
                dokumen: current.file,
              },
            ],
          };
        } else if (current && current.id) {
          payload[apiKey] = {
            update: [
              {
                id: current.id,
                tahun: current.tahun,
                namaDokumen: current.nama,
                nominal: Number(current.nominal) || 0,
                dokumen: current.file,
              },
            ],
          };
        }
      };

      // Helper for single simple document (AHU, NPWP, NIB)
      const handleSingleSimple = (
        currentArray: DokumenSimple[],
        originalDok: { id: number } | null,
        apiKey: string
      ) => {
        const current = currentArray[0];
        const originalId = originalDok?.id;

        if (!current && !originalId) return;

        if (!current && originalId) {
          payload[apiKey] = { delete: [originalId] };
        } else if (current && !current.id) {
          payload[apiKey] = {
            create: [
              {
                tahun: current.tahun,
                nomor: current.nomor,
                dokumen: current.file,
              },
            ],
          };
        } else if (current && current.id) {
          payload[apiKey] = {
            update: [
              {
                id: current.id,
                tahun: current.tahun,
                nomor: current.nomor,
                dokumen: current.file,
              },
            ],
          };
        }
      };

      // Handle single document fields
      handleSingleWithNominal(
        legalitasState.anggaranDasar,
        originalLegalitas.dokAnggaranDasarBumdes,
        "dokAnggaranDasarBumdes"
      );
      handleSingleWithNominal(
        legalitasState.anggaranRumahTangga,
        originalLegalitas.dokAnggaranRumahTanggaBumdes,
        "dokAnggaranRumahTanggaBumdes"
      );
      handleSingleSimple(
        legalitasState.ahuBadanHukum,
        originalLegalitas.dokAHUBadanHukum,
        "dokAHUBadanHukum"
      );
      handleSingleSimple(
        legalitasState.npwp,
        originalLegalitas.dokNPWP,
        "dokNPWP"
      );
      handleSingleSimple(
        legalitasState.nib,
        originalLegalitas.dokNIB,
        "dokNIB"
      );

      // Handle dokumenAsetDesa (array or single object)
      const originalAsetArr = Array.isArray(
        originalLegalitas.dokPemanfaatanAsetDesa
      )
        ? originalLegalitas.dokPemanfaatanAsetDesa
        : originalLegalitas.dokPemanfaatanAsetDesa?.id
        ? [originalLegalitas.dokPemanfaatanAsetDesa]
        : [];
      const originalAsetIds = new Set(originalAsetArr.map((d) => d.id));
      const currentAsetIds = new Set(
        legalitasState.dokumenAsetDesa.filter((d) => d.id).map((d) => d.id)
      );

      const asetCreate = legalitasState.dokumenAsetDesa
        .filter((d) => !d.id)
        .map((d) => ({
          tahun: d.tahun,
          namaDokumen: d.nama,
          nomor: d.nomor,
          dokumen: d.file,
        }));

      const asetUpdate = legalitasState.dokumenAsetDesa
        .filter((d) => d.id && originalAsetIds.has(d.id))
        .map((d) => ({
          id: d.id,
          tahun: d.tahun,
          namaDokumen: d.nama,
          nomor: d.nomor,
          dokumen: d.file,
        }));

      const asetDelete = [...originalAsetIds].filter(
        (id) => !currentAsetIds.has(id)
      );

      if (asetCreate.length || asetUpdate.length || asetDelete.length) {
        payload.dokPemanfaatanAsetDesa = {
          ...(asetCreate.length && { create: asetCreate }),
          ...(asetUpdate.length && { update: asetUpdate }),
          ...(asetDelete.length && { delete: asetDelete }),
        };
      }

      // Handle perdesPenyertaanModal (array or single object)
      const originalPerdesArr = Array.isArray(
        originalLegalitas.dokPerdesPenyertaanModalBumdes
      )
        ? originalLegalitas.dokPerdesPenyertaanModalBumdes
        : originalLegalitas.dokPerdesPenyertaanModalBumdes?.id
        ? [originalLegalitas.dokPerdesPenyertaanModalBumdes]
        : [];
      const originalPerdesIds = new Set(originalPerdesArr.map((d) => d.id));
      const currentPerdesIds = new Set(
        legalitasState.perdesPenyertaanModal
          .filter((d) => d.id)
          .map((d) => d.id)
      );

      const perdesCreate = legalitasState.perdesPenyertaanModal
        .filter((d) => !d.id)
        .map((d) => ({
          tahun: d.tahun,
          namaDokumen: d.nama,
          nomor: d.nomor,
          nominal: Number(d.nominal) || 0,
          dokumen: d.file,
        }));

      const perdesUpdate = legalitasState.perdesPenyertaanModal
        .filter((d) => d.id && originalPerdesIds.has(d.id))
        .map((d) => ({
          id: d.id,
          tahun: d.tahun,
          namaDokumen: d.nama,
          nomor: d.nomor,
          nominal: Number(d.nominal) || 0,
          dokumen: d.file,
        }));

      const perdesDelete = [...originalPerdesIds].filter(
        (id) => !currentPerdesIds.has(id)
      );

      if (perdesCreate.length || perdesUpdate.length || perdesDelete.length) {
        payload.dokPerdesPenyertaanModalBumdes = {
          ...(perdesCreate.length && { create: perdesCreate }),
          ...(perdesUpdate.length && { update: perdesUpdate }),
          ...(perdesDelete.length && { delete: perdesDelete }),
        };
      }

      console.log("📤 Legalitas PATCH payload:", payload);
      await pagesApi.updateLegalitas(user.id, payload);

      // Refresh data after save
      const newData = await pagesApi.getLegalitas(user.id);
      setOriginalLegalitas(newData);
      legalitasDispatch({
        type: "SET_LEGALITAS",
        payload: mapLegalitasApiToState(newData),
      });

      return true;
    } catch (err) {
      console.error("Failed to save legalitas:", err);
      return false;
    }
    === END ORIGINAL API CODE === */
  }, [user?.id, originalLegalitas, legalitasState]);

  return (
    <DashboardContext.Provider
      value={{
        profileState,
        profileDispatch,
        strukturState,
        strukturDispatch,
        legalitasState,
        legalitasDispatch,
        isLoading,
        error,
        saveProfile,
        saveStruktur,
        saveLegalitas,
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
