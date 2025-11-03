import { useCallback, useState } from "react";
import Button from "../../components/ui/Button";
import { Table, type Column } from "../../components/ui/Table";
import AddLaporanBulananModal, {
  type LaporanBulananPayload,
} from "../../components/modals/AddLaporanBulananModal";
import AddRapatInternalModal, {
  type RapatInternalPayload,
} from "../../components/modals/AddRapatInternalModal";
import SaveResultModal from "../../components/modals/SaveResultModal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Eye, Download, Pencil, Trash2 } from "lucide-react";
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

// Helper function to format date
function formatDate(dateString: string): string {
  if (!dateString) return "-";
  return dateString;
}

export default function LaporanBulananTab() {
  const {
    laporanBulananData,
    setLaporanBulananData,
    rapatInternalData,
    setRapatInternalData,
  } = useLaporan();

  // Modal states for Laporan Bulanan
  const [openLaporanModal, setOpenLaporanModal] = useState(false);
  const [editingLaporanIndex, setEditingLaporanIndex] = useState<number | null>(
    null
  );

  // Modal states for Rapat Internal
  const [openRapatModal, setOpenRapatModal] = useState(false);
  const [editingRapatIndex, setEditingRapatIndex] = useState<number | null>(
    null
  );

  const [savedOpen, setSavedOpen] = useState(false);
  const [savedTitle, setSavedTitle] = useState("");

  // Confirm delete states
  const [confirmDeleteLaporanOpen, setConfirmDeleteLaporanOpen] = useState(false);
  const [deleteLaporanIndex, setDeleteLaporanIndex] = useState<number | null>(null);
  const [confirmDeleteRapatOpen, setConfirmDeleteRapatOpen] = useState(false);
  const [deleteRapatIndex, setDeleteRapatIndex] = useState<number | null>(null);

  // Save handlers for Laporan Bulanan
  const saveLaporan = useCallback(
    (data: LaporanBulananPayload) => {
      if (editingLaporanIndex !== null) {
        setLaporanBulananData((prev) =>
          prev.map((item, idx) => (idx === editingLaporanIndex ? data : item))
        );
        setEditingLaporanIndex(null);
      } else {
        setLaporanBulananData((prev) => [...prev, data]);
      }
      setOpenLaporanModal(false);
      setSavedTitle("Laporan Bulanan Tersimpan");
      setSavedOpen(true);
    },
    [editingLaporanIndex, setLaporanBulananData]
  );

  // Delete handler for Laporan Bulanan
  const handleDeleteLaporan = useCallback((index: number) => {
    setDeleteLaporanIndex(index);
    setConfirmDeleteLaporanOpen(true);
  }, []);

  const confirmDeleteLaporan = useCallback(() => {
    if (deleteLaporanIndex !== null) {
      setLaporanBulananData((prev) =>
        prev.filter((_, idx) => idx !== deleteLaporanIndex)
      );
      setDeleteLaporanIndex(null);
    }
  }, [deleteLaporanIndex, setLaporanBulananData]);

  // Save handlers for Rapat Internal
  const saveRapat = useCallback(
    (data: RapatInternalPayload) => {
      if (editingRapatIndex !== null) {
        setRapatInternalData((prev) =>
          prev.map((item, idx) => (idx === editingRapatIndex ? data : item))
        );
        setEditingRapatIndex(null);
      } else {
        setRapatInternalData((prev) => [...prev, data]);
      }
      setOpenRapatModal(false);
      setSavedTitle("Rapat Internal Tersimpan");
      setSavedOpen(true);
    },
    [editingRapatIndex, setRapatInternalData]
  );

  // Delete handler for Rapat Internal
  const handleDeleteRapat = useCallback((index: number) => {
    setDeleteRapatIndex(index);
    setConfirmDeleteRapatOpen(true);
  }, []);

  const confirmDeleteRapat = useCallback(() => {
    if (deleteRapatIndex !== null) {
      setRapatInternalData((prev) =>
        prev.filter((_, idx) => idx !== deleteRapatIndex)
      );
      setDeleteRapatIndex(null);
    }
  }, [deleteRapatIndex, setRapatInternalData]);

  // File handlers
  const handlePreviewFile = useCallback((file: string) => {
    if (isUrl(file)) {
      window.open(file, "_blank", "noopener,noreferrer");
    } else {
      alert("Preview file: " + file);
    }
  }, []);

  const downloadFile = useCallback((file: string) => {
    if (isUrl(file)) {
      window.open(file, "_blank", "noopener,noreferrer");
    } else {
      alert("Tidak ada URL. Nama file tersimpan: " + file);
    }
  }, []);

  // Table data for Laporan Bulanan
  const laporanTableData = laporanBulananData.map((item, idx) => ({
    ...item,
    _index: idx,
  }));

  // Table columns for Laporan Bulanan
  const laporanColumns: Column<(typeof laporanTableData)[number]>[] = [
    {
      header: "Nama Laporan",
      accessor: "namaLaporan",
      width: "w-48",
    },
    {
      header: "Unit",
      accessor: "unit",
      width: "w-32",
    },
    {
      header: "Bulan",
      accessor: "bulan",
      width: "w-28",
    },
    {
      header: "Tahun",
      accessor: "tahun",
      width: "w-20",
      align: "center",
    },
    {
      header: "Keterangan",
      accessor: "keterangan",
      width: "w-48",
    },
    {
      header: "Tanggal Upload",
      accessor: "tanggalUpload",
      cell: (row) => formatDate(row.tanggalUpload),
      width: "w-32",
    },
    {
      header: "File",
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
      width: "w-40",
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
                  onClick={() => downloadFile(row.file)}
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
                setEditingLaporanIndex(rowIndex);
                setOpenLaporanModal(true);
              }}
              className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
              title="Edit"
            >
              <Pencil className="h-4 w-4 text-blue-600" />
            </button>
            <button
              type="button"
              onClick={() => handleDeleteLaporan(rowIndex)}
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

  // Table data for Rapat Internal
  const rapatTableData = rapatInternalData.map((item, idx) => ({
    ...item,
    _index: idx,
  }));

  // Table columns for Rapat Internal
  const rapatColumns: Column<(typeof rapatTableData)[number]>[] = [
    {
      header: "Nama Kegiatan",
      accessor: "namaKegiatan",
      width: "w-48",
    },
    {
      header: "Tanggal",
      accessor: "tanggal",
      cell: (row) => formatDate(row.tanggal),
      width: "w-32",
    },
    {
      header: "Judul Notulen",
      accessor: "judulNotulen",
      width: "w-48",
    },
    {
      header: "Upload Notulen",
      accessor: "uploadNotulen",
      cell: (row) => {
        if (!row.uploadNotulen || row.uploadNotulen === "-") {
          return <span className="text-neutral-400">-</span>;
        }
        return (
          <button
            type="button"
            onClick={() => handlePreviewFile(row.uploadNotulen)}
            className="text-blue-600 hover:underline"
          >
            {row.uploadNotulen}
          </button>
        );
      },
      width: "w-40",
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
      width: "w-40",
    },
    {
      header: "Aksi",
      accessor: () => null,
      align: "right",
      cell: (row) => {
        const rowIndex = row._index;
        const hasNotulen = row.uploadNotulen && row.uploadNotulen !== "-";
        const hasDokumentasi = row.dokumentasi && row.dokumentasi !== "-";

        return (
          <div className="flex justify-end gap-1">
            {hasNotulen && (
              <>
                <button
                  type="button"
                  onClick={() => handlePreviewFile(row.uploadNotulen)}
                  className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                  title="Preview Notulen"
                >
                  <Eye className="h-4 w-4 text-blue-600" />
                </button>
                <button
                  type="button"
                  onClick={() => downloadFile(row.uploadNotulen)}
                  className="inline-flex items-center rounded p-1.5 hover:bg-emerald-50"
                  title="Download Notulen"
                >
                  <Download className="h-4 w-4 text-emerald-600" />
                </button>
              </>
            )}
            {hasDokumentasi && (
              <>
                <button
                  type="button"
                  onClick={() => handlePreviewFile(row.dokumentasi)}
                  className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                  title="Preview Dokumentasi"
                >
                  <Eye className="h-4 w-4 text-blue-600" />
                </button>
                <button
                  type="button"
                  onClick={() => downloadFile(row.dokumentasi)}
                  className="inline-flex items-center rounded p-1.5 hover:bg-emerald-50"
                  title="Download Dokumentasi"
                >
                  <Download className="h-4 w-4 text-emerald-600" />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => {
                setEditingRapatIndex(rowIndex);
                setOpenRapatModal(true);
              }}
              className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
              title="Edit"
            >
              <Pencil className="h-4 w-4 text-blue-600" />
            </button>
            <button
              type="button"
              onClick={() => handleDeleteRapat(rowIndex)}
              className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
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
      <div className="min-h-[600px] p-6 space-y-8">
        {/* Section 1: Laporan Bulanan */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Laporan Bulanan
          </h2>
          <div className="mb-4">
            <Table
              data={laporanTableData}
              columns={laporanColumns}
              emptyMessage="Tidak ada data yang ditambahkan"
              getRowKey={(_, index) => index}
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setEditingLaporanIndex(null);
                setOpenLaporanModal(true);
              }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Tambah Laporan Bulanan
            </Button>
          </div>
        </div>

        {/* Section 2: Rapat Internal BUM Desa */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Rapat Internal BUM Desa
          </h2>
          <div className="mb-4">
            <Table
              data={rapatTableData}
              columns={rapatColumns}
              emptyMessage="Tidak ada data yang ditambahkan"
              getRowKey={(_, index) => index}
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setEditingRapatIndex(null);
                setOpenRapatModal(true);
              }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Tambah Catatan Rapat
            </Button>
          </div>
        </div>
      </div>

      {/* Modals for Laporan Bulanan */}
      <AddLaporanBulananModal
        open={openLaporanModal}
        onClose={() => {
          setOpenLaporanModal(false);
          setEditingLaporanIndex(null);
        }}
        onSave={saveLaporan}
        title={
          editingLaporanIndex !== null
            ? "Edit Laporan Bulanan"
            : "Tambah Laporan Bulanan"
        }
        initialData={
          editingLaporanIndex !== null
            ? laporanBulananData[editingLaporanIndex]
            : undefined
        }
      />

      {/* Modals for Rapat Internal */}
      <AddRapatInternalModal
        open={openRapatModal}
        onClose={() => {
          setOpenRapatModal(false);
          setEditingRapatIndex(null);
        }}
        onSave={saveRapat}
        title={
          editingRapatIndex !== null
            ? "Edit Rapat Internal"
            : "Tambah Rapat Internal"
        }
        initialData={
          editingRapatIndex !== null
            ? rapatInternalData[editingRapatIndex]
            : undefined
        }
      />

      {/* Success Modal */}
      <SaveResultModal
        open={savedOpen}
        onClose={() => setSavedOpen(false)}
        title={savedTitle}
        autoCloseMs={1500}
      />

      {/* Confirm Delete Laporan Dialog */}
      <ConfirmDialog
        open={confirmDeleteLaporanOpen}
        onClose={() => setConfirmDeleteLaporanOpen(false)}
        onConfirm={confirmDeleteLaporan}
        title="Hapus Laporan Bulanan"
        message="Apakah Anda yakin ingin menghapus laporan bulanan ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />

      {/* Confirm Delete Rapat Dialog */}
      <ConfirmDialog
        open={confirmDeleteRapatOpen}
        onClose={() => setConfirmDeleteRapatOpen(false)}
        onConfirm={confirmDeleteRapat}
        title="Hapus Rapat Internal"
        message="Apakah Anda yakin ingin menghapus catatan rapat internal ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />
    </>
  );
}
