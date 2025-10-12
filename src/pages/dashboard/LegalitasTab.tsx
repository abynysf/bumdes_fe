import { useCallback, useReducer, useState } from "react";
import Button from "../../components/ui/Button";
import DataCard from "../../components/ui/DataCard";
import { Download, Trash2 } from "lucide-react";
import AddAnggaranModal from "../../components/modals/legalitas/AddLegalDokumenModal";
import SaveResultModal from "../../components/modals/SaveResultModal";

/**
 * ===========================
 * Types
 * ===========================
 */

type BaseDokumen = {
  tahun: number;
  nama: string;
  nominal?: number | "";
  file: string;
};

type DokumenART = {
  tahun: number;
  nama: string;
  nominal?: number | "";
  file: string;
};

type DokumenPerdes = {
  tahun: number;
  nama: string;
  nomor: string;
  nominal?: number | "";
  file: string;
};

type LegalitasState = {
  anggaranDasar: BaseDokumen[];
  anggaranRumahTangga: DokumenART[];
  perdesPenyertaanModal: DokumenPerdes[];
};

/**
 * ===========================
 * Initial
 * ===========================
 */
const INITIAL: LegalitasState = {
  anggaranDasar: [],
  anggaranRumahTangga: [],
  perdesPenyertaanModal: [],
};

/**
 * ===========================
 * Utils
 * ===========================
 */
function isUrl(value: string): boolean {
  try {
    if (!value || !value.trim()) return false;
    const url = new URL(value);
    return Boolean(url.protocol && url.host);
  } catch {
    return false;
  }
}

function formatCurrency(value: number | "" | undefined): string {
  if (value === "" || value === undefined || value === null) {
    return "-";
  }
  return "Rp" + Intl.NumberFormat("id-ID").format(Number(value));
}

/**
 * ===========================
 * Reducer (sederhana & terpusat)
 * ===========================
 */

type Action =
  | { type: "ad/add"; payload: BaseDokumen }
  | { type: "ad/remove"; index: number }
  | { type: "art/add"; payload: DokumenART }
  | { type: "art/remove"; index: number }
  | { type: "perdes/add"; payload: DokumenPerdes }
  | { type: "perdes/remove"; index: number }
  | { type: "reset" };

function reducer(state: LegalitasState, action: Action): LegalitasState {
  switch (action.type) {
    case "ad/add":
      return {
        ...state,
        anggaranDasar: [...state.anggaranDasar, action.payload],
      };
    case "ad/remove":
      return {
        ...state,
        anggaranDasar: state.anggaranDasar.filter((_, i) => i !== action.index),
      };

    case "art/add":
      return {
        ...state,
        anggaranRumahTangga: [...state.anggaranRumahTangga, action.payload],
      };
    case "art/remove":
      return {
        ...state,
        anggaranRumahTangga: state.anggaranRumahTangga.filter(
          (_, i) => i !== action.index
        ),
      };

    case "perdes/add":
      return {
        ...state,
        perdesPenyertaanModal: [...state.perdesPenyertaanModal, action.payload],
      };
    case "perdes/remove":
      return {
        ...state,
        perdesPenyertaanModal: state.perdesPenyertaanModal.filter(
          (_, i) => i !== action.index
        ),
      };

    case "reset":
      return INITIAL;

    default:
      return state;
  }
}

/**
 * ===========================
 * Component
 * ===========================
 */
export default function LegalitasTab() {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  // Modal flags
  const [openAD, setOpenAD] = useState(false);
  const [openART, setOpenART] = useState(false);
  const [openPerdes, setOpenPerdes] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);

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

  // Helpers menerima hasil dari modal
  // Define the LegalDokumenPayload type (adjust fields as needed)
  type LegalDokumenPayload = {
    tahun: number;
    nama: string;
    nominal?: number | "";
    file: string;
    nomor?: string;
  };

  const saveAD = useCallback((d: LegalDokumenPayload) => {
    const payload: BaseDokumen = {
      tahun: d.tahun,
      nama: d.nama,
      nominal: d.nominal ?? "",
      file: d.file,
    };
    dispatch({ type: "ad/add", payload });
    setOpenAD(false);
  }, []);

  const saveART = useCallback((d: LegalDokumenPayload) => {
    const payload: DokumenART = {
      tahun: d.tahun,
      nama: d.nama,
      nominal: d.nominal ?? "",
      file: d.file,
    };
    dispatch({ type: "art/add", payload });
    setOpenART(false);
  }, []);

  const savePerdes = useCallback((d: LegalDokumenPayload) => {
    const payload: DokumenPerdes = {
      tahun: d.tahun,
      nama: d.nama,
      nomor: d.nomor ?? "",
      nominal: d.nominal ?? "",
      file: d.file,
    };
    dispatch({ type: "perdes/add", payload });
    setOpenPerdes(false);
  }, []);

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* Right column */}
      <div className="col-span-full space-y-4">
        {/* Anggaran Dasar */}
        <DataCard
          label="Anggaran Dasar BUM Desa"
          buttonLabel="Tambah Dokumen"
          onButtonClick={() => setOpenAD(true)}
        >
          <div className="overflow-x-auto border border-t-neutral-200 rounded-lg">
            <table className="min-w-full w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-neutral-50 text-left text-sm font-semibold text-neutral-700">
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Tahun
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nama
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nominal
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
                {state.anggaranDasar.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  state.anggaranDasar.map((d, i) => (
                    <tr
                      key={`${d.nama}-${d.tahun}-${i}`}
                      className="text-sm text-neutral-800"
                    >
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.tahun}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.nama}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {formatCurrency(d.nominal)}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
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
                            className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
                            onClick={() =>
                              dispatch({ type: "ad/remove", index: i })
                            }
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

        {/* Anggaran Rumah Tangga */}
        <DataCard
          label="Anggaran Rumah Tangga BUM Desa"
          buttonLabel="Tambah Dokumen"
          onButtonClick={() => setOpenART(true)}
        >
          <div className="overflow-x-auto border border-t-neutral-200 rounded-lg">
            <table className="min-w-full w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-neutral-50 text-left text-sm font-semibold text-neutral-700">
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Tahun
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nama
                  </th>
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Nominal
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
                {state.anggaranRumahTangga.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  state.anggaranRumahTangga.map((d, i) => (
                    <tr
                      key={`${d.nama}-${d.tahun}-${i}`}
                      className="text-sm text-neutral-800"
                    >
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.tahun}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.nama}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {formatCurrency(d.nominal)}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
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
                            className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
                            onClick={() =>
                              dispatch({ type: "art/remove", index: i })
                            }
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

        {/* Perdes Penyertaan Modal */}
        <DataCard
          label="Perdes Penyertaan Modal BUM Desa"
          buttonLabel="Tambah Dokumen"
          onButtonClick={() => setOpenPerdes(true)}
        >
          <div className="overflow-x-auto border border-t-neutral-200 rounded-lg">
            <table className="min-w-full w-full border-separate border-spacing-0">
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
                    Nominal
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
                {state.perdesPenyertaanModal.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  state.perdesPenyertaanModal.map((d, i) => (
                    <tr
                      key={`${d.nama}-${d.tahun}-${d.nomor}-${i}`}
                      className="text-sm text-neutral-800"
                    >
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.tahun}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.nama}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {d.nomor || "-"}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {formatCurrency(d.nominal)}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
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
                            className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
                            onClick={() =>
                              dispatch({ type: "perdes/remove", index: i })
                            }
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

      {/* Save */}
      <div className="col-span-full flex justify-end">
        <Button onClick={onSave}>Simpan</Button>
      </div>

      {/* Modals */}
      <AddAnggaranModal
        open={openAD}
        onClose={() => setOpenAD(false)}
        onSave={saveAD}
        title="Tambah AD BUM Desa"
        showNominal
        namaLabel="Nama Dokumen (AD)"
        nominalLabel="Nominal"
      />

      <AddAnggaranModal
        open={openART}
        onClose={() => setOpenART(false)}
        onSave={saveART}
        title="Tambah ART BUM Desa"
        showNominal
        namaLabel="Nama Dokumen (ART)"
        nominalLabel="Nominal"
      />

      <AddAnggaranModal
        open={openPerdes}
        onClose={() => setOpenPerdes(false)}
        onSave={savePerdes}
        title="Tambah Perdes Penyertaan Modal"
        showNomor
        showNominal
        namaLabel="Nama Perdes"
        nomorLabel="Nomor Perdes"
        nominalLabel="Nominal"
      />
      <SaveResultModal
        open={savedOpen}
        onClose={() => setSavedOpen(false)}
        title="Data Struktur Tersimpan"
        autoCloseMs={1500}
      />
    </div>
  );
}
