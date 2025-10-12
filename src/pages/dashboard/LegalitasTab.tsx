import { useCallback, useReducer, useState } from "react";
import Button from "../../components/ui/Button";
import DataCard from "../../components/ui/DataCard";
import { Download, Eye, Pencil, Trash2 } from "lucide-react";
import AddAnggaranModal from "../../components/modals/legalitas/AddLegalDokumenModal";
import SaveResultModal from "../../components/modals/SaveResultModal";

/**
 * ===========================
 * Types
 * ===========================
 */

type BaseDokumen = {
  tahun: number;
  nama: string;
  nominal?: number | "";
  file: string;
};

type DokumenART = {
  tahun: number;
  nama: string;
  nominal?: number | "";
  file: string;
};

type DokumenPerdes = {
  tahun: number;
  nama: string;
  nomor: string;
  nominal?: number | "";
  file: string;
};

type LegalitasState = {
  anggaranDasar: BaseDokumen[];
  anggaranRumahTangga: DokumenART[];
  perdesPenyertaanModal: DokumenPerdes[];
};

/**
 * ===========================
 * Initial
 * ===========================
 */
const INITIAL: LegalitasState = {
  anggaranDasar: [],
  anggaranRumahTangga: [],
  perdesPenyertaanModal: [],
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

function formatCurrency(value: number | "" | undefined): string {
  if (value === "" || value === undefined || value === null) {
    return "-";
  }
  return "Rp" + Intl.NumberFormat("id-ID").format(Number(value));
}

/**
 * ===========================
 * Reducer (sederhana & terpusat)
 * ===========================
 */

type Action =
  | { type: "ad/add"; payload: BaseDokumen }
  | { type: "ad/update"; index: number; payload: BaseDokumen }
  | { type: "ad/remove"; index: number }
  | { type: "art/add"; payload: DokumenART }
  | { type: "art/update"; index: number; payload: DokumenART }
  | { type: "art/remove"; index: number }
  | { type: "perdes/add"; payload: DokumenPerdes }
  | { type: "perdes/update"; index: number; payload: DokumenPerdes }
  | { type: "perdes/remove"; index: number }
  | { type: "reset" };

function reducer(state: LegalitasState, action: Action): LegalitasState {
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
export default function LegalitasTab() {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  // Modal flags
  const [openAD, setOpenAD] = useState(false);
  const [openART, setOpenART] = useState(false);
  const [openPerdes, setOpenPerdes] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);

  // Edit state for each table
  const [editingADIndex, setEditingADIndex] = useState<number | null>(null);
  const [editingARTIndex, setEditingARTIndex] = useState<number | null>(null);
  const [editingPerdesIndex, setEditingPerdesIndex] = useState<number | null>(null);

  // Download confirmation and preview modals
  const [downloadConfirmOpen, setDownloadConfirmOpen] = useState(false);
  const [fileToDownload, setFileToDownload] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileToPreview, setFileToPreview] = useState<string>("");

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
    // TODO: ganti dengan API call
    console.log("[SAVE] profil payload:", state);
    setSavedOpen(true);
  }, [state]);

  // Helpers menerima hasil dari modal
  // Define the LegalDokumenPayload type (adjust fields as needed)
  type LegalDokumenPayload = {
    tahun: number;
    nama: string;
    nominal?: number | "";
    file: string;
    nomor?: string;
  };

  const saveAD = useCallback((d: LegalDokumenPayload) => {
    const payload: BaseDokumen = {
      tahun: d.tahun,
      nama: d.nama,
      nominal: d.nominal ?? "",
      file: d.file,
    };
    if (editingADIndex !== null) {
      dispatch({ type: "ad/update", index: editingADIndex, payload });
      setEditingADIndex(null);
    } else {
      dispatch({ type: "ad/add", payload });
    }
    setOpenAD(false);
  }, [editingADIndex]);

  const saveART = useCallback((d: LegalDokumenPayload) => {
    const payload: DokumenART = {
      tahun: d.tahun,
      nama: d.nama,
      nominal: d.nominal ?? "",
      file: d.file,
    };
    if (editingARTIndex !== null) {
      dispatch({ type: "art/update", index: editingARTIndex, payload });
      setEditingARTIndex(null);
    } else {
      dispatch({ type: "art/add", payload });
    }
    setOpenART(false);
  }, [editingARTIndex]);

  const savePerdes = useCallback((d: LegalDokumenPayload) => {
    const payload: DokumenPerdes = {
      tahun: d.tahun,
      nama: d.nama,
      nomor: d.nomor ?? "",
      nominal: d.nominal ?? "",
      file: d.file,
    };
    if (editingPerdesIndex !== null) {
      dispatch({ type: "perdes/update", index: editingPerdesIndex, payload });
      setEditingPerdesIndex(null);
    } else {
      dispatch({ type: "perdes/add", payload });
    }
    setOpenPerdes(false);
  }, [editingPerdesIndex]);

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* Right column */}
      <div className="col-span-full space-y-4">
        {/* Anggaran Dasar */}
        <DataCard
          label="Anggaran Dasar BUM Desa"
          buttonLabel="Tambah Dokumen"
          onButtonClick={() => {
            setEditingADIndex(null);
            setOpenAD(true);
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
                    Nama
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nominal
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
                {state.anggaranDasar.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  state.anggaranDasar.map((d, i) => (
                    <tr
                      key={`${d.nama}-${d.tahun}-${i}`}
                      className="text-sm text-neutral-800"
                    >
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.tahun}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.nama}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {formatCurrency(d.nominal)}
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
                              setEditingADIndex(i);
                              setOpenAD(true);
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
                              dispatch({ type: "ad/remove", index: i })
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

        {/* Anggaran Rumah Tangga */}
        <DataCard
          label="Anggaran Rumah Tangga BUM Desa"
          buttonLabel="Tambah Dokumen"
          onButtonClick={() => {
            setEditingARTIndex(null);
            setOpenART(true);
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
                    Nama
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nominal
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
                {state.anggaranRumahTangga.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  state.anggaranRumahTangga.map((d, i) => (
                    <tr
                      key={`${d.nama}-${d.tahun}-${i}`}
                      className="text-sm text-neutral-800"
                    >
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.tahun}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.nama}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {formatCurrency(d.nominal)}
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
                              setEditingARTIndex(i);
                              setOpenART(true);
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
                              dispatch({ type: "art/remove", index: i })
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

        {/* Perdes Penyertaan Modal */}
        <DataCard
          label="Perdes Penyertaan Modal BUM Desa"
          buttonLabel="Tambah Dokumen"
          onButtonClick={() => {
            setEditingPerdesIndex(null);
            setOpenPerdes(true);
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
                    Nama
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nomor
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nominal
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
                {state.perdesPenyertaanModal.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  state.perdesPenyertaanModal.map((d, i) => (
                    <tr
                      key={`${d.nama}-${d.tahun}-${d.nomor}-${i}`}
                      className="text-sm text-neutral-800"
                    >
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.tahun}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.nama}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.nomor || "-"}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {formatCurrency(d.nominal)}
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
                              setEditingPerdesIndex(i);
                              setOpenPerdes(true);
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
                              dispatch({ type: "perdes/remove", index: i })
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

      {/* Modals */}
      <AddAnggaranModal
        open={openAD}
        onClose={() => {
          setOpenAD(false);
          setEditingADIndex(null);
        }}
        onSave={saveAD}
        title="Tambah AD BUM Desa"
        showNominal
        namaLabel="Nama Dokumen (AD)"
        nominalLabel="Nominal"
        initialData={
          editingADIndex !== null
            ? {
                tahun: state.anggaranDasar[editingADIndex].tahun,
                nama: state.anggaranDasar[editingADIndex].nama,
                nominal: state.anggaranDasar[editingADIndex].nominal,
                file: state.anggaranDasar[editingADIndex].file,
              }
            : undefined
        }
      />

      <AddAnggaranModal
        open={openART}
        onClose={() => {
          setOpenART(false);
          setEditingARTIndex(null);
        }}
        onSave={saveART}
        title="Tambah ART BUM Desa"
        showNominal
        namaLabel="Nama Dokumen (ART)"
        nominalLabel="Nominal"
        initialData={
          editingARTIndex !== null
            ? {
                tahun: state.anggaranRumahTangga[editingARTIndex].tahun,
                nama: state.anggaranRumahTangga[editingARTIndex].nama,
                nominal: state.anggaranRumahTangga[editingARTIndex].nominal,
                file: state.anggaranRumahTangga[editingARTIndex].file,
              }
            : undefined
        }
      />

      <AddAnggaranModal
        open={openPerdes}
        onClose={() => {
          setOpenPerdes(false);
          setEditingPerdesIndex(null);
        }}
        onSave={savePerdes}
        title="Tambah Perdes Penyertaan Modal"
        showNomor
        showNominal
        namaLabel="Nama Perdes"
        nomorLabel="Nomor Perdes"
        nominalLabel="Nominal"
        initialData={
          editingPerdesIndex !== null
            ? {
                tahun: state.perdesPenyertaanModal[editingPerdesIndex].tahun,
                nama: state.perdesPenyertaanModal[editingPerdesIndex].nama,
                nomor: state.perdesPenyertaanModal[editingPerdesIndex].nomor,
                nominal: state.perdesPenyertaanModal[editingPerdesIndex].nominal,
                file: state.perdesPenyertaanModal[editingPerdesIndex].file,
              }
            : undefined
        }
      />
      <SaveResultModal
        open={savedOpen}
        onClose={() => setSavedOpen(false)}
        title="Data Struktur Tersimpan"
        autoCloseMs={1500}
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
