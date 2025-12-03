import { useEffect, useState } from "react";
import Modal from "../../ui/Modal";
import TextInput from "../../ui/TextInput";
import Dropdown from "../../ui/Dropdown";
import Button from "../../ui/Button";
import UploadDokumenModal from "../UploadDokumenModal";

type Rekening = {
  bank: string;
  nama: string;
  nomor: string;
  ketahananPangan?: boolean;
  keterangan?: string;
  file?: string;
  fileBlob?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (rek: Rekening) => void;
  initialData?: Rekening;
};

const BANK_OPTIONS = [
  { label: "Bank BKK", value: "Bank BKK" },
  { label: "Bank BRI", value: "Bank BRI" },
  { label: "Bank Jateng", value: "Bank Jateng" },
  { label: "Bank Mandiri", value: "Bank Mandiri" },
  { label: "Bank Syariah Indonesia", value: "Bank Syariah Indonesia" },
];

export default function AddRekeningModal({ open, onClose, onSave, initialData }: Props) {
  const [bank, setBank] = useState("");
  const [nama, setNama] = useState("");
  const [nomor, setNomor] = useState("");
  const [ketahanan, setKetahanan] = useState(false);
  const [file, setFile] = useState("");
  const [fileBlob, setFileBlob] = useState("");
  const [touched, setTouched] = useState(false);

  // Upload modal visibility
  const [openUpload, setOpenUpload] = useState(false);

  // Note: We don't revoke blob URL on unmount because it's passed to context
  // and needs to remain valid for preview. Revocation happens only when
  // a new file replaces it (in onUpload handler below).

  useEffect(() => {
    if (open) {
      if (initialData) {
        // Editing mode - populate with existing data
        setBank(initialData.bank);
        setNama(initialData.nama);
        setNomor(initialData.nomor);
        setKetahanan(initialData.ketahananPangan ?? false);
        setFile(initialData.file ?? "");
        setFileBlob(initialData.fileBlob ?? "");
      } else {
        // Add mode - reset all fields
        setBank("");
        setNama("");
        setNomor("");
        setKetahanan(false);
        setFile("");
        setFileBlob("");
      }
      setTouched(false);
    }
  }, [open, initialData]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched(true); // Show validation errors

    if (!bank || !nama || !nomor) return;

    onSave({
      bank,
      nama,
      nomor,
      ketahananPangan: ketahanan,
      keterangan: ketahanan ? "Ketahanan Pangan" : undefined,
      file: file || undefined,
      fileBlob: fileBlob || undefined,
    });
    onClose(); // will trigger the reset next time it opens
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={initialData ? "Edit Rekening" : "Tambah Rekening"}
      >
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {/* Nama Bank (Dropdown) */}
        <Dropdown
          label="Nama Bank"
          required
          placeholder="Masukkan nama bank"
          options={BANK_OPTIONS}
          value={bank}
          onChange={(val) => setBank(val)}
          touched={touched}
        />

        {/* Nama Pemilik Rekening */}
        <TextInput
          label="Nama Pemilik Rekening"
          required
          placeholder="Masukkan nama pemilik rekening"
          value={nama}
          onChange={(e: any) => setNama(e?.target?.value ?? e)}
          touched={touched}
        />

        {/* Nomor Rekening */}
        <TextInput
          label="Nomor Rekening BUM Desa"
          required
          placeholder="Masukkan nomor rekening"
          value={nomor}
          onChange={(e: any) => {
            const value = e?.target?.value ?? e;
            // Only allow numbers
            if (/^\d*$/.test(value)) {
              setNomor(value);
            }
          }}
          touched={touched}
        />

        {/* File Upload */}
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

        {/* Checkbox */}
        <label className="mt-2 flex items-center gap-2 text-sm text-neutral-800">
          <input
            type="checkbox"
            checked={ketahanan}
            onChange={(e) => setKetahanan(e.target.checked)}
          />
          Rekening untuk ketahanan pangan
        </label>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
          >
            Batal
          </button>
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </Modal>

      {/* Upload modal */}
      <UploadDokumenModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onUpload={(f) => {
          // Revoke previous blob URL if exists
          if (fileBlob) {
            URL.revokeObjectURL(fileBlob);
          }
          setFile(f.name);
          setFileBlob(URL.createObjectURL(f));
          setOpenUpload(false);
        }}
        currentFileName={file || undefined}
      />
    </>
  );
}
