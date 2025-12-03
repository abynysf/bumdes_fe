/**
 * API utility for making requests to the backend
 */

// Use proxy in development to avoid CORS issues
const API_BASE_URL = "/api";

// API response types
export interface ApiResponse<T> {
  ok: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface LoginResponse {
  ok: boolean;
  user?: {
    id: number;
    email: string;
    displayName: string;
    role: string;
    desaUid: string | null;
    kecamatanUid: string | null;
  };
  message?: string;
  error?: string;
}

// Generic fetch wrapper with error handling
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "An error occurred");
  }

  return data;
}

// Auth API functions
export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
};

// Profile BUMDes API response types
export interface ProfileApiResponse {
  bumdes: {
    id: number;
    uid: string;
    namaBumdes: string;
    alamatKantor: string;
    pekerjaL: number;
    pekerjaP: number;
    badanHukumSudahTerbit: boolean;
    tahunPendirian: number;
    startPeriodeKepengurusan: string;
    endPeriodeKepengurusan: string;
    desaUid: string;
    desa: {
      id: number;
      uid: string;
      namaDesa: string;
      kecamatanUid: string;
    };
  };
  rekening: Array<{
    id: number;
    nama: string;
    nomorRekening: string;
    bank: string;
    ketahananPangan: boolean;
    file?: string;
  }>;
  dokPeraturanDesaPendirianBumdes: {
    id: number;
    tahunPerdesPendirian: number;
    namaPerdesPendirian: string;
    nomorPerdesPendirian: string;
    dokumen?: string;
  } | Array<{
    id: number;
    tahunPerdesPendirian: number;
    namaPerdesPendirian: string;
    nomorPerdesPendirian: string;
    dokumen?: string;
  }> | null;
}

// Struktur document types
export interface StrukturDokumen {
  id: number;
  startPeriodeJabatan?: number;
  endPeriodeJabatan?: number;
  tahun?: number;
  nomorSurat: string;
  dokumen?: string;
}

export interface StrukturPengurus {
  id: number;
  jabatan: string;
  nama: string;
  pekerjaan: string;
  nomorTelepon: string;
  gaji: number;
  keterangan: string;
}

export interface StrukturApiResponse {
  pengurus: StrukturPengurus[];
  dokSuratKeputusanPengawas: StrukturDokumen | null;
  dokSuratKeputusanDirekturBumdes: StrukturDokumen | null;
  dokSKPegawai: StrukturDokumen[];
  dokKeputusanPengurusBumdes: StrukturDokumen | null;
  dokBeritaAcaraSerahTerimaPengurusBumdes: StrukturDokumen | null;
}

// Legalitas document types
export interface LegalitasDokumenWithNominal {
  id: number;
  tahun: number;
  namaDokumen: string;
  nominal: number;
  dokumen?: string;
}

export interface LegalitasDokumenSimple {
  id: number;
  tahun: number;
  nomor: string;
  dokumen?: string;
}

export interface LegalitasDokumenAset {
  id: number;
  tahun: number;
  namaDokumen: string;
  nomor: string;
  dokumen?: string;
}

export interface LegalitasDokumenPerdes {
  id: number;
  tahun: number;
  namaDokumen: string;
  nomor: string;
  nominal: number;
  dokumen?: string;
}

export interface LegalitasApiResponse {
  dokAnggaranDasarBumdes: LegalitasDokumenWithNominal | null;
  dokAnggaranRumahTanggaBumdes: LegalitasDokumenWithNominal | null;
  dokAHUBadanHukum: LegalitasDokumenSimple | null;
  dokNPWP: LegalitasDokumenSimple | null;
  dokNIB: LegalitasDokumenSimple | null;
  // API returns array OR single object depending on count
  dokPemanfaatanAsetDesa: LegalitasDokumenAset[] | LegalitasDokumenAset | null;
  dokPerdesPenyertaanModalBumdes: LegalitasDokumenPerdes[] | LegalitasDokumenPerdes | null;
}

// Pages API functions
export const pagesApi = {
  getProfile: async (id: number): Promise<ProfileApiResponse> => {
    return apiFetch<ProfileApiResponse>(`/pages/profile/${id}`);
  },
  getStruktur: async (id: number): Promise<StrukturApiResponse> => {
    return apiFetch<StrukturApiResponse>(`/pages/struktur/${id}`);
  },
  getLegalitas: async (id: number): Promise<LegalitasApiResponse> => {
    return apiFetch<LegalitasApiResponse>(`/pages/legalitas/${id}`);
  },
  updateProfile: async (id: number, data: unknown): Promise<unknown> => {
    return apiFetch(`/pages/profile/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  updateStruktur: async (id: number, data: unknown): Promise<unknown> => {
    return apiFetch(`/pages/struktur/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  updateLegalitas: async (id: number, data: unknown): Promise<unknown> => {
    return apiFetch(`/pages/legalitas/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};

export default apiFetch;
