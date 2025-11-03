import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import TextInput from "../ui/TextInput";
import YearPicker from "../ui/YearPicker";
import Button from "../ui/Button";
import UploadDokumenModal from "./UploadDokumenModal";

export type ProgramKerjaPayload = {
  nama: string;
  tahun: number;
  tanggalUpload: string; // YYYY-MM-DD format (auto-generated)
  file: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: ProgramKerjaPayload) => void;
  title?: string;
  initialData?: Partial<ProgramKerjaPayload>;
};

export default function AddProgramKerjaModal({
  open,
  onClose,
  onSave,
  title = "Tambah Program Kerja",
  initialData,
}: Props) {
  const [nama, setNama] = useState("");
  const [tahun, setTahun] = useState<number | "">("");
  const [file, setFile] = useState<string>("");
  const [touched, setTouched] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);

  // Populate fields when editing
  useEffect(() => {
    if (initialData) {
      setNama(initialData.nama ?? "");
      setTahun(initialData.tahun ?? "");
      setFile(initialData.file ?? "");
    }
  }, [initialData]);

  // Reset fields when adding new
  useEffect(() => {
    if (!initialData && open) {
      setNama("");
      setTahun("");
      setFile("");
      setTouched(false);
    }
  }, [initialData, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    // Validate required fields
    if (!nama || tahun === "") {
      return;
    }

    // Auto-generate current date in YYYY-MM-DD format
    const now = new Date();
    const tanggalUpload = now.toISOString().split("T")[0];

    const payload: ProgramKerjaPayload = {
      nama,
      tahun: Number(tahun),
      tanggalUpload,
      file: file || "-",
    };
    onSave(payload);

    // Reset form
    setNama("");
    setTahun("");
    setFile("");
    setTouched(false);
    onClose();
  }

  return (
    <>
      <Modal open={open} onClose={onClose} title={title}>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Nama Program Kerja */}
          <TextInput
            label="Nama Program Kerja"
            placeholder="Contoh: Program Kerja BUM Desa Tahun 2024"
            value={nama}
            onChange={(e: any) => setNama(e.target?.value ?? e)}
            required
            touched={touched}
          />

          {/* Tahun */}
          <YearPicker
            label="Tahun"
            placeholder="Pilih tahun"
            value={tahun === "" ? undefined : tahun}
            onChange={(y) => setTahun(y ?? "")}
            required
            touched={touched}
          />

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              File (PDF)
            </label>
            <p className="mt-1 text-xs text-neutral-400">
              {file && file !== "-"
                ? `Terpilih: ${file}`
                : "Belum ada dokumen terunggah"}
            </p>
            <button
              type="button"
              onClick={() => setOpenUpload(true)}
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
