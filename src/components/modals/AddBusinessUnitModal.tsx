import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import TextInput from "../ui/TextInput";
import Dropdown from "../ui/Dropdown";
import Textarea from "../ui/Textarea";
import DatePicker from "../ui/DatePicker";
import Button from "../ui/Button";

export type BusinessUnitPayload = {
  namaUnit: string;
  jenisUsaha: string;
  detailUsaha: string;
  tanggalBerdiri: string;
  totalModal: number | "";
  omzetTahunIni: number | "";
  status: "Aktif" | "Tidak Aktif";
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (unit: BusinessUnitPayload) => void;
  title?: string;
  initialData?: Partial<BusinessUnitPayload>;
};

const JENIS_USAHA_OPTIONS = [
  { value: "Pertanian padi", label: "Pertanian padi" },
  { value: "Pertanian jagung", label: "Pertanian jagung" },
  { value: "Pertanian buah", label: "Pertanian buah" },
  { value: "Pertanian sayur", label: "Pertanian sayur" },
  { value: "Pertanian lain-lain", label: "Pertanian lain-lain" },
  { value: "Perikanan lele", label: "Perikanan lele" },
  { value: "Perikanan nila", label: "Perikanan nila" },
  { value: "Perikanan lain-lain", label: "Perikanan lain-lain" },
  { value: "Peternakan ayam", label: "Peternakan ayam" },
  { value: "Peternakan kambing", label: "Peternakan kambing" },
  { value: "Peternakan sapi", label: "Peternakan sapi" },
  { value: "Simpan Pinjam", label: "Simpan Pinjam" },
  {
    value: "Pengelolaan Air Desa (PAM Desa/Pamsimas)",
    label: "Pengelolaan Air Desa (PAM Desa/Pamsimas)",
  },
  {
    value: "Perdagangan Ritel (Toko Sembako/Kelontong)",
    label: "Perdagangan Ritel (Toko Sembako/Kelontong)",
  },
  { value: "Pengelolaan Wisata Desa", label: "Pengelolaan Wisata Desa" },
  {
    value: "Jasa Pembayaran Digital (PPOB & BRILink, samsat digital)",
    label: "Jasa Pembayaran Digital (PPOB & BRILink, samsat digital)",
  },
  { value: "Pengelolaan Pasar Desa", label: "Pengelolaan Pasar Desa" },
  { value: "Jasa Internet Desa", label: "Jasa Internet Desa" },
  {
    value: "Jasa Fotocopy dan Penjualan ATK",
    label: "Jasa Fotocopy dan Penjualan ATK",
  },
  { value: "Pengelolaan Sampah", label: "Pengelolaan Sampah" },
  {
    value: "Pompanisasi (Pengelolaan Air Irigasi)",
    label: "Pompanisasi (Pengelolaan Air Irigasi)",
  },
  {
    value: "Persewaan Properti (Kios/Ruko)",
    label: "Persewaan Properti (Kios/Ruko)",
  },
  { value: "Usaha Kerajinan Lokal", label: "Usaha Kerajinan Lokal" },
  { value: "Jasa Transportasi", label: "Jasa Transportasi" },
  { value: "Lain-lain", label: "Lain-lain" },
];

const STATUS_OPTIONS = [
  { value: "Aktif", label: "Aktif" },
  { value: "Tidak Aktif", label: "Tidak Aktif" },
];

export default function AddBusinessUnitModal({
  open,
  onClose,
  onSave,
  title = "Tambah Unit Usaha Baru",
  initialData,
}: Props) {
  const [namaUnit, setNamaUnit] = useState("");
  const [jenisUsaha, setJenisUsaha] = useState("");
  const [detailUsaha, setDetailUsaha] = useState("");
  const [tanggalBerdiri, setTanggalBerdiri] = useState("");
  const [totalModal, setTotalModal] = useState<number | "">("");
  const [omzetTahunIni, setOmzetTahunIni] = useState<number | "">("");
  const [status, setStatus] = useState<"Aktif" | "Tidak Aktif">("Aktif");
  const [touched, setTouched] = useState(false);

  // Populate fields when editing
  useEffect(() => {
    if (initialData) {
      setNamaUnit(initialData.namaUnit ?? "");
      setJenisUsaha(initialData.jenisUsaha ?? "");
      setDetailUsaha(initialData.detailUsaha ?? "");
      setTanggalBerdiri(initialData.tanggalBerdiri ?? "");
      setTotalModal(initialData.totalModal ?? "");
      setOmzetTahunIni(initialData.omzetTahunIni ?? "");
      setStatus(initialData.status ?? "Aktif");
    }
  }, [initialData]);

  // Reset fields when adding new
  useEffect(() => {
    if (!initialData && open) {
      setNamaUnit("");
      setJenisUsaha("");
      setDetailUsaha("");
      setTanggalBerdiri("");
      setTotalModal("");
      setOmzetTahunIni("");
      setStatus("Aktif");
      setTouched(false);
    }
  }, [initialData, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    // Validate required fields
    if (
      !namaUnit ||
      !jenisUsaha ||
      !detailUsaha ||
      !tanggalBerdiri ||
      totalModal === "" ||
      omzetTahunIni === ""
    ) {
      return;
    }

    const payload: BusinessUnitPayload = {
      namaUnit,
      jenisUsaha,
      detailUsaha,
      tanggalBerdiri,
      totalModal,
      omzetTahunIni,
      status,
    };
    onSave(payload);

    // Reset form
    setNamaUnit("");
    setJenisUsaha("");
    setDetailUsaha("");
    setTanggalBerdiri("");
    setTotalModal("");
    setOmzetTahunIni("");
    setStatus("Aktif");
    setTouched(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {/* Nama Unit Usaha */}
        <TextInput
          label="Nama Unit Usaha"
          placeholder="Masukkan nama unit usaha"
          value={namaUnit}
          onChange={(e: any) => setNamaUnit(e.target?.value ?? e)}
          required
          touched={touched}
        />

        {/* Jenis Usaha */}
        <Dropdown
          label="Jenis Usaha"
          options={JENIS_USAHA_OPTIONS}
          value={jenisUsaha}
          onChange={(value) => setJenisUsaha(value)}
          placeholder="Pilih Jenis..."
          required
          touched={touched}
        />

        {/* Detail Usaha */}
        <Textarea
          label="Detail Usaha"
          placeholder="Contoh: Menjual sembako"
          value={detailUsaha}
          onChange={(e: any) => setDetailUsaha(e.target?.value ?? e)}
          required
          touched={touched}
          rows={3}
        />

        {/* Tanggal Berdiri */}
        <DatePicker
          label="Tanggal Berdiri"
          placeholder="Pilih tanggal berdiri"
          value={tanggalBerdiri}
          onChange={(date) => setTanggalBerdiri(date || "")}
          required
          touched={touched}
        />

        {/* Total Modal */}
        <TextInput
          label="Total Modal (Rp)"
          type="number"
          placeholder="Contoh: 50000000"
          value={totalModal as any}
          onChange={(e: any) => {
            const v = e.target?.value ?? e;
            const num = v === "" ? "" : Number(v);
            setTotalModal(Number.isNaN(num) ? "" : num);
          }}
          required
          touched={touched}
        />

        {/* Omzet Tahun Ini */}
        <TextInput
          label="Omzet Tahun Ini (Rp)"
          type="number"
          placeholder="Contoh: 150000000"
          value={omzetTahunIni as any}
          onChange={(e: any) => {
            const v = e.target?.value ?? e;
            const num = v === "" ? "" : Number(v);
            setOmzetTahunIni(Number.isNaN(num) ? "" : num);
          }}
          required
          touched={touched}
        />

        {/* Status */}
        <Dropdown
          label="Status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(value) => setStatus(value as "Aktif" | "Tidak Aktif")}
          required
          touched={touched}
        />

        <div className="pt-2">
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </Modal>
  );
}
