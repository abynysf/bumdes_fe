// pages/dashboard/ProfileTab.tsx
import { useState } from "react";
import TextInput from "../../components/ui/TextInput";
import Dropdown from "../../components/ui/Dropdown";
import YearPicker from "../../components/ui/YearPicker";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import DataCard from "../../components/ui/DataCard";
import AddDokumenModal from "../../components/modals/AddDokumenModal";
import AddRekeningModal from "../../components/modals/AddRekeningModal";
import UploadDokumenModal from "../../components/modals/UploadDokumenModal";
import { Download, Trash2 } from "lucide-react";

type FormState = {
  namaLengkap: string;
  statusBadanHukum: string;
  tahunPendirian?: number | "";
  alamatKantor: string;
  jumlahPengurus?: number | "";
  pengurusL?: number | "";
  pengurusP?: number | "";
};

export default function ProfileTab() {
  // ---- Main form ------------------------------------------------------------
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

  // ---- Lists ----------------------------------------------------------------
  type Rekening = {
    bank: string;
    nama: string;
    nomor: string;
    ketahananPangan?: boolean;
  };
  type Dokumen = { tahun: number; nama: string; nomor: string; file: string };

  const [rekening, setRekening] = useState<Rekening[]>([]);
  const [dokumen, setDokumen] = useState<Dokumen[]>([]);

  // ---- Modals state ----------------------------------------------------------
  const [openRekening, setOpenRekening] = useState(false);
  const [openDokumen, setOpenDokumen] = useState(false);

  const [skBadanHukumFile, setSkBadanHukumFile] = useState("");
  const [openUploadSK, setOpenUploadSK] = useState(false);

  // ---- Actions --------------------------------------------------------------
  function openAddRekening() {
    setOpenRekening(true);
  }
  function saveRekeningFromModal(newRek: Rekening) {
    setRekening((prev) => [...prev, newRek]);
    setOpenRekening(false);
  }
  function removeRekening(idx: number) {
    setRekening((prev) => prev.filter((_, i) => i !== idx));
  }

  function openAddDokumen() {
    setOpenDokumen(true);
  }
  function saveDokumenFromModal(newDoc: Dokumen) {
    setDokumen((prev) => [...prev, newDoc]);
    setOpenDokumen(false);
  }
  function removeDokumen(idx: number) {
    setDokumen((prev) => prev.filter((_, i) => i !== idx));
  }

  function isUrl(str: string) {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }

  function downloadDokumen(file: string) {
    // If it's a URL, open in a new tab. Otherwise, just trigger a download hint or handle as needed.
    if (isUrl(file)) {
      window.open(file, "_blank", "noopener,noreferrer");
    } else {
      // If you store only file names, you can replace this with your file-serving URL
      // e.g. window.open(`/api/files/${encodeURIComponent(file)}`, "_blank");
      alert("Tidak ada URL untuk diunduh. Simpan sebagai nama file: " + file);
    }
  }

  function onSave() {
    // TODO: call your API here
    console.log({ form, rekening, dokumen });
    alert("Saved (mock). Check console.");
  }

  // ---- UI -------------------------------------------------------------------
  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* LEFT: Main form */}
      <div className="col-span-full space-y-4 lg:col-span-7">
        <div>
          <TextInput
            label="Nama Lengkap BUM Desa"
            required
            placeholder="Masukkan nama lengkap BUM Desa"
            value={form.namaLengkap}
            onChange={(e) => update("namaLengkap", e.target.value)}
          />
          <p className="mt-1 text-xs text-neutral-400">
            Wajib diisi. Sesuai dengan yang terdaftar pada Administrasi Hukum
            Umum (AHU)
          </p>
        </div>

        <Dropdown
          label="Status Badan Hukum"
          required
          placeholder="Pilih status badan hukum"
          options={[
            { label: "Sudah Terbit", value: "terbit" },
            { label: "Dalam Proses", value: "proses" },
          ]}
          value={form.statusBadanHukum}
          onChange={(value) => update("statusBadanHukum", value)}
        />

        {form.statusBadanHukum === "terbit" && (
          <div className="mt-2">
            <label className="mb-1 flex items-center gap-1 text-sm font-medium text-neutral-700">
              <span className="text-red-600">*</span>
              <span>Surat Keterangan Badan Hukum</span>
            </label>

            <p className="text-xs text-neutral-400">
              {skBadanHukumFile
                ? `Terpilih: ${skBadanHukumFile}`
                : "Belum ada data terunggah"}
            </p>

            <button
              type="button"
              onClick={() => setOpenUploadSK(true)}
              className="mt-2 rounded-md bg-neutral-500 px-4 py-2 text-xs text-white hover:bg-neutral-600 font-semibold"
            >
              Unggah Dokumen
            </button>
          </div>
        )}

        <YearPicker
          label="Tahun Pendirian BUM Desa"
          required
          placeholder="Pilih tahun"
          value={form.tahunPendirian === "" ? undefined : form.tahunPendirian}
          onChange={(y) => update("tahunPendirian", y ?? "")}
        />

        <Textarea
          label="Alamat Kantor"
          required
          rows={6}
          placeholder="Masukkan alamat kantor"
          value={form.alamatKantor}
          onChange={(e) => update("alamatKantor", e.target.value)}
        />

        {/* Dokumen list */}
        <DataCard
          label="Peraturan Desa Pendirian BUM Desa"
          buttonLabel="Tambah Dokumen"
          onButtonClick={() => openAddDokumen()}
        >
          <div className="border border-t-neutral-200">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-neutral-50 text-left text-sm font-semibold text-neutral-700">
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Tahun
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nama
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
                {dokumen.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  dokumen.map((d, i) => (
                    <tr key={`${d.nomor}-${i}`} className="text-sm">
                      <td className="border-b border-neutral-200 px-3 py-2 text-neutral-800">
                        {d.tahun}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2 text-neutral-800">
                        {d.nama}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2 text-neutral-800">
                        {d.nomor}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2 text-neutral-800">
                        {/* If it's a URL, show as a link; if not, just the filename */}
                        {isUrl(d.file) ? (
                          <a
                            href={d.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {d.file}
                          </a>
                        ) : (
                          d.file
                        )}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        <div className="flex justify-end gap-2">
                          {/* Download */}
                          <button
                            type="button"
                            onClick={() => downloadDokumen(d.file)}
                            className="inline-flex items-center rounded p-1.5 hover:bg-emerald-50"
                            title="Unduh"
                            aria-label="Unduh dokumen"
                          >
                            <Download className="h-4 w-4 text-emerald-600" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => removeDokumen(i)}
                            className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
                            title="Hapus"
                            aria-label="Hapus dokumen"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DataCard>
      </div>

      {/* RIGHT: counts + rekening */}
      <div className="col-span-full space-y-4 lg:col-span-5">
        <div>
          <TextInput
            label="Jumlah Pengurus BUM Desa"
            placeholder="Masukkan jumlah pengurus BUM Desa"
            value={String(form.jumlahPengurus ?? "")}
            onChange={(e: any) =>
              update(
                "jumlahPengurus",
                e.target.value ? Number(e.target.value) : ""
              )
            }
          />

          <div className="mt-4 flex gap-3">
            <TextInput
              label="Laki-laki"
              placeholder="Jumlah pengurus laki-laki"
              className="flex-1"
              value={String(form.pengurusL ?? "")}
              onChange={(e: any) =>
                update(
                  "pengurusL",
                  e.target.value ? Number(e.target.value) : ""
                )
              }
            />
            <TextInput
              label="Perempuan"
              placeholder="Jumlah pengurus perempuan"
              className="flex-1"
              value={String(form.pengurusP ?? "")}
              onChange={(e: any) =>
                update(
                  "pengurusP",
                  e.target.value ? Number(e.target.value) : ""
                )
              }
            />
          </div>
        </div>

        <DataCard
          label="Rekening BUM Desa"
          buttonLabel="Tambah Rekening"
          onButtonClick={() => openAddRekening()}
        >
          <div className="border border-t-neutral-200">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-neutral-50 text-left text-sm font-semibold text-neutral-700">
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Bank
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nama
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nomor Rekening
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {rekening.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  rekening.map((r, i) => (
                    <tr
                      key={`${r.bank}-${r.nomor}-${i}`}
                      className={`
                text-sm text-neutral-800
                ${r.ketahananPangan ? "bg-emerald-50" : ""}
              `}
                    >
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {r.bank}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {r.nama}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {r.nomor}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2 text-right">
                        <button
                          type="button"
                          className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
                          onClick={() => removeRekening(i)}
                          title="Hapus"
                          aria-label="Hapus rekening"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DataCard>
      </div>

      {/* Save */}
      <div className="col-span-full flex justify-end">
        <Button onClick={onSave}>Simpan</Button>
      </div>

      {/* ---- Modals ---------------------------------------------------------- */}
      <AddRekeningModal
        open={openRekening}
        onClose={() => setOpenRekening(false)}
        onSave={saveRekeningFromModal}
      />

      <AddDokumenModal
        open={openDokumen}
        onClose={() => setOpenDokumen(false)}
        onSave={saveDokumenFromModal}
      />
      <UploadDokumenModal
        open={openUploadSK}
        onClose={() => setOpenUploadSK(false)}
        onSave={(uploaded) => {
          setSkBadanHukumFile(uploaded);
          setOpenUploadSK(false);
        }}
      />
    </div>
  );
}
