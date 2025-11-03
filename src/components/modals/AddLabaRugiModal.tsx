import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import YearPicker from "../ui/YearPicker";
import TextInput from "../ui/TextInput";
import Button from "../ui/Button";

export type LabaRugiPayload = {
  tahun: number;
  labaKotor: number;
  bebanGaji: number;
  bebanLainLain: number;
  labaBersih: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: LabaRugiPayload) => void;
  title?: string;
  initialData?: Partial<LabaRugiPayload>;
};

// Utility function for displaying formatted currency (read-only field)
function formatCurrencyDisplay(value: number): string {
  return "Rp " + new Intl.NumberFormat("id-ID").format(value);
}

export default function AddLabaRugiModal({
  open,
  onClose,
  onSave,
  title = "Tambah Data Laba Rugi",
  initialData,
}: Props) {
  const [tahun, setTahun] = useState<number | "">("");
  const [labaKotor, setLabaKotor] = useState<number | "">("");
  const [bebanGaji, setBebanGaji] = useState<number | "">("");
  const [bebanLainLain, setBebanLainLain] = useState<number | "">("");
  const [touched, setTouched] = useState(false);

  // Calculate Laba Bersih automatically
  const labaBersih =
    typeof labaKotor === "number" &&
    typeof bebanGaji === "number" &&
    typeof bebanLainLain === "number"
      ? labaKotor - bebanGaji - bebanLainLain
      : 0;

  // Populate fields when editing
  useEffect(() => {
    if (initialData) {
      setTahun(initialData.tahun ?? "");
      setLabaKotor(initialData.labaKotor ?? "");
      setBebanGaji(initialData.bebanGaji ?? "");
      setBebanLainLain(initialData.bebanLainLain ?? "");
    }
  }, [initialData]);

  // Reset fields when adding new
  useEffect(() => {
    if (!initialData && open) {
      setTahun("");
      setLabaKotor("");
      setBebanGaji("");
      setBebanLainLain("");
      setTouched(false);
    }
  }, [initialData, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    // Validate required fields
    if (tahun === "" || labaKotor === "" || bebanGaji === "" || bebanLainLain === "") {
      return;
    }

    const payload: LabaRugiPayload = {
      tahun: Number(tahun),
      labaKotor: Number(labaKotor),
      bebanGaji: Number(bebanGaji),
      bebanLainLain: Number(bebanLainLain),
      labaBersih,
    };
    onSave(payload);

    // Reset form
    setTahun("");
    setLabaKotor("");
    setBebanGaji("");
    setBebanLainLain("");
    setTouched(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {/* Tahun */}
        <YearPicker
          label="Tahun"
          placeholder="Pilih tahun"
          value={tahun === "" ? undefined : tahun}
          onChange={(y) => setTahun(y ?? "")}
          required
          touched={touched}
        />

        {/* Laba Kotor */}
        <TextInput
          type="number"
          label="Laba Kotor"
          placeholder="Contoh: 50000000"
          value={labaKotor === "" ? "" : String(labaKotor)}
          onChange={(e: any) => {
            const value = e.target?.value ?? e;
            setLabaKotor(value === "" ? "" : Number(value));
          }}
          required
          touched={touched}
        />

        {/* Beban Gaji */}
        <TextInput
          type="number"
          label="Beban Gaji"
          placeholder="Contoh: 5000000"
          value={bebanGaji === "" ? "" : String(bebanGaji)}
          onChange={(e: any) => {
            const value = e.target?.value ?? e;
            setBebanGaji(value === "" ? "" : Number(value));
          }}
          required
          touched={touched}
        />

        {/* Beban Lain-Lain */}
        <TextInput
          type="number"
          label="Beban Lain-Lain"
          placeholder="Contoh: 2000000"
          value={bebanLainLain === "" ? "" : String(bebanLainLain)}
          onChange={(e: any) => {
            const value = e.target?.value ?? e;
            setBebanLainLain(value === "" ? "" : Number(value));
          }}
          required
          touched={touched}
        />

        {/* Laba Bersih (Auto-calculated, Read-only) */}
        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Laba Bersih <span className="text-neutral-400">(Otomatis)</span>
          </label>
          <div className="mt-1 rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
            {formatCurrencyDisplay(labaBersih)}
          </div>
          <p className="mt-1 text-xs text-neutral-400">
            Dihitung otomatis: Laba Kotor - Beban Gaji - Beban Lain-Lain
          </p>
        </div>

        <div className="pt-2">
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </Modal>
  );
}
