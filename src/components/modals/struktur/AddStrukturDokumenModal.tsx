import { useEffect, useState } from "react";
import Modal from "../../ui/Modal";
import TextInput from "../../ui/TextInput";
import Button from "../../ui/Button";
import YearPicker from "../../ui/YearPicker";
import UploadDokumenModal from "../UploadDokumenModal";

type DocumentData = {
  periode: string;
  nomor: string;
  file: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (dokumen: DocumentData) => void;
  title?: string;
  keterangan?: string;
  initialData?: DocumentData;
};

export default function AddStrukturDokumenModal({
  open,
  onClose,
  onSave,
  title,
  keterangan,
  initialData,
}: Props) {
  const [awal, setAwal] = useState<number | "">("");
  const [akhir, setAkhir] = useState<number | "">("");
  const [nomor, setNomor] = useState("");
  const [file, setFile] = useState<string>("");
  const [touched, setTouched] = useState(false);

  // upload modal visibility
  const [openUpload, setOpenUpload] = useState(false);

  // Populate fields when editing
  useEffect(() => {
    if (open && initialData) {
      // Parse periode string "2020–2025" back to numbers
      const [awalStr, akhirStr] = initialData.periode.split("–");
      setAwal(awalStr ? parseInt(awalStr, 10) : "");
      setAkhir(akhirStr ? parseInt(akhirStr, 10) : "");
      setNomor(initialData.nomor === "-" ? "" : initialData.nomor);
      setFile(initialData.file === "-" ? "" : initialData.file);
      setTouched(false);
    } else if (open && !initialData) {
      // Reset form when opening for new entry
      setAwal("");
      setAkhir("");
      setNomor("");
      setFile("");
      setTouched(false);
    }
  }, [open, initialData]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true); // Show validation errors

    // Only validate required fields (years)
    if (awal === "" || akhir === "") {
      return; // Validation failed - errors will show
    }

    // Check year range
    if (akhir < awal) {
      return; // Error already shown via YearPicker error prop
    }

    const periode = `${awal}–${akhir}`;
    // Use "-" for empty optional fields
    onSave({
      periode,
      nomor: nomor.trim() || "-",
      file: file || "-"
    });
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={title ?? "Tambah Data Dokumen"}
      >
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Periode (awal-akhir) */}
          <div>
            <div className="flex gap-2">
              <YearPicker
                label="Awal Periode"
                placeholder="Pilih tahun"
                required
                value={awal === "" ? undefined : awal}
                onChange={(y) => setAwal(y ?? "")}
                touched={touched}
              />
              <YearPicker
                label="Akhir Periode"
                placeholder="Pilih tahun"
                required
                value={akhir === "" ? undefined : akhir}
                onChange={(y) => setAkhir(y ?? "")}
                touched={touched}
                error={
                  akhir !== "" && awal !== "" && akhir < awal
                    ? "Harus lebih besar dari awal periode"
                    : undefined
                }
              />
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              Periode tersimpan sebagai:{" "}
              <span className="font-medium">
                {awal && akhir ? `${awal}–${akhir}` : "Belum lengkap"}
              </span>
            </p>
          </div>

          {/* Nomor Dokumen */}
          <div>
            <TextInput
              label={keterangan ?? "Nomor Surat Keputusan / Berita Acara"}
              placeholder={
                "Masukkan" + (keterangan ? ` ${keterangan}` : " Dokumen")
              }
              value={nomor}
              onChange={(e: any) => setNomor(e.target?.value ?? e)}
            />
            <p className="mt-1 text-xs text-neutral-400">Nomor Surat</p>
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
