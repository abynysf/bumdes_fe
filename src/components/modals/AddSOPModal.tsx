import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import TextInput from "../ui/TextInput";
import Dropdown from "../ui/Dropdown";
import DatePicker from "../ui/DatePicker";
import Button from "../ui/Button";
import UploadDokumenModal from "./UploadDokumenModal";

export type SOPPayload = {
  unitNama: string;
  nama: string;
  tanggalDibuat: string; // YYYY-MM-DD format
  file: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (sop: SOPPayload) => void;
  title?: string;
  initialData?: Partial<SOPPayload>;
  unitUsahaOptions: Array<{ value: string; label: string }>;
};

export default function AddSOPModal({
  open,
  onClose,
  onSave,
  title = "Tambah SOP Baru",
  initialData,
  unitUsahaOptions,
}: Props) {
  const [unitNama, setUnitNama] = useState("");
  const [nama, setNama] = useState("");
  const [tanggalDibuat, setTanggalDibuat] = useState("");
  const [file, setFile] = useState<string>("");
  const [touched, setTouched] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);

  // Populate fields when editing
  useEffect(() => {
    if (initialData) {
      setUnitNama(initialData.unitNama ?? "");
      setNama(initialData.nama ?? "");
      setTanggalDibuat(initialData.tanggalDibuat ?? "");
      setFile(initialData.file ?? "");
    }
  }, [initialData]);

  // Reset fields when adding new
  useEffect(() => {
    if (!initialData && open) {
      setUnitNama("");
      setNama("");
      setTanggalDibuat("");
      setFile("");
      setTouched(false);
    }
  }, [initialData, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    // Validate required fields
    if (!unitNama || !nama || !tanggalDibuat) {
      return;
    }

    const payload: SOPPayload = {
      unitNama,
      nama,
      tanggalDibuat,
      file: file || "-",
    };
    onSave(payload);

    // Reset form
    setUnitNama("");
    setNama("");
    setTanggalDibuat("");
    setFile("");
    setTouched(false);
    onClose();
  }

  return (
    <>
      <Modal open={open} onClose={onClose} title={title}>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Nama SOP */}
          <TextInput
            label="Nama SOP"
            placeholder="Masukkan nama SOP"
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

          {/* Tanggal Dibuat */}
          <DatePicker
            label="Tanggal Dibuat"
            placeholder="Pilih tanggal dibuat"
            value={tanggalDibuat}
            onChange={(date) => setTanggalDibuat(date || "")}
            required
            touched={touched}
          />

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Lampiran Dokumen
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
        onUpload={(file) => {
          setFile(file.name);
          setOpenUpload(false);
        }}
        currentFileName={file && file !== "-" ? file : undefined}
      />
    </>
  );
}
