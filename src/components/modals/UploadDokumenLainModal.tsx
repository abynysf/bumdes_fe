import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import UploadBox from "../ui/UploadBox";
import Button from "../ui/Button";

type Props = {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  currentFileName?: string;
};

export default function UploadDokumenLainModal({
  open,
  onClose,
  onUpload,
  currentFileName,
}: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedFile) {
      onUpload(selectedFile);
      setSelectedFile(null);
      onClose();
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Upload File">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Pilih File Dokumen
            </label>
            <UploadBox
              accept=".pdf,.doc,.docx"
              onFileSelect={(file: File) => setSelectedFile(file)}
            />
          </div>

          {currentFileName && !selectedFile && (
            <p className="text-sm text-neutral-600">
              File saat ini: {currentFileName}
            </p>
          )}

          {selectedFile && (
            <p className="text-sm text-emerald-600">
              File terpilih: {selectedFile.name}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={!selectedFile}>
              Upload
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
