import { useCallback, useState } from "react";
import Button from "../../components/ui/Button";
import { Table, type Column } from "../../components/ui/Table";
import AddSOPModal, {
  type SOPPayload,
} from "../../components/modals/AddSOPModal";
import SaveResultModal from "../../components/modals/SaveResultModal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Eye, Download, Pencil, Trash2 } from "lucide-react";
import {
  useBusinessUnits,
  type SOPDocument,
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

export default function SOPUnitUsahaTab() {
  const { units, sopDocuments, setSopDocuments } = useBusinessUnits();

  // Modal states
  const [openSOPModal, setOpenSOPModal] = useState(false);
  const [editingSOPIndex, setEditingSOPIndex] = useState<number | null>(null);
  const [savedOpen, setSavedOpen] = useState(false);

  // File preview and download states
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileToPreview, setFileToPreview] = useState<string>("");
  const [downloadConfirmOpen, setDownloadConfirmOpen] = useState(false);
  const [fileToDownload, setFileToDownload] = useState<string>("");

  // Confirm delete states
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // Save SOP handler
  const saveSOP = useCallback(
    (data: SOPPayload) => {
      const payload: SOPDocument = {
        unitNama: data.unitNama,
        tahun: new Date(data.tanggalDibuat).getFullYear(),
        nama: data.nama,
        file: data.file,
      };

      if (editingSOPIndex !== null) {
        setSopDocuments((prev) =>
          prev.map((sop, idx) => (idx === editingSOPIndex ? payload : sop))
        );
        setEditingSOPIndex(null);
      } else {
        setSopDocuments((prev) => [...prev, payload]);
      }

      setOpenSOPModal(false);
      setSavedOpen(true);
    },
    [editingSOPIndex, setSopDocuments]
  );

  // Delete handler
  const handleDelete = useCallback((index: number) => {
    setDeleteIndex(index);
    setConfirmDeleteOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteIndex !== null) {
      setSopDocuments((prev) => prev.filter((_, idx) => idx !== deleteIndex));
      setDeleteIndex(null);
    }
  }, [deleteIndex, setSopDocuments]);

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

  // Generate unit usaha options for SOP dropdown
  const unitUsahaOptions = units.map((unit) => ({
    value: unit.namaUnit,
    label: unit.namaUnit,
  }));

  // SOP Table data with row numbers
  const sopTableData = sopDocuments.map((sop, idx) => ({
    ...sop,
    _index: idx,
  }));

  // SOP Table columns definition
  const sopColumns: Column<(typeof sopTableData)[0]>[] = [
    {
      header: "No",
      accessor: "_index",
      cell: (row) => row._index + 1,
      width: "w-16",
      align: "left",
    },
    {
      header: "Nama SOP",
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
      header: "Tahun",
      accessor: "tahun",
      width: "w-24",
      align: "left",
    },
    {
      header: "Nama File",
      accessor: "file",
      cell: (row) => {
        if (!row.file || row.file === "-") {
          return <span className="text-neutral-400">-</span>;
        }
        return (
          <button
            type="button"
            onClick={() => handlePreviewFile(row.file)}
            className="text-blue-600 hover:underline"
          >
            {row.file}
          </button>
        );
      },
      width: "w-48",
    },
    {
      header: "Aksi",
      accessor: () => null,
      align: "right",
      cell: (row) => {
        const rowIndex = row._index;
        return (
          <div className="flex justify-end gap-1">
            {row.file && row.file !== "-" && (
              <>
                <button
                  type="button"
                  className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                  onClick={() => handlePreviewFile(row.file)}
                  title="Preview"
                >
                  <Eye className="h-4 w-4 text-blue-600" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadFile(row.file)}
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
                setEditingSOPIndex(rowIndex);
                setOpenSOPModal(true);
              }}
              className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
              title="Edit"
            >
              <Pencil className="h-4 w-4 text-blue-600" />
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
              onClick={() => handleDelete(rowIndex)}
              title="Hapus"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </button>
          </div>
        );
      },
      width: "w-40",
    },
  ];

  return (
    <>
      <div className="min-h-[600px] p-6">
        {/* SOP Table */}
        <div className="mb-4">
          <Table
            data={sopTableData}
            columns={sopColumns}
            emptyMessage="Tidak ada data yang ditambahkan"
            getRowKey={(_, index) => index}
          />
        </div>

        {/* Add SOP button */}
        <div className="flex items-center justify-end">
          <Button
            onClick={() => {
              setEditingSOPIndex(null);
              setOpenSOPModal(true);
            }}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            Tambah SOP
          </Button>
        </div>
      </div>

      {/* Modals */}
      <AddSOPModal
        open={openSOPModal}
        onClose={() => {
          setOpenSOPModal(false);
          setEditingSOPIndex(null);
        }}
        onSave={saveSOP}
        unitUsahaOptions={unitUsahaOptions}
        title={editingSOPIndex !== null ? "Edit SOP" : "Tambah SOP Baru"}
        initialData={
          editingSOPIndex !== null && sopDocuments[editingSOPIndex]
            ? {
                unitNama: sopDocuments[editingSOPIndex].unitNama,
                nama: sopDocuments[editingSOPIndex].nama,
                tanggalDibuat: `${sopDocuments[editingSOPIndex].tahun}-01-01`,
                file: sopDocuments[editingSOPIndex].file,
              }
            : undefined
        }
      />

      <SaveResultModal
        open={savedOpen}
        onClose={() => setSavedOpen(false)}
        title="SOP Tersimpan"
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
            <h3 className="mb-4 text-lg font-semibold">Unduh Dokumen</h3>
            <p className="mb-6 text-sm text-neutral-600">
              Apakah Anda yakin ingin mengunduh dokumen ini?
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
        title="Hapus SOP"
        message="Apakah Anda yakin ingin menghapus SOP ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />
    </>
  );
}
