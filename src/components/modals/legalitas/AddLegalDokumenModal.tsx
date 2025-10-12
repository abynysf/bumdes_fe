import { useEffect, useState } from "react";
import Modal from "../../ui/Modal";
import TextInput from "../../ui/TextInput";
import Button from "../../ui/Button";
import YearPicker from "../../ui/YearPicker";
import UploadDokumenModal from "../UploadDokumenModal";

export type LegalDokumenPayload = {
  tahun: number;
  nama: string;
  nomor?: string;
  nominal?: number | "";
  file: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (dokumen: LegalDokumenPayload) => void;
  title?: string;

  /** Toggle field visibility per use-case */
  showNomor?: boolean;
  showNominal?: boolean;

  /** Optional labels/help */
  namaLabel?: string;
  nomorLabel?: string;
  nominalLabel?: string;

  /** Initial data for editing */
  initialData?: Partial<LegalDokumenPayload>;
};

export default function AddLegalDokumenModal({
  open,
  onClose,
  onSave,
  title,
  showNomor = false,
  showNominal = false,
  namaLabel = "Nama Dokumen",
  nomorLabel = "Nomor Dokumen",
  nominalLabel = "Nominal",
  initialData,
}: Props) {
  const [tahun, setTahun] = useState<number | "">("");
  const [nama, setNama] = useState("");
  const [nomor, setNomor] = useState("");
  const [nominal, setNominal] = useState<number | "">("");
  const [file, setFile] = useState<string>("");
  const [touched, setTouched] = useState(false);

  const [openUpload, setOpenUpload] = useState(false);

  // Populate fields when editing
  useEffect(() => {
    if (initialData) {
      setTahun(initialData.tahun ?? "");
      setNama(initialData.nama ?? "");
      setNomor(initialData.nomor ?? "");
      setNominal(initialData.nominal ?? "");
      setFile(initialData.file ?? "");
    }
  }, [initialData]);

  // Reset fields when adding new
  useEffect(() => {
    if (!initialData && open) {
      setTahun("");
      setNama("");
      setNomor("");
      setNominal("");
      setFile("");
      setTouched(false);
    }
  }, [initialData, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true); // Show validation errors

    // Only validate required fields: tahun and nama
    if (tahun === "" || !nama) return;

    const payload: LegalDokumenPayload = {
      tahun,
      nama,
      file: file || "-",
      ...(showNomor ? { nomor: nomor || "-" } : {}),
      ...(showNominal ? { nominal: nominal || "" } : {}),
    };
    onSave(payload);

    // Reset form
    setTahun("");
    setNama("");
    setNomor("");
    setNominal("");
    setFile("");
    setTouched(false);
    onClose();
  }

  return (
    <>
      <Modal open={open} onClose={onClose} title={title ?? "Tambah Dokumen"}>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Tahun */}
          <YearPicker
            label="Tahun"
            required
            placeholder="Pilih tahun"
            value={tahun === "" ? undefined : tahun}
            onChange={(y) => setTahun(y ?? "")}
            touched={touched}
          />

          {/* Nama */}
          <TextInput
            label={namaLabel}
            placeholder="Masukkan nama dokumen"
            value={nama}
            onChange={(e: any) => setNama(e.target?.value ?? e)}
            required
            touched={touched}
          />

          {/* Nomor (opsional) */}
          {showNomor && (
            <TextInput
              label={nomorLabel}
              placeholder="Masukkan nomor dokumen"
              value={nomor}
              onChange={(e: any) => setNomor(e.target?.value ?? e)}
            />
          )}

          {/* Nominal (opsional) */}
          {showNominal && (
            <TextInput
              label={nominalLabel}
              type="number"
              placeholder="cth: 15000000"
              value={nominal as any}
              onChange={(e: any) => {
                const v = e.target?.value ?? e;
                const num = v === "" ? "" : Number(v);
                setNominal(Number.isNaN(num) ? "" : num);
              }}
            />
          )}

          {/* File */}
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Lampiran
            </label>
            <p className="mt-1 text-xs text-neutral-400">
              {file ? `Terpilih: ${file}` : "Belum ada dokumen terunggah"}
            </p>
            <button
              type="button"
              onClick={() => setOpenUpload(true)}
              className="mt-2 rounded-md bg-neutral-600 px-4 py-2 text-sm text-white hover:bg-neutral-700"
            >
              Unggah Dokumen
            </button>
          </div>

          <div className="pt-2">
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </Modal>

      {/* Upload modal */}
      <UploadDokumenModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onSave={(uploaded) => {
          setFile(uploaded);
          setOpenUpload(false);
        }}
      />
    </>
  );
}
