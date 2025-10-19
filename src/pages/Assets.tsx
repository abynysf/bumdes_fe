import { useCallback, useReducer, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import Button from "../components/ui/Button";
import { Table, type Column } from "../components/ui/Table";
import AddAssetModal, {
  type AssetPayload,
} from "../components/modals/AddAssetModal";
import SaveResultModal from "../components/modals/SaveResultModal";
import { useIsMobile } from "../hooks";
import {
  Download,
  Eye,
  Pencil,
  Trash2,
  FileDown,
  Printer,
  DollarSign,
} from "lucide-react";

/* ===========================
 * Types
 * =========================== */

type AssetInventaris = {
  jenisInventaris: string;
  nomorInventaris: string;
  tanggalPembelian: number | "";
  unit: number | "";
  hargaSatuan: number | "";
  hargaPerolehan: number | "";
  umurEkonomis: number | "";
  buktiPembelian: string;
};

type AssetState = {
  assets: AssetInventaris[];
};

/* ===========================
 * Initials
 * =========================== */

const INITIAL: AssetState = {
  assets: [],
};

/* ===========================
 * Utils
 * =========================== */

function isUrl(value: string): boolean {
  try {
    if (!value || !value.trim() || value === "-") return false;
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
  return "Rp " + new Intl.NumberFormat("id-ID").format(Number(value));
}

function formatYear(year: number | ""): string {
  if (year === "" || year === undefined || year === null) {
    return "-";
  }
  return String(year);
}

/* ===========================
 * Reducer
 * =========================== */

type Action =
  | { type: "asset/add"; payload: AssetInventaris }
  | { type: "asset/update"; index: number; payload: AssetInventaris }
  | { type: "asset/remove"; index: number }
  | { type: "reset" };

function reducer(state: AssetState, action: Action): AssetState {
  switch (action.type) {
    case "asset/add":
      return {
        ...state,
        assets: [...state.assets, action.payload],
      };

    case "asset/update":
      return {
        ...state,
        assets: state.assets.map((item, i) =>
          i === action.index ? action.payload : item
        ),
      };

    case "asset/remove":
      return {
        ...state,
        assets: state.assets.filter((_, i) => i !== action.index),
      };

    case "reset":
      return INITIAL;

    default:
      return state;
  }
}

/* ===========================
 * Component
 * =========================== */

export default function Assets() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const [state, dispatch] = useReducer(reducer, INITIAL);

  // Modal states
  const [openAssetModal, setOpenAssetModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [savedOpen, setSavedOpen] = useState(false);

  // File preview and download states
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileToPreview, setFileToPreview] = useState<string>("");
  const [downloadConfirmOpen, setDownloadConfirmOpen] = useState(false);
  const [fileToDownload, setFileToDownload] = useState<string>("");

  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Calculate total asset value
  const calculateTotal = useCallback((): number => {
    return state.assets.reduce((sum, asset) => {
      const value =
        typeof asset.hargaPerolehan === "number" ? asset.hargaPerolehan : 0;
      return sum + value;
    }, 0);
  }, [state.assets]);

  // Save asset handler
  const saveAsset = useCallback(
    (data: AssetPayload) => {
      const payload: AssetInventaris = {
        jenisInventaris: data.jenisInventaris,
        nomorInventaris: data.nomorInventaris,
        tanggalPembelian: data.tanggalPembelian,
        unit: data.unit,
        hargaSatuan: data.hargaSatuan,
        hargaPerolehan: data.hargaPerolehan,
        umurEkonomis: data.umurEkonomis,
        buktiPembelian: data.buktiPembelian || "-",
      };

      if (editingIndex !== null) {
        dispatch({ type: "asset/update", index: editingIndex, payload });
        setEditingIndex(null);
      } else {
        dispatch({ type: "asset/add", payload });
      }

      setOpenAssetModal(false);
      setSavedOpen(true);
    },
    [editingIndex]
  );

  // File preview handler
  const handlePreviewFile = useCallback((file: string) => {
    setFileToPreview(file);
    setPreviewOpen(true);
  }, []);

  // File download handlers
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

  // Export to CSV
  const exportToCSV = useCallback(() => {
    if (state.assets.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }

    const headers = [
      "No",
      "Jenis Inventaris",
      "Nomor Inventaris",
      "Tahun Pembelian",
      "Unit",
      "Harga Satuan",
      "Harga Perolehan",
      "Umur Ekonomis (Bulan)",
      "Bukti",
    ];

    const rows = state.assets.map((asset, index) => [
      index + 1,
      asset.jenisInventaris,
      asset.nomorInventaris,
      formatYear(asset.tanggalPembelian),
      asset.unit,
      asset.hargaSatuan,
      asset.hargaPerolehan,
      asset.umurEkonomis,
      asset.buktiPembelian || "-",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `aset-bumdes-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [state.assets]);

  // Export to PDF (using print)
  const exportToPDF = useCallback(() => {
    window.print();
  }, []);

  // Add row numbers to data for table display
  const tableData = state.assets.map((asset, idx) => ({
    ...asset,
    _index: idx,
  }));

  // Table columns definition
  const columns: Column<(typeof tableData)[0]>[] = [
    {
      header: "No",
      accessor: "_index",
      cell: (row) => row._index + 1,
      width: "w-16",
      align: "center",
    },
    {
      header: "Jenis Inventaris",
      accessor: "jenisInventaris",
      width: "w-48",
    },
    {
      header: "Nomor Inventaris",
      accessor: "nomorInventaris",
      width: "w-40",
    },
    {
      header: "Tahun Pembelian",
      accessor: "tanggalPembelian",
      cell: (row) => formatYear(row.tanggalPembelian),
      width: "w-32",
      hideOnMobile: true,
    },
    {
      header: "Unit",
      accessor: "unit",
      width: "w-20",
      align: "center",
    },
    {
      header: "Harga Perolehan",
      accessor: "hargaPerolehan",
      cell: (row) => formatCurrency(row.hargaPerolehan),
      width: "w-40",
    },
    {
      header: "Bukti",
      accessor: "buktiPembelian",
      cell: (row) => {
        const file = row.buktiPembelian;
        if (!file || file === "-") {
          return <span className="text-neutral-400">-</span>;
        }
        if (isUrl(file)) {
          return (
            <a
              href={file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              Lihat
            </a>
          );
        }
        return <span className="text-neutral-600">{file}</span>;
      },
      width: "w-24",
      hideOnMobile: true,
    },
    {
      header: "Aksi",
      accessor: () => null,
      cell: (row) => {
        const rowIndex = row._index;
        return (
          <div className="flex justify-end gap-1">
            {row.buktiPembelian && row.buktiPembelian !== "-" && (
              <>
                <button
                  type="button"
                  className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                  onClick={() => handlePreviewFile(row.buktiPembelian)}
                  title="Preview"
                  aria-label="Preview file"
                >
                  <Eye className="h-4 w-4 text-blue-600" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadFile(row.buktiPembelian)}
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
                setEditingIndex(rowIndex);
                setOpenAssetModal(true);
              }}
              className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
              title="Edit"
              aria-label="Edit asset"
            >
              <Pencil className="h-4 w-4 text-blue-600" />
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
              onClick={() => {
                if (confirm("Hapus aset ini?")) {
                  dispatch({ type: "asset/remove", index: rowIndex });
                }
              }}
              title="Hapus"
              aria-label="Hapus asset"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </button>
          </div>
        );
      },
      width: "w-40",
      align: "right",
    },
  ];

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            margin: 1cm;
          }

          /* Hide sidebar and navigation */
          aside,
          nav,
          header[class*="top"],
          button {
            display: none !important;
          }

          /* Reset body and html for print */
          html, body {
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Show main content */
          body * {
            visibility: hidden;
          }

          main,
          main * {
            visibility: visible !important;
          }

          main {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            overflow: visible !important;
          }

          /* Hide buttons in main content */
          main button {
            display: none !important;
            visibility: hidden !important;
          }

          /* Make backgrounds print-friendly */
          .bg-gradient-to-r {
            background: white !important;
            color: #000 !important;
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }

          .text-white,
          .text-blue-100,
          .text-blue-600,
          .text-blue-700 {
            color: #000 !important;
          }

          /* Ensure table is visible */
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            page-break-inside: auto;
          }

          thead {
            display: table-header-group;
          }

          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }

          th, td {
            border: 1px solid #ddd !important;
            padding: 8px !important;
          }

          /* Hide last two columns (Bukti and Aksi) */
          td:last-child,
          th:last-child,
          td:nth-last-child(2),
          th:nth-last-child(2) {
            display: none !important;
          }
        }
      `}</style>

      <div className="flex h-screen overflow-hidden bg-neutral-50">
        <Sidebar
          isOpen={sidebarOpen || !isMobile}
          onClose={handleSidebarClose}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto">
            <section className="bg-neutral-50 p-4 sm:p-6 lg:p-8">
              {/* Header Card with Total */}
              <div className="mb-6 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 p-8 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-medium text-blue-100">
                      Total Nilai Aset
                    </h2>
                    <p className="mt-2 text-4xl font-bold text-white">
                      {formatCurrency(calculateTotal())}
                    </p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Data Table Card */}
              <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <h1 className="text-2xl font-bold text-neutral-900">
                    Aset BUM Desa
                  </h1>
                </div>

                {/* Table */}
                <div className="mb-4">
                  <Table
                    data={tableData}
                    columns={columns}
                    emptyMessage="Tidak ada data yang ditambahkan"
                    getRowKey={(_, index) => index}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={exportToCSV}
                    className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    <FileDown className="h-4 w-4" />
                    Unduh CSV
                  </button>
                  <button
                    type="button"
                    onClick={exportToPDF}
                    className="inline-flex items-center gap-2 rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-700 focus:ring-offset-2"
                  >
                    <Printer className="h-4 w-4" />
                    Cetak PDF
                  </button>
                  <Button
                    onClick={() => {
                      setEditingIndex(null);
                      setOpenAssetModal(true);
                    }}
                  >
                    Data
                  </Button>
                </div>
              </div>
            </section>
          </main>
        </div>

        {/* Modals */}
        <AddAssetModal
          open={openAssetModal}
          onClose={() => {
            setOpenAssetModal(false);
            setEditingIndex(null);
          }}
          onSave={saveAsset}
          initialData={
            editingIndex !== null
              ? {
                  jenisInventaris: state.assets[editingIndex].jenisInventaris,
                  nomorInventaris: state.assets[editingIndex].nomorInventaris,
                  tanggalPembelian: state.assets[editingIndex].tanggalPembelian,
                  unit: state.assets[editingIndex].unit,
                  hargaSatuan: state.assets[editingIndex].hargaSatuan,
                  hargaPerolehan: state.assets[editingIndex].hargaPerolehan,
                  umurEkonomis: state.assets[editingIndex].umurEkonomis,
                  buktiPembelian: state.assets[editingIndex].buktiPembelian,
                }
              : undefined
          }
        />

        <SaveResultModal
          open={savedOpen}
          onClose={() => setSavedOpen(false)}
          title="Aset Tersimpan"
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
    </>
  );
}
