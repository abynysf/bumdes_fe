import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import TextInput from "../ui/TextInput";
import DatePicker from "../ui/DatePicker";
import Button from "../ui/Button";
import UploadDokumenModal from "./UploadDokumenModal";

export type RapatInternalPayload = {
  namaKegiatan: string;
  tanggal: string; // YYYY-MM-DD
  judulNotulen: string;
  uploadNotulen: string;
  dokumentasi: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: RapatInternalPayload) => void;
  title?: string;
  initialData?: Partial<RapatInternalPayload>;
};

export default function AddRapatInternalModal({
  open,
  onClose,
  onSave,
  title = "Tambah Rapat Internal",
  initialData,
}: Props) {
  const [namaKegiatan, setNamaKegiatan] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [judulNotulen, setJudulNotulen] = useState("");
  const [uploadNotulen, setUploadNotulen] = useState<string>("");
  const [dokumentasi, setDokumentasi] = useState<string>("");
  const [touched, setTouched] = useState(false);
  const [openUploadNotulen, setOpenUploadNotulen] = useState(false);
  const [openUploadDok, setOpenUploadDok] = useState(false);

  // Populate fields when editing
  useEffect(() => {
    if (initialData) {
      setNamaKegiatan(initialData.namaKegiatan ?? "");
      setTanggal(initialData.tanggal ?? "");
      setJudulNotulen(initialData.judulNotulen ?? "");
      setUploadNotulen(initialData.uploadNotulen ?? "");
      setDokumentasi(initialData.dokumentasi ?? "");
    }
  }, [initialData]);

  // Reset fields when adding new
  useEffect(() => {
    if (!initialData && open) {
      setNamaKegiatan("");
      setTanggal("");
      setJudulNotulen("");
      setUploadNotulen("");
      setDokumentasi("");
      setTouched(false);
    }
  }, [initialData, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    // Validate required fields
    if (!namaKegiatan || !tanggal || !judulNotulen) {
      return;
    }

    const payload: RapatInternalPayload = {
      namaKegiatan,
      tanggal,
      judulNotulen,
      uploadNotulen: uploadNotulen || "-",
      dokumentasi: dokumentasi || "-",
    };
    onSave(payload);

    // Reset form
    setNamaKegiatan("");
    setTanggal("");
    setJudulNotulen("");
    setUploadNotulen("");
    setDokumentasi("");
    setTouched(false);
    onClose();
  }

  return (
    <>
      <Modal open={open} onClose={onClose} title={title}>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Nama Kegiatan */}
          <TextInput
            label="Nama Kegiatan"
            placeholder="Contoh: Rapat Evaluasi Bulanan Agustus"
            value={namaKegiatan}
            onChange={(e: any) => setNamaKegiatan(e.target?.value ?? e)}
            required
            touched={touched}
          />

          {/* Tanggal */}
          <DatePicker
            label="Tanggal"
            value={tanggal}
            onChange={(date) => setTanggal(date || "")}
            required
            touched={touched}
          />

          {/* Judul Notulen */}
          <TextInput
            label="Judul Notulen"
            placeholder="Contoh: Notulen Rapat Evaluasi Agustus 2025"
            value={judulNotulen}
            onChange={(e: any) => setJudulNotulen(e.target?.value ?? e)}
            required
            touched={touched}
          />

          {/* Upload Notulen */}
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Upload Notulen (PDF)
            </label>
            <p className="mt-1 text-xs text-neutral-400">
              {uploadNotulen && uploadNotulen !== "-"
                ? `Terpilih: ${uploadNotulen}`
                : "Belum ada dokumen terunggah"}
            </p>
            <button
              type="button"
              onClick={() => setOpenUploadNotulen(true)}
              className="mt-2 rounded-md bg-neutral-600 px-4 py-2 text-sm text-white hover:bg-neutral-700"
            >
              Choose File
            </button>
            <p className="mt-1 text-xs text-neutral-400">
              Kosongkan jika tidak ingin mengubah file.
            </p>
          </div>

          {/* Dokumentasi */}
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Dokumentasi (PDF)
            </label>
            <p className="mt-1 text-xs text-neutral-400">
              {dokumentasi && dokumentasi !== "-"
                ? `Terpilih: ${dokumentasi}`
                : "Belum ada dokumen terunggah"}
            </p>
            <button
              type="button"
              onClick={() => setOpenUploadDok(true)}
              className="mt-2 rounded-md bg-neutral-600 px-4 py-2 text-sm text-white hover:bg-neutral-700"
            >
              Choose File
            </button>
            <p className="mt-1 text-xs text-neutral-400">
              Kosongkan jika tidak ingin mengubah file.
            </p>
          </div>

          <div className="pt-2">
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </Modal>

      {/* Upload modals */}
      <UploadDokumenModal
        open={openUploadNotulen}
        onClose={() => setOpenUploadNotulen(false)}
        onUpload={(file) => {
          setUploadNotulen(file.name);
          setOpenUploadNotulen(false);
        }}
        currentFileName={uploadNotulen && uploadNotulen !== "-" ? uploadNotulen : undefined}
      />
      <UploadDokumenModal
        open={openUploadDok}
        onClose={() => setOpenUploadDok(false)}
        onUpload={(file) => {
          setDokumentasi(file.name);
          setOpenUploadDok(false);
        }}
        currentFileName={dokumentasi && dokumentasi !== "-" ? dokumentasi : undefined}
      />
    </>
  );
}
