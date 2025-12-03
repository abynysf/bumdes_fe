import { useCallback, useState } from "react";
import Button from "../../components/ui/Button";
import DataCard from "../../components/ui/DataCard";
import { Download, Eye, Pencil, Trash2 } from "lucide-react";
import AddPengurusBUMModal from "../../components/modals/struktur/AddPengurusBUMModal";
import AddStrukturDokumenModal from "../../components/modals/struktur/AddStrukturDokumenModal";
import SaveResultModal from "../../components/modals/SaveResultModal";
import WarningModal from "../../components/modals/WarningModal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import {
  useDashboard,
  type PengurusBUM,
  type SKPengawas,
  type SKDirektur,
  type SKPegawai,
  type SKPengurus,
  type BeritaAcaraBUM,
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

function formatCurrency(value: number | "" | string | undefined): string {
  if (value === "" || value === undefined) return "-";
  return "Rp " + new Intl.NumberFormat("id-ID").format(Number(value));
}

function formatPeriode(periode?: string, tahun?: string): string {
  if (tahun) return tahun;
  if (!periode) return "-";
  // Convert "2025-11-01–2025-11-27" to "2025 sampai 2025"
  const [awal, akhir] = periode.split("–");
  if (awal && akhir) {
    return `${awal.slice(0, 4)} sampai ${akhir.slice(0, 4)}`;
  }
  return periode;
}


/**
 * ===========================
 * Component
 * ===========================
 */

export default function StrukturTab() {
  const {
    strukturState: state,
    strukturDispatch: dispatch,
    isLoading: isDataLoading,
    saveStruktur,
  } = useDashboard();

  // Modal flags
  const [openPengurus, setOpenPengurus] = useState(false);
  const [openSKPengawas, setOpenSKPengawas] = useState(false);
  const [openSKDirektur, setOpenSKDirektur] = useState(false);
  const [openSKPegawai, setOpenSKPegawai] = useState(false);
  const [openSKPengurus, setOpenSKPengurus] = useState(false);
  const [openBA, setOpenBA] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Confirm delete states
  const [confirmDeletePengurusOpen, setConfirmDeletePengurusOpen] =
    useState(false);
  const [deletePengurusIndex, setDeletePengurusIndex] = useState<number | null>(
    null
  );
  const [confirmDeleteSKPengawasOpen, setConfirmDeleteSKPengawasOpen] =
    useState(false);
  const [deleteSKPengawasIndex, setDeleteSKPengawasIndex] = useState<
    number | null
  >(null);
  const [confirmDeleteSKDirekturOpen, setConfirmDeleteSKDirekturOpen] =
    useState(false);
  const [deleteSKDirekturIndex, setDeleteSKDirekturIndex] = useState<
    number | null
  >(null);
  const [confirmDeleteSKPegawaiOpen, setConfirmDeleteSKPegawaiOpen] =
    useState(false);
  const [deleteSKPegawaiIndex, setDeleteSKPegawaiIndex] = useState<
    number | null
  >(null);
  const [confirmDeleteSKPengurusOpen, setConfirmDeleteSKPengurusOpen] =
    useState(false);
  const [deleteSKPengurusIndex, setDeleteSKPengurusIndex] = useState<
    number | null
  >(null);
  const [confirmDeleteBAOpen, setConfirmDeleteBAOpen] = useState(false);
  const [deleteBAIndex, setDeleteBAIndex] = useState<number | null>(null);

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
  const downloadFile = useCallback((file: string) => {
    const url = getFileUrl(file);
    if (url) {
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
      const success = await saveStruktur();
      if (success) {
        setSavedOpen(true);
      } else {
        setShowWarning(true);
      }
    } catch (error) {
      console.error("Save error:", error);
      setShowWarning(true);
    } finally {
      setIsSaving(false);
    }
  }, [saveStruktur]);

  type PersonDataPayload = {
    id?: number;
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
        id: p.id,
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

  // Delete handlers
  const handleDeletePengurus = useCallback((index: number) => {
    setDeletePengurusIndex(index);
    setConfirmDeletePengurusOpen(true);
  }, []);

  const confirmDeletePengurus = useCallback(() => {
    if (deletePengurusIndex !== null) {
      dispatch({ type: "pengurus/remove", index: deletePengurusIndex });
      setDeletePengurusIndex(null);
    }
  }, [deletePengurusIndex]);

  const handleDeleteSKPengawas = useCallback((index: number) => {
    setDeleteSKPengawasIndex(index);
    setConfirmDeleteSKPengawasOpen(true);
  }, []);

  const confirmDeleteSKPengawas = useCallback(() => {
    if (deleteSKPengawasIndex !== null) {
      dispatch({ type: "skPengawas/remove", index: deleteSKPengawasIndex });
      setDeleteSKPengawasIndex(null);
    }
  }, [deleteSKPengawasIndex]);

  const handleDeleteSKDirektur = useCallback((index: number) => {
    setDeleteSKDirekturIndex(index);
    setConfirmDeleteSKDirekturOpen(true);
  }, []);

  const confirmDeleteSKDirektur = useCallback(() => {
    if (deleteSKDirekturIndex !== null) {
      dispatch({ type: "skDirektur/remove", index: deleteSKDirekturIndex });
      setDeleteSKDirekturIndex(null);
    }
  }, [deleteSKDirekturIndex]);

  const handleDeleteSKPegawai = useCallback((index: number) => {
    setDeleteSKPegawaiIndex(index);
    setConfirmDeleteSKPegawaiOpen(true);
  }, []);

  const confirmDeleteSKPegawai = useCallback(() => {
    if (deleteSKPegawaiIndex !== null) {
      dispatch({ type: "skPegawai/remove", index: deleteSKPegawaiIndex });
      setDeleteSKPegawaiIndex(null);
    }
  }, [deleteSKPegawaiIndex]);

  const handleDeleteSKPengurus = useCallback((index: number) => {
    setDeleteSKPengurusIndex(index);
    setConfirmDeleteSKPengurusOpen(true);
  }, []);

  const confirmDeleteSKPengurus = useCallback(() => {
    if (deleteSKPengurusIndex !== null) {
      dispatch({ type: "skPengurus/remove", index: deleteSKPengurusIndex });
      setDeleteSKPengurusIndex(null);
    }
  }, [deleteSKPengurusIndex]);

  const handleDeleteBA = useCallback((index: number) => {
    setDeleteBAIndex(index);
    setConfirmDeleteBAOpen(true);
  }, []);

  const confirmDeleteBA = useCallback(() => {
    if (deleteBAIndex !== null) {
      dispatch({ type: "ba/remove", index: deleteBAIndex });
      setDeleteBAIndex(null);
    }
  }, [deleteBAIndex]);

  // Show loading spinner while data is being fetched
  if (isDataLoading) {
    return (
      <div className="flex items-center justify-center p-12 min-h-screen bg-white">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto mb-2" />
          <p className="text-neutral-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* Main content */}
      <div className="col-span-full space-y-4">
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
                        {formatCurrency(p.gaji)}
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
                            onClick={() => handleDeletePengurus(i)}
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
                        {formatPeriode(d.periode, d.tahun)}
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
                            onClick={() => handleDeleteSKPengawas(i)}
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
                        {formatPeriode(d.periode, d.tahun)}
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
                            onClick={() => handleDeleteSKDirektur(i)}
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
                        {formatPeriode(d.periode, d.tahun)}
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
                            onClick={() => handleDeleteSKPegawai(i)}
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
                            onClick={() => handleDeleteSKPengurus(i)}
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
                            onClick={() => handleDeleteBA(i)}
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
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? "Menyimpan..." : "Update"}
        </Button>
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
                id: state.pengurus[editingPengurusIndex].id,
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
        type="error"
        title="Gagal Menyimpan"
        message="Terjadi kesalahan saat menyimpan data. Silakan coba lagi."
      />

      {/* Confirm Delete Dialogs */}
      <ConfirmDialog
        open={confirmDeletePengurusOpen}
        onClose={() => setConfirmDeletePengurusOpen(false)}
        onConfirm={confirmDeletePengurus}
        title="Hapus Pengurus"
        message="Apakah Anda yakin ingin menghapus data pengurus ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />

      <ConfirmDialog
        open={confirmDeleteSKPengawasOpen}
        onClose={() => setConfirmDeleteSKPengawasOpen(false)}
        onConfirm={confirmDeleteSKPengawas}
        title="Hapus SK Pengawas"
        message="Apakah Anda yakin ingin menghapus dokumen SK Pengawas ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />

      <ConfirmDialog
        open={confirmDeleteSKDirekturOpen}
        onClose={() => setConfirmDeleteSKDirekturOpen(false)}
        onConfirm={confirmDeleteSKDirektur}
        title="Hapus SK Direktur"
        message="Apakah Anda yakin ingin menghapus dokumen SK Direktur ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />

      <ConfirmDialog
        open={confirmDeleteSKPegawaiOpen}
        onClose={() => setConfirmDeleteSKPegawaiOpen(false)}
        onConfirm={confirmDeleteSKPegawai}
        title="Hapus SK Pegawai"
        message="Apakah Anda yakin ingin menghapus dokumen SK Pegawai ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />

      <ConfirmDialog
        open={confirmDeleteSKPengurusOpen}
        onClose={() => setConfirmDeleteSKPengurusOpen(false)}
        onConfirm={confirmDeleteSKPengurus}
        title="Hapus SK Pengurus"
        message="Apakah Anda yakin ingin menghapus dokumen SK Pengurus ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />

      <ConfirmDialog
        open={confirmDeleteBAOpen}
        onClose={() => setConfirmDeleteBAOpen(false)}
        onConfirm={confirmDeleteBA}
        title="Hapus Berita Acara"
        message="Apakah Anda yakin ingin menghapus dokumen Berita Acara ini? Tindakan ini tidak dapat dibatalkan."
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
