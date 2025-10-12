import { useEffect, useState } from "react";
import Modal from "../../ui/Modal";
import TextInput from "../../ui/TextInput";
import Button from "../../ui/Button";

type PersonData = {
  jabatan?: string;
  unit?: string;
  nama: string;
  pekerjaan: string;
  nomorTelepon: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (person: PersonData) => void;
  title?: string;
  initialData?: PersonData;

  /** Toggle field visibility per use-case */
  ShowJabatan?: boolean;
  ShowUnit?: boolean;
};

export default function AddPengurusBUMModal({
  open,
  onClose,
  onSave,
  title,
  initialData,
  ShowJabatan = false,
  ShowUnit = false,
}: Props) {
  const [jabatan, setJabatan] = useState("");
  const [nama, setNama] = useState("");
  const [unit, setUnit] = useState("");
  const [pekerjaan, setPekerjaan] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [touched, setTouched] = useState(false);

  // Populate fields when editing
  useEffect(() => {
    if (open && initialData) {
      setJabatan(initialData.jabatan ?? "");
      setNama(initialData.nama);
      setUnit(initialData.unit ?? "");
      setPekerjaan(initialData.pekerjaan);
      setNomorTelepon(initialData.nomorTelepon);
      setTouched(false);
    } else if (open && !initialData) {
      // Reset form when opening for new entry
      setJabatan("");
      setNama("");
      setUnit("");
      setPekerjaan("");
      setNomorTelepon("");
      setTouched(false);
    }
  }, [open, initialData]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true); // Show validation errors

    // Validate required fields based on visibility
    const requiredFieldsFilled =
      nama &&
      pekerjaan &&
      nomorTelepon &&
      (!ShowJabatan || jabatan) &&
      (!ShowUnit || unit);

    if (!requiredFieldsFilled) return;

    const payload: PersonData = {
      nama,
      pekerjaan,
      nomorTelepon,
      ...(ShowJabatan ? { jabatan } : {}),
      ...(ShowUnit ? { unit } : {}),
    };
    onSave(payload);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title ?? "Data Kepala Unit BUM Desa"}
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {ShowJabatan && (
          <div>
            <TextInput
              label="Jabatan"
              placeholder="Masukkan jabatan"
              value={jabatan}
              onChange={(e: any) => setJabatan(e.target?.value ?? e)}
              required
              touched={touched}
            />
          </div>
        )}

        {ShowUnit && (
          <div>
            <TextInput
              label="Nama Unit"
              placeholder="Masukkan nama unit"
              value={unit}
              onChange={(e: any) => setUnit(e.target?.value ?? e)}
              required
              touched={touched}
            />
          </div>
        )}

        <div>
          <TextInput
            label="Masukkan Nama Pengurus"
            placeholder="Masukkan nama pengurus"
            value={nama}
            onChange={(e: any) => setNama(e.target?.value ?? e)}
            required
            touched={touched}
          />
        </div>

        <div>
          <TextInput
            label="Pekerjaan Pengurus"
            placeholder="Masukkan pekerjaan"
            value={pekerjaan}
            onChange={(e: any) => setPekerjaan(e.target?.value ?? e)}
            required
            touched={touched}
          />
        </div>

        <div>
          <TextInput
            label="Nomor Telepon Pengurus"
            placeholder="Masukkan nomor telepon"
            value={nomorTelepon}
            onChange={(e: any) => setNomorTelepon(e.target?.value ?? e)}
            required
            touched={touched}
          />
        </div>

        <div className="pt-2">
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </Modal>
  );
}
