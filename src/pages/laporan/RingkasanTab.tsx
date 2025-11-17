import { useCallback, useState } from "react";
import Button from "../../components/ui/Button";
import { Table, type Column } from "../../components/ui/Table";
import AddLabaRugiModal, {
  type LabaRugiPayload,
} from "../../components/modals/AddLabaRugiModal";
import AddHasilMusdesModal, {
  type HasilMusdesPayload,
} from "../../components/modals/AddHasilMusdesModal";
import SaveResultModal from "../../components/modals/SaveResultModal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Eye, Download, Pencil, Trash2, Printer } from "lucide-react";
import { useLaporan } from "../../contexts/LaporanContext";

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

// Helper function to format currency
function formatCurrency(value: number): string {
  return "Rp " + new Intl.NumberFormat("id-ID").format(value);
}

export default function RingkasanTab() {
  const { labaRugiData, setLabaRugiData, hasilMusdesData, setHasilMusdesData } =
    useLaporan();

  // Laba Rugi Modal states
  const [openLabaRugiModal, setOpenLabaRugiModal] = useState(false);
  const [editingLabaRugiIndex, setEditingLabaRugiIndex] = useState<
    number | null
  >(null);

  // Hasil Musdes Modal states
  const [openMusdesModal, setOpenMusdesModal] = useState(false);
  const [editingMusdesIndex, setEditingMusdesIndex] = useState<number | null>(
    null
  );

  // Success modal
  const [savedOpen, setSavedOpen] = useState(false);

  // Confirm delete states
  const [confirmDeleteLabaRugiOpen, setConfirmDeleteLabaRugiOpen] = useState(false);
  const [deleteLabaRugiIndex, setDeleteLabaRugiIndex] = useState<number | null>(null);
  const [confirmDeleteMusdesOpen, setConfirmDeleteMusdesOpen] = useState(false);
  const [deleteMusdesIndex, setDeleteMusdesIndex] = useState<number | null>(null);

  // File preview and download states (for Hasil Musdes)
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileToPreview, setFileToPreview] = useState<string>("");
  const [downloadConfirmOpen, setDownloadConfirmOpen] = useState(false);
  const [fileToDownload, setFileToDownload] = useState<string>("");

  // Save Laba Rugi handler
  const saveLabaRugi = useCallback(
    (data: LabaRugiPayload) => {
      if (editingLabaRugiIndex !== null) {
        setLabaRugiData((prev) =>
          prev.map((item, idx) => (idx === editingLabaRugiIndex ? data : item))
        );
        setEditingLabaRugiIndex(null);
      } else {
        setLabaRugiData((prev) => [...prev, data]);
      }
      setOpenLabaRugiModal(false);
      setSavedOpen(true);
    },
    [editingLabaRugiIndex, setLabaRugiData]
  );

  // Save Hasil Musdes handler
  const saveHasilMusdes = useCallback(
    (data: HasilMusdesPayload) => {
      if (editingMusdesIndex !== null) {
        setHasilMusdesData((prev) =>
          prev.map((item, idx) => (idx === editingMusdesIndex ? data : item))
        );
        setEditingMusdesIndex(null);
      } else {
        setHasilMusdesData((prev) => [...prev, data]);
      }
      setOpenMusdesModal(false);
      setSavedOpen(true);
    },
    [editingMusdesIndex, setHasilMusdesData]
  );

  // Delete handlers
  const handleDeleteLabaRugi = useCallback((index: number) => {
    setDeleteLabaRugiIndex(index);
    setConfirmDeleteLabaRugiOpen(true);
  }, []);

  const confirmDeleteLabaRugi = useCallback(() => {
    if (deleteLabaRugiIndex !== null) {
      setLabaRugiData((prev) =>
        prev.filter((_, idx) => idx !== deleteLabaRugiIndex)
      );
      setDeleteLabaRugiIndex(null);
    }
  }, [deleteLabaRugiIndex, setLabaRugiData]);

  const handleDeleteMusdes = useCallback((index: number) => {
    setDeleteMusdesIndex(index);
    setConfirmDeleteMusdesOpen(true);
  }, []);

  const confirmDeleteMusdes = useCallback(() => {
    if (deleteMusdesIndex !== null) {
      setHasilMusdesData((prev) =>
        prev.filter((_, idx) => idx !== deleteMusdesIndex)
      );
      setDeleteMusdesIndex(null);
    }
  }, [deleteMusdesIndex, setHasilMusdesData]);

  // File handlers (for Hasil Musdes Bukti PAD)
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

  // Print handler for Laba Rugi table
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Prepare Laba Rugi table data
  const labaRugiTableData = labaRugiData.map((item, idx) => ({
    ...item,
    _index: idx,
  }));

  // Laba Rugi Table columns
  const labaRugiColumns: Column<(typeof labaRugiTableData)[0]>[] = [
    {
      header: "Tahun",
      accessor: "tahun",
      width: "w-24",
    },
    {
      header: "Laba Kotor",
      accessor: "labaKotor",
      cell: (row) => formatCurrency(row.labaKotor),
      width: "w-40",
    },
    {
      header: "Beban Gaji",
      accessor: "bebanGaji",
      cell: (row) => formatCurrency(row.bebanGaji),
      width: "w-40",
    },
    {
      header: "Beban Lain-Lain",
      accessor: "bebanLainLain",
      cell: (row) => formatCurrency(row.bebanLainLain),
      width: "w-40",
    },
    {
      header: "Laba Bersih",
      accessor: "labaBersih",
      cell: (row) => (
        <span className="font-semibold">{formatCurrency(row.labaBersih)}</span>
      ),
      width: "w-40",
    },
    {
      header: "Aksi",
      accessor: () => null,
      align: "right",
      cell: (row) => {
        const rowIndex = row._index;
        return (
          <div className="flex justify-end gap-1">
            <button
              type="button"
              onClick={() => {
                setEditingLabaRugiIndex(rowIndex);
                setOpenLabaRugiModal(true);
              }}
              className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
              title="Edit"
            >
              <Pencil className="h-4 w-4 text-blue-600" />
            </button>

            <button
              type="button"
              onClick={() => handleDeleteLabaRugi(rowIndex)}
              className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
              title="Hapus"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </button>
          </div>
        );
      },
      width: "w-24",
    },
  ];

  // Prepare Hasil Musdes table data
  const hasilMusdesTableData = hasilMusdesData.map((item, idx) => ({
    ...item,
    _index: idx,
  }));

  // Hasil Musdes Table columns
  const hasilMusdesColumns: Column<(typeof hasilMusdesTableData)[0]>[] = [
    {
      header: "Tahun",
      accessor: "tahun",
      width: "w-24",
    },
    {
      header: "Laba Bersih",
      accessor: "labaBersih",
      cell: (row) => formatCurrency(row.labaBersih),
      width: "w-40",
    },
    {
      header: "Laba Ditahan",
      accessor: "labaDitahan",
      cell: (row) => formatCurrency(row.labaDitahan),
      width: "w-40",
    },
    {
      header: "PAD dari BUM Desa",
      accessor: "padDariBumDesa",
      cell: (row) => formatCurrency(row.padDariBumDesa),
      width: "w-40",
    },
    {
      header: "Bukti PAD",
      accessor: "buktiPad",
      cell: (row) => {
        if (!row.buktiPad || row.buktiPad === "-") {
          return <span className="text-neutral-400">-</span>;
        }
        return (
          <button
            type="button"
            onClick={() => handlePreviewFile(row.buktiPad)}
            className="text-blue-600 hover:underline"
          >
            {row.buktiPad}
          </button>
        );
      },
      width: "w-48",
    },
    {
      header: "Kegiatan PAD untuk Apa",
      accessor: "kegiatanPadUntukApa",
      width: "w-64",
    },
    {
      header: "Aksi",
      accessor: () => null,
      align: "right",
      cell: (row) => {
        const rowIndex = row._index;
        const hasFile = row.buktiPad && row.buktiPad !== "-";

        return (
          <div className="flex justify-end gap-1">
            {hasFile && (
              <>
                <button
                  type="button"
                  onClick={() => handlePreviewFile(row.buktiPad)}
                  className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                  title="Preview"
                >
                  <Eye className="h-4 w-4 text-blue-600" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadFile(row.buktiPad)}
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
                setEditingMusdesIndex(rowIndex);
                setOpenMusdesModal(true);
              }}
              className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
              title="Edit"
            >
              <Pencil className="h-4 w-4 text-blue-600" />
            </button>

            <button
              type="button"
              onClick={() => handleDeleteMusdes(rowIndex)}
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
      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            margin: 2cm 1.5cm;
            size: landscape;
          }

          /* Remove ALL rounded corners and shadows */
          * {
            border-radius: 0 !important;
            box-shadow: none !important;
            outline: none !important;
          }

          /* Remove background colors from wrapper elements */
          div, section {
            background-color: white !important;
            border: none !important;
          }

          /* Hide everything except the print content */
          body * {
            visibility: hidden;
          }

          /* Show only the first section (Ringkasan Laba Rugi) */
          .print-section,
          .print-section * {
            visibility: visible !important;
          }

          /* Hide buttons and controls */
          button,
          .no-print {
            display: none !important;
          }

          /* Hide the second section (Hasil Musdes) */
          .hide-on-print {
            display: none !important;
          }

          /* Position the print section */
          .print-section {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 20px !important;
          }

          /* Print title styling */
          .print-title {
            display: block !important;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 24px;
            color: #000;
          }

          /* Show empty message if no data */
          .empty-message {
            visibility: visible !important;
            display: block !important;
          }

          /* Table styling */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
          }

          thead {
            background-color: #059669 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          th {
            background-color: #059669 !important;
            color: white !important;
            font-weight: 600;
            padding: 12px 8px;
            text-align: left;
            border: 1px solid #333 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          td {
            padding: 10px 8px;
            border: 1px solid #333 !important;
            color: #000;
          }

          tbody tr {
            background-color: white !important;
          }

          tbody tr:nth-child(even) {
            background-color: #f9fafb !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Signature section */
          .print-signature {
            display: block !important;
            margin-top: 48px;
            page-break-inside: avoid;
          }

          .print-signature-header {
            text-align: right;
            margin-bottom: 24px;
            color: #000;
            font-size: 14px;
          }

          .print-signature-grid {
            display: flex;
            justify-content: space-between;
            gap: 40px;
          }

          .print-signature-box {
            flex: 1;
            text-align: center;
          }

          .print-signature-label {
            font-weight: 600;
            margin-bottom: 80px;
            color: #000;
            font-size: 14px;
          }

          .print-signature-line {
            border-bottom: 1px solid #000 !important;
            border-top: none !important;
            border-left: none !important;
            border-right: none !important;
            width: 200px;
            margin: 0 auto;
          }
        }
      `}</style>

      <div className="min-h-[600px] p-6">
        {/* Section 1: Ringkasan Laba Rugi Tahunan */}
        <div className="mb-8 print-section">
          {/* Print-only title */}
          <div className="print-title" style={{ display: "none" }}>
            Ringkasan Laba Rugi Tahunan
          </div>

          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Ringkasan Laba Rugi Tahunan
          </h2>
          <div className="mb-4">
            <Table
              data={labaRugiTableData}
              columns={labaRugiColumns}
              emptyMessage="Tidak ada data yang ditambahkan"
              getRowKey={(_, index) => index}
            />
          </div>

          {/* Print-only signature section */}
          <div className="print-signature" style={{ display: "none" }}>
            <div className="print-signature-header">
              Purwodadi,{" "}
              {new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <div className="print-signature-grid">
              <div className="print-signature-box">
                <div className="print-signature-label">
                  Mengetahui,
                  <br />
                  Direktur BUM Desa
                </div>
                <div className="print-signature-line"></div>
              </div>
              <div className="print-signature-box">
                <div className="print-signature-label">Sekretaris BUM Desa</div>
                <div className="print-signature-line"></div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-900"
            >
              <Printer className="h-4 w-4" />
              Cetak
            </button>
            <Button
              onClick={() => {
                setEditingLabaRugiIndex(null);
                setOpenLabaRugiModal(true);
              }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Tambah Data
            </Button>
          </div>
        </div>

        {/* Section 2: Hasil Musyawarah Desa Tahunan */}
        <div className="hide-on-print">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Hasil Musyawarah Desa Tahunan
          </h2>
          <div className="mb-4">
            <Table
              data={hasilMusdesTableData}
              columns={hasilMusdesColumns}
              emptyMessage="Tidak ada data yang ditambahkan"
              getRowKey={(_, index) => index}
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setEditingMusdesIndex(null);
                setOpenMusdesModal(true);
              }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Tambah Hasil Musdes
            </Button>
          </div>
        </div>
      </div>

      {/* Add/Edit Laba Rugi Modal */}
      <AddLabaRugiModal
        open={openLabaRugiModal}
        onClose={() => {
          setOpenLabaRugiModal(false);
          setEditingLabaRugiIndex(null);
        }}
        onSave={saveLabaRugi}
        title={
          editingLabaRugiIndex !== null
            ? "Edit Data Laba Rugi"
            : "Tambah Data Laba Rugi"
        }
        initialData={
          editingLabaRugiIndex !== null
            ? labaRugiData[editingLabaRugiIndex]
            : undefined
        }
      />

      {/* Add/Edit Hasil Musdes Modal */}
      <AddHasilMusdesModal
        open={openMusdesModal}
        onClose={() => {
          setOpenMusdesModal(false);
          setEditingMusdesIndex(null);
        }}
        onSave={saveHasilMusdes}
        title={
          editingMusdesIndex !== null
            ? "Edit Hasil Musdes"
            : "Tambah Hasil Musdes"
        }
        initialData={
          editingMusdesIndex !== null
            ? hasilMusdesData[editingMusdesIndex]
            : undefined
        }
      />

      {/* Success Modal */}
      <SaveResultModal
        open={savedOpen}
        onClose={() => setSavedOpen(false)}
        title="Data Tersimpan"
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

      {/* Confirm Delete Laba Rugi Dialog */}
      <ConfirmDialog
        open={confirmDeleteLabaRugiOpen}
        onClose={() => setConfirmDeleteLabaRugiOpen(false)}
        onConfirm={confirmDeleteLabaRugi}
        title="Hapus Data Laba Rugi"
        message="Apakah Anda yakin ingin menghapus data laba rugi ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />

      {/* Confirm Delete Hasil Musdes Dialog */}
      <ConfirmDialog
        open={confirmDeleteMusdesOpen}
        onClose={() => setConfirmDeleteMusdesOpen(false)}
        onConfirm={confirmDeleteMusdes}
        title="Hapus Hasil Musyawarah Desa"
        message="Apakah Anda yakin ingin menghapus data hasil musyawarah desa ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />
    </>
  );
}
