import { useCallback, useReducer, useState } from "react";
import YearPicker from "../../components/ui/YearPicker";
import Button from "../../components/ui/Button";
import DataCard from "../../components/ui/DataCard";
import { Download, Eye, Pencil, Trash2 } from "lucide-react";
import AddPengurusBUMModal from "../../components/modals/struktur/AddPengurusBUMModal";
import AddStrukturDokumenModal from "../../components/modals/struktur/AddStrukturDokumenModal";
import SaveResultModal from "../../components/modals/SaveResultModal";
import WarningModal from "../../components/modals/WarningModal";

/**
 * ===========================
 * Types
 * ===========================
 */

type Periode = {
  awalPeriode: number | "";
  akhirPeriode: number | "";
};

type PengurusBUM = {
  jabatan: string;
  namaPengurus: string;
  pekerjaan: string;
  nomorTelepon: string;
};

type KepalaUnit = {
  namaUnit: string;
  namaKepalaUnit: string;
  pekerjaan: string;
  nomorTelepon: string;
};

type PengawasBUM = {
  namaPengawas: string;
  pekerjaan: string;
  nomorTelepon: string;
};

type SKBUMDesa = {
  periode: string;
  nomor: string;
  file: string;
};

type BeritaAcaraBUM = {
  periode: string;
  nomor: string;
  file: string;
};

type StukturState = {
  periode: Periode;
  pengurus: PengurusBUM[];
  kepalaUnit: KepalaUnit[];
  pengawas: PengawasBUM[];
  suratKeputusan: SKBUMDesa[];
  beritaAcara: BeritaAcaraBUM[];
};

/**
 * ===========================
 * Initials
 * ===========================
 */

const INITIAL: StukturState = {
  periode: {
    awalPeriode: "",
    akhirPeriode: "",
  },
  pengurus: [],
  kepalaUnit: [],
  pengawas: [],
  suratKeputusan: [],
  beritaAcara: [],
};

/**
 * ===========================
 * Utils
 * ===========================
 */

function isUrl(value: string): boolean {
  try {
    if (!value || !value.trim()) return false;
    const url = new URL(value);
    return Boolean(url.protocol && url.host);
  } catch {
    return false;
  }
}

/**
 * ===========================
 * Reducer (sederhana & terpusat)
 * ===========================
 */

type Action =
  | {
      type: "periode/update";
      key: keyof Periode;
      value: Periode[keyof Periode];
    }
  | { type: "pengurus/add"; payload: PengurusBUM }
  | { type: "pengurus/update"; index: number; payload: PengurusBUM }
  | { type: "pengurus/remove"; index: number }
  | { type: "kepalaUnit/add"; payload: KepalaUnit }
  | { type: "kepalaUnit/update"; index: number; payload: KepalaUnit }
  | { type: "kepalaUnit/remove"; index: number }
  | { type: "pengawas/add"; payload: PengawasBUM }
  | { type: "pengawas/update"; index: number; payload: PengawasBUM }
  | { type: "pengawas/remove"; index: number }
  | { type: "sk/add"; payload: SKBUMDesa }
  | { type: "sk/update"; index: number; payload: SKBUMDesa }
  | { type: "sk/remove"; index: number }
  | { type: "ba/add"; payload: BeritaAcaraBUM }
  | { type: "ba/update"; index: number; payload: BeritaAcaraBUM }
  | { type: "ba/remove"; index: number }
  | { type: "reset" };

function dataReducer(state: StukturState, action: Action): StukturState {
  switch (action.type) {
    case "periode/update":
      return {
        ...state,
        periode: { ...state.periode, [action.key]: action.value },
      };

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

    case "kepalaUnit/add":
      return { ...state, kepalaUnit: [...state.kepalaUnit, action.payload] };
    case "kepalaUnit/update":
      return {
        ...state,
        kepalaUnit: state.kepalaUnit.map((k, i) =>
          i === action.index ? action.payload : k
        ),
      };
    case "kepalaUnit/remove":
      return {
        ...state,
        kepalaUnit: state.kepalaUnit.filter((_, i) => i !== action.index),
      };

    case "pengawas/add":
      return { ...state, pengawas: [...state.pengawas, action.payload] };
    case "pengawas/update":
      return {
        ...state,
        pengawas: state.pengawas.map((p, i) =>
          i === action.index ? action.payload : p
        ),
      };
    case "pengawas/remove":
      return {
        ...state,
        pengawas: state.pengawas.filter((_, i) => i !== action.index),
      };

    case "sk/add":
      return {
        ...state,
        suratKeputusan: [...state.suratKeputusan, action.payload],
      };
    case "sk/update":
      return {
        ...state,
        suratKeputusan: state.suratKeputusan.map((s, i) =>
          i === action.index ? action.payload : s
        ),
      };
    case "sk/remove":
      return {
        ...state,
        suratKeputusan: state.suratKeputusan.filter(
          (_, i) => i !== action.index
        ),
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
      return INITIAL;

    default:
      return state;
  }
}

/**
 * ===========================
 * Component
 * ===========================
 */

export default function StrukturTab() {
  const [state, dispatch] = useReducer(dataReducer, INITIAL);

  // Modal flags
  const [openPengurus, setOpenPengurus] = useState(false);
  const [openKepalaUnit, setOpenKepalaUnit] = useState(false);
  const [openPengawas, setOpenPengawas] = useState(false);
  const [openSK, setOpenSK] = useState(false);
  const [openBA, setOpenBA] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Track if user attempted to submit (for showing validation errors)
  const [touched, setTouched] = useState(false);

  // Edit state for each table
  const [editingPengurusIndex, setEditingPengurusIndex] = useState<number | null>(null);
  const [editingKepalaUnitIndex, setEditingKepalaUnitIndex] = useState<number | null>(null);
  const [editingPengawasIndex, setEditingPengawasIndex] = useState<number | null>(null);
  const [editingSKIndex, setEditingSKIndex] = useState<number | null>(null);
  const [editingBAIndex, setEditingBAIndex] = useState<number | null>(null);

  // Download confirmation and preview modals
  const [downloadConfirmOpen, setDownloadConfirmOpen] = useState(false);
  const [fileToDownload, setFileToDownload] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileToPreview, setFileToPreview] = useState<string>("");

  // Handlers
  const updateForm = useCallback(
    (key: keyof Periode, value: Periode[keyof Periode]) =>
      dispatch({ type: "periode/update", key, value }),
    []
  );

  const downloadFile = useCallback((file: string) => {
    if (isUrl(file)) {
      window.open(file, "_blank", "noopener,noreferrer");
    } else {
      alert("Tidak ada URL. Nama file tersimpan: " + file);
    }
  }, []);

  const handleDownloadFile = useCallback((file: string) => {
    setFileToDownload(file);
    setDownloadConfirmOpen(true);
  }, []);

  const confirmDownload = useCallback(() => {
    if (fileToDownload) {
      downloadFile(fileToDownload);
    }
    setDownloadConfirmOpen(false);
    setFileToDownload("");
  }, [fileToDownload, downloadFile]);

  const handlePreviewFile = useCallback((file: string) => {
    setFileToPreview(file);
    setPreviewOpen(true);
  }, []);

  const onSave = useCallback(() => {
    // Mark as touched to show validation errors
    setTouched(true);

    // Validate required fields: awal and akhir periode
    if (state.periode.awalPeriode === "" || state.periode.akhirPeriode === "") {
      setShowWarning(true); // Show warning modal
      return; // Stop if validation fails
    }

    // Validate year range: akhir must be >= awal
    if (state.periode.akhirPeriode < state.periode.awalPeriode) {
      setShowWarning(true); // Show warning modal
      return; // Stop if validation fails
    }

    // TODO: ganti dengan API call
    console.log("[SAVE] profil payload:", state);
    setSavedOpen(true);
    // Reset touched after successful save
    setTouched(false);
  }, [state]);

  type PersonDataPayload = {
    jabatan?: string;
    unit?: string;
    nama: string;
    pekerjaan: string;
    nomorTelepon: string;
  };

  // helper untuk menerima hasil dari modal
  const savePengurus = useCallback((p: PersonDataPayload) => {
    const payload: PengurusBUM = {
      jabatan: p.jabatan ?? "",
      namaPengurus: p.nama,
      pekerjaan: p.pekerjaan,
      nomorTelepon: p.nomorTelepon,
    };
    if (editingPengurusIndex !== null) {
      dispatch({ type: "pengurus/update", index: editingPengurusIndex, payload });
      setEditingPengurusIndex(null);
    } else {
      dispatch({ type: "pengurus/add", payload });
    }
    setOpenPengurus(false);
  }, [editingPengurusIndex]);

  const saveKepalaUnit = useCallback((p: PersonDataPayload) => {
    const payload: KepalaUnit = {
      namaUnit: p.unit ?? "",
      namaKepalaUnit: p.nama,
      pekerjaan: p.pekerjaan,
      nomorTelepon: p.nomorTelepon,
    };
    if (editingKepalaUnitIndex !== null) {
      dispatch({ type: "kepalaUnit/update", index: editingKepalaUnitIndex, payload });
      setEditingKepalaUnitIndex(null);
    } else {
      dispatch({ type: "kepalaUnit/add", payload });
    }
    setOpenKepalaUnit(false);
  }, [editingKepalaUnitIndex]);

  const savePengawas = useCallback((p: PersonDataPayload) => {
    const payload: PengawasBUM = {
      namaPengawas: p.nama,
      pekerjaan: p.pekerjaan,
      nomorTelepon: p.nomorTelepon,
    };
    if (editingPengawasIndex !== null) {
      dispatch({ type: "pengawas/update", index: editingPengawasIndex, payload });
      setEditingPengawasIndex(null);
    } else {
      dispatch({ type: "pengawas/add", payload });
    }
    setOpenPengawas(false);
  }, [editingPengawasIndex]);

  const saveSK = useCallback((d: SKBUMDesa) => {
    if (editingSKIndex !== null) {
      dispatch({ type: "sk/update", index: editingSKIndex, payload: d });
      setEditingSKIndex(null);
    } else {
      dispatch({ type: "sk/add", payload: d });
    }
    setOpenSK(false);
  }, [editingSKIndex]);

  const saveBA = useCallback((d: BeritaAcaraBUM) => {
    if (editingBAIndex !== null) {
      dispatch({ type: "ba/update", index: editingBAIndex, payload: d });
      setEditingBAIndex(null);
    } else {
      dispatch({ type: "ba/add", payload: d });
    }
    setOpenBA(false);
  }, [editingBAIndex]);

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* Main form */}
      <div className="col-span-full lg:col-span-6 space-y-4">
        <div>
          <div className="flex gap-2">
            <YearPicker
              label="Awal Periode Kepengurusan"
              required
              placeholder="Pilih tahun"
              value={
                state.periode.awalPeriode === ""
                  ? undefined
                  : state.periode.awalPeriode
              }
              onChange={(y) => updateForm("awalPeriode", y ?? "")}
              touched={touched}
            />
            <YearPicker
              label="Akhir Periode Kepengurusan"
              required
              placeholder="Pilih tahun"
              value={
                state.periode.akhirPeriode === ""
                  ? undefined
                  : state.periode.akhirPeriode
              }
              onChange={(y) => updateForm("akhirPeriode", y ?? "")}
              touched={touched}
              error={
                state.periode.akhirPeriode !== "" &&
                state.periode.awalPeriode !== "" &&
                state.periode.akhirPeriode < state.periode.awalPeriode
                  ? "Harus lebih besar dari awal periode"
                  : undefined
              }
            />
          </div>
          <p className="mt-1 text-xs text-red-500">
            Perhatian! Mengubah bagian ini dapat mempengaruhi data yang lain
          </p>
        </div>
      </div>

      {/* Right column */}
      <div className="col-span-full space-y-4 ">
        {/* Pengurus */}
        <DataCard
          label="Pengurus BUM Desa"
          buttonLabel="Tambah Data"
          onButtonClick={() => {
            setEditingPengurusIndex(null);
            setOpenPengurus(true);
          }}
        >
          <div className="overflow-x-auto border border-t-neutral-200 rounded-lg">
            <table className="min-w-full w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-neutral-50 text-left text-sm font-semibold text-neutral-700">
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Jabatan
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nama
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Pekerjaan
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nomor Telepon
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.pengurus.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  state.pengurus.map((p, i) => (
                    <tr
                      key={`${p.jabatan}-${p.namaPengurus}-${i}`}
                      className="text-sm text-neutral-800"
                    >
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.jabatan}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.namaPengurus}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.pekerjaan}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.nomorTelepon}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPengurusIndex(i);
                              setOpenPengurus(true);
                            }}
                            className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                            title="Edit"
                            aria-label="Edit pengurus"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
                            onClick={() =>
                              dispatch({ type: "pengurus/remove", index: i })
                            }
                            title="Hapus"
                            aria-label="Hapus pengurus"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DataCard>

        <DataCard
          label="Kepala Unit BUM Desa"
          buttonLabel="Tambah Data"
          onButtonClick={() => {
            setEditingKepalaUnitIndex(null);
            setOpenKepalaUnit(true);
          }}
        >
          <div className="overflow-x-auto border border-t-neutral-200 rounded-lg">
            <table className="min-w-full w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-neutral-50 text-left text-sm font-semibold text-neutral-700">
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Unit
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nama
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Pekerjaan
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nomor Telepon
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.kepalaUnit.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  state.kepalaUnit.map((p, i) => (
                    <tr
                      key={`${p.namaUnit}-${p.namaKepalaUnit}-${i}`}
                      className="text-sm text-neutral-800"
                    >
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.namaUnit}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.namaKepalaUnit}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.pekerjaan}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.nomorTelepon}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingKepalaUnitIndex(i);
                              setOpenKepalaUnit(true);
                            }}
                            className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                            title="Edit"
                            aria-label="Edit kepala unit"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
                            onClick={() =>
                              dispatch({ type: "kepalaUnit/remove", index: i })
                            }
                            title="Hapus"
                            aria-label="Hapus kepala unit"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DataCard>

        <DataCard
          label="Pengawas BUM Desa"
          buttonLabel="Tambah Data"
          onButtonClick={() => {
            setEditingPengawasIndex(null);
            setOpenPengawas(true);
          }}
        >
          <div className="overflow-x-auto border border-t-neutral-200 rounded-lg">
            <table className="min-w-full w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-neutral-50 text-left text-sm font-semibold text-neutral-700">
                  <th className="border-b border-neutral-200 px-3 py-3">No</th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nama
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Pekerjaan
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nomor Telepon
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.pengawas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  state.pengawas.map((p, i) => (
                    <tr
                      key={`${p.namaPengawas}-${p.pekerjaan}-${i}`}
                      className="text-sm text-neutral-800"
                    >
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {i + 1}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.namaPengawas}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.pekerjaan}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.nomorTelepon}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPengawasIndex(i);
                              setOpenPengawas(true);
                            }}
                            className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                            title="Edit"
                            aria-label="Edit pengawas"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
                            onClick={() =>
                              dispatch({ type: "pengawas/remove", index: i })
                            }
                            title="Hapus"
                            aria-label="Hapus pengawas"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DataCard>

        {/* Double card */}
        <div className="flex flex-col lg:flex-row gap-4">
          <DataCard
            label="Surat Keputusan BUM Desa"
            buttonLabel="Tambah Data"
            note={
              state.suratKeputusan.length > 0
                ? "Periode kepengerusan telah diubah. Harap masukkan data terbaru!"
                : undefined
            }
            className="flex-1"
            onButtonClick={() => {
              setEditingSKIndex(null);
              setOpenSK(true);
            }}
          >
            <div className="overflow-x-auto border border-t-neutral-200 rounded-lg">
              <table className="min-w-full w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-neutral-50 text-left text-sm font-semibold text-neutral-700">
                    <th className="border-b border-neutral-200 px-3 py-3">
                      Periode
                    </th>
                    <th className="border-b border-neutral-200 px-3 py-3">
                      Nomor
                    </th>
                    <th className="border-b border-neutral-200 px-3 py-3">
                      File
                    </th>
                    <th className="border-b border-neutral-200 px-3 py-3 text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {state.suratKeputusan.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-4 text-center text-sm text-neutral-400"
                      >
                        Tidak ada data yang ditambahkan
                      </td>
                    </tr>
                  ) : (
                    state.suratKeputusan.map((d, i) => (
                      <tr
                        key={`${d.nomor}-${i}`}
                        className="text-sm text-neutral-800"
                      >
                        <td className="border-b border-neutral-200 px-3 py-2">
                          {d.periode}
                        </td>
                        <td className="border-b border-neutral-200 px-3 py-2">
                          {d.nomor}
                        </td>
                        <td className="border-b border-neutral-200 px-3 py-2">
                          {isUrl(d.file) ? (
                            <a
                              href={d.file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {d.file}
                            </a>
                          ) : (
                            d.file
                          )}
                        </td>
                        <td className="border-b border-neutral-200 px-3 py-2">
                          <div className="flex justify-end gap-1">
                            {d.file && d.file !== "-" && (
                              <>
                                <button
                                  type="button"
                                  className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                                  onClick={() => handlePreviewFile(d.file)}
                                  title="Preview"
                                  aria-label="Preview file"
                                >
                                  <Eye className="h-4 w-4 text-blue-600" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDownloadFile(d.file)}
                                  className="inline-flex items-center rounded p-1.5 hover:bg-emerald-50"
                                  title="Unduh"
                                  aria-label="Unduh dokumen"
                                >
                                  <Download className="h-4 w-4 text-emerald-600" />
                                </button>
                              </>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSKIndex(i);
                                setOpenSK(true);
                              }}
                              className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                              title="Edit"
                              aria-label="Edit dokumen"
                            >
                              <Pencil className="h-4 w-4 text-blue-600" />
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
                              onClick={() =>
                                dispatch({ type: "sk/remove", index: i })
                              }
                              title="Hapus"
                              aria-label="Hapus dokumen"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </DataCard>

          <DataCard
            label="Berita Acara Serah Terima Pengurus BUM Desa"
            buttonLabel="Tambah Data"
            note={
              state.beritaAcara.length > 0
                ? "Periode kepengerusan telah diubah. Harap masukkan data terbaru!"
                : undefined
            }
            className="flex-1"
            onButtonClick={() => {
              setEditingBAIndex(null);
              setOpenBA(true);
            }}
          >
            <div className="overflow-x-auto border border-t-neutral-200 rounded-lg">
              <table className="min-w-full w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-neutral-50 text-left text-sm font-semibold text-neutral-700">
                    <th className="border-b border-neutral-200 px-3 py-3">
                      Periode
                    </th>
                    <th className="border-b border-neutral-200 px-3 py-3">
                      Nomor
                    </th>
                    <th className="border-b border-neutral-200 px-3 py-3">
                      File
                    </th>
                    <th className="border-b border-neutral-200 px-3 py-3 text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {state.beritaAcara.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-4 text-center text-sm text-neutral-400"
                      >
                        Tidak ada data yang ditambahkan
                      </td>
                    </tr>
                  ) : (
                    state.beritaAcara.map((d, i) => (
                      <tr
                        key={`${d.nomor}-${i}`}
                        className="text-sm text-neutral-800"
                      >
                        <td className="border-b border-neutral-200 px-3 py-2">
                          {d.periode}
                        </td>
                        <td className="border-b border-neutral-200 px-3 py-2">
                          {d.nomor}
                        </td>
                        <td className="border-b border-neutral-200 px-3 py-2">
                          {isUrl(d.file) ? (
                            <a
                              href={d.file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {d.file}
                            </a>
                          ) : (
                            d.file
                          )}
                        </td>
                        <td className="border-b border-neutral-200 px-3 py-2">
                          <div className="flex justify-end gap-1">
                            {d.file && d.file !== "-" && (
                              <>
                                <button
                                  type="button"
                                  className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                                  onClick={() => handlePreviewFile(d.file)}
                                  title="Preview"
                                  aria-label="Preview file"
                                >
                                  <Eye className="h-4 w-4 text-blue-600" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDownloadFile(d.file)}
                                  className="inline-flex items-center rounded p-1.5 hover:bg-emerald-50"
                                  title="Unduh"
                                  aria-label="Unduh dokumen"
                                >
                                  <Download className="h-4 w-4 text-emerald-600" />
                                </button>
                              </>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingBAIndex(i);
                                setOpenBA(true);
                              }}
                              className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                              title="Edit"
                              aria-label="Edit dokumen"
                            >
                              <Pencil className="h-4 w-4 text-blue-600" />
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
                              onClick={() =>
                                dispatch({ type: "ba/remove", index: i })
                              }
                              title="Hapus"
                              aria-label="Hapus dokumen"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </DataCard>
        </div>
      </div>

      {/* Save */}
      <div className="col-span-full flex justify-end">
        <Button onClick={onSave}>Simpan</Button>
      </div>

      {/* ---- Modals ---------------------------------------------------------- */}
      <AddPengurusBUMModal
        open={openPengurus}
        onClose={() => {
          setOpenPengurus(false);
          setEditingPengurusIndex(null);
        }}
        onSave={savePengurus}
        ShowJabatan
        title="Data Pengurus BUM Desa"
        initialData={
          editingPengurusIndex !== null
            ? {
                jabatan: state.pengurus[editingPengurusIndex].jabatan,
                nama: state.pengurus[editingPengurusIndex].namaPengurus,
                pekerjaan: state.pengurus[editingPengurusIndex].pekerjaan,
                nomorTelepon: state.pengurus[editingPengurusIndex].nomorTelepon,
              }
            : undefined
        }
      />
      <AddPengurusBUMModal
        open={openKepalaUnit}
        onClose={() => {
          setOpenKepalaUnit(false);
          setEditingKepalaUnitIndex(null);
        }}
        onSave={saveKepalaUnit}
        ShowUnit
        title="Data Kepala Unit BUM Desa"
        initialData={
          editingKepalaUnitIndex !== null
            ? {
                unit: state.kepalaUnit[editingKepalaUnitIndex].namaUnit,
                nama: state.kepalaUnit[editingKepalaUnitIndex].namaKepalaUnit,
                pekerjaan: state.kepalaUnit[editingKepalaUnitIndex].pekerjaan,
                nomorTelepon: state.kepalaUnit[editingKepalaUnitIndex].nomorTelepon,
              }
            : undefined
        }
      />
      <AddPengurusBUMModal
        open={openPengawas}
        onClose={() => {
          setOpenPengawas(false);
          setEditingPengawasIndex(null);
        }}
        onSave={savePengawas}
        title="Data Pengawas BUM Desa"
        initialData={
          editingPengawasIndex !== null
            ? {
                nama: state.pengawas[editingPengawasIndex].namaPengawas,
                pekerjaan: state.pengawas[editingPengawasIndex].pekerjaan,
                nomorTelepon: state.pengawas[editingPengawasIndex].nomorTelepon,
              }
            : undefined
        }
      />

      <AddStrukturDokumenModal
        open={openSK}
        onClose={() => {
          setOpenSK(false);
          setEditingSKIndex(null);
        }}
        onSave={saveSK}
        keterangan="Surat Keterangan Keputusan BUM Desa"
        title="Tambah SK Pengurus BUM Desa"
        initialData={
          editingSKIndex !== null
            ? state.suratKeputusan[editingSKIndex]
            : undefined
        }
      />
      <AddStrukturDokumenModal
        open={openBA}
        onClose={() => {
          setOpenBA(false);
          setEditingBAIndex(null);
        }}
        onSave={saveBA}
        title="Berita Acara Serah Terima Pengurus BUM Desa"
        keterangan="Berita Acara Serah Terima Pengurus BUM Desa"
        initialData={
          editingBAIndex !== null
            ? state.beritaAcara[editingBAIndex]
            : undefined
        }
      />
      <SaveResultModal
        open={savedOpen}
        onClose={() => setSavedOpen(false)}
        title="Data Struktur Tersimpan"
        autoCloseMs={1500}
      />

      <WarningModal
        open={showWarning}
        onClose={() => setShowWarning(false)}
        type="warning"
        title="Data Belum Lengkap"
        message="Mohon lengkapi Awal Periode dan Akhir Periode Kepengurusan sebelum menyimpan."
      />

      {/* Download Confirmation Modal */}
      {downloadConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setDownloadConfirmOpen(false);
            setFileToDownload("");
          }}
        >
          <div
            className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-semibold text-neutral-800">
              Unduh Dokumen
            </h3>
            <p className="mb-6 text-sm text-neutral-600">
              Apakah Anda yakin ingin mengunduh dokumen ini?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDownloadConfirmOpen(false);
                  setFileToDownload("");
                }}
                className="rounded-md border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
              >
                Batal
              </button>
              <button
                onClick={confirmDownload}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
              >
                Unduh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-auto rounded-lg bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Preview Dokumen</h3>
              <button
                onClick={() => setPreviewOpen(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>
            <div className="text-sm text-neutral-600">
              <p className="mb-2">File: {fileToPreview}</p>
              {isUrl(fileToPreview) ? (
                <iframe
                  src={fileToPreview}
                  className="h-[70vh] w-full border"
                  title="Preview dokumen"
                />
              ) : (
                <p className="text-neutral-500">
                  Pratinjau tidak tersedia. File: {fileToPreview}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
