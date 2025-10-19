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
  gaji: string;
  keterangan: string;
};

type SKPengawas = {
  periode?: string;
  tahun?: string;
  nomor: string;
  file: string;
};

type SKDirektur = {
  periode?: string;
  tahun?: string;
  nomor: string;
  file: string;
};

type SKPegawai = {
  periode?: string;
  tahun?: string;
  nomor: string;
  file: string;
};

type SKPengurus = {
  periode?: string;
  tahun?: string;
  nomor: string;
  file: string;
};

type BeritaAcaraBUM = {
  periode?: string;
  tahun?: string;
  nomor: string;
  file: string;
};

type StukturState = {
  periode: Periode;
  pengurus: PengurusBUM[];
  skPengawas: SKPengawas[];
  skDirektur: SKDirektur[];
  skPegawai: SKPegawai[];
  skPengurus: SKPengurus[];
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
  skPengawas: [],
  skDirektur: [],
  skPegawai: [],
  skPengurus: [],
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
  const [openSKPengawas, setOpenSKPengawas] = useState(false);
  const [openSKDirektur, setOpenSKDirektur] = useState(false);
  const [openSKPegawai, setOpenSKPegawai] = useState(false);
  const [openSKPengurus, setOpenSKPengurus] = useState(false);
  const [openBA, setOpenBA] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Track if user attempted to submit (for showing validation errors)
  const [touched, setTouched] = useState(false);

  // Edit state for each table
  const [editingPengurusIndex, setEditingPengurusIndex] = useState<
    number | null
  >(null);
  const [editingSKPengawasIndex, setEditingSKPengawasIndex] = useState<
    number | null
  >(null);
  const [editingSKDirekturIndex, setEditingSKDirekturIndex] = useState<
    number | null
  >(null);
  const [editingSKPegawaiIndex, setEditingSKPegawaiIndex] = useState<
    number | null
  >(null);
  const [editingSKPengurusIndex, setEditingSKPengurusIndex] = useState<
    number | null
  >(null);
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
    gaji?: string;
    keterangan?: string;
  };

  // helper untuk menerima hasil dari modal
  const savePengurus = useCallback(
    (p: PersonDataPayload) => {
      const payload: PengurusBUM = {
        jabatan: p.jabatan ?? "",
        namaPengurus: p.nama,
        pekerjaan: p.pekerjaan,
        nomorTelepon: p.nomorTelepon,
        gaji: p.gaji ?? "",
        keterangan: p.keterangan ?? "",
      };
      if (editingPengurusIndex !== null) {
        dispatch({
          type: "pengurus/update",
          index: editingPengurusIndex,
          payload,
        });
        setEditingPengurusIndex(null);
      } else {
        dispatch({ type: "pengurus/add", payload });
      }
      setOpenPengurus(false);
    },
    [editingPengurusIndex]
  );

  const saveSKPengawas = useCallback(
    (d: SKPengawas) => {
      if (editingSKPengawasIndex !== null) {
        dispatch({
          type: "skPengawas/update",
          index: editingSKPengawasIndex,
          payload: d,
        });
        setEditingSKPengawasIndex(null);
      } else {
        dispatch({ type: "skPengawas/add", payload: d });
      }
      setOpenSKPengawas(false);
    },
    [editingSKPengawasIndex]
  );

  const saveSKDirektur = useCallback(
    (d: SKDirektur) => {
      if (editingSKDirekturIndex !== null) {
        dispatch({
          type: "skDirektur/update",
          index: editingSKDirekturIndex,
          payload: d,
        });
        setEditingSKDirekturIndex(null);
      } else {
        dispatch({ type: "skDirektur/add", payload: d });
      }
      setOpenSKDirektur(false);
    },
    [editingSKDirekturIndex]
  );

  const saveSKPegawai = useCallback(
    (d: SKPegawai) => {
      if (editingSKPegawaiIndex !== null) {
        dispatch({
          type: "skPegawai/update",
          index: editingSKPegawaiIndex,
          payload: d,
        });
        setEditingSKPegawaiIndex(null);
      } else {
        dispatch({ type: "skPegawai/add", payload: d });
      }
      setOpenSKPegawai(false);
    },
    [editingSKPegawaiIndex]
  );

  const saveSKPengurus = useCallback(
    (d: SKPengurus) => {
      if (editingSKPengurusIndex !== null) {
        dispatch({
          type: "skPengurus/update",
          index: editingSKPengurusIndex,
          payload: d,
        });
        setEditingSKPengurusIndex(null);
      } else {
        dispatch({ type: "skPengurus/add", payload: d });
      }
      setOpenSKPengurus(false);
    },
    [editingSKPengurusIndex]
  );

  const saveBA = useCallback(
    (d: BeritaAcaraBUM) => {
      if (editingBAIndex !== null) {
        dispatch({ type: "ba/update", index: editingBAIndex, payload: d });
        setEditingBAIndex(null);
      } else {
        dispatch({ type: "ba/add", payload: d });
      }
      setOpenBA(false);
    },
    [editingBAIndex]
  );

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
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Gaji
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Keterangan
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
                      colSpan={7}
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
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.gaji}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.keterangan || "-"}
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

        {/* Document sections */}
        <DataCard
          label="Surat Keputusan Pengawas"
          buttonLabel="Tambah Dokumen"
          onButtonClick={() => {
            setEditingSKPengawasIndex(null);
            setOpenSKPengawas(true);
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
                    Nama File
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.skPengawas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  state.skPengawas.map((d, i) => (
                    <tr
                      key={`${d.nomor}-${i}`}
                      className="text-sm text-neutral-800"
                    >
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.periode || d.tahun || "-"}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.nomor}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.file}
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
                              >
                                <Eye className="h-4 w-4 text-blue-600" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadFile(d.file)}
                                className="inline-flex items-center rounded p-1.5 hover:bg-emerald-50"
                                title="Unduh"
                              >
                                <Download className="h-4 w-4 text-emerald-600" />
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSKPengawasIndex(i);
                              setOpenSKPengawas(true);
                            }}
                            className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
                            onClick={() =>
                              dispatch({ type: "skPengawas/remove", index: i })
                            }
                            title="Hapus"
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
          label="Surat Keputusan Direktur BUM Desa"
          buttonLabel="Tambah Dokumen"
          onButtonClick={() => {
            setEditingSKDirekturIndex(null);
            setOpenSKDirektur(true);
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
                    Nama File
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.skDirektur.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  state.skDirektur.map((d, i) => (
                    <tr
                      key={`${d.nomor}-${i}`}
                      className="text-sm text-neutral-800"
                    >
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.periode || d.tahun || "-"}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.nomor}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.file}
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
                              >
                                <Eye className="h-4 w-4 text-blue-600" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadFile(d.file)}
                                className="inline-flex items-center rounded p-1.5 hover:bg-emerald-50"
                                title="Unduh"
                              >
                                <Download className="h-4 w-4 text-emerald-600" />
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSKDirekturIndex(i);
                              setOpenSKDirektur(true);
                            }}
                            className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
                            onClick={() =>
                              dispatch({ type: "skDirektur/remove", index: i })
                            }
                            title="Hapus"
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
          label="SK Pegawai"
          buttonLabel="Tambah Dokumen"
          onButtonClick={() => {
            setEditingSKPegawaiIndex(null);
            setOpenSKPegawai(true);
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
                    Nama File
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.skPegawai.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  state.skPegawai.map((d, i) => (
                    <tr
                      key={`${d.nomor}-${i}`}
                      className="text-sm text-neutral-800"
                    >
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.periode || d.tahun || "-"}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.nomor}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.file}
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
                              >
                                <Eye className="h-4 w-4 text-blue-600" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadFile(d.file)}
                                className="inline-flex items-center rounded p-1.5 hover:bg-emerald-50"
                                title="Unduh"
                              >
                                <Download className="h-4 w-4 text-emerald-600" />
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSKPegawaiIndex(i);
                              setOpenSKPegawai(true);
                            }}
                            className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
                            onClick={() =>
                              dispatch({ type: "skPegawai/remove", index: i })
                            }
                            title="Hapus"
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
          label="Surat Keputusan Pengurus BUM Desa"
          buttonLabel="Tambah Dokumen"
          note="Surat Keputusan Pengurus BUM Desa hanya untuk sebelum tahun 2021"
          onButtonClick={() => {
            setEditingSKPengurusIndex(null);
            setOpenSKPengurus(true);
          }}
        >
          <div className="overflow-x-auto border border-t-neutral-200 rounded-lg">
            <table className="min-w-full w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-neutral-50 text-left text-sm font-semibold text-neutral-700">
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Tahun
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nomor
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nama File
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.skPengurus.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  state.skPengurus.map((d, i) => (
                    <tr
                      key={`${d.nomor}-${i}`}
                      className="text-sm text-neutral-800"
                    >
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.tahun || d.periode || "-"}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.nomor}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.file}
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
                              >
                                <Eye className="h-4 w-4 text-blue-600" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadFile(d.file)}
                                className="inline-flex items-center rounded p-1.5 hover:bg-emerald-50"
                                title="Unduh"
                              >
                                <Download className="h-4 w-4 text-emerald-600" />
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSKPengurusIndex(i);
                              setOpenSKPengurus(true);
                            }}
                            className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
                            onClick={() =>
                              dispatch({ type: "skPengurus/remove", index: i })
                            }
                            title="Hapus"
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
          buttonLabel="Tambah Dokumen"
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
                    Tahun
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nomor
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nama File
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
                        {d.tahun || d.periode || "-"}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.nomor}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.file}
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
                              >
                                <Eye className="h-4 w-4 text-blue-600" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadFile(d.file)}
                                className="inline-flex items-center rounded p-1.5 hover:bg-emerald-50"
                                title="Unduh"
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
        ShowGaji
        ShowKeterangan
        title="Data Pengurus BUM Desa"
        initialData={
          editingPengurusIndex !== null
            ? {
                jabatan: state.pengurus[editingPengurusIndex].jabatan,
                nama: state.pengurus[editingPengurusIndex].namaPengurus,
                pekerjaan: state.pengurus[editingPengurusIndex].pekerjaan,
                nomorTelepon: state.pengurus[editingPengurusIndex].nomorTelepon,
                gaji: state.pengurus[editingPengurusIndex].gaji,
                keterangan: state.pengurus[editingPengurusIndex].keterangan,
              }
            : undefined
        }
      />

      <AddStrukturDokumenModal
        open={openSKPengawas}
        onClose={() => {
          setOpenSKPengawas(false);
          setEditingSKPengawasIndex(null);
        }}
        onSave={saveSKPengawas}
        keterangan="Surat Keputusan Pengawas"
        title="Tambah Dokumen SK Pengawas"
        initialData={
          editingSKPengawasIndex !== null
            ? state.skPengawas[editingSKPengawasIndex]
            : undefined
        }
      />

      <AddStrukturDokumenModal
        open={openSKDirektur}
        onClose={() => {
          setOpenSKDirektur(false);
          setEditingSKDirekturIndex(null);
        }}
        onSave={saveSKDirektur}
        keterangan="Surat Keputusan Direktur BUM Desa"
        title="Tambah Dokumen SK Direktur"
        initialData={
          editingSKDirekturIndex !== null
            ? state.skDirektur[editingSKDirekturIndex]
            : undefined
        }
      />

      <AddStrukturDokumenModal
        open={openSKPegawai}
        onClose={() => {
          setOpenSKPegawai(false);
          setEditingSKPegawaiIndex(null);
        }}
        onSave={saveSKPegawai}
        keterangan="SK Pegawai"
        title="Tambah Dokumen SK Pegawai"
        initialData={
          editingSKPegawaiIndex !== null
            ? state.skPegawai[editingSKPegawaiIndex]
            : undefined
        }
      />

      <AddStrukturDokumenModal
        open={openSKPengurus}
        onClose={() => {
          setOpenSKPengurus(false);
          setEditingSKPengurusIndex(null);
        }}
        onSave={saveSKPengurus}
        keterangan="Surat Keputusan Pengurus BUM Desa"
        title="Tambah Dokumen SK Pengurus"
        useTahun={true}
        initialData={
          editingSKPengurusIndex !== null
            ? state.skPengurus[editingSKPengurusIndex]
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
        useTahun={true}
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
