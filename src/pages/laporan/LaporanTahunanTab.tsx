import { useCallback, useState } from "react";
import Button from "../../components/ui/Button";
import { Table, type Column } from "../../components/ui/Table";
import AddLaporanTahunanModal, {
  type LaporanTahunanPayload,
} from "../../components/modals/AddLaporanTahunanModal";
import AddMusyawarahDesaModal, {
  type MusyawarahDesaTahunanPayload,
} from "../../components/modals/AddMusyawarahDesaModal";
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

export default function LaporanTahunanTab() {
  const {
    laporanTahunanData,
    setLaporanTahunanData,
    musyawarahDesaData,
    setMusyawarahDesaData,
  } = useLaporan();

  // Modal states for Laporan Tahunan
  const [openLaporanModal, setOpenLaporanModal] = useState(false);
  const [editingLaporanIndex, setEditingLaporanIndex] = useState<number | null>(
    null
  );

  // Modal states for Musyawarah Desa Tahunan
  const [openMusyawarahModal, setOpenMusyawarahModal] = useState(false);
  const [editingMusyawarahIndex, setEditingMusyawarahIndex] = useState<
    number | null
  >(null);

  const [savedOpen, setSavedOpen] = useState(false);
  const [savedTitle, setSavedTitle] = useState("");

  // Confirm delete states
  const [confirmDeleteLaporanOpen, setConfirmDeleteLaporanOpen] = useState(false);
  const [deleteLaporanIndex, setDeleteLaporanIndex] = useState<number | null>(null);
  const [confirmDeleteMusyawarahOpen, setConfirmDeleteMusyawarahOpen] = useState(false);
  const [deleteMusyawarahIndex, setDeleteMusyawarahIndex] = useState<number | null>(null);

  // Save handlers for Laporan Tahunan
  const saveLaporan = useCallback(
    (data: LaporanTahunanPayload) => {
      if (editingLaporanIndex !== null) {
        setLaporanTahunanData((prev) =>
          prev.map((item, idx) => (idx === editingLaporanIndex ? data : item))
        );
        setEditingLaporanIndex(null);
      } else {
        setLaporanTahunanData((prev) => [...prev, data]);
      }
      setOpenLaporanModal(false);
      setSavedTitle("Laporan Tahunan Tersimpan");
      setSavedOpen(true);
    },
    [editingLaporanIndex, setLaporanTahunanData]
  );

  // Delete handler for Laporan Tahunan
  const handleDeleteLaporan = useCallback((index: number) => {
    setDeleteLaporanIndex(index);
    setConfirmDeleteLaporanOpen(true);
  }, []);

  const confirmDeleteLaporan = useCallback(() => {
    if (deleteLaporanIndex !== null) {
      setLaporanTahunanData((prev) =>
        prev.filter((_, idx) => idx !== deleteLaporanIndex)
      );
      setDeleteLaporanIndex(null);
    }
  }, [deleteLaporanIndex, setLaporanTahunanData]);

  // Save handlers for Musyawarah Desa Tahunan
  const saveMusyawarah = useCallback(
    (data: MusyawarahDesaTahunanPayload) => {
      if (editingMusyawarahIndex !== null) {
        setMusyawarahDesaData((prev) =>
          prev.map((item, idx) => (idx === editingMusyawarahIndex ? data : item))
        );
        setEditingMusyawarahIndex(null);
      } else {
        setMusyawarahDesaData((prev) => [...prev, data]);
      }
      setOpenMusyawarahModal(false);
      setSavedTitle("Musyawarah Desa Tersimpan");
      setSavedOpen(true);
    },
    [editingMusyawarahIndex, setMusyawarahDesaData]
  );

  // Delete handler for Musyawarah Desa Tahunan
  const handleDeleteMusyawarah = useCallback((index: number) => {
    setDeleteMusyawarahIndex(index);
    setConfirmDeleteMusyawarahOpen(true);
  }, []);

  const confirmDeleteMusyawarah = useCallback(() => {
    if (deleteMusyawarahIndex !== null) {
      setMusyawarahDesaData((prev) =>
        prev.filter((_, idx) => idx !== deleteMusyawarahIndex)
      );
      setDeleteMusyawarahIndex(null);
    }
  }, [deleteMusyawarahIndex, setMusyawarahDesaData]);

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

  // Table data for Laporan Tahunan
  const laporanTableData = laporanTahunanData.map((item, idx) => ({
    ...item,
    _index: idx,
  }));

  // Table columns for Laporan Tahunan
  const laporanColumns: Column<(typeof laporanTableData)[number]>[] = [
    {
      header: "Nama Laporan",
      accessor: "namaLaporan",
      width: "w-64",
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

  // Table data for Musyawarah Desa Tahunan
  const musyawarahTableData = musyawarahDesaData.map((item, idx) => ({
    ...item,
    _index: idx,
  }));

  // Table columns for Musyawarah Desa Tahunan
  const musyawarahColumns: Column<(typeof musyawarahTableData)[number]>[] = [
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
      header: "Judul Berita Acara Musyawarah Desa",
      accessor: "judulBeritaAcara",
      width: "w-56",
    },
    {
      header: "Upload Berita Acara",
      accessor: "uploadBeritaAcara",
      cell: (row) => {
        if (!row.uploadBeritaAcara || row.uploadBeritaAcara === "-") {
          return <span className="text-neutral-400">-</span>;
        }
        return (
          <button
            type="button"
            onClick={() => handlePreviewFile(row.uploadBeritaAcara)}
            className="text-blue-600 hover:underline"
          >
            {row.uploadBeritaAcara}
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
        const hasBeritaAcara =
          row.uploadBeritaAcara && row.uploadBeritaAcara !== "-";
        const hasDokumentasi = row.dokumentasi && row.dokumentasi !== "-";

        return (
          <div className="flex justify-end gap-1">
            {hasBeritaAcara && (
              <>
                <button
                  type="button"
                  onClick={() => handlePreviewFile(row.uploadBeritaAcara)}
                  className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                  title="Preview Berita Acara"
                >
                  <Eye className="h-4 w-4 text-blue-600" />
                </button>
                <button
                  type="button"
                  onClick={() => downloadFile(row.uploadBeritaAcara)}
                  className="inline-flex items-center rounded p-1.5 hover:bg-emerald-50"
                  title="Download Berita Acara"
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
                setEditingMusyawarahIndex(rowIndex);
                setOpenMusyawarahModal(true);
              }}
              className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
              title="Edit"
            >
              <Pencil className="h-4 w-4 text-blue-600" />
            </button>
            <button
              type="button"
              onClick={() => handleDeleteMusyawarah(rowIndex)}
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
        {/* Section 1: Laporan Tahunan */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Laporan Tahunan
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
              Tambah Laporan Tahunan
            </Button>
          </div>
        </div>

        {/* Section 2: Musyawarah Desa Tahunan */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Musyawarah Desa Tahunan
          </h2>
          <div className="mb-4">
            <Table
              data={musyawarahTableData}
              columns={musyawarahColumns}
              emptyMessage="Tidak ada data yang ditambahkan"
              getRowKey={(_, index) => index}
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setEditingMusyawarahIndex(null);
                setOpenMusyawarahModal(true);
              }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Tambah Musyawarah Desa
            </Button>
          </div>
        </div>
      </div>

      {/* Modals for Laporan Tahunan */}
      <AddLaporanTahunanModal
        open={openLaporanModal}
        onClose={() => {
          setOpenLaporanModal(false);
          setEditingLaporanIndex(null);
        }}
        onSave={saveLaporan}
        title={
          editingLaporanIndex !== null
            ? "Edit Laporan Tahunan"
            : "Tambah Laporan Tahunan"
        }
        initialData={
          editingLaporanIndex !== null
            ? laporanTahunanData[editingLaporanIndex]
            : undefined
        }
      />

      {/* Modals for Musyawarah Desa Tahunan */}
      <AddMusyawarahDesaModal
        open={openMusyawarahModal}
        onClose={() => {
          setOpenMusyawarahModal(false);
          setEditingMusyawarahIndex(null);
        }}
        onSave={saveMusyawarah}
        title={
          editingMusyawarahIndex !== null
            ? "Edit Musyawarah Desa"
            : "Tambah Musyawarah Desa"
        }
        initialData={
          editingMusyawarahIndex !== null
            ? musyawarahDesaData[editingMusyawarahIndex]
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
        title="Hapus Laporan Tahunan"
        message="Apakah Anda yakin ingin menghapus laporan tahunan ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />

      {/* Confirm Delete Musyawarah Dialog */}
      <ConfirmDialog
        open={confirmDeleteMusyawarahOpen}
        onClose={() => setConfirmDeleteMusyawarahOpen(false)}
        onConfirm={confirmDeleteMusyawarah}
        title="Hapus Musyawarah Desa"
        message="Apakah Anda yakin ingin menghapus catatan musyawarah desa ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />
    </>
  );
}
