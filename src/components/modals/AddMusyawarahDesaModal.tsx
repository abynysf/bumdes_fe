import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import TextInput from "../ui/TextInput";
import DatePicker from "../ui/DatePicker";
import Button from "../ui/Button";
import UploadDokumenModal from "./UploadDokumenModal";

export type MusyawarahDesaTahunanPayload = {
  namaKegiatan: string;
  tanggal: string; // YYYY-MM-DD format
  judulBeritaAcara: string;
  uploadBeritaAcara: string;
  dokumentasi: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: MusyawarahDesaTahunanPayload) => void;
  title?: string;
  initialData?: Partial<MusyawarahDesaTahunanPayload>;
};

export default function AddMusyawarahDesaModal({
  open,
  onClose,
  onSave,
  title = "Tambah Musyawarah Desa",
  initialData,
}: Props) {
  const [namaKegiatan, setNamaKegiatan] = useState("");
  const [tanggal, setTanggal] = useState<string | undefined>(undefined);
  const [judulBeritaAcara, setJudulBeritaAcara] = useState("");
  const [uploadBeritaAcara, setUploadBeritaAcara] = useState<string>("");
  const [dokumentasi, setDokumentasi] = useState<string>("");
  const [touched, setTouched] = useState(false);
  const [openUploadBerita, setOpenUploadBerita] = useState(false);
  const [openUploadDok, setOpenUploadDok] = useState(false);

  // Populate fields when editing
  useEffect(() => {
    if (initialData) {
      setNamaKegiatan(initialData.namaKegiatan ?? "");
      setJudulBeritaAcara(initialData.judulBeritaAcara ?? "");
      setUploadBeritaAcara(initialData.uploadBeritaAcara ?? "");
      setDokumentasi(initialData.dokumentasi ?? "");
      setTanggal(initialData.tanggal);
    }
  }, [initialData]);

  // Reset fields when adding new
  useEffect(() => {
    if (!initialData && open) {
      setNamaKegiatan("");
      setTanggal(undefined);
      setJudulBeritaAcara("");
      setUploadBeritaAcara("");
      setDokumentasi("");
      setTouched(false);
    }
  }, [initialData, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    // Validate required fields
    if (!namaKegiatan || !tanggal || !judulBeritaAcara) {
      return;
    }

    const payload: MusyawarahDesaTahunanPayload = {
      namaKegiatan,
      tanggal,
      judulBeritaAcara,
      uploadBeritaAcara: uploadBeritaAcara || "-",
      dokumentasi: dokumentasi || "-",
    };
    onSave(payload);

    // Reset form
    setNamaKegiatan("");
    setTanggal(undefined);
    setJudulBeritaAcara("");
    setUploadBeritaAcara("");
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
            placeholder="Contoh: Musyawarah Desa Tahunan 2024"
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

          {/* Judul Berita Acara Musyawarah Desa */}
          <TextInput
            label="Judul Berita Acara Musyawarah Desa"
            placeholder="Contoh: Berita Acara Musyawarah Desa Tahunan"
            value={judulBeritaAcara}
            onChange={(e: any) => setJudulBeritaAcara(e.target?.value ?? e)}
            required
            touched={touched}
          />

          {/* Upload Berita Acara */}
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Upload Berita Acara (PDF)
            </label>
            <p className="mt-1 text-xs text-neutral-400">
              {uploadBeritaAcara && uploadBeritaAcara !== "-"
                ? `Terpilih: ${uploadBeritaAcara}`
                : "Belum ada dokumen terunggah"}
            </p>
            <button
              type="button"
              onClick={() => setOpenUploadBerita(true)}
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
        open={openUploadBerita}
        onClose={() => setOpenUploadBerita(false)}
        onSave={(uploaded) => {
          setUploadBeritaAcara(uploaded);
          setOpenUploadBerita(false);
        }}
      />
      <UploadDokumenModal
        open={openUploadDok}
        onClose={() => setOpenUploadDok(false)}
        onSave={(uploaded) => {
          setDokumentasi(uploaded);
          setOpenUploadDok(false);
        }}
      />
    </>
  );
}
