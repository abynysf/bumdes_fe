import { useCallback, useState } from "react";
import Button from "../../components/ui/Button";
import { Table, type Column } from "../../components/ui/Table";
import AddActivityDocModal, {
  type ActivityDocPayload,
} from "../../components/modals/AddActivityDocModal";
import SaveResultModal from "../../components/modals/SaveResultModal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Eye, Download, Pencil, Trash2 } from "lucide-react";
import {
  useBusinessUnits,
  type ActivityDoc,
} from "../../contexts/BusinessUnitsContext";

// Helper function to check if string is URL
function isUrl(str: string): boolean {
  if (!str || str === "-") return false;
  try {
    const url = new URL(str);
    return Boolean(url.protocol && url.host);
  } catch {
    return false;
  }
}

// Helper function to format date from YYYY-MM-DD to DD/MM/YYYY
function formatDate(dateString: string): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
}

export default function DokumentasiKegiatanTab() {
  const { units, activityDocs, setActivityDocs } = useBusinessUnits();

  // Modal states
  const [openDocModal, setOpenDocModal] = useState(false);
  const [editingDocIndex, setEditingDocIndex] = useState<number | null>(null);
  const [savedOpen, setSavedOpen] = useState(false);

  // File preview and download states
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileToPreview, setFileToPreview] = useState<string>("");
  const [downloadConfirmOpen, setDownloadConfirmOpen] = useState(false);
  const [fileToDownload, setFileToDownload] = useState<string>("");

  // Confirm delete states
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // Save activity doc handler
  const saveActivityDoc = useCallback(
    (data: ActivityDocPayload) => {
      const payload: ActivityDoc = {
        unitNama: data.unitNama,
        tahun: new Date(data.tanggalUpload).getFullYear(),
        nama: data.nama,
        deskripsi: "", // Empty string for now
        file: data.file,
      };

      if (editingDocIndex !== null) {
        setActivityDocs((prev) =>
          prev.map((doc, idx) => (idx === editingDocIndex ? payload : doc))
        );
        setEditingDocIndex(null);
      } else {
        setActivityDocs((prev) => [...prev, payload]);
      }

      setOpenDocModal(false);
      setSavedOpen(true);
    },
    [editingDocIndex, setActivityDocs]
  );

  // Delete handler
  const handleDelete = useCallback((index: number) => {
    setDeleteIndex(index);
    setConfirmDeleteOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteIndex !== null) {
      setActivityDocs((prev) => prev.filter((_, idx) => idx !== deleteIndex));
      setDeleteIndex(null);
    }
  }, [deleteIndex, setActivityDocs]);

  // File handlers
  const handlePreviewFile = useCallback((file: string) => {
    setFileToPreview(file);
    setPreviewOpen(true);
  }, []);

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

  // Generate dropdown options from business units
  const unitUsahaOptions = units.map((unit) => ({
    value: unit.namaUnit,
    label: unit.namaUnit,
  }));

  // Prepare table data with index
  const tableData = activityDocs.map((doc, idx) => ({
    ...doc,
    _index: idx,
    tanggalUpload: formatDate(
      new Date(doc.tahun, 0, 1).toISOString().split("T")[0]
    ),
  }));

  // Table columns
  const columns: Column<(typeof tableData)[number]>[] = [
    {
      header: "Nama Dokumen",
      accessor: "nama",
      width: "w-64",
      align: "left",
    },
    {
      header: "Unit Usaha Terkait",
      accessor: "unitNama",
      width: "w-48",
      align: "left",
    },
    {
      header: "Tanggal Upload",
      accessor: "tanggalUpload",
      width: "w-32",
      align: "left",
    },
    {
      header: "Nama File",
      accessor: "file",
      cell: (row) => {
        if (!row.file || row.file === "-") {
          return <span className="text-neutral-400">-</span>;
        }
        return <span className="text-blue-600">{row.file}</span>;
      },
      width: "w-48",
    },
    {
      header: "Aksi",
      accessor: () => null,
      align: "right",
      cell: (row) => {
        const rowIndex = row._index;
        const hasFile = row.file && row.file !== "-";

        return (
          <div className="flex justify-end gap-1">
            {hasFile && (
              <>
                <button
                  type="button"
                  onClick={() => handlePreviewFile(row.file)}
                  className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                  title="Preview"
                >
                  <Eye className="h-4 w-4 text-blue-600" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadFile(row.file)}
                  className="inline-flex items-center rounded p-1.5 hover:bg-emerald-50"
                  title="Download"
                >
                  <Download className="h-4 w-4 text-emerald-600" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                setEditingDocIndex(rowIndex);
                setOpenDocModal(true);
              }}
              className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
              title="Edit"
            >
              <Pencil className="h-4 w-4 text-blue-600" />
            </button>

            <button
              type="button"
              onClick={() => handleDelete(rowIndex)}
              className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
              title="Hapus"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </button>
          </div>
        );
      },
      width: "w-32",
    },
  ];

  return (
    <>
      <div className="min-h-[600px] p-6">
        {/* Table */}
        <div className="mb-4">
          <Table
            data={tableData}
            columns={columns}
            emptyMessage="Tidak ada data yang ditambahkan"
            getRowKey={(_, index) => index}
          />
        </div>

        {/* Bottom Right Button */}
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setEditingDocIndex(null);
              setOpenDocModal(true);
            }}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            Tambah Dokumentasi
          </Button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AddActivityDocModal
        open={openDocModal}
        onClose={() => {
          setOpenDocModal(false);
          setEditingDocIndex(null);
        }}
        onSave={saveActivityDoc}
        title={
          editingDocIndex !== null
            ? "Edit Dokumen Kegiatan"
            : "Tambah Dokumen Kegiatan"
        }
        initialData={
          editingDocIndex !== null
            ? {
                unitNama: activityDocs[editingDocIndex]?.unitNama,
                nama: activityDocs[editingDocIndex]?.nama,
                tanggalUpload: new Date(
                  activityDocs[editingDocIndex]?.tahun ??
                    new Date().getFullYear(),
                  0,
                  1
                )
                  .toISOString()
                  .split("T")[0],
                file: activityDocs[editingDocIndex]?.file,
              }
            : undefined
        }
        unitUsahaOptions={unitUsahaOptions}
      />

      {/* Success Modal */}
      <SaveResultModal
        open={savedOpen}
        onClose={() => setSavedOpen(false)}
        title="Dokumen Kegiatan Tersimpan"
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
              Apakah Anda yakin ingin mengunduh file:{" "}
              <strong>{fileToDownload}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDownloadConfirmOpen(false);
                  setFileToDownload("");
                }}
                className="rounded-md bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-300"
              >
                Batal
              </button>
              <button
                onClick={confirmDownload}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
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

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Dokumen Kegiatan"
        message="Apakah Anda yakin ingin menghapus dokumen kegiatan ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />
    </>
  );
}
