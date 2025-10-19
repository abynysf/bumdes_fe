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
  gaji?: string;
  keterangan?: string;
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
  ShowGaji?: boolean;
  ShowKeterangan?: boolean;
};

export default function AddPengurusBUMModal({
  open,
  onClose,
  onSave,
  title,
  initialData,
  ShowJabatan = false,
  ShowUnit = false,
  ShowGaji = false,
  ShowKeterangan = false,
}: Props) {
  const [jabatan, setJabatan] = useState("");
  const [nama, setNama] = useState("");
  const [unit, setUnit] = useState("");
  const [pekerjaan, setPekerjaan] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [gaji, setGaji] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [touched, setTouched] = useState(false);

  // Populate fields when editing
  useEffect(() => {
    if (open && initialData) {
      setJabatan(initialData.jabatan ?? "");
      setNama(initialData.nama);
      setUnit(initialData.unit ?? "");
      setPekerjaan(initialData.pekerjaan);
      setNomorTelepon(initialData.nomorTelepon);
      setGaji(initialData.gaji ?? "");
      setKeterangan(initialData.keterangan ?? "");
      setTouched(false);
    } else if (open && !initialData) {
      // Reset form when opening for new entry
      setJabatan("");
      setNama("");
      setUnit("");
      setPekerjaan("");
      setNomorTelepon("");
      setGaji("");
      setKeterangan("");
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
      (!ShowUnit || unit) &&
      (!ShowGaji || gaji);

    if (!requiredFieldsFilled) return;

    const payload: PersonData = {
      nama,
      pekerjaan,
      nomorTelepon,
      ...(ShowJabatan ? { jabatan } : {}),
      ...(ShowUnit ? { unit } : {}),
      ...(ShowGaji ? { gaji } : {}),
      ...(ShowKeterangan ? { keterangan } : {}),
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

        {ShowGaji && (
          <div>
            <TextInput
              label="Gaji"
              placeholder="Masukkan gaji (contoh: Rp 2.500.000)"
              value={gaji}
              onChange={(e: any) => setGaji(e.target?.value ?? e)}
              required
              touched={touched}
            />
          </div>
        )}

        {ShowKeterangan && (
          <div>
            <TextInput
              label="Keterangan"
              placeholder="Masukkan keterangan (opsional)"
              value={keterangan}
              onChange={(e: any) => setKeterangan(e.target?.value ?? e)}
              touched={touched}
            />
          </div>
        )}

        <div className="pt-2">
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </Modal>
  );
}
