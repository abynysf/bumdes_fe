import { useState } from "react";
import Modal from "../ui/Modal";

type UploadProps = {
  open: boolean;
  onClose: () => void;
  onSave: (fileNameOrUrl: string) => void;
};

export default function UploadDokumenModal({
  open,
  onClose,
  onSave,
}: UploadProps) {
  const [picked, setPicked] = useState<File | null>(null);
  const inputId = "upload-dokumen-input";

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setPicked(f);
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0] ?? null;
    setPicked(f);
  }

  return (
    <Modal open={open} onClose={onClose} title="Unggah Dokumen">
      <div className="space-y-6">
        {/* Hidden input lives OUTSIDE. Label points to it via htmlFor */}
        <input
          id={inputId}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileInput}
        />

        <label
          htmlFor={inputId}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="flex h-56 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50/40"
        >
          <div className="text-emerald-600 text-6xl leading-none">☁️</div>
          <p className="mt-3 text-sm text-neutral-700">
            Seret & letakkan berkas atau{" "}
            <span className="text-emerald-700 underline">Telusuri</span>
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Format yang didukung: PDF
          </p>
        </label>

        <p className="text-xs text-neutral-600 text-center">
          {picked ? `Terpilih: ${picked.name}` : "Belum ada dokumen terpilih"}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={!picked}
            onClick={() => picked && onSave(picked.name)}
            className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            Simpan
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Batal
          </button>
        </div>
      </div>
    </Modal>
  );
}
