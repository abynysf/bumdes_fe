import { useCallback, useState } from "react";
import Button from "../../components/ui/Button";
import { Table, type Column } from "../../components/ui/Table";
import AddLaporanPengawasModal, {
  type LaporanPengawasPayload,
} from "../../components/modals/AddLaporanPengawasModal";
import SaveResultModal from "../../components/modals/SaveResultModal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Pencil, Trash2 } from "lucide-react";
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

// Helper function to format date from YYYY-MM-DD to YYYY-MM-DD
function formatDate(dateString: string): string {
  if (!dateString) return "-";
  return dateString;
}

export default function LaporanPengawasTab() {
  const { laporanPengawasData, setLaporanPengawasData } = useLaporan();

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [savedOpen, setSavedOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // Save handler
  const saveLaporan = useCallback(
    (data: LaporanPengawasPayload) => {
      if (editingIndex !== null) {
        setLaporanPengawasData((prev) =>
          prev.map((item, idx) => (idx === editingIndex ? data : item))
        );
        setEditingIndex(null);
      } else {
        setLaporanPengawasData((prev) => [...prev, data]);
      }
      setOpenModal(false);
      setSavedOpen(true);
    },
    [editingIndex, setLaporanPengawasData]
  );

  // Delete handler
  const handleDelete = useCallback((index: number) => {
    setDeleteIndex(index);
    setConfirmDeleteOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteIndex !== null) {
      setLaporanPengawasData((prev) =>
        prev.filter((_, idx) => idx !== deleteIndex)
      );
      setDeleteIndex(null);
    }
  }, [deleteIndex, setLaporanPengawasData]);

  // File handlers
  const handlePreviewFile = useCallback((file: string) => {
    if (isUrl(file)) {
      window.open(file, "_blank", "noopener,noreferrer");
    } else {
      alert("Preview file: " + file);
    }
  }, []);


  // Prepare table data with index
  const tableData = laporanPengawasData.map((item, idx) => ({
    ...item,
    _index: idx,
  }));

  // Table columns
  const columns: Column<(typeof tableData)[number]>[] = [
    {
      header: "Nama Laporan",
      accessor: "namaLaporan",
      width: "w-64",
    },
    {
      header: "Bulan",
      accessor: "bulan",
      width: "w-32",
    },
    {
      header: "Tahun",
      accessor: "tahun",
      width: "w-24",
      align: "center",
    },
    {
      header: "Tanggal Upload",
      accessor: "tanggalUpload",
      cell: (row) => formatDate(row.tanggalUpload),
      width: "w-32",
    },
    {
      header: "File Laporan",
      accessor: "fileLaporan",
      cell: (row) => {
        if (!row.fileLaporan || row.fileLaporan === "-") {
          return <span className="text-neutral-400">-</span>;
        }
        return (
          <button
            type="button"
            onClick={() => handlePreviewFile(row.fileLaporan)}
            className="text-blue-600 hover:underline"
          >
            {row.fileLaporan}
          </button>
        );
      },
      width: "w-48",
    },
    {
      header: "Dokumentasi",
      accessor: "dokumentasi",
      cell: (row) => {
        if (!row.dokumentasi || row.dokumentasi === "-") {
          return <span className="text-neutral-400">-</span>;
        }
        return (
          <button
            type="button"
            onClick={() => handlePreviewFile(row.dokumentasi)}
            className="text-blue-600 hover:underline"
          >
            {row.dokumentasi}
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
            <button
              type="button"
              onClick={() => {
                setEditingIndex(rowIndex);
                setOpenModal(true);
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
      width: "w-24",
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
              setEditingIndex(null);
              setOpenModal(true);
            }}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            Tambah Laporan Pengawas
          </Button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AddLaporanPengawasModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingIndex(null);
        }}
        onSave={saveLaporan}
        title={
          editingIndex !== null
            ? "Edit Laporan Pengawas"
            : "Tambah Laporan Pengawas"
        }
        initialData={
          editingIndex !== null
            ? laporanPengawasData[editingIndex]
            : undefined
        }
      />

      {/* Success Modal */}
      <SaveResultModal
        open={savedOpen}
        onClose={() => setSavedOpen(false)}
        title="Laporan Pengawas Tersimpan"
        autoCloseMs={1500}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Laporan Pengawas"
        message="Apakah Anda yakin ingin menghapus laporan pengawas ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />
    </>
  );
}
