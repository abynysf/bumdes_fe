import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import TextInput from "../ui/TextInput";
import DatePicker from "../ui/DatePicker";
import Button from "../ui/Button";
import UploadDokumenLainModal from "./UploadDokumenLainModal";

export type DokumenLainPayload = {
  namaDokumen: string;
  tanggalUpload: string;
  fileUrl: string;
  fileName: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: DokumenLainPayload) => void;
  title?: string;
  initialData?: Partial<DokumenLainPayload>;
};

export default function AddDokumenLainModal({
  open,
  onClose,
  onSave,
  title = "Tambah Dokumen Lain",
  initialData,
}: Props) {
  const [namaDokumen, setNamaDokumen] = useState("");
  const [tanggalUpload, setTanggalUpload] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [touched, setTouched] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Populate fields when editing
  useEffect(() => {
    if (initialData && open) {
      setNamaDokumen(initialData.namaDokumen ?? "");
      setTanggalUpload(initialData.tanggalUpload ?? "");
      setFileUrl(initialData.fileUrl ?? "");
      setFileName(initialData.fileName ?? "");
    }
  }, [initialData, open]);

  // Reset fields when adding new
  useEffect(() => {
    if (!initialData && open) {
      setNamaDokumen("");
      setTanggalUpload("");
      setFileUrl("");
      setFileName("");
      setTouched(false);
    }
  }, [initialData, open]);

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
      return;
    }

    onSave({
      namaDokumen,
      tanggalUpload,
      fileUrl,
      fileName,
    });

    // Reset form
    setNamaDokumen("");
    setTanggalUpload("");
    setFileUrl("");
    setFileName("");
    setTouched(false);
    onClose();
  }

  return (
    <>
      <Modal open={open} onClose={onClose} title={title}>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan
            </Button>
          </div>
        </form>
      </Modal>

      <UploadDokumenLainModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleFileUpload}
        currentFileName={fileName}
      />
    </>
  );
}
