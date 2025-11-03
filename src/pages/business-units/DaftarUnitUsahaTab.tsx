import { useCallback, useState } from "react";
import Button from "../../components/ui/Button";
import { Table, type Column } from "../../components/ui/Table";
import AddBusinessUnitModal, {
  type BusinessUnitPayload,
} from "../../components/modals/AddBusinessUnitModal";
import SaveResultModal from "../../components/modals/SaveResultModal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { FileDown, Printer, Pencil, Trash2 } from "lucide-react";
import { useBusinessUnits } from "../../contexts/BusinessUnitsContext";

// Helper functions
function formatCurrency(value: number | ""): string {
  if (value === "") return "-";
  return "Rp " + new Intl.NumberFormat("id-ID").format(Number(value));
}

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

function getCurrentDateString(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function DaftarUnitUsahaTab() {
  const { units, setUnits } = useBusinessUnits();

  // Modal states
  const [openUnitModal, setOpenUnitModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [savedOpen, setSavedOpen] = useState(false);

  // Confirm delete states
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // Save business unit handler
  const saveUnit = useCallback(
    (data: BusinessUnitPayload) => {
      const payload = {
        namaUnit: data.namaUnit,
        jenisUsaha: data.jenisUsaha,
        detailUsaha: data.detailUsaha,
        tanggalBerdiri: data.tanggalBerdiri,
        totalModal: data.totalModal,
        omzetTahunIni: data.omzetTahunIni,
        status: data.status,
        terakhirUpdate: getCurrentDateString(),
      };

      if (editingIndex !== null) {
        // Update existing
        setUnits((prev) =>
          prev.map((unit, idx) => (idx === editingIndex ? payload : unit))
        );
        setEditingIndex(null);
      } else {
        // Add new
        setUnits((prev) => [...prev, payload]);
      }

      setOpenUnitModal(false);
      setSavedOpen(true);
    },
    [editingIndex, setUnits]
  );

  // Delete handler
  const handleDelete = useCallback((index: number) => {
    setDeleteIndex(index);
    setConfirmDeleteOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteIndex !== null) {
      setUnits((prev) => prev.filter((_, idx) => idx !== deleteIndex));
      setDeleteIndex(null);
    }
  }, [deleteIndex, setUnits]);

  // Export to CSV
  const exportToCSV = useCallback(() => {
    if (units.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }

    const headers = [
      "No",
      "Nama Unit",
      "Jenis Usaha",
      "Detail Usaha",
      "Tanggal Berdiri",
      "Total Modal",
      "Omzet Tahun Ini",
      "Status",
      "Terakhir Update",
    ];

    const rows = units.map((unit, index) => [
      index + 1,
      unit.namaUnit,
      unit.jenisUsaha,
      unit.detailUsaha,
      formatDate(unit.tanggalBerdiri),
      unit.totalModal,
      unit.omzetTahunIni,
      unit.status,
      unit.terakhirUpdate,
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
      `unit-usaha-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [units]);

  // Export to PDF
  const exportToPDF = useCallback(() => {
    window.print();
  }, []);

  // Table data with row numbers
  const tableData = units.map((unit, idx) => ({
    ...unit,
    _index: idx,
  }));

  // Table columns definition
  const columns: Column<(typeof tableData)[0]>[] = [
    {
      header: "No",
      accessor: "_index",
      cell: (row) => row._index + 1,
      width: "w-16",
      align: "left",
    },
    {
      header: "Nama Unit",
      accessor: "namaUnit",
      width: "w-46",
      align: "left",
    },
    {
      header: "Jenis Usaha",
      accessor: "jenisUsaha",
      width: "w-46",
      align: "left",
    },
    {
      header: "Detail Usaha",
      accessor: "detailUsaha",
      width: "w-64",
    },
    {
      header: "Tanggal Berdiri",
      accessor: "tanggalBerdiri",
      cell: (row) => formatDate(row.tanggalBerdiri),
      width: "w-40",
      align: "left",
    },
    {
      header: "Total Modal",
      accessor: "totalModal",
      cell: (row) => formatCurrency(row.totalModal),
      width: "w-40",
      align: "left",
      hideOnMobile: true,
    },
    {
      header: "Omzet Tahun Ini",
      accessor: "omzetTahunIni",
      cell: (row) => formatCurrency(row.omzetTahunIni),
      width: "w-40",
      align: "left",
      hideOnMobile: true,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
            row.status === "Aktif"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-neutral-100 text-neutral-700"
          }`}
        >
          {row.status}
        </span>
      ),
      width: "w-28",
      align: "left",
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
                setEditingIndex(rowIndex);
                setOpenUnitModal(true);
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
      width: "w-32",
    },
    {
      header: "Terakhir Update",
      accessor: "terakhirUpdate",
      width: "w-40",
      hideOnMobile: true,
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

          /* Remove ALL rounded corners and shadows from EVERYTHING */
          * {
            border-radius: 0 !important;
            box-shadow: none !important;
          }

          /* Remove borders from container elements */
          div, section, main {
            border: none !important;
          }

          /* Hide sidebar, navigation, and buttons */
          aside,
          nav,
          header,
          button,
          .no-print {
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

          /* Show only printable content */
          body * {
            visibility: hidden;
          }

          main,
          main *,
          .print-only,
          .print-only * {
            visibility: visible !important;
          }

          main {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            overflow: visible !important;
          }

          /* Print document title */
          .print-only {
            display: block !important;
          }

          .print-title {
            text-align: center;
            font-size: 18pt;
            font-weight: bold;
            margin-bottom: 24px;
            color: #000 !important;
          }

          /* Table styling */
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            page-break-inside: auto;
            font-size: 9pt;
            margin-bottom: 24px;
          }

          thead {
            display: table-header-group;
            background-color: #059669 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          thead th {
            background-color: #059669 !important;
            color: white !important;
            font-weight: bold !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }

          th, td {
            border: 1px solid #333 !important;
            padding: 6px 4px !important;
            text-align: left;
          }

          /* Hide Aksi column */
          table th:nth-last-child(2),
          table td:nth-last-child(2) {
            display: none !important;
          }

          /* Hide Terakhir Update column */
          table th:last-child,
          table td:last-child {
            display: none !important;
          }

          /* Summary section */
          .print-summary {
            display: flex !important;
            justify-content: space-between;
            margin-bottom: 24px;
            font-size: 11pt;
            font-weight: bold;
          }

          /* Signature section */
          .print-signature {
            margin-top: 32px;
            page-break-inside: avoid;
          }

          .print-signature-header {
            text-align: right;
            margin-bottom: 16px;
            font-size: 11pt;
          }

          .print-signature-grid {
            display: flex;
            justify-content: space-between;
            margin-top: 24px;
          }

          .print-signature-box {
            width: 45%;
            text-align: center;
          }

          .print-signature-label {
            margin-bottom: 80px;
            font-size: 11pt;
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
        {/* Print-only Title */}
        <div className="print-only print-title" style={{ display: "none" }}>
          Laporan Unit Usaha BUM Desa
        </div>

        <div className="mb-4">
          <Table
            data={tableData}
            columns={columns}
            emptyMessage="Tidak ada data yang ditambahkan"
            getRowKey={(_, index) => index}
          />
        </div>

        {/* Print-only Summary Section */}
        <div className="print-only print-summary" style={{ display: "none" }}>
          <div>
            <strong>Total Modal Keseluruhan:</strong>{" "}
            {formatCurrency(
              units.reduce(
                (sum, unit) =>
                  sum +
                  (typeof unit.totalModal === "number" ? unit.totalModal : 0),
                0
              )
            )}
          </div>
          <div>
            <strong>Total Omzet (Tahun Ini):</strong>{" "}
            {formatCurrency(
              units.reduce(
                (sum, unit) =>
                  sum +
                  (typeof unit.omzetTahunIni === "number"
                    ? unit.omzetTahunIni
                    : 0),
                0
              )
            )}
          </div>
        </div>

        {/* Print-only Signature Section */}
        <div className="print-only print-signature" style={{ display: "none" }}>
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

        <div className="flex flex-wrap items-center justify-end gap-3 no-print">
          <button
            type="button"
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <FileDown className="h-4 w-4" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={exportToPDF}
            className="inline-flex items-center gap-2 rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-700 focus:ring-offset-2"
          >
            <Printer className="h-4 w-4" />
            Cetak
          </button>
          <Button
            onClick={() => {
              setEditingIndex(null);
              setOpenUnitModal(true);
            }}
          >
            Tambah Data
          </Button>
        </div>
      </div>

      {/* Modals */}
      <AddBusinessUnitModal
        open={openUnitModal}
        onClose={() => {
          setOpenUnitModal(false);
          setEditingIndex(null);
        }}
        onSave={saveUnit}
        initialData={
          editingIndex !== null
            ? {
                namaUnit: units[editingIndex].namaUnit,
                jenisUsaha: units[editingIndex].jenisUsaha,
                detailUsaha: units[editingIndex].detailUsaha,
                tanggalBerdiri: units[editingIndex].tanggalBerdiri,
                totalModal: units[editingIndex].totalModal,
                omzetTahunIni: units[editingIndex].omzetTahunIni,
                status: units[editingIndex].status,
              }
            : undefined
        }
      />

      <SaveResultModal
        open={savedOpen}
        onClose={() => setSavedOpen(false)}
        title="Unit Usaha Tersimpan"
        autoCloseMs={1500}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Unit Usaha"
        message="Apakah Anda yakin ingin menghapus unit usaha ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />
    </>
  );
}
