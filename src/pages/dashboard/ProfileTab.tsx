import React, { useCallback, useReducer, useState } from "react";
import TextInput from "../../components/ui/TextInput";
import Dropdown from "../../components/ui/Dropdown";
import YearPicker from "../../components/ui/YearPicker";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import DataCard from "../../components/ui/DataCard";
import AddDokumenModal from "../../components/modals/profil/AddDokumenModal";
import AddRekeningModal from "../../components/modals/profil/AddRekeningModal";
import UploadDokumenModal from "../../components/modals/UploadDokumenModal";
import SaveResultModal from "../../components/modals/SaveResultModal";
import { Download, Trash2 } from "lucide-react";

/* ===========================
 * Types
 * =========================== */

type BaseProfile = {
  namaLengkap: string;
  statusBadanHukum: string;
  tahunPendirian: number | "";
  alamatKantor: string;
  jumlahPengurus: number | "";
  pengurusL: number | "";
  pengurusP: number | "";
  skBadanHukumFile: string | null;
};

type DokumenPerdes = {
  tahun: number;
  nama: string;
  nomor: string;
  file: string;
};

type RekeningBUM = {
  bank: string;
  nama: string;
  nomor: string;
  ketahananPangan?: boolean;
};

type ProfileState = {
  form: BaseProfile;
  dokumen: DokumenPerdes[];
  rekening: RekeningBUM[];
};

/* ===========================
 * Initials
 * =========================== */

const INITIAL: ProfileState = {
  form: {
    namaLengkap: "",
    statusBadanHukum: "",
    tahunPendirian: "",
    alamatKantor: "",
    jumlahPengurus: "",
    pengurusL: "",
    pengurusP: "",
    skBadanHukumFile: null,
  },
  dokumen: [],
  rekening: [],
};

/* ===========================
 * Utils
 * =========================== */

function isUrl(value: string): boolean {
  try {
    if (!value || !value.trim()) return false;
    const url = new URL(value);
    return Boolean(url.protocol && url.host);
  } catch {
    return false;
  }
}

/* ===========================
 * Reducer (sederhana & terpusat)
 * =========================== */

type Action =
  | {
      type: "form/update";
      key: keyof BaseProfile;
      value: BaseProfile[keyof BaseProfile];
    }
  | { type: "rekening/add"; payload: RekeningBUM }
  | { type: "rekening/remove"; index: number }
  | { type: "dokumen/add"; payload: DokumenPerdes }
  | { type: "dokumen/remove"; index: number }
  | { type: "sk/set"; payload: string | null }
  | { type: "reset" };

function dataReducer(state: ProfileState, action: Action): ProfileState {
  switch (action.type) {
    case "form/update":
      return { ...state, form: { ...state.form, [action.key]: action.value } };

    case "rekening/add":
      return { ...state, rekening: [...state.rekening, action.payload] };
    case "rekening/remove":
      return {
        ...state,
        rekening: state.rekening.filter((_, i) => i !== action.index),
      };
    case "dokumen/add":
      return { ...state, dokumen: [...state.dokumen, action.payload] };
    case "dokumen/remove":
      return {
        ...state,
        dokumen: state.dokumen.filter((_, i) => i !== action.index),
      };
    case "sk/set":
      return {
        ...state,
        form: { ...state.form, skBadanHukumFile: action.payload },
      };
    case "reset":
      return INITIAL;
    default:
      return state;
  }
}

/* ===========================
 * Component
 * =========================== */

export default function ProfileTab() {
  const [state, dispatch] = useReducer(dataReducer, INITIAL);

  // modal flags
  const [openRekening, setOpenRekening] = useState(false);
  const [openDokumen, setOpenDokumen] = useState(false);
  const [openUploadSK, setOpenUploadSK] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);

  // Handlers
  const updateForm = useCallback(
    (key: keyof BaseProfile, value: BaseProfile[keyof BaseProfile]) =>
      dispatch({ type: "form/update", key, value }),
    []
  );

  // Number handler (only allow digits and empty)
  const handleNumber = useCallback(
    (
        key: keyof Pick<
          BaseProfile,
          "jumlahPengurus" | "pengurusL" | "pengurusP"
        >
      ) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.trim();
        if (raw === "") return updateForm(key, "");
        if (/^\d+$/.test(raw)) updateForm(key, Number(raw));
      },
    [updateForm]
  );

  const downloadFile = useCallback((file: string) => {
    if (isUrl(file)) {
      window.open(file, "_blank", "noopener,noreferrer");
    } else {
      alert("Tidak ada URL. Nama file tersimpan: " + file);
    }
  }, []);

  const onSave = useCallback(() => {
    // TODO: ganti dengan API call
    console.log("[SAVE] profil payload:", state);
    setSavedOpen(true);
  }, [state]);

  // modal save helpers
  const saveRekening = useCallback((rek: RekeningBUM) => {
    dispatch({ type: "rekening/add", payload: rek });
    setOpenRekening(false);
  }, []);

  const saveDokumen = useCallback((doc: DokumenPerdes) => {
    dispatch({ type: "dokumen/add", payload: doc });
    setOpenDokumen(false);
  }, []);

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* Left: Main form */}
      <div className="col-span-full space-y-4 lg:col-span-7">
        <div>
          <TextInput
            label="Nama Lengkap BUM Desa"
            required
            placeholder="Masukkan nama lengkap BUM Desa"
            value={state.form.namaLengkap}
            onChange={(e) => updateForm("namaLengkap", e.target.value)}
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
          value={state.form.statusBadanHukum}
          onChange={(value) => updateForm("statusBadanHukum", value)}
        />

        {state.form.statusBadanHukum === "terbit" && (
          <div className="mt-2">
            <label className="mb-1 flex items-center gap-1 text-sm font-medium text-neutral-700">
              <span className="text-red-600">*</span>
              <span>Surat Keterangan Badan Hukum</span>
            </label>

            <p className="text-xs text-neutral-400">
              {state.form.skBadanHukumFile
                ? `Terpilih: ${state.form.skBadanHukumFile}`
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
          value={
            state.form.tahunPendirian === ""
              ? undefined
              : state.form.tahunPendirian
          }
          onChange={(y) => updateForm("tahunPendirian", y ?? "")}
        />

        <Textarea
          label="Alamat Kantor"
          required
          rows={6}
          placeholder="Masukkan alamat kantor"
          value={state.form.alamatKantor}
          onChange={(e) => updateForm("alamatKantor", e.target.value)}
        />

        {/* Dokumen list */}
        <DataCard
          label="Peraturan Desa Pendirian BUM Desa"
          buttonLabel="Tambah Dokumen"
          onButtonClick={() => setOpenDokumen(true)}
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
                {state.dokumen.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  state.dokumen.map((d, i) => (
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
                          <button
                            type="button"
                            onClick={() => downloadFile(d.file)}
                            className="inline-flex items-center rounded p-1.5 hover:bg-emerald-50"
                            title="Unduh"
                            aria-label="Unduh dokumen"
                          >
                            <Download className="h-4 w-4 text-emerald-600" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              dispatch({ type: "dokumen/remove", index: i })
                            }
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
            value={String(state.form.jumlahPengurus ?? "")}
            onChange={handleNumber("jumlahPengurus")}
          />

          <div className="mt-4 flex gap-3">
            <TextInput
              label="Laki-laki"
              placeholder="Jumlah pengurus laki-laki"
              className="flex-1"
              value={String(state.form.pengurusL ?? "")}
              onChange={handleNumber("pengurusL")}
            />
            <TextInput
              label="Perempuan"
              placeholder="Jumlah pengurus perempuan"
              className="flex-1"
              value={String(state.form.pengurusP ?? "")}
              onChange={handleNumber("pengurusP")}
            />
          </div>
        </div>

        <DataCard
          label="Rekening BUM Desa"
          buttonLabel="Tambah Rekening"
          onButtonClick={() => setOpenRekening(true)}
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
                {state.rekening.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  state.rekening.map((r, i) => (
                    <tr
                      key={`${r.bank}-${r.nomor}-${i}`}
                      className={`text-sm text-neutral-800 ${
                        r.ketahananPangan ? "bg-emerald-50" : ""
                      }`}
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
                          onClick={() =>
                            dispatch({ type: "rekening/remove", index: i })
                          }
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

      {/* Modals */}
      <AddRekeningModal
        open={openRekening}
        onClose={() => setOpenRekening(false)}
        onSave={saveRekening}
      />

      <AddDokumenModal
        open={openDokumen}
        onClose={() => setOpenDokumen(false)}
        onSave={saveDokumen}
      />

      <UploadDokumenModal
        open={openUploadSK}
        onClose={() => setOpenUploadSK(false)}
        onSave={(uploaded) => {
          dispatch({ type: "sk/set", payload: uploaded });
          setOpenUploadSK(false);
        }}
      />

      <SaveResultModal
        open={savedOpen}
        onClose={() => setSavedOpen(false)}
        title="Data Profil Tersimpan"
        autoCloseMs={1500}
      />
    </div>
  );
}
