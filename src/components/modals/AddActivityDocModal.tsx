import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import TextInput from "../ui/TextInput";
import Dropdown from "../ui/Dropdown";
import Button from "../ui/Button";
import UploadDokumenModal from "./UploadDokumenModal";

export type ActivityDocPayload = {
  unitNama: string;
  nama: string;
  tanggalUpload: string; // YYYY-MM-DD format (auto-generated)
  file: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (doc: ActivityDocPayload) => void;
  title?: string;
  initialData?: Partial<ActivityDocPayload>;
  unitUsahaOptions: Array<{ value: string; label: string }>;
};

export default function AddActivityDocModal({
  open,
  onClose,
  onSave,
  title = "Tambah Dokumen Kegiatan",
  initialData,
  unitUsahaOptions,
}: Props) {
  const [unitNama, setUnitNama] = useState("");
  const [nama, setNama] = useState("");
  const [file, setFile] = useState<string>("");
  const [touched, setTouched] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);

  // Populate fields when editing
  useEffect(() => {
    if (initialData) {
      setUnitNama(initialData.unitNama ?? "");
      setNama(initialData.nama ?? "");
      setFile(initialData.file ?? "");
    }
  }, [initialData]);

  // Reset fields when adding new
  useEffect(() => {
    if (!initialData && open) {
      setUnitNama("");
      setNama("");
      setFile("");
      setTouched(false);
    }
  }, [initialData, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    // Validate required fields
    if (!unitNama || !nama) {
      return;
    }

    // Auto-generate current date in YYYY-MM-DD format
    const now = new Date();
    const tanggalUpload = now.toISOString().split("T")[0];

    const payload: ActivityDocPayload = {
      unitNama,
      nama,
      tanggalUpload,
      file: file || "-",
    };
    onSave(payload);

    // Reset form
    setUnitNama("");
    setNama("");
    setFile("");
    setTouched(false);
    onClose();
  }

  return (
    <>
      <Modal open={open} onClose={onClose} title={title}>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Nama Dokumen */}
          <TextInput
            label="Nama Dokumen"
            placeholder="Contoh: Laporan Rapat Bulanan"
            value={nama}
            onChange={(e: any) => setNama(e.target?.value ?? e)}
            required
            touched={touched}
          />

          {/* Unit Usaha Terkait */}
          <Dropdown
            label="Unit Usaha Terkait"
            options={unitUsahaOptions}
            value={unitNama}
            onChange={(value) => setUnitNama(value)}
            placeholder="Pilih Unit Usaha..."
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
            <Button type="submit">Simpan Dokumen</Button>
          </div>
        </form>
      </Modal>

      {/* Upload modal */}
      <UploadDokumenModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onUpload={(file) => {
          setFile(file.name);
          setOpenUpload(false);
        }}
        currentFileName={file && file !== "-" ? file : undefined}
      />
    </>
  );
}
