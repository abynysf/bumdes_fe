import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import TextInput from "../ui/TextInput";
import DatePicker from "../ui/DatePicker";
import Button from "../ui/Button";
import UploadDokumenModal from "./UploadDokumenModal";

export type RapatKinerjaPayload = {
  namaKegiatan: string;
  tanggal: string; // YYYY-MM-DD format
  judulNotulen: string;
  uploadNotulen: string;
  dokumentasi: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: RapatKinerjaPayload) => void;
  title?: string;
  initialData?: Partial<RapatKinerjaPayload>;
};

export default function AddRapatKinerjaModal({
  open,
  onClose,
  onSave,
  title = "Tambah Rapat Kinerja",
  initialData,
}: Props) {
  const [namaKegiatan, setNamaKegiatan] = useState("");
  const [tanggal, setTanggal] = useState<string | undefined>(undefined);
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
      setJudulNotulen(initialData.judulNotulen ?? "");
      setUploadNotulen(initialData.uploadNotulen ?? "");
      setDokumentasi(initialData.dokumentasi ?? "");
      setTanggal(initialData.tanggal);
    }
  }, [initialData]);

  // Reset fields when adding new
  useEffect(() => {
    if (!initialData && open) {
      setNamaKegiatan("");
      setTanggal(undefined);
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

    const payload: RapatKinerjaPayload = {
      namaKegiatan,
      tanggal,
      judulNotulen,
      uploadNotulen: uploadNotulen || "-",
      dokumentasi: dokumentasi || "-",
    };
    onSave(payload);

    // Reset form
    setNamaKegiatan("");
    setTanggal(undefined);
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
            placeholder="Contoh: Rapat Evaluasi Kinerja Semester I"
            value={namaKegiatan}
            onChange={(e: any) => setNamaKegiatan(e.target?.value ?? e)}
            required
            touched={touched}
          />

          {/* Tanggal */}
          <DatePicker
            label="Tanggal"
            placeholder="Pilih tanggal"
            value={tanggal}
            onChange={setTanggal}
            required
            touched={touched}
          />

          {/* Judul Notulen */}
          <TextInput
            label="Judul Notulen"
            placeholder="Contoh: Notulen Rapat Evaluasi Kinerja"
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

          {/* Dokumentasi Upload */}
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
