import { useState } from "react";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import { Trash2 } from "lucide-react";

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

export default function ProfileTab() {
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
    <div className="grid grid-cols-12 gap-6">
      {/* Left column — main form */}
      <Card className="col-span-12 lg:col-span-8 rounded-xl border bg-white shadow-sm">
        <Card.Body className="space-y-4">
          {/* Nama Lengkap */}
          <div>
            <div className="mb-1 flex items-center gap-1 text-sm font-medium text-neutral-700">
              <span>Nama Lengkap BUM Desa</span>
              <span className="text-red-600">*</span>
            </div>
            <Input
              placeholder="Placeholder"
              value={form.namaLengkap}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                update("namaLengkap", e.target.value)
              }
              className="rounded-lg text-neutral-900"
            />
            <p className="mt-1 text-xs text-neutral-400">
              Wajib diisi. Sesuai dengan yang terdaftar pada Administrasi Hukum
              Umum (AHU)
            </p>
          </div>

          {/* Status Badan Hukum */}
          <div>
            <div className="mb-1 flex items-center gap-1 text-sm font-medium text-neutral-700">
              <span>Status Badan Hukum</span>
              <span className="text-red-600">*</span>
            </div>
            <Select
              value={form.statusBadanHukum}
              onChange={(e) => update("statusBadanHukum", e.target.value)}
              options={[
                { label: "Placeholder", value: "" },
                { label: "Sudah Terdaftar", value: "terdaftar" },
                { label: "Belum Terdaftar", value: "belum" },
              ]}
              className="rounded-lg text-neutral-900"
            />
          </div>

          {/* Tahun Pendirian */}
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Tahun Pendirian BUM Desa
            </label>
            <Input
              type="number"
              placeholder="YYYY"
              value={form.tahunPendirian ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                update(
                  "tahunPendirian",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className="rounded-lg text-neutral-900"
            />
          </div>

          {/* Alamat */}
          <div>
            <div className="mb-1 flex items-center gap-1 text-sm font-medium text-neutral-700">
              <span>Alamat Kantor</span>
            </div>
            <Textarea
              placeholder="Write a message"
              value={form.alamatKantor}
              onChange={(e) => update("alamatKantor", e.target.value)}
              rows={3}
              className="rounded-lg text-neutral-900"
            />
          </div>
        </Card.Body>
      </Card>

      {/* Right column — counts + rekening */}
      <div className="col-span-12 space-y-6 lg:col-span-4">
        {/* Counts */}
        <Card className="rounded-xl border bg-white shadow-sm">
          <Card.Body className="space-y-3 text-neutral-700">
            <span>Jumlah Pengurus BUM Desa</span>
            <Input
              placeholder="Total"
              type="number"
              value={form.jumlahPengurus ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                update(
                  "jumlahPengurus",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className="rounded-lg text-neutral-900"
            />
            <div className="grid grid-cols-2 gap-3">
              {/* <span>Jumlah Laki-laki</span> */}
              <div>
                <label className="mb-1 block text-xs text-neutral-700">
                  Jumlah Pengurus Laki-laki
                </label>
                <Input
                  type="number"
                  placeholder="Laki-laki"
                  value={form.tahunPendirian ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    update(
                      "tahunPendirian",
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="rounded-lg text-neutral-900"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-700">
                  Jumlah Pengurus Perempuan
                </label>
                <Input
                  placeholder="Perempuan"
                  type="number"
                  value={form.pengurusP ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    update(
                      "pengurusP",
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="rounded-lg"
                />
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Rekening list */}
        <Card className="rounded-xl bg-white shadow-md ring-1 ring-neutral-200">
          <Card.Header className="px-6 py-4 text-lg font-semibold text-neutral-900 border-b border-neutral-200">
            Rekening BUM Desa
          </Card.Header>

          <Card.Body className="px-6 py-5">
            <Table
              className="text-neutral-800"
              headers={[
                <span key="h1" className="font-semibold text-neutral-800">
                  Bank
                </span>,
                <span key="h2" className="font-semibold text-neutral-800">
                  Nomor Rekening
                </span>,
                <span key="h3" className="font-semibold text-neutral-800">
                  Aksi
                </span>,
              ]}
              rows={
                rekening.length === 0
                  ? []
                  : rekening.map((r, idx) => [
                      <span key={`b-${idx}`} className="text-neutral-800">
                        {r.bank}
                      </span>,
                      <span
                        key={`n-${idx}`}
                        className="font-medium text-neutral-800"
                      >
                        {r.nomor}
                      </span>,
                      <button
                        key={`a-${idx}`}
                        onClick={() => removeRekening(idx)}
                        className="rounded p-1 hover:bg-red-50"
                        aria-label="Hapus"
                        title="Hapus"
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </button>,
                    ])
              }
              emptyText="Tidak ada data yang ditambahkan"
            />

            {/* muted gray button like the design */}
            <div className="mt-4">
              <Button
                variant="secondary"
                className="bg-neutral-500 text-white hover:bg-neutral-600 disabled:opacity-50 rounded-md px-4 py-2"
                onClick={addRekening}
              >
                Tambah Rekening
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Dokumen section */}
      <Card className="col-span-8 rounded-xl bg-white shadow-md ring-1 ring-neutral-200">
        <Card.Header className="px-6 py-4 text-lg font-semibold text-neutral-900 border-b border-neutral-200">
          Peraturan Desa Pendirian BUM Desa
        </Card.Header>

        <Card.Body className="px-6 py-5">
          <Table
            className="text-neutral-800"
            headers={[
              <span key="h1" className="font-semibold text-neutral-800">
                Tahun
              </span>,
              <span key="h2" className="font-semibold text-neutral-800">
                Nomor
              </span>,
              <span key="h3" className="font-semibold text-neutral-800">
                File
              </span>,
              <span key="h4" className="font-semibold text-neutral-800">
                Aksi
              </span>,
            ]}
            rows={
              dokumen.length === 0
                ? []
                : dokumen.map((d, idx) => [
                    <span key={`t-${idx}`}>{d.tahun}</span>,
                    <span key={`no-${idx}`}>{d.nomor}</span>,
                    <span key={`f-${idx}`} className="text-neutral-700">
                      {d.file}
                    </span>,
                    <button
                      key={`a-${idx}`}
                      onClick={() => removeDokumen(idx)}
                      className="rounded p-1 hover:bg-red-50"
                      aria-label="Hapus"
                      title="Hapus"
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </button>,
                  ])
            }
            emptyText="Tidak ada data yang ditambahkan"
          />

          <div className="mt-4">
            <Button
              variant="secondary"
              className="bg-neutral-500 text-white hover:bg-neutral-600 rounded-md px-4 py-2"
              onClick={addDokumen}
            >
              Tambah Dokumen
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Save */}
      <div className="col-span-12 flex justify-end">
        <Button onClick={onSave}>Simpan</Button>
      </div>
    </div>
  );
}
