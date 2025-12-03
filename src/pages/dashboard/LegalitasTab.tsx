import { useCallback, useState } from "react";
import Button from "../../components/ui/Button";
import DataCard from "../../components/ui/DataCard";
import { Download, Eye, Pencil, Trash2 } from "lucide-react";
import AddAnggaranModal from "../../components/modals/legalitas/AddLegalDokumenModal";
import SaveResultModal from "../../components/modals/SaveResultModal";
import WarningModal from "../../components/modals/WarningModal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import {
  useDashboard,
  type BaseDokumen,
  type DokumenART,
  type DokumenSimple,
  type DokumenAsetDesa,
  type DokumenPerdesModal,
} from "../../contexts/DashboardContext";

/**
 * ===========================
 * Utils
 * ===========================
 */
function isUrl(value: string): boolean {
  // Any non-empty, non-dash value is considered previewable
  if (!value || !value.trim() || value === "-") return false;
  return true;
}

function getFileUrl(file: string): string {
  if (!file || file === "-") return "";
  // Blob URLs - return as-is
  if (file.startsWith("blob:")) return file;
  // Full URLs - return as-is
  if (file.startsWith("http://") || file.startsWith("https://")) return file;
  // Server paths with uploads/ prefix - prepend /api
  if (file.startsWith("uploads/")) return `/api/${file}`;
  // Plain filename - assume it's in uploads directory
  return `/api/uploads/${file}`;
}

function formatCurrency(value: number | "" | undefined): string {
  if (value === "" || value === undefined || value === null) {
    return "-";
  }
  return "Rp" + Intl.NumberFormat("id-ID").format(Number(value));
}

/**
 * ===========================
 * Component
 * ===========================
 */
export default function LegalitasTab() {
  const {
    legalitasState: state,
    legalitasDispatch: dispatch,
    saveLegalitas,
  } = useDashboard();

  // Modal flags
  const [openAD, setOpenAD] = useState(false);
  const [openART, setOpenART] = useState(false);
  const [openAHU, setOpenAHU] = useState(false);
  const [openNPWP, setOpenNPWP] = useState(false);
  const [openNIB, setOpenNIB] = useState(false);
  const [openAset, setOpenAset] = useState(false);
  const [openPerdes, setOpenPerdes] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);

  // Edit state for each table
  const [editingADIndex, setEditingADIndex] = useState<number | null>(null);
  const [editingARTIndex, setEditingARTIndex] = useState<number | null>(null);
  const [editingAHUIndex, setEditingAHUIndex] = useState<number | null>(null);
  const [editingNPWPIndex, setEditingNPWPIndex] = useState<number | null>(null);
  const [editingNIBIndex, setEditingNIBIndex] = useState<number | null>(null);
  const [editingAsetIndex, setEditingAsetIndex] = useState<number | null>(null);
  const [editingPerdesIndex, setEditingPerdesIndex] = useState<number | null>(
    null
  );

  // Download confirmation and preview modals
  const [downloadConfirmOpen, setDownloadConfirmOpen] = useState(false);
  const [fileToDownload, setFileToDownload] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileToPreview, setFileToPreview] = useState<string>("");

  // Confirm delete states
  const [confirmDeleteADOpen, setConfirmDeleteADOpen] = useState(false);
  const [deleteADIndex, setDeleteADIndex] = useState<number | null>(null);
  const [confirmDeleteARTOpen, setConfirmDeleteARTOpen] = useState(false);
  const [deleteARTIndex, setDeleteARTIndex] = useState<number | null>(null);
  const [confirmDeleteAHUOpen, setConfirmDeleteAHUOpen] = useState(false);
  const [deleteAHUIndex, setDeleteAHUIndex] = useState<number | null>(null);
  const [confirmDeleteNPWPOpen, setConfirmDeleteNPWPOpen] = useState(false);
  const [deleteNPWPIndex, setDeleteNPWPIndex] = useState<number | null>(null);
  const [confirmDeleteNIBOpen, setConfirmDeleteNIBOpen] = useState(false);
  const [deleteNIBIndex, setDeleteNIBIndex] = useState<number | null>(null);
  const [confirmDeleteAsetOpen, setConfirmDeleteAsetOpen] = useState(false);
  const [deleteAsetIndex, setDeleteAsetIndex] = useState<number | null>(null);
  const [confirmDeletePerdesOpen, setConfirmDeletePerdesOpen] = useState(false);
  const [deletePerdesIndex, setDeletePerdesIndex] = useState<number | null>(
    null
  );

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const downloadFile = useCallback((file: string) => {
    if (isUrl(file)) {
      const url = getFileUrl(file);
      window.open(url, "_blank", "noopener,noreferrer");
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

  const onSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const success = await saveLegalitas();
      if (success) {
        setSavedOpen(true);
      } else {
        setShowWarning(true);
      }
    } catch (error) {
      console.error("Save legalitas error:", error);
      setShowWarning(true);
    } finally {
      setIsSaving(false);
    }
  }, [saveLegalitas]);

  // Helpers menerima hasil dari modal
  // Define the LegalDokumenPayload type (adjust fields as needed)
  type LegalDokumenPayload = {
    id?: number;
    tahun: number;
    nama: string;
    nominal?: number | "";
    file: string;
    nomor?: string;
  };

  const saveAD = useCallback(
    (d: LegalDokumenPayload) => {
      const payload: BaseDokumen = {
        id: d.id,
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
    },
    [editingADIndex, dispatch]
  );

  const saveART = useCallback(
    (d: LegalDokumenPayload) => {
      const payload: DokumenART = {
        id: d.id,
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
    },
    [editingARTIndex, dispatch]
  );

  const saveAHU = useCallback(
    (d: LegalDokumenPayload) => {
      const payload: DokumenSimple = {
        id: d.id,
        tahun: d.tahun,
        nomor: d.nomor ?? "",
        file: d.file,
      };
      if (editingAHUIndex !== null) {
        dispatch({ type: "ahu/update", index: editingAHUIndex, payload });
        setEditingAHUIndex(null);
      } else {
        dispatch({ type: "ahu/add", payload });
      }
      setOpenAHU(false);
    },
    [editingAHUIndex, dispatch]
  );

  const saveNPWP = useCallback(
    (d: LegalDokumenPayload) => {
      const payload: DokumenSimple = {
        id: d.id,
        tahun: d.tahun,
        nomor: d.nomor ?? "",
        file: d.file,
      };
      if (editingNPWPIndex !== null) {
        dispatch({ type: "npwp/update", index: editingNPWPIndex, payload });
        setEditingNPWPIndex(null);
      } else {
        dispatch({ type: "npwp/add", payload });
      }
      setOpenNPWP(false);
    },
    [editingNPWPIndex, dispatch]
  );

  const saveNIB = useCallback(
    (d: LegalDokumenPayload) => {
      const payload: DokumenSimple = {
        id: d.id,
        tahun: d.tahun,
        nomor: d.nomor ?? "",
        file: d.file,
      };
      if (editingNIBIndex !== null) {
        dispatch({ type: "nib/update", index: editingNIBIndex, payload });
        setEditingNIBIndex(null);
      } else {
        dispatch({ type: "nib/add", payload });
      }
      setOpenNIB(false);
    },
    [editingNIBIndex, dispatch]
  );

  const saveAset = useCallback(
    (d: LegalDokumenPayload) => {
      const payload: DokumenAsetDesa = {
        id: d.id,
        tahun: d.tahun,
        nama: d.nama,
        nomor: d.nomor ?? "",
        file: d.file,
      };
      if (editingAsetIndex !== null) {
        dispatch({ type: "aset/update", index: editingAsetIndex, payload });
        setEditingAsetIndex(null);
      } else {
        dispatch({ type: "aset/add", payload });
      }
      setOpenAset(false);
    },
    [editingAsetIndex, dispatch]
  );

  const savePerdes = useCallback(
    (d: LegalDokumenPayload) => {
      const payload: DokumenPerdesModal = {
        id: d.id,
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
    },
    [editingPerdesIndex, dispatch]
  );

  // Delete handlers
  const handleDeleteAD = useCallback((index: number) => {
    setDeleteADIndex(index);
    setConfirmDeleteADOpen(true);
  }, []);

  const confirmDeleteAD = useCallback(() => {
    if (deleteADIndex !== null) {
      dispatch({ type: "ad/remove", index: deleteADIndex });
      setDeleteADIndex(null);
    }
  }, [deleteADIndex]);

  const handleDeleteART = useCallback((index: number) => {
    setDeleteARTIndex(index);
    setConfirmDeleteARTOpen(true);
  }, []);

  const confirmDeleteART = useCallback(() => {
    if (deleteARTIndex !== null) {
      dispatch({ type: "art/remove", index: deleteARTIndex });
      setDeleteARTIndex(null);
    }
  }, [deleteARTIndex]);

  const handleDeleteAHU = useCallback((index: number) => {
    setDeleteAHUIndex(index);
    setConfirmDeleteAHUOpen(true);
  }, []);

  const confirmDeleteAHU = useCallback(() => {
    if (deleteAHUIndex !== null) {
      dispatch({ type: "ahu/remove", index: deleteAHUIndex });
      setDeleteAHUIndex(null);
    }
  }, [deleteAHUIndex]);

  const handleDeleteNPWP = useCallback((index: number) => {
    setDeleteNPWPIndex(index);
    setConfirmDeleteNPWPOpen(true);
  }, []);

  const confirmDeleteNPWP = useCallback(() => {
    if (deleteNPWPIndex !== null) {
      dispatch({ type: "npwp/remove", index: deleteNPWPIndex });
      setDeleteNPWPIndex(null);
    }
  }, [deleteNPWPIndex]);

  const handleDeleteNIB = useCallback((index: number) => {
    setDeleteNIBIndex(index);
    setConfirmDeleteNIBOpen(true);
  }, []);

  const confirmDeleteNIB = useCallback(() => {
    if (deleteNIBIndex !== null) {
      dispatch({ type: "nib/remove", index: deleteNIBIndex });
      setDeleteNIBIndex(null);
    }
  }, [deleteNIBIndex]);

  const handleDeleteAset = useCallback((index: number) => {
    setDeleteAsetIndex(index);
    setConfirmDeleteAsetOpen(true);
  }, []);

  const confirmDeleteAset = useCallback(() => {
    if (deleteAsetIndex !== null) {
      dispatch({ type: "aset/remove", index: deleteAsetIndex });
      setDeleteAsetIndex(null);
    }
  }, [deleteAsetIndex]);

  const handleDeletePerdes = useCallback((index: number) => {
    setDeletePerdesIndex(index);
    setConfirmDeletePerdesOpen(true);
  }, []);

  const confirmDeletePerdes = useCallback(() => {
    if (deletePerdesIndex !== null) {
      dispatch({ type: "perdes/remove", index: deletePerdesIndex });
      setDeletePerdesIndex(null);
    }
  }, [deletePerdesIndex]);

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
                            onClick={() => handleDeleteAD(i)}
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
                            onClick={() => handleDeleteART(i)}
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

        {/* AHU Badan Hukum */}
        <DataCard
          label="AHU Badan Hukum"
          buttonLabel="Tambah Dokumen"
          onButtonClick={() => {
            setEditingAHUIndex(null);
            setOpenAHU(true);
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
                    File
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.ahuBadanHukum.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  state.ahuBadanHukum.map((d, i) => (
                    <tr
                      key={`${d.nomor}-${d.tahun}-${i}`}
                      className="text-sm text-neutral-800"
                    >
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.tahun}
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
                              setEditingAHUIndex(i);
                              setOpenAHU(true);
                            }}
                            className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
                            onClick={() => handleDeleteAHU(i)}
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

        {/* NPWP */}
        <DataCard
          label="NPWP"
          buttonLabel="Tambah Dokumen"
          onButtonClick={() => {
            setEditingNPWPIndex(null);
            setOpenNPWP(true);
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
                    File
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.npwp.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  state.npwp.map((d, i) => (
                    <tr
                      key={`${d.nomor}-${d.tahun}-${i}`}
                      className="text-sm text-neutral-800"
                    >
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.tahun}
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
                              setEditingNPWPIndex(i);
                              setOpenNPWP(true);
                            }}
                            className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
                            onClick={() => handleDeleteNPWP(i)}
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

        {/* NIB */}
        <DataCard
          label="NIB (Nomor Izin Berusaha)"
          buttonLabel="Tambah Dokumen"
          onButtonClick={() => {
            setEditingNIBIndex(null);
            setOpenNIB(true);
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
                    File
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.nib.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  state.nib.map((d, i) => (
                    <tr
                      key={`${d.nomor}-${d.tahun}-${i}`}
                      className="text-sm text-neutral-800"
                    >
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.tahun}
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
                              setEditingNIBIndex(i);
                              setOpenNIB(true);
                            }}
                            className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
                            onClick={() => handleDeleteNIB(i)}
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

        {/* Dokumen Pemanfaatan Aset Desa */}
        <DataCard
          label="Dokumen Pemanfaatan Aset Desa"
          buttonLabel="Tambah Dokumen"
          onButtonClick={() => {
            setEditingAsetIndex(null);
            setOpenAset(true);
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
                    File
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.dokumenAsetDesa.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  state.dokumenAsetDesa.map((d, i) => (
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
                        {d.nomor || "-"}
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
                              setEditingAsetIndex(i);
                              setOpenAset(true);
                            }}
                            className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
                            onClick={() => handleDeleteAset(i)}
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
                            onClick={() => handleDeletePerdes(i)}
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
              {state.perdesPenyertaanModal.length > 0 && (
                <tfoot>
                  <tr className="bg-neutral-50 text-sm font-semibold text-neutral-800">
                    <td
                      colSpan={3}
                      className="border-t-2 border-neutral-300 px-3 py-3 text-right"
                    >
                      Total Modal
                    </td>
                    <td className="border-t-2 border-neutral-300 px-3 py-3">
                      {formatCurrency(
                        state.perdesPenyertaanModal.reduce(
                          (sum, d) =>
                            sum +
                            (typeof d.nominal === "number" ? d.nominal : 0),
                          0
                        )
                      )}
                    </td>
                    <td
                      colSpan={2}
                      className="border-t-2 border-neutral-300"
                    ></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </DataCard>
      </div>

      {/* Save */}
      <div className="col-span-full flex justify-end">
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? "Menyimpan..." : "Update"}
        </Button>
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
                id: state.anggaranDasar[editingADIndex].id,
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
                id: state.anggaranRumahTangga[editingARTIndex].id,
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
                id: state.perdesPenyertaanModal[editingPerdesIndex].id,
                tahun: state.perdesPenyertaanModal[editingPerdesIndex].tahun,
                nama: state.perdesPenyertaanModal[editingPerdesIndex].nama,
                nomor: state.perdesPenyertaanModal[editingPerdesIndex].nomor,
                nominal:
                  state.perdesPenyertaanModal[editingPerdesIndex].nominal,
                file: state.perdesPenyertaanModal[editingPerdesIndex].file,
              }
            : undefined
        }
      />

      {/* AHU Badan Hukum Modal */}
      <AddAnggaranModal
        open={openAHU}
        onClose={() => {
          setOpenAHU(false);
          setEditingAHUIndex(null);
        }}
        onSave={saveAHU}
        title="Tambah AHU Badan Hukum"
        showNomor
        namaLabel="Nama Dokumen"
        nomorLabel="Nomor AHU"
        initialData={
          editingAHUIndex !== null
            ? {
                id: state.ahuBadanHukum[editingAHUIndex].id,
                tahun: state.ahuBadanHukum[editingAHUIndex].tahun,
                nama: "AHU Badan Hukum",
                nomor: state.ahuBadanHukum[editingAHUIndex].nomor,
                file: state.ahuBadanHukum[editingAHUIndex].file,
              }
            : undefined
        }
      />

      {/* NPWP Modal */}
      <AddAnggaranModal
        open={openNPWP}
        onClose={() => {
          setOpenNPWP(false);
          setEditingNPWPIndex(null);
        }}
        onSave={saveNPWP}
        title="Tambah NPWP"
        showNomor
        namaLabel="Nama Dokumen"
        nomorLabel="Nomor NPWP"
        initialData={
          editingNPWPIndex !== null
            ? {
                id: state.npwp[editingNPWPIndex].id,
                tahun: state.npwp[editingNPWPIndex].tahun,
                nama: "NPWP",
                nomor: state.npwp[editingNPWPIndex].nomor,
                file: state.npwp[editingNPWPIndex].file,
              }
            : undefined
        }
      />

      {/* NIB Modal */}
      <AddAnggaranModal
        open={openNIB}
        onClose={() => {
          setOpenNIB(false);
          setEditingNIBIndex(null);
        }}
        onSave={saveNIB}
        title="Tambah NIB (Nomor Izin Berusaha)"
        showNomor
        namaLabel="Nama Dokumen"
        nomorLabel="Nomor Izin Berusaha"
        initialData={
          editingNIBIndex !== null
            ? {
                id: state.nib[editingNIBIndex].id,
                tahun: state.nib[editingNIBIndex].tahun,
                nama: "NIB",
                nomor: state.nib[editingNIBIndex].nomor,
                file: state.nib[editingNIBIndex].file,
              }
            : undefined
        }
      />

      {/* Dokumen Aset Desa Modal */}
      <AddAnggaranModal
        open={openAset}
        onClose={() => {
          setOpenAset(false);
          setEditingAsetIndex(null);
        }}
        onSave={saveAset}
        title="Tambah Dokumen Pemanfaatan Aset Desa"
        namaLabel="Nama Dokumen"
        showNomor
        nomorLabel="Nomor Dokumen"
        initialData={
          editingAsetIndex !== null
            ? {
                id: state.dokumenAsetDesa[editingAsetIndex].id,
                tahun: state.dokumenAsetDesa[editingAsetIndex].tahun,
                nama: state.dokumenAsetDesa[editingAsetIndex].nama,
                nomor: state.dokumenAsetDesa[editingAsetIndex].nomor,
                file: state.dokumenAsetDesa[editingAsetIndex].file,
              }
            : undefined
        }
      />

      <SaveResultModal
        open={savedOpen}
        onClose={() => setSavedOpen(false)}
        title="Data Legalitas Tersimpan"
        autoCloseMs={1500}
      />

      <WarningModal
        open={showWarning}
        onClose={() => setShowWarning(false)}
        title="Gagal Menyimpan"
        message="Terjadi kesalahan saat menyimpan data legalitas. Silakan coba lagi."
      />

      {/* Confirm Delete Dialogs */}
      <ConfirmDialog
        open={confirmDeleteADOpen}
        onClose={() => setConfirmDeleteADOpen(false)}
        onConfirm={confirmDeleteAD}
        title="Hapus Anggaran Dasar"
        message="Apakah Anda yakin ingin menghapus dokumen Anggaran Dasar ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />

      <ConfirmDialog
        open={confirmDeleteARTOpen}
        onClose={() => setConfirmDeleteARTOpen(false)}
        onConfirm={confirmDeleteART}
        title="Hapus Anggaran Rumah Tangga"
        message="Apakah Anda yakin ingin menghapus dokumen Anggaran Rumah Tangga ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />

      <ConfirmDialog
        open={confirmDeleteAHUOpen}
        onClose={() => setConfirmDeleteAHUOpen(false)}
        onConfirm={confirmDeleteAHU}
        title="Hapus AHU Badan Hukum"
        message="Apakah Anda yakin ingin menghapus dokumen AHU Badan Hukum ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />

      <ConfirmDialog
        open={confirmDeleteNPWPOpen}
        onClose={() => setConfirmDeleteNPWPOpen(false)}
        onConfirm={confirmDeleteNPWP}
        title="Hapus NPWP"
        message="Apakah Anda yakin ingin menghapus dokumen NPWP ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />

      <ConfirmDialog
        open={confirmDeleteNIBOpen}
        onClose={() => setConfirmDeleteNIBOpen(false)}
        onConfirm={confirmDeleteNIB}
        title="Hapus NIB"
        message="Apakah Anda yakin ingin menghapus dokumen NIB ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />

      <ConfirmDialog
        open={confirmDeleteAsetOpen}
        onClose={() => setConfirmDeleteAsetOpen(false)}
        onConfirm={confirmDeleteAset}
        title="Hapus Dokumen Aset Desa"
        message="Apakah Anda yakin ingin menghapus dokumen Aset Desa ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />

      <ConfirmDialog
        open={confirmDeletePerdesOpen}
        onClose={() => setConfirmDeletePerdesOpen(false)}
        onConfirm={confirmDeletePerdes}
        title="Hapus Perdes Penyertaan Modal"
        message="Apakah Anda yakin ingin menghapus dokumen Perdes Penyertaan Modal ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
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
                  src={getFileUrl(fileToPreview)}
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
