import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import TextInput from "../ui/TextInput";
import Textarea from "../ui/Textarea";
import Dropdown from "../ui/Dropdown";
import YearPicker from "../ui/YearPicker";
import Button from "../ui/Button";
import UploadDokumenModal from "./UploadDokumenModal";

export type LaporanBulananPayload = {
  namaLaporan: string;
  unit: string;
  bulan: string;
  tahun: number;
  keterangan: string;
  tanggalUpload: string; // YYYY-MM-DD format (auto-generated)
  file: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: LaporanBulananPayload) => void;
  title?: string;
  initialData?: Partial<LaporanBulananPayload>;
};

const MONTH_OPTIONS = [
  { label: "Januari", value: "Januari" },
  { label: "Februari", value: "Februari" },
  { label: "Maret", value: "Maret" },
  { label: "April", value: "April" },
  { label: "Mei", value: "Mei" },
  { label: "Juni", value: "Juni" },
  { label: "Juli", value: "Juli" },
  { label: "Agustus", value: "Agustus" },
  { label: "September", value: "September" },
  { label: "Oktober", value: "Oktober" },
  { label: "November", value: "November" },
  { label: "Desember", value: "Desember" },
];

export default function AddLaporanBulananModal({
  open,
  onClose,
  onSave,
  title = "Tambah Laporan Bulanan",
  initialData,
}: Props) {
  const [namaLaporan, setNamaLaporan] = useState("");
  const [unit, setUnit] = useState("");
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState<number | "">("");
  const [keterangan, setKeterangan] = useState("");
  const [file, setFile] = useState<string>("");
  const [touched, setTouched] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);

  // Populate fields when editing
  useEffect(() => {
    if (initialData) {
      setNamaLaporan(initialData.namaLaporan ?? "");
      setUnit(initialData.unit ?? "");
      setBulan(initialData.bulan ?? "");
      setTahun(initialData.tahun ?? "");
      setKeterangan(initialData.keterangan ?? "");
      setFile(initialData.file ?? "");
    }
  }, [initialData]);

  // Reset fields when adding new
  useEffect(() => {
    if (!initialData && open) {
      setNamaLaporan("");
      setUnit("");
      setBulan("");
      setTahun("");
      setKeterangan("");
      setFile("");
      setTouched(false);
    }
  }, [initialData, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    // Validate required fields
    if (!namaLaporan || !unit || !bulan || tahun === "") {
      return;
    }

    // Auto-generate current date in YYYY-MM-DD format
    const now = new Date();
    const tanggalUpload = now.toISOString().split("T")[0];

    const payload: LaporanBulananPayload = {
      namaLaporan,
      unit,
      bulan,
      tahun: Number(tahun),
      keterangan,
      tanggalUpload,
      file: file || "-",
    };
    onSave(payload);

    // Reset form
    setNamaLaporan("");
    setUnit("");
    setBulan("");
    setTahun("");
    setKeterangan("");
    setFile("");
    setTouched(false);
    onClose();
  }

  return (
    <>
      <Modal open={open} onClose={onClose} title={title}>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Nama Laporan */}
          <TextInput
            label="Nama Laporan"
            placeholder="Contoh: Laporan Bulanan Unit Peternakan"
            value={namaLaporan}
            onChange={(e: any) => setNamaLaporan(e.target?.value ?? e)}
            required
            touched={touched}
          />

          {/* Unit */}
          <TextInput
            label="Unit"
            placeholder="Contoh: Unit Peternakan"
            value={unit}
            onChange={(e: any) => setUnit(e.target?.value ?? e)}
            required
            touched={touched}
          />

          {/* Bulan */}
          <Dropdown
            label="Bulan"
            placeholder="Pilih bulan"
            options={MONTH_OPTIONS}
            value={bulan}
            onChange={setBulan}
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

          {/* Keterangan */}
          <Textarea
            label="Keterangan"
            placeholder="Keterangan tambahan"
            value={keterangan}
            onChange={(e: any) => setKeterangan(e.target?.value ?? e)}
            rows={3}
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
