import { useEffect, useState } from "react";
import Modal from "../../ui/Modal";
import TextInput from "../../ui/TextInput";
import Button from "../../ui/Button";
import YearPicker from "../../ui/YearPicker";
import DatePicker from "../../ui/DatePicker";
import UploadDokumenModal from "../UploadDokumenModal";

type DocumentData = {
  id?: number;
  periode?: string;
  tahun?: string;
  nomor: string;
  file: string;
  fileBlob?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (dokumen: DocumentData) => void;
  title?: string;
  keterangan?: string;
  initialData?: DocumentData;
  useTahun?: boolean; // If true, uses single "Tahun" field instead of "Periode" range
};

export default function AddStrukturDokumenModal({
  open,
  onClose,
  onSave,
  title,
  keterangan,
  initialData,
  useTahun = false,
}: Props) {
  const [awal, setAwal] = useState<string>("");
  const [akhir, setAkhir] = useState<string>("");
  const [tahun, setTahun] = useState<number | "">("");
  const [nomor, setNomor] = useState("");
  const [file, setFile] = useState<string>("");
  const [fileBlob, setFileBlob] = useState<string>("");
  const [touched, setTouched] = useState(false);

  // upload modal visibility
  const [openUpload, setOpenUpload] = useState(false);

  // Populate fields when editing
  useEffect(() => {
    if (open && initialData) {
      if (useTahun && initialData.tahun) {
        // Single year mode
        setTahun(parseInt(initialData.tahun, 10) || "");
      } else if (initialData.periode) {
        // Parse periode string "2020-01-01–2025-12-31" back to date strings
        const [awalStr, akhirStr] = initialData.periode.split("–");
        setAwal(awalStr || "");
        setAkhir(akhirStr || "");
      }
      setNomor(initialData.nomor === "-" ? "" : initialData.nomor);
      setFile(initialData.file === "-" ? "" : initialData.file);
      setFileBlob(initialData.fileBlob ?? "");
      setTouched(false);
    } else if (open && !initialData) {
      // Reset form when opening for new entry
      setAwal("");
      setAkhir("");
      setTahun("");
      setNomor("");
      setFile("");
      setFileBlob("");
      setTouched(false);
    }
  }, [open, initialData, useTahun]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true); // Show validation errors

    if (useTahun) {
      // Single year mode validation
      if (tahun === "") {
        return; // Validation failed
      }

      onSave({
        id: initialData?.id,
        tahun: tahun.toString(),
        nomor: nomor.trim() || "-",
        file: file || "-",
        fileBlob: fileBlob || undefined,
      });
    } else {
      // Periode range mode validation
      if (awal === "" || akhir === "") {
        return; // Validation failed - errors will show
      }

      // Check year range
      if (akhir < awal) {
        return; // Error already shown via YearPicker error prop
      }

      const periode = `${awal}–${akhir}`;
      onSave({
        id: initialData?.id,
        periode,
        nomor: nomor.trim() || "-",
        file: file || "-",
        fileBlob: fileBlob || undefined,
      });
    }
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={title ?? "Tambah Data Dokumen"}
      >
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Year field(s) - single year or range */}
          {useTahun ? (
            <div>
              <YearPicker
                label="Tahun"
                placeholder="Pilih tahun"
                required
                value={tahun === "" ? undefined : tahun}
                onChange={(y) => setTahun(y ?? "")}
                touched={touched}
              />
              <p className="mt-1 text-xs text-neutral-400">
                Tahun tersimpan: <span className="font-medium">{tahun || "Belum dipilih"}</span>
              </p>
            </div>
          ) : (
            <div>
              <div className="flex gap-2">
                <DatePicker
                  label="Awal Periode"
                  placeholder="Pilih tanggal"
                  required
                  value={awal}
                  onChange={(date) => setAwal(date || "")}
                  touched={touched}
                />
                <DatePicker
                  label="Akhir Periode"
                  placeholder="Pilih tanggal"
                  required
                  value={akhir}
                  onChange={(date) => setAkhir(date || "")}
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
                  {awal && akhir ? `${awal.slice(0, 4)} sampai ${akhir.slice(0, 4)}` : "Belum lengkap"}
                </span>
              </p>
            </div>
          )}

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
