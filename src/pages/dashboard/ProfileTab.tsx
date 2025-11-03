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
import WarningModal from "../../components/modals/WarningModal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Download, Eye, Pencil, Trash2 } from "lucide-react";

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
  file?: string;
};

type RekeningBUM = {
  bank: string;
  nama: string;
  nomor: string;
  ketahananPangan?: boolean;
  keterangan?: string;
  file?: string;
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
  | { type: "rekening/update"; index: number; payload: RekeningBUM }
  | { type: "rekening/remove"; index: number }
  | { type: "dokumen/add"; payload: DokumenPerdes }
  | { type: "dokumen/update"; index: number; payload: DokumenPerdes }
  | { type: "dokumen/remove"; index: number }
  | { type: "sk/set"; payload: string | null }
  | { type: "reset" };

function dataReducer(state: ProfileState, action: Action): ProfileState {
  switch (action.type) {
    case "form/update":
      return { ...state, form: { ...state.form, [action.key]: action.value } };

    case "rekening/add":
      return { ...state, rekening: [...state.rekening, action.payload] };
    case "rekening/update":
      return {
        ...state,
        rekening: state.rekening.map((r, i) =>
          i === action.index ? action.payload : r
        ),
      };
    case "rekening/remove":
      return {
        ...state,
        rekening: state.rekening.filter((_, i) => i !== action.index),
      };
    case "dokumen/add":
      return { ...state, dokumen: [...state.dokumen, action.payload] };
    case "dokumen/update":
      return {
        ...state,
        dokumen: state.dokumen.map((d, i) =>
          i === action.index ? action.payload : d
        ),
      };
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
  const [showWarning, setShowWarning] = useState(false);

  // Track if user attempted to submit (for showing validation errors)
  const [touched, setTouched] = useState(false);

  // Edit rekening state
  const [editingRekeningIndex, setEditingRekeningIndex] = useState<
    number | null
  >(null);

  // Edit dokumen state
  const [editingDokumenIndex, setEditingDokumenIndex] = useState<number | null>(
    null
  );

  // Download confirmation modal state
  const [downloadConfirmOpen, setDownloadConfirmOpen] = useState(false);
  const [fileToDownload, setFileToDownload] = useState<string>("");

  // Preview modal state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileToPreview, setFileToPreview] = useState<string>("");

  // Confirm delete states
  const [confirmDeleteDokumenOpen, setConfirmDeleteDokumenOpen] =
    useState(false);
  const [deleteDokumenIndex, setDeleteDokumenIndex] = useState<number | null>(
    null
  );
  const [confirmDeleteRekeningOpen, setConfirmDeleteRekeningOpen] =
    useState(false);
  const [deleteRekeningIndex, setDeleteRekeningIndex] = useState<
    number | null
  >(null);

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

  const handleDownloadFile = useCallback((file: string) => {
    setFileToDownload(file);
    setDownloadConfirmOpen(true);
  }, []);

  const confirmDownload = useCallback(() => {
    if (fileToDownload) {
      downloadFile(fileToDownload);
    }
    setDownloadConfirmOpen(false);
    setFileToDownload("");
  }, [fileToDownload, downloadFile]);

  const handlePreviewFile = useCallback((file: string) => {
    setFileToPreview(file);
    setPreviewOpen(true);
  }, []);

  const onSave = useCallback(() => {
    // Mark as touched to show validation errors
    setTouched(true);

    // Validate 4 mandatory fields
    if (
      !state.form.namaLengkap ||
      !state.form.statusBadanHukum ||
      state.form.tahunPendirian === "" ||
      !state.form.alamatKantor
    ) {
      setShowWarning(true);
      return;
    }

    // Validate SK file if status is "terbit"
    if (
      state.form.statusBadanHukum === "terbit" &&
      !state.form.skBadanHukumFile
    ) {
      setShowWarning(true);
      return;
    }

    // TODO: ganti dengan API call
    console.log("[SAVE] profil payload:", state);
    setSavedOpen(true);
    // Reset touched after successful save
    setTouched(false);
  }, [state]);

  // modal save helpers
  const saveRekening = useCallback(
    (rek: RekeningBUM) => {
      if (editingRekeningIndex !== null) {
        dispatch({
          type: "rekening/update",
          index: editingRekeningIndex,
          payload: rek,
        });
        setEditingRekeningIndex(null);
      } else {
        dispatch({ type: "rekening/add", payload: rek });
      }
      setOpenRekening(false);
    },
    [editingRekeningIndex]
  );

  const saveDokumen = useCallback(
    (doc: DokumenPerdes) => {
      if (editingDokumenIndex !== null) {
        dispatch({
          type: "dokumen/update",
          index: editingDokumenIndex,
          payload: doc,
        });
        setEditingDokumenIndex(null);
      } else {
        dispatch({ type: "dokumen/add", payload: doc });
      }
      setOpenDokumen(false);
    },
    [editingDokumenIndex]
  );

  // Delete handlers
  const handleDeleteDokumen = useCallback((index: number) => {
    setDeleteDokumenIndex(index);
    setConfirmDeleteDokumenOpen(true);
  }, []);

  const confirmDeleteDokumen = useCallback(() => {
    if (deleteDokumenIndex !== null) {
      dispatch({ type: "dokumen/remove", index: deleteDokumenIndex });
      setDeleteDokumenIndex(null);
    }
  }, [deleteDokumenIndex]);

  const handleDeleteRekening = useCallback((index: number) => {
    setDeleteRekeningIndex(index);
    setConfirmDeleteRekeningOpen(true);
  }, []);

  const confirmDeleteRekening = useCallback(() => {
    if (deleteRekeningIndex !== null) {
      dispatch({ type: "rekening/remove", index: deleteRekeningIndex });
      setDeleteRekeningIndex(null);
    }
  }, [deleteRekeningIndex]);

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
            touched={touched}
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
          touched={touched}
        />

        {state.form.statusBadanHukum === "terbit" && (
          <div className="mt-2">
            <label className="mb-1 flex items-center gap-1 text-sm font-medium text-neutral-700">
              <span className="text-red-600">*</span>
              <span>Surat Keterangan Badan Hukum</span>
            </label>

            <p
              className={`text-xs ${
                touched && !state.form.skBadanHukumFile
                  ? "text-red-600"
                  : "text-neutral-400"
              }`}
            >
              {state.form.skBadanHukumFile
                ? `Terpilih: ${state.form.skBadanHukumFile}`
                : "Belum ada data terunggah"}
            </p>

            <button
              type="button"
              onClick={() => setOpenUploadSK(true)}
              className={`mt-2 rounded-md px-4 py-2 text-xs text-white font-semibold ${
                touched && !state.form.skBadanHukumFile
                  ? "bg-red-500 hover:bg-red-600 ring-2 ring-red-500/20"
                  : "bg-neutral-500 hover:bg-neutral-600"
              }`}
            >
              Unggah Dokumen
            </button>

            {touched && !state.form.skBadanHukumFile && (
              <p className="mt-1 text-xs text-red-600">
                File SK Badan Hukum wajib diunggah
              </p>
            )}
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
          touched={touched}
        />

        <Textarea
          label="Alamat Kantor"
          required
          rows={6}
          placeholder="Masukkan alamat kantor"
          value={state.form.alamatKantor}
          onChange={(e) => updateForm("alamatKantor", e.target.value)}
          touched={touched}
        />

        {/* Dokumen list */}
        <DataCard
          label="Peraturan Desa Pendirian BUM Desa"
          buttonLabel="Tambah Dokumen"
          onButtonClick={() => {
            setEditingDokumenIndex(null);
            setOpenDokumen(true);
          }}
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
                        {d.file || "-"}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        <div className="flex justify-end gap-2">
                          {d.file && (
                            <>
                              <button
                                type="button"
                                onClick={() => handlePreviewFile(d.file!)}
                                className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                                title="Preview"
                                aria-label="Preview dokumen"
                              >
                                <Eye className="h-4 w-4 text-blue-600" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDownloadFile(d.file!)}
                                className="inline-flex items-center rounded p-1.5 hover:bg-emerald-50"
                                title="Unduh"
                                aria-label="Unduh dokumen"
                              >
                                <Download className="h-4 w-4 text-emerald-600" />
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setEditingDokumenIndex(i);
                              setOpenDokumen(true);
                            }}
                            className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                            title="Edit"
                            aria-label="Edit dokumen"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteDokumen(i)}
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
            error={
              touched &&
              state.form.jumlahPengurus !== "" &&
              state.form.pengurusL !== "" &&
              state.form.pengurusP !== "" &&
              Number(state.form.jumlahPengurus) !==
                Number(state.form.pengurusL) + Number(state.form.pengurusP)
                ? `Harus sama dengan total L + P (${
                    Number(state.form.pengurusL) + Number(state.form.pengurusP)
                  })`
                : undefined
            }
            touched={touched}
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
          onButtonClick={() => {
            setEditingRekeningIndex(null);
            setOpenRekening(true);
          }}
        >
          <div className="overflow-x-auto border border-t-neutral-200 rounded-lg">
            <table className="min-w-full w-full border-separate border-spacing-0">
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
                  <th className="border-b border-neutral-200 px-3 py-3">
                    Keterangan
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
                {state.rekening.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
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
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {r.keterangan || "-"}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        {r.file || "-"}
                      </td>
                      <td className="border-b border-neutral-200 px-3 py-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {r.file && (
                            <>
                              <button
                                type="button"
                                className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                                onClick={() => handlePreviewFile(r.file!)}
                                title="Preview"
                                aria-label="Preview file"
                              >
                                <Eye className="h-4 w-4 text-blue-600" />
                              </button>
                              <button
                                type="button"
                                className="inline-flex items-center rounded p-1.5 hover:bg-emerald-50"
                                onClick={() => handleDownloadFile(r.file!)}
                                title="Unduh"
                                aria-label="Unduh file"
                              >
                                <Download className="h-4 w-4 text-emerald-600" />
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                            onClick={() => {
                              setEditingRekeningIndex(i);
                              setOpenRekening(true);
                            }}
                            title="Edit"
                            aria-label="Edit rekening"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center rounded p-1.5 hover:bg-red-50"
                            onClick={() => handleDeleteRekening(i)}
                            title="Hapus"
                            aria-label="Hapus rekening"
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
      <AddRekeningModal
        open={openRekening}
        onClose={() => {
          setOpenRekening(false);
          setEditingRekeningIndex(null);
        }}
        onSave={saveRekening}
        initialData={
          editingRekeningIndex !== null
            ? state.rekening[editingRekeningIndex]
            : undefined
        }
      />

      <AddDokumenModal
        open={openDokumen}
        onClose={() => {
          setOpenDokumen(false);
          setEditingDokumenIndex(null);
        }}
        onSave={saveDokumen}
        initialData={
          editingDokumenIndex !== null
            ? state.dokumen[editingDokumenIndex]
            : undefined
        }
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

      <WarningModal
        open={showWarning}
        onClose={() => setShowWarning(false)}
        type="warning"
        title="Data Belum Lengkap"
        message="Mohon lengkapi data wajib sebelum menyimpan."
      />

      {/* Confirm Delete Dialogs */}
      <ConfirmDialog
        open={confirmDeleteDokumenOpen}
        onClose={() => setConfirmDeleteDokumenOpen(false)}
        onConfirm={confirmDeleteDokumen}
        title="Hapus Dokumen"
        message="Apakah Anda yakin ingin menghapus dokumen ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />

      <ConfirmDialog
        open={confirmDeleteRekeningOpen}
        onClose={() => setConfirmDeleteRekeningOpen(false)}
        onConfirm={confirmDeleteRekening}
        title="Hapus Rekening"
        message="Apakah Anda yakin ingin menghapus data rekening ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />

      {/* Download Confirmation Modal */}
      {downloadConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setDownloadConfirmOpen(false);
            setFileToDownload("");
          }}
        >
          <div
            className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-semibold text-neutral-800">
              Unduh Dokumen
            </h3>
            <p className="mb-6 text-sm text-neutral-600">
              Apakah Anda yakin ingin mengunduh file:{" "}
              <strong>{fileToDownload}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDownloadConfirmOpen(false);
                  setFileToDownload("");
                }}
                className="rounded-md bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-300"
              >
                Batal
              </button>
              <button
                onClick={confirmDownload}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Unduh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-auto rounded-lg bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Preview Dokumen</h3>
              <button
                onClick={() => setPreviewOpen(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>
            <div className="text-sm text-neutral-600">
              <p className="mb-2">File: {fileToPreview}</p>
              {isUrl(fileToPreview) ? (
                <iframe
                  src={fileToPreview}
                  className="h-[70vh] w-full border"
                  title="Preview dokumen"
                />
              ) : (
                <p className="text-neutral-500">
                  Pratinjau tidak tersedia. File: {fileToPreview}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
