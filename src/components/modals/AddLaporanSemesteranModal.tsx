import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import TextInput from "../ui/TextInput";
import Dropdown from "../ui/Dropdown";
import YearPicker from "../ui/YearPicker";
import Button from "../ui/Button";
import UploadDokumenModal from "./UploadDokumenModal";

export type LaporanSemesteranPayload = {
  namaLaporan: string;
  semester: string;
  tahun: number;
  tanggalUpload: string; // YYYY-MM-DD format (auto-generated)
  file: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: LaporanSemesteranPayload) => void;
  title?: string;
  initialData?: Partial<LaporanSemesteranPayload>;
};

const SEMESTER_OPTIONS = [
  { label: "Ganjil (I)", value: "Ganjil (I)" },
  { label: "Genap (II)", value: "Genap (II)" },
];

export default function AddLaporanSemesteranModal({
  open,
  onClose,
  onSave,
  title = "Tambah Laporan Semesteran",
  initialData,
}: Props) {
  const [namaLaporan, setNamaLaporan] = useState("");
  const [semester, setSemester] = useState("");
  const [tahun, setTahun] = useState<number | "">("");
  const [file, setFile] = useState<string>("");
  const [touched, setTouched] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);

  // Populate fields when editing
  useEffect(() => {
    if (initialData) {
      setNamaLaporan(initialData.namaLaporan ?? "");
      setSemester(initialData.semester ?? "");
      setTahun(initialData.tahun ?? "");
      setFile(initialData.file ?? "");
    }
  }, [initialData]);

  // Reset fields when adding new
  useEffect(() => {
    if (!initialData && open) {
      setNamaLaporan("");
      setSemester("");
      setTahun("");
      setFile("");
      setTouched(false);
    }
  }, [initialData, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    // Validate required fields
    if (!namaLaporan || !semester || tahun === "") {
      return;
    }

    // Auto-generate current date in YYYY-MM-DD format
    const now = new Date();
    const tanggalUpload = now.toISOString().split("T")[0];

    const payload: LaporanSemesteranPayload = {
      namaLaporan,
      semester,
      tahun: Number(tahun),
      tanggalUpload,
      file: file || "-",
    };
    onSave(payload);

    // Reset form
    setNamaLaporan("");
    setSemester("");
    setTahun("");
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
            placeholder="Contoh: Laporan Semesteran Ganjil 2024"
            value={namaLaporan}
            onChange={(e: any) => setNamaLaporan(e.target?.value ?? e)}
            required
            touched={touched}
          />

          {/* Semester */}
          <Dropdown
            label="Semester"
            placeholder="Pilih semester"
            options={SEMESTER_OPTIONS}
            value={semester}
            onChange={setSemester}
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
        onUpload={(file) => {
          setFile(file.name);
          setOpenUpload(false);
        }}
        currentFileName={file && file !== "-" ? file : undefined}
      />
    </>
  );
}
