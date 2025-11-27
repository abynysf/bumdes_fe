import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import TextInput from "../ui/TextInput";
import Dropdown from "../ui/Dropdown";
import YearPicker from "../ui/YearPicker";
import Button from "../ui/Button";
import UploadDokumenModal from "./UploadDokumenModal";

export type LaporanPengawasPayload = {
  namaLaporan: string;
  bulan: string;
  tahun: number;
  tanggalUpload: string; // YYYY-MM-DD format (auto-generated)
  fileLaporan: string;
  dokumentasi: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: LaporanPengawasPayload) => void;
  title?: string;
  initialData?: Partial<LaporanPengawasPayload>;
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

export default function AddLaporanPengawasModal({
  open,
  onClose,
  onSave,
  title = "Tambah Laporan Pengawas",
  initialData,
}: Props) {
  const [namaLaporan, setNamaLaporan] = useState("");
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState<number | "">("");
  const [fileLaporan, setFileLaporan] = useState<string>("");
  const [dokumentasi, setDokumentasi] = useState<string>("");
  const [touched, setTouched] = useState(false);
  const [openUploadLaporan, setOpenUploadLaporan] = useState(false);
  const [openUploadDok, setOpenUploadDok] = useState(false);

  // Populate fields when editing
  useEffect(() => {
    if (initialData) {
      setNamaLaporan(initialData.namaLaporan ?? "");
      setBulan(initialData.bulan ?? "");
      setTahun(initialData.tahun ?? "");
      setFileLaporan(initialData.fileLaporan ?? "");
      setDokumentasi(initialData.dokumentasi ?? "");
    }
  }, [initialData]);

  // Reset fields when adding new
  useEffect(() => {
    if (!initialData && open) {
      setNamaLaporan("");
      setBulan("");
      setTahun("");
      setFileLaporan("");
      setDokumentasi("");
      setTouched(false);
    }
  }, [initialData, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    // Validate required fields
    if (!namaLaporan || !bulan || tahun === "") {
      return;
    }

    // Auto-generate current date in YYYY-MM-DD format
    const now = new Date();
    const tanggalUpload = now.toISOString().split("T")[0];

    const payload: LaporanPengawasPayload = {
      namaLaporan,
      bulan,
      tahun: Number(tahun),
      tanggalUpload,
      fileLaporan: fileLaporan || "-",
      dokumentasi: dokumentasi || "-",
    };
    onSave(payload);

    // Reset form
    setNamaLaporan("");
    setBulan("");
    setTahun("");
    setFileLaporan("");
    setDokumentasi("");
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
            placeholder="Contoh: Laporan Pengawasan Bulanan Agustus"
            value={namaLaporan}
            onChange={(e: any) => setNamaLaporan(e.target?.value ?? e)}
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

          {/* File Laporan Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              File Laporan (PDF)
            </label>
            <p className="mt-1 text-xs text-neutral-400">
              {fileLaporan && fileLaporan !== "-"
                ? `Terpilih: ${fileLaporan}`
                : "Belum ada dokumen terunggah"}
            </p>
            <button
              type="button"
              onClick={() => setOpenUploadLaporan(true)}
              className="mt-2 rounded-md bg-neutral-600 px-4 py-2 text-sm text-white hover:bg-neutral-700"
            >
              Choose File
            </button>
            <p className="mt-1 text-xs text-neutral-400">
              Kosongkan jika tidak ingin mengubah file.
            </p>
          </div>

          {/* Dokumentasi Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Dokumentasi (PDF)
            </label>
            <p className="mt-1 text-xs text-neutral-400">
              {dokumentasi && dokumentasi !== "-"
                ? `Terpilih: ${dokumentasi}`
                : "Belum ada dokumen terunggah"}
            </p>
            <button
              type="button"
              onClick={() => setOpenUploadDok(true)}
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

      {/* Upload modals */}
      <UploadDokumenModal
        open={openUploadLaporan}
        onClose={() => setOpenUploadLaporan(false)}
        onUpload={(file) => {
          setFileLaporan(file.name);
          setOpenUploadLaporan(false);
        }}
        currentFileName={fileLaporan && fileLaporan !== "-" ? fileLaporan : undefined}
      />
      <UploadDokumenModal
        open={openUploadDok}
        onClose={() => setOpenUploadDok(false)}
        onUpload={(file) => {
          setDokumentasi(file.name);
          setOpenUploadDok(false);
        }}
        currentFileName={dokumentasi && dokumentasi !== "-" ? dokumentasi : undefined}
      />
    </>
  );
}
