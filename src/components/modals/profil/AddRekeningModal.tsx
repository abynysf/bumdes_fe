import { useEffect, useState } from "react";
import Modal from "../../ui/Modal";
import TextInput from "../../ui/TextInput";
import Dropdown from "../../ui/Dropdown";
import Button from "../../ui/Button";

type Rekening = {
  bank: string;
  nama: string;
  nomor: string;
  ketahananPangan?: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (rek: Rekening) => void;
};

const BANK_OPTIONS = [
  { label: "Bank BKK", value: "Bank BKK" },
  { label: "Bank BRI", value: "Bank BRI" },
  { label: "Bank Jateng", value: "Bank Jateng" },
  { label: "Bank Mandiri", value: "Bank Mandiri" },
  { label: "Bank Syariah Indonesia", value: "Bank Syariah Indonesia" },
];

export default function AddRekeningModal({ open, onClose, onSave }: Props) {
  const [bank, setBank] = useState("");
  const [nama, setNama] = useState("");
  const [nomor, setNomor] = useState("");
  const [ketahanan, setKetahanan] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setBank("");
      setNama("");
      setNomor("");
      setKetahanan(false);
      setTouched(false);
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched(true); // Show validation errors

    if (!bank || !nama || !nomor) return;

    onSave({ bank, nama, nomor, ketahananPangan: ketahanan });
    onClose(); // will trigger the reset next time it opens
  }

  return (
    <Modal open={open} onClose={onClose} title="Tambah Rekening">
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
          onChange={(e: any) => setNomor(e?.target?.value ?? e)}
          touched={touched}
        />

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
  );
}
