import { useState } from "react";
import { useOthers } from "../../contexts/OthersContext";
import type { DokumenLain } from "../../contexts/OthersContext";
import { Table, type Column } from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import DatePicker from "../../components/ui/DatePicker";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useToast } from "../../contexts/ToastContext";
import UploadDokumenModal from "../../components/modals/UploadDokumenModal";
import { Eye, Download, Trash2 } from "lucide-react";

export default function DokumenLainTab() {
  const { dokumenLain, setDokumenLain } = useOthers();
  const { showToast } = useToast();

  // Form state
  const [namaDokumen, setNamaDokumen] = useState("");
  const [tanggalUpload, setTanggalUpload] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [touched, setTouched] = useState(false);

  // Modal states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);

  function handleFileUpload(file: File) {
    // In a real app, this would upload to server and get back a URL
    const mockUrl = URL.createObjectURL(file);
    setFileUrl(mockUrl);
    setFileName(file.name);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    if (!namaDokumen || !tanggalUpload || !fileUrl) {
      showToast("error", "Semua field wajib diisi");
      return;
    }

    const newDoc: DokumenLain = {
      id: Date.now().toString(),
      namaDokumen,
      tanggalUpload,
      fileUrl,
      fileName,
    };

    setDokumenLain((prev: DokumenLain[]) => [...prev, newDoc]);
    showToast("success", "Dokumen berhasil ditambahkan");

    // Reset form
    setNamaDokumen("");
    setTanggalUpload("");
    setFileUrl("");
    setFileName("");
    setTouched(false);
  }

  function handlePreview(doc: DokumenLain) {
    setPreviewUrl(doc.fileUrl);
    setPreviewModalOpen(true);
  }

  function handleDownload(doc: DokumenLain) {
    window.open(doc.fileUrl, "_blank");
    showToast("success", "Dokumen berhasil diunduh");
  }

  function handleDeleteClick(docId: string) {
    setDocToDelete(docId);
    setDeleteDialogOpen(true);
  }

  function handleDeleteConfirm() {
    if (docToDelete) {
      setDokumenLain((prev: DokumenLain[]) => prev.filter((doc: DokumenLain) => doc.id !== docToDelete));
      showToast("success", "Dokumen berhasil dihapus");
      setDeleteDialogOpen(false);
      setDocToDelete(null);
    }
  }

  const columns: Column<DokumenLain>[] = [
    {
      header: "NAMA DOKUMEN",
      accessor: "namaDokumen",
      width: "w-64",
      align: "left",
    },
    {
      header: "TANGGAL UPLOAD",
      accessor: "tanggalUpload",
      width: "w-40",
      align: "center",
    },
    {
      header: "FILE",
      accessor: "fileName",
      cell: (doc: DokumenLain) => (
        <a
          href={doc.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {doc.fileName}
        </a>
      ),
      width: "w-48",
      align: "left",
    },
    {
      header: "AKSI",
      accessor: () => null,
      cell: (doc: DokumenLain) => (
        <div className="flex gap-1 justify-center">
          <button
            type="button"
            onClick={() => handlePreview(doc)}
            className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
            title="Lihat"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </button>
          <button
            type="button"
            onClick={() => handleDownload(doc)}
            className="inline-flex items-center rounded p-1.5 hover:bg-emerald-50"
            title="Unduh"
          >
            <Download className="h-4 w-4 text-emerald-600" />
          </button>
          <button
            type="button"
            onClick={() => handleDeleteClick(doc.id)}
            className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
            title="Hapus"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      ),
      width: "w-32",
      align: "center",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h2 className="text-lg font-semibold text-neutral-800">
        Upload Dokumen Lain
      </h2>

      {/* Add Form */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <TextInput
          label="Nama Dokumen"
          value={namaDokumen}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNamaDokumen(e.target.value)}
          required
          touched={touched}
          placeholder="Masukkan nama dokumen"
        />

        <DatePicker
          label="Tanggal Upload"
          value={tanggalUpload}
          onChange={(date: string | undefined) => setTanggalUpload(date ?? "")}
          required
          touched={touched}
        />

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            File <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setUploadModalOpen(true)}
            >
              Choose File
            </Button>
            {fileName ? (
              <span className="text-sm text-neutral-600">{fileName}</span>
            ) : (
              <span className="text-sm text-neutral-400">No file chosen</span>
            )}
          </div>
          {touched && !fileUrl && (
            <p className="text-red-500 text-xs mt-1">File wajib diisi</p>
          )}
        </div>

        <div className="flex justify-start">
          <Button type="submit" variant="primary">
            + Tambah Dokumen
          </Button>
        </div>
      </form>

      {/* Documents Table */}
      <div className="overflow-x-auto">
        <Table columns={columns} data={dokumenLain} />
      </div>

      {/* Upload Modal */}
      <UploadDokumenModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleFileUpload}
        currentFileName={fileName}
      />

      {/* Preview Modal */}
      <Modal
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title="Preview Dokumen"
        className="max-w-4xl"
      >
        <div className="w-full h-[600px]">
          <iframe
            src={previewUrl}
            className="w-full h-full border-0"
            title="Document Preview"
          />
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Dokumen"
        message="Apakah Anda yakin ingin menghapus dokumen ini?"
        variant="danger"
      />
    </div>
  );
}
