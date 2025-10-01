import { useState } from "react";
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
};

export default function AddStrukturDokumenModal({
  open,
  onClose,
  onSave,
  title,
  keterangan,
}: Props) {
  const [awal, setAwal] = useState<number | "">("");
  const [akhir, setAkhir] = useState<number | "">("");
  const [nomor, setNomor] = useState("");
  const [file, setFile] = useState<string>("");

  // upload modal visibility
  const [openUpload, setOpenUpload] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (awal === "" || akhir === "" || !nomor || !file) return; // simple guard
    const periode = `${awal}–${akhir}`;
    onSave({ periode, nomor, file });
    onClose();
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={title ?? "Tambah Data Dokumen"}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Periode (awal-akhir) */}
          <div>
            <div className="flex gap-2">
              <YearPicker
                label="Awal Periode"
                placeholder="Pilih tahun"
                required
                value={awal === "" ? undefined : awal}
                onChange={(y) => setAwal(y ?? "")}
              />
              <YearPicker
                label="Akhir Periode"
                placeholder="Pilih tahun"
                required
                value={akhir === "" ? undefined : akhir}
                onChange={(y) => setAkhir(y ?? "")}
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
