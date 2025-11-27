import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import YearPicker from "../ui/YearPicker";
import TextInput from "../ui/TextInput";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import UploadDokumenModal from "./UploadDokumenModal";

export type HasilMusdesPayload = {
  tahun: number;
  labaBersih: number;
  labaDitahan: number;
  padDariBumDesa: number;
  buktiPad: string;
  kegiatanPadUntukApa: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: HasilMusdesPayload) => void;
  title?: string;
  initialData?: Partial<HasilMusdesPayload>;
};


export default function AddHasilMusdesModal({
  open,
  onClose,
  onSave,
  title = "Tambah Hasil Musdes",
  initialData,
}: Props) {
  const [tahun, setTahun] = useState<number | "">("");
  const [labaBersih, setLabaBersih] = useState<number | "">("");
  const [labaDitahan, setLabaDitahan] = useState<number | "">("");
  const [padDariBumDesa, setPadDariBumDesa] = useState<number | "">("");
  const [buktiPad, setBuktiPad] = useState<string>("");
  const [kegiatanPadUntukApa, setKegiatanPadUntukApa] = useState("");
  const [touched, setTouched] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);

  // Populate fields when editing
  useEffect(() => {
    if (initialData) {
      setTahun(initialData.tahun ?? "");
      setLabaBersih(initialData.labaBersih ?? "");
      setLabaDitahan(initialData.labaDitahan ?? "");
      setPadDariBumDesa(initialData.padDariBumDesa ?? "");
      setBuktiPad(initialData.buktiPad ?? "");
      setKegiatanPadUntukApa(initialData.kegiatanPadUntukApa ?? "");
    }
  }, [initialData]);

  // Reset fields when adding new
  useEffect(() => {
    if (!initialData && open) {
      setTahun("");
      setLabaBersih("");
      setLabaDitahan("");
      setPadDariBumDesa("");
      setBuktiPad("");
      setKegiatanPadUntukApa("");
      setTouched(false);
    }
  }, [initialData, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    // Validate required fields
    if (
      tahun === "" ||
      labaBersih === "" ||
      labaDitahan === "" ||
      padDariBumDesa === "" ||
      !kegiatanPadUntukApa
    ) {
      return;
    }

    const payload: HasilMusdesPayload = {
      tahun: Number(tahun),
      labaBersih: Number(labaBersih),
      labaDitahan: Number(labaDitahan),
      padDariBumDesa: Number(padDariBumDesa),
      buktiPad: buktiPad || "-",
      kegiatanPadUntukApa,
    };
    onSave(payload);

    // Reset form
    setTahun("");
    setLabaBersih("");
    setLabaDitahan("");
    setPadDariBumDesa("");
    setBuktiPad("");
    setKegiatanPadUntukApa("");
    setTouched(false);
    onClose();
  }

  return (
    <>
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

          {/* Laba Bersih */}
          <TextInput
            type="number"
            label="Laba Bersih"
            placeholder="Contoh: 50000000"
            value={labaBersih === "" ? "" : String(labaBersih)}
            onChange={(e: any) => {
              const value = e.target?.value ?? e;
              setLabaBersih(value === "" ? "" : Number(value));
            }}
            required
            touched={touched}
          />

          {/* Laba Ditahan */}
          <TextInput
            type="number"
            label="Laba Ditahan"
            placeholder="Contoh: 30000000"
            value={labaDitahan === "" ? "" : String(labaDitahan)}
            onChange={(e: any) => {
              const value = e.target?.value ?? e;
              setLabaDitahan(value === "" ? "" : Number(value));
            }}
            required
            touched={touched}
          />

          {/* PAD dari BUM Desa */}
          <TextInput
            type="number"
            label="PAD dari BUM Desa"
            placeholder="Contoh: 20000000"
            value={padDariBumDesa === "" ? "" : String(padDariBumDesa)}
            onChange={(e: any) => {
              const value = e.target?.value ?? e;
              setPadDariBumDesa(value === "" ? "" : Number(value));
            }}
            required
            touched={touched}
          />

          {/* Bukti PAD (File Upload) */}
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Bukti PAD
            </label>
            <p className="mt-1 text-xs text-neutral-400">
              {buktiPad && buktiPad !== "-"
                ? `Terpilih: ${buktiPad}`
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

          {/* Kegiatan PAD untuk Apa */}
          <Textarea
            label="Kegiatan PAD untuk Apa"
            placeholder="Contoh: Bantuan sosial dan rehab RTLH"
            rows={4}
            value={kegiatanPadUntukApa}
            onChange={(e: any) => setKegiatanPadUntukApa(e.target?.value ?? e)}
            required
            touched={touched}
          />

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
          setBuktiPad(file.name);
          setOpenUpload(false);
        }}
        currentFileName={buktiPad && buktiPad !== "-" ? buktiPad : undefined}
      />
    </>
  );
}
