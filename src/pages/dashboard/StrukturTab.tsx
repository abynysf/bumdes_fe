import { useCallback, useReducer, useState } from "react";
import YearPicker from "../../components/ui/YearPicker";
import Button from "../../components/ui/Button";
import DataCard from "../../components/ui/DataCard";
import { Download, Trash2 } from "lucide-react";
import AddPengurusBUMModal from "../../components/modals/struktur/AddPengurusBUMModal";
import AddStrukturDokumenModal from "../../components/modals/struktur/AddStrukturDokumenModal";
import SaveResultModal from "../../components/modals/SaveResultModal";

/**
 * ===========================
 * Types
 * ===========================
 */

type Periode = {
  awalPeriode: number | "";
  akhirPeriode: number | "";
};

type PengurusBUM = {
  jabatan: string;
  namaPengurus: string;
  pekerjaan: string;
  nomorTelepon: string;
};

type KepalaUnit = {
  namaUnit: string;
  namaKepalaUnit: string;
  pekerjaan: string;
  nomorTelepon: string;
};

type PengawasBUM = {
  namaPengawas: string;
  pekerjaan: string;
  nomorTelepon: string;
};

type SKBUMDesa = {
  periode: string;
  nomor: string;
  file: string;
};

type BeritaAcaraBUM = {
  periode: string;
  nomor: string;
  file: string;
};

type StukturState = {
  periode: Periode;
  pengurus: PengurusBUM[];
  kepalaUnit: KepalaUnit[];
  pengawas: PengawasBUM[];
  suratKeputusan: SKBUMDesa[];
  beritaAcara: BeritaAcaraBUM[];
};

/**
 * ===========================
 * Initials
 * ===========================
 */

const INITIAL: StukturState = {
  periode: {
    awalPeriode: "",
    akhirPeriode: "",
  },
  pengurus: [],
  kepalaUnit: [],
  pengawas: [],
  suratKeputusan: [],
  beritaAcara: [],
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

/**
 * ===========================
 * Reducer (sederhana & terpusat)
 * ===========================
 */

type Action =
  | {
      type: "periode/update";
      key: keyof Periode;
      value: Periode[keyof Periode];
    }
  | { type: "pengurus/add"; payload: PengurusBUM }
  | { type: "pengurus/remove"; index: number }
  | { type: "kepalaUnit/add"; payload: KepalaUnit }
  | { type: "kepalaUnit/remove"; index: number }
  | { type: "pengawas/add"; payload: PengawasBUM }
  | { type: "pengawas/remove"; index: number }
  | { type: "sk/add"; payload: SKBUMDesa }
  | { type: "sk/remove"; index: number }
  | { type: "ba/add"; payload: BeritaAcaraBUM }
  | { type: "ba/remove"; index: number }
  | { type: "reset" };

function dataReducer(state: StukturState, action: Action): StukturState {
  switch (action.type) {
    case "periode/update":
      return {
        ...state,
        periode: { ...state.periode, [action.key]: action.value },
      };

    case "pengurus/add":
      return { ...state, pengurus: [...state.pengurus, action.payload] };
    case "pengurus/remove":
      return {
        ...state,
        pengurus: state.pengurus.filter((_, i) => i !== action.index),
      };

    case "kepalaUnit/add":
      return { ...state, kepalaUnit: [...state.kepalaUnit, action.payload] };
    case "kepalaUnit/remove":
      return {
        ...state,
        kepalaUnit: state.kepalaUnit.filter((_, i) => i !== action.index),
      };

    case "pengawas/add":
      return { ...state, pengawas: [...state.pengawas, action.payload] };
    case "pengawas/remove":
      return {
        ...state,
        pengawas: state.pengawas.filter((_, i) => i !== action.index),
      };

    case "sk/add":
      return {
        ...state,
        suratKeputusan: [...state.suratKeputusan, action.payload],
      };
    case "sk/remove":
      return {
        ...state,
        suratKeputusan: state.suratKeputusan.filter(
          (_, i) => i !== action.index
        ),
      };

    case "ba/add":
      return { ...state, beritaAcara: [...state.beritaAcara, action.payload] };
    case "ba/remove":
      return {
        ...state,
        beritaAcara: state.beritaAcara.filter((_, i) => i !== action.index),
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

export default function StrukturTab() {
  const [state, dispatch] = useReducer(dataReducer, INITIAL);

  // Modal flags
  const [openPengurus, setOpenPengurus] = useState(false);
  const [openKepalaUnit, setOpenKepalaUnit] = useState(false);
  const [openPengawas, setOpenPengawas] = useState(false);
  const [openSK, setOpenSK] = useState(false);
  const [openBA, setOpenBA] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);

  // Handlers
  const updateForm = useCallback(
    (key: keyof Periode, value: Periode[keyof Periode]) =>
      dispatch({ type: "periode/update", key, value }),
    []
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

  type PersonDataPayload = {
    jabatan?: string;
    unit?: string;
    nama: string;
    pekerjaan: string;
    nomorTelepon: string;
  };

  // helper untuk menerima hasil dari modal
  const savePengurus = useCallback((p: PersonDataPayload) => {
    const payload: PengurusBUM = {
      jabatan: p.jabatan ?? "",
      namaPengurus: p.nama,
      pekerjaan: p.pekerjaan,
      nomorTelepon: p.nomorTelepon,
    };
    dispatch({ type: "pengurus/add", payload });
    setOpenPengurus(false);
  }, []);
  const saveKepalaUnit = useCallback((p: PersonDataPayload) => {
    const payload: KepalaUnit = {
      namaUnit: p.unit ?? "",
      namaKepalaUnit: p.nama,
      pekerjaan: p.pekerjaan,
      nomorTelepon: p.nomorTelepon,
    };
    dispatch({ type: "kepalaUnit/add", payload });
    setOpenKepalaUnit(false);
  }, []);
  const savePengawas = useCallback((p: PersonDataPayload) => {
    const payload: PengawasBUM = {
      namaPengawas: p.nama,
      pekerjaan: p.pekerjaan,
      nomorTelepon: p.nomorTelepon,
    };
    dispatch({ type: "pengawas/add", payload });
    setOpenPengawas(false);
  }, []);
  const saveSK = useCallback((d: SKBUMDesa) => {
    dispatch({ type: "sk/add", payload: d });
    setOpenSK(false);
  }, []);
  const saveBA = useCallback((d: BeritaAcaraBUM) => {
    dispatch({ type: "ba/add", payload: d });
    setOpenBA(false);
  }, []);

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* Main form */}
      <div className="col-span-full lg:col-span-6 space-y-4">
        <div>
          <div className="flex gap-2">
            <YearPicker
              label="Awal Periode Kepengurusan"
              required
              placeholder="Pilih tahun"
              value={
                state.periode.awalPeriode === ""
                  ? undefined
                  : state.periode.awalPeriode
              }
              onChange={(y) => updateForm("awalPeriode", y ?? "")}
            />
            <YearPicker
              label="Akhir Periode Kepengurusan"
              required
              placeholder="Pilih tahun"
              value={
                state.periode.akhirPeriode === ""
                  ? undefined
                  : state.periode.akhirPeriode
              }
              onChange={(y) => updateForm("akhirPeriode", y ?? "")}
            />
          </div>
          <p className="mt-1 text-xs text-red-500">
            Perhatian! Mengubah bagian ini dapat mempengaruhi data yang lain
          </p>
        </div>
      </div>

      {/* Right column */}
      <div className="col-span-full space-y-4 ">
        {/* Pengurus */}
        <DataCard
          label="Pengurus BUM Desa"
          buttonLabel="Tambah Data"
          onButtonClick={() => setOpenPengurus(true)}
        >
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
                {state.pengurus.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  state.pengurus.map((p, i) => (
                    <tr
                      key={`${p.jabatan}-${p.namaPengurus}-${i}`}
                      className="text-sm text-neutral-800"
                    >
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.jabatan}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.namaPengurus}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.pekerjaan}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.nomorTelepon}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2 text-right">
                        <button
                          type="button"
                          className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
                          onClick={() =>
                            dispatch({ type: "pengurus/remove", index: i })
                          }
                          title="Hapus"
                          aria-label="Hapus pengurus"
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

        <DataCard
          label="Kepala Unit BUM Desa"
          buttonLabel="Tambah Data"
          onButtonClick={() => setOpenKepalaUnit(true)}
        >
          <div className="border border-t-neutral-200">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-neutral-50 text-left text-sm font-semibold text-neutral-700">
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Unit
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
                {state.kepalaUnit.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  state.kepalaUnit.map((p, i) => (
                    <tr
                      key={`${p.namaUnit}-${p.namaKepalaUnit}-${i}`}
                      className="text-sm text-neutral-800"
                    >
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.namaUnit}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.namaKepalaUnit}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.pekerjaan}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.nomorTelepon}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2 text-right">
                        <button
                          type="button"
                          className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
                          onClick={() =>
                            dispatch({ type: "kepalaUnit/remove", index: i })
                          }
                          title="Hapus"
                          aria-label="Hapus kepala unit"
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

        <DataCard
          label="Pengawas BUM Desa"
          buttonLabel="Tambah Data"
          onButtonClick={() => setOpenPengawas(true)}
        >
          <div className="border border-t-neutral-200">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-neutral-50 text-left text-sm font-semibold text-neutral-700">
                  <th className="border-b border-neutral-200 px-3 py-3">No</th>
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
                {state.pengawas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-4 text-center text-sm text-neutral-400"
                    >
                      Tidak ada data yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  state.pengawas.map((p, i) => (
                    <tr
                      key={`${p.namaPengawas}-${p.pekerjaan}-${i}`}
                      className="text-sm text-neutral-800"
                    >
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {i + 1}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.namaPengawas}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.pekerjaan}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {p.nomorTelepon}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2 text-right">
                        <button
                          type="button"
                          className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
                          onClick={() =>
                            dispatch({ type: "pengawas/remove", index: i })
                          }
                          title="Hapus"
                          aria-label="Hapus pengawas"
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

        {/* Double card */}
        <div className="flex flex-col lg:flex-row gap-4">
          <DataCard
            label="Surat Keputusan BUM Desa"
            buttonLabel="Tambah Data"
            note="Periode kepengerusan telah diubah. Harap masukkan data terbaru!"
            className="flex-1"
            onButtonClick={() => setOpenSK(true)}
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
                  {state.suratKeputusan.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-4 text-center text-sm text-neutral-400"
                      >
                        Tidak ada data yang ditambahkan
                      </td>
                    </tr>
                  ) : (
                    state.suratKeputusan.map((d, i) => (
                      <tr
                        key={`${d.nomor}-${i}`}
                        className="text-sm text-neutral-800"
                      >
                        <td className="border-b border-neutral-200 px-3 py-2">
                          {d.periode}
                        </td>
                        <td className="border-b border-neutral-200 px-3 py-2">
                          {d.nomor}
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
                                dispatch({ type: "sk/remove", index: i })
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

          <DataCard
            label="Berita Acara Serah Terima Pengurus BUM Desa"
            buttonLabel="Tambah Data"
            note="Periode kepengerusan telah diubah. Harap masukkan data terbaru!"
            className="flex-1"
            onButtonClick={() => setOpenBA(true)}
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
                  {state.beritaAcara.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-4 text-center text-sm text-neutral-400"
                      >
                        Tidak ada data yang ditambahkan
                      </td>
                    </tr>
                  ) : (
                    state.beritaAcara.map((d, i) => (
                      <tr
                        key={`${d.nomor}-${i}`}
                        className="text-sm text-neutral-800"
                      >
                        <td className="border-b border-neutral-200 px-3 py-2">
                          {d.periode}
                        </td>
                        <td className="border-b border-neutral-200 px-3 py-2">
                          {d.nomor}
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
                                dispatch({ type: "ba/remove", index: i })
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
      </div>

      {/* Save */}
      <div className="col-span-full flex justify-end">
        <Button onClick={onSave}>Simpan</Button>
      </div>

      {/* ---- Modals ---------------------------------------------------------- */}
      <AddPengurusBUMModal
        open={openPengurus}
        onClose={() => setOpenPengurus(false)}
        onSave={savePengurus}
        ShowJabatan
        title="Data Pengurus BUM Desa"
      />
      <AddPengurusBUMModal
        open={openKepalaUnit}
        onClose={() => setOpenKepalaUnit(false)}
        onSave={saveKepalaUnit}
        ShowUnit
        title="Data Kepala Unit BUM Desa"
      />
      <AddPengurusBUMModal
        open={openPengawas}
        onClose={() => setOpenPengawas(false)}
        onSave={savePengawas}
        title="Data Pengawas BUM Desa"
      />

      <AddStrukturDokumenModal
        open={openSK}
        onClose={() => setOpenSK(false)}
        onSave={saveSK}
        keterangan="Surat Keterangan Keputusan BUM Desa"
        title="Tambah SK Pengurus BUM Desa"
      />
      <AddStrukturDokumenModal
        open={openBA}
        onClose={() => setOpenBA(false)}
        onSave={saveBA}
        title="Berita Acara Serah Terima Pengurus BUM Desa"
        keterangan="Berita Acara Serah Terima Pengurus BUM Desa"
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
