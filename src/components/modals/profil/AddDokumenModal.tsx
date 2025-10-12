import { useState } from "react";
import Modal from "../../ui/Modal";
import TextInput from "../../ui/TextInput";
import Button from "../../ui/Button";
import YearPicker from "../../ui/YearPicker";
import UploadDokumenModal from "../UploadDokumenModal";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (dokumen: {
    tahun: number;
    nama: string;
    nomor: string;
    file: string;
  }) => void;
};

export default function AddDokumenModal({ open, onClose, onSave }: Props) {
  const [tahun, setTahun] = useState<number | "">("");
  const [nama, setNama] = useState("");
  const [nomor, setNomor] = useState("");
  const [file, setFile] = useState<string>("");
  const [touched, setTouched] = useState(false);

  // upload modal visibility
  const [openUpload, setOpenUpload] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true); // Show validation errors

    if (tahun === "" || !nama || !nomor || !file) return; // simple guard

    onSave({ tahun: Number(tahun), nama, nomor, file });

    // Reset form
    setTahun("");
    setNama("");
    setNomor("");
    setFile("");
    setTouched(false);
    onClose();
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Unggah Perdes Pendirian BUM Desa"
      >
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Tahun */}
          <div>
            <YearPicker
              label="Tahun Perdes Pendirian BUM Desa"
              placeholder="Masukkan tahun pendirian"
              required
              value={tahun === "" ? undefined : tahun}
              onChange={(y) => setTahun(y ?? "")}
              touched={touched}
            />
            <p className="mt-1 text-xs text-neutral-400">
              Tahun Pengesahan Perdes
            </p>
          </div>

          {/* Nama Dokumen */}
          <div>
            <TextInput
              label="Nama Perdes Pendirian BUM Desa"
              placeholder="Masukkan nama dokumen"
              value={nama}
              onChange={(e: any) => setNama(e.target?.value ?? e)} // supports either event or value
              required
              touched={touched}
            />
            <p className="mt-1 text-xs text-neutral-400">Nama Dokumen</p>
          </div>

          {/* Nomor Perdes */}
          <div>
            <TextInput
              label="Nomor Perdes Pendirian BUM Desa"
              placeholder="Masukkan nomor perdes"
              value={nomor}
              onChange={(e: any) => setNomor(e.target?.value ?? e)}
              required
              touched={touched}
            />
            <p className="mt-1 text-xs text-neutral-400">Nomor Perdes</p>
          </div>

          {/* Lampiran */}
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

          {/* Actions */}
          <div className="pt-2">
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </Modal>

      {/* Upload modal (3rd screenshot behavior) */}
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
