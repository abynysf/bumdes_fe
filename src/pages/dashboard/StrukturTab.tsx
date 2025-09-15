import { useState } from "react";
import YearPicker from "../../components/ui/YearPicker";
import Button from "../../components/ui/Button";
import DataCard from "../../components/ui/DataCard";

type FormState = {
  namaLengkap: string;
  statusBadanHukum: string;
  tahunPendirian?: number | "";
  alamatKantor: string;
  jumlahPengurus?: number | "";
  pengurusL?: number | "";
  pengurusP?: number | "";
};

type Rekening = { bank: string; nomor: string };
type Dokumen = { tahun: number; nomor: string; file: string };

export default function StrukturTab() {
  // main form
  const [form, setForm] = useState<FormState>({
    namaLengkap: "",
    statusBadanHukum: "",
    tahunPendirian: "",
    alamatKantor: "",
    jumlahPengurus: "",
    pengurusL: "",
    pengurusP: "",
  });

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // small lists
  const [rekening, setRekening] = useState<Rekening[]>([]);
  const [dokumen, setDokumen] = useState<Dokumen[]>([]);

  function addRekening() {
    const bank = prompt("Nama bank?");
    if (!bank) return;
    const nomor = prompt("Nomor rekening?");
    if (!nomor) return;
    setRekening((r) => [...r, { bank, nomor }]);
  }
  function removeRekening(idx: number) {
    setRekening((r) => r.filter((_, i) => i !== idx));
  }

  function addDokumen() {
    const tahunStr = prompt("Tahun?");
    const nomor = prompt("Nomor dokumen?");
    const file = prompt("Nama file?");
    const tahun = tahunStr ? Number(tahunStr) : NaN;
    if (!tahunStr || Number.isNaN(tahun) || !nomor || !file) return;
    setDokumen((d) => [...d, { tahun, nomor, file }]);
  }
  function removeDokumen(idx: number) {
    setDokumen((d) => d.filter((_, i) => i !== idx));
  }

  function onSave() {
    // TODO: swap with API
    console.log({ form, rekening, dokumen });
    alert("Saved (mock). Check console.");
  }

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* Main form */}
      <div className="col-span-full lg:col-span-6 space-y-4">
        {/* Nama Lengkap */}
        <div>
          <div className="flex gap-2">
            <YearPicker
              label="Awal Periode Kepengurusan"
              required
              placeholder="Pilih tahun"
            />
            <YearPicker
              label="Akhir Periode Kepengurusan"
              required
              placeholder="Pilih tahun"
            />
          </div>
          <p className="mt-1 text-xs text-red-500">
            Perhatian! Mengubah bagian ini dapat mempengaruhi data yang lain
          </p>
        </div>
      </div>

      {/* Right column */}
      <div className="col-span-full space-y-4 ">
        {/* Direktur */}
        <DataCard label="Pengurus BUM Desa" buttonLabel="Ubah Data">
          <div className="border border-t-neutral-200">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-neutral-50 text-left text-sm font-semibold text-neutral-700">
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Jabatan
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nama
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Pekerjaan
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nomor Telepon
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-4 text-center text-sm text-neutral-400"
                  >
                    Tidak ada data yang ditambahkan
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </DataCard>

        <DataCard label="Kepala Unit BUM Desa" buttonLabel="Tambah Data">
          <div className="border border-t-neutral-200">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-neutral-50 text-left text-sm font-semibold text-neutral-700">
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Jabatan
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nama
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Pekerjaan
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nomor Telepon
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-4 text-center text-sm text-neutral-400"
                  >
                    Tidak ada data yang ditambahkan
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </DataCard>

        <DataCard label="Pengawas BUM Desa" buttonLabel="Tambah Data">
          <div className="border border-t-neutral-200">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-neutral-50 text-left text-sm font-semibold text-neutral-700">
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Jabatan
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nama
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Pekerjaan
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nomor Telepon
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-4 text-center text-sm text-neutral-400"
                  >
                    Tidak ada data yang ditambahkan
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </DataCard>

        {/* Double card */}
        <div className="flex flex-col lg:flex-row gap-4">
          <DataCard
            label="Surat Keputusan BUM Desa"
            buttonLabel="Tambah Data"
            note="Periode kepengerusan telah diubah. Harap masukkan data terbaru!"
            className="flex-1"
          >
            <div className="border border-t-neutral-200">
              <table className="w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-neutral-50 text-left text-sm font-semibold text-neutral-700">
                    <th className="border-b border-neutral-200 px-3 py-3">
                      Periode
                    </th>
                    <th className="border-b border-neutral-200 px-3 py-3">
                      Nomor
                    </th>
                    <th className="border-b border-neutral-200 px-3 py-3">
                      File
                    </th>
                    <th className="border-b border-neutral-200 px-3 py-3 text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </DataCard>

          <DataCard
            label="Berita Acara Serah Terima Pengurus BUM Desa"
            buttonLabel="Tambah Data"
            note="Periode kepengerusan telah diubah. Harap masukkan data terbaru!"
            className="flex-1"
          >
            <div className="border border-t-neutral-200">
              <table className="w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-neutral-50 text-left text-sm font-semibold text-neutral-700">
                    <th className="border-b border-neutral-200 px-3 py-3">
                      Periode
                    </th>
                    <th className="border-b border-neutral-200 px-3 py-3">
                      Nomor
                    </th>
                    <th className="border-b border-neutral-200 px-3 py-3">
                      File
                    </th>
                    <th className="border-b border-neutral-200 px-3 py-3 text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </DataCard>
        </div>
      </div>

      {/* Save */}
      <div className="col-span-full flex justify-end">
        <Button onClick={onSave}>Simpan</Button>
      </div>
    </div>
  );
}
