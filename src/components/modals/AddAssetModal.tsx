import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import TextInput from "../ui/TextInput";
import Button from "../ui/Button";
import YearPicker from "../ui/YearPicker";
import UploadDokumenModal from "./UploadDokumenModal";

export type AssetPayload = {
  jenisInventaris: string;
  nomorInventaris: string;
  tanggalPembelian: number | "";
  unit: number | "";
  hargaSatuan: number | "";
  hargaPerolehan: number | "";
  umurEkonomis: number | "";
  buktiPembelian: string;
  buktiPembelianBlob?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (asset: AssetPayload) => void;
  title?: string;
  initialData?: Partial<AssetPayload>;
};

export default function AddAssetModal({
  open,
  onClose,
  onSave,
  title = "Formulir Pencatatan Aset",
  initialData,
}: Props) {
  const [jenisInventaris, setJenisInventaris] = useState("");
  const [nomorInventaris, setNomorInventaris] = useState("");
  const [tanggalPembelian, setTanggalPembelian] = useState<number | "">("");
  const [unit, setUnit] = useState<number | "">("");
  const [hargaSatuan, setHargaSatuan] = useState<number | "">("");
  const [hargaPerolehan, setHargaPerolehan] = useState<number | "">("");
  const [umurEkonomis, setUmurEkonomis] = useState<number | "">("");
  const [buktiPembelian, setBuktiPembelian] = useState("");
  const [buktiPembelianBlob, setBuktiPembelianBlob] = useState("");
  const [touched, setTouched] = useState(false);

  const [openUpload, setOpenUpload] = useState(false);

  // Auto-calculate Harga Perolehan when Unit or Harga Satuan changes
  useEffect(() => {
    if (unit !== "" && hargaSatuan !== "") {
      setHargaPerolehan(Number(unit) * Number(hargaSatuan));
    } else {
      setHargaPerolehan("");
    }
  }, [unit, hargaSatuan]);

  // Populate fields when editing
  useEffect(() => {
    if (initialData) {
      setJenisInventaris(initialData.jenisInventaris ?? "");
      setNomorInventaris(initialData.nomorInventaris ?? "");
      setTanggalPembelian(initialData.tanggalPembelian ?? "");
      setUnit(initialData.unit ?? "");
      setHargaSatuan(initialData.hargaSatuan ?? "");
      setHargaPerolehan(initialData.hargaPerolehan ?? "");
      setUmurEkonomis(initialData.umurEkonomis ?? "");
      setBuktiPembelian(initialData.buktiPembelian ?? "");
      setBuktiPembelianBlob(initialData.buktiPembelianBlob ?? "");
    }
  }, [initialData]);

  // Reset fields when adding new
  useEffect(() => {
    if (!initialData && open) {
      setJenisInventaris("");
      setNomorInventaris("");
      setTanggalPembelian("");
      setUnit("");
      setHargaSatuan("");
      setHargaPerolehan("");
      setUmurEkonomis("");
      setBuktiPembelian("");
      setBuktiPembelianBlob("");
      setTouched(false);
    }
  }, [initialData, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    // Validate required fields
    if (
      !jenisInventaris ||
      !nomorInventaris ||
      !tanggalPembelian ||
      unit === "" ||
      hargaSatuan === "" ||
      umurEkonomis === ""
    ) {
      return;
    }

    const payload: AssetPayload = {
      jenisInventaris,
      nomorInventaris,
      tanggalPembelian,
      unit,
      hargaSatuan,
      hargaPerolehan: hargaPerolehan !== "" ? hargaPerolehan : 0,
      umurEkonomis,
      buktiPembelian: buktiPembelian || "-",
      buktiPembelianBlob: buktiPembelianBlob || undefined,
    };
    onSave(payload);

    // Reset form
    setJenisInventaris("");
    setNomorInventaris("");
    setTanggalPembelian("");
    setUnit("");
    setHargaSatuan("");
    setHargaPerolehan("");
    setUmurEkonomis("");
    setBuktiPembelian("");
    setBuktiPembelianBlob("");
    setTouched(false);
    onClose();
  }

  return (
    <>
      <Modal open={open} onClose={onClose} title={title}>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Jenis Inventaris */}
          <TextInput
            label="Jenis Inventaris"
            placeholder="Contoh: Laptop, Meja Kantor"
            value={jenisInventaris}
            onChange={(e: any) => setJenisInventaris(e.target?.value ?? e)}
            required
            touched={touched}
          />

          {/* Nomor Inventaris */}
          <TextInput
            label="Nomor Inventaris"
            placeholder="Contoh: BUMDES/INV/001"
            value={nomorInventaris}
            onChange={(e: any) => setNomorInventaris(e.target?.value ?? e)}
            required
            touched={touched}
          />

          {/* Tanggal Pembelian (Year) */}
          <YearPicker
            label="Tahun Pembelian"
            placeholder="Pilih tahun"
            value={tanggalPembelian === "" ? undefined : tanggalPembelian}
            onChange={(y) => setTanggalPembelian(y ?? "")}
            required
            touched={touched}
          />

          {/* Bukti Pembelian */}
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Bukti Pembelian
            </label>
            <p className="mt-1 text-xs text-neutral-400">
              {buktiPembelian
                ? `Terpilih: ${buktiPembelian}`
                : "Belum ada dokumen terunggah"}
            </p>
            <button
              type="button"
              onClick={() => setOpenUpload(true)}
              className="mt-2 rounded-md bg-neutral-600 px-4 py-2 text-sm text-white hover:bg-neutral-700"
            >
              Pilih file...
            </button>
          </div>

          {/* Unit */}
          <TextInput
            label="Unit"
            type="number"
            placeholder="Jumlah barang"
            value={unit as any}
            onChange={(e: any) => {
              const v = e.target?.value ?? e;
              const num = v === "" ? "" : Number(v);
              setUnit(Number.isNaN(num) ? "" : num);
            }}
            required
            touched={touched}
          />

          {/* Harga Satuan */}
          <TextInput
            label="Harga Satuan (Rp)"
            type="number"
            placeholder="Contoh: 5000000"
            value={hargaSatuan as any}
            onChange={(e: any) => {
              const v = e.target?.value ?? e;
              const num = v === "" ? "" : Number(v);
              setHargaSatuan(Number.isNaN(num) ? "" : num);
            }}
            required
            touched={touched}
          />

          {/* Harga Perolehan (Auto-calculated, read-only) */}
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Harga Perolehan (Rp)
            </label>
            <input
              type="text"
              value={
                hargaPerolehan !== ""
                  ? new Intl.NumberFormat("id-ID").format(Number(hargaPerolehan))
                  : ""
              }
              readOnly
              disabled
              className="mt-1 block w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm text-neutral-600"
            />
            <p className="mt-1 text-xs text-neutral-400">
              Otomatis dihitung: Unit × Harga Satuan
            </p>
          </div>

          {/* Umur Ekonomis */}
          <TextInput
            label="Umur Ekonomis (Bulan)"
            type="number"
            placeholder="Contoh: 48 (untuk 4 tahun)"
            value={umurEkonomis as any}
            onChange={(e: any) => {
              const v = e.target?.value ?? e;
              const num = v === "" ? "" : Number(v);
              setUmurEkonomis(Number.isNaN(num) ? "" : num);
            }}
            required
            touched={touched}
          />

          <div className="pt-2">
            <Button type="submit">Simpan Aset</Button>
          </div>
        </form>
      </Modal>

      {/* Upload modal */}
      <UploadDokumenModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onUpload={(file) => {
          // Revoke previous blob URL if exists
          if (buktiPembelianBlob) {
            URL.revokeObjectURL(buktiPembelianBlob);
          }
          setBuktiPembelian(file.name);
          setBuktiPembelianBlob(URL.createObjectURL(file));
          setOpenUpload(false);
        }}
        currentFileName={buktiPembelian || undefined}
      />
    </>
  );
}
