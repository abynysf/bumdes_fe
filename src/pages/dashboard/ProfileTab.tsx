import React, { useCallback, useState } from "react";
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
import { Download, Eye, Pencil, Printer, Trash2 } from "lucide-react";
import {
  useDashboard,
  type BaseProfile,
  type DokumenPerdes,
  type RekeningBUM,
} from "../../contexts/DashboardContext";

/* ===========================
 * Utils
 * =========================== */

/**
 * Converts a file path to a URL that can be used for preview/download.
 * Handles: blob URLs, full URLs, and server paths like "uploads/rekening/..."
 */
function getFileUrl(value: string): string | null {
  if (!value || !value.trim()) return null;

  // Blob URLs - use as-is
  if (value.startsWith("blob:")) return value;

  // Server paths like "uploads/rekening/..." - prepend /api
  if (value.startsWith("uploads/")) return `/api/${value}`;

  // Full URLs - use as-is
  try {
    const url = new URL(value);
    if (url.protocol && url.host) return value;
  } catch {
    // Not a valid URL
  }

  return null;
}

/* ===========================
 * Component
 * =========================== */

export default function ProfileTab() {
  const {
    profileState: state,
    profileDispatch: dispatch,
    strukturState,
    legalitasState,
    isLoading: isDataLoading,
    saveProfile,
  } = useDashboard();

  // modal flags
  const [openRekening, setOpenRekening] = useState(false);
  const [openDokumen, setOpenDokumen] = useState(false);
  const [openUploadSK, setOpenUploadSK] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningType, setWarningType] = useState<"validation" | "api">("validation");

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
    const url = getFileUrl(file);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
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

  const [isSaving, setIsSaving] = useState(false);

  const onSave = useCallback(async () => {
    // Mark as touched to show validation errors
    setTouched(true);

    // Validate 4 mandatory fields
    if (
      !state.form.namaLengkap ||
      !state.form.statusBadanHukum ||
      state.form.tahunPendirian === "" ||
      !state.form.alamatKantor
    ) {
      setWarningType("validation");
      setShowWarning(true);
      return;
    }

    // Validate SK file if status is "terbit"
    if (
      state.form.statusBadanHukum === "terbit" &&
      !state.form.skBadanHukumFile
    ) {
      setWarningType("validation");
      setShowWarning(true);
      return;
    }

    // Call API to save
    setIsSaving(true);
    try {
      const success = await saveProfile();
      if (success) {
        setSavedOpen(true);
        setTouched(false);
      } else {
        setWarningType("api");
        setShowWarning(true);
      }
    } catch (error) {
      console.error("Save error:", error);
      setWarningType("api");
      setShowWarning(true);
    } finally {
      setIsSaving(false);
    }
  }, [state, saveProfile]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

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

  // Show loading spinner while data is being fetched
  if (isDataLoading) {
    return (
      <div className="flex items-center justify-center p-12 min-h-screen bg-white">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto mb-2" />
          <p className="text-neutral-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          /* Page setup - zero margin removes browser headers/footers */
          @page {
            margin: 0;
            size: portrait;
          }

          /* Remove default body margin */
          body {
            margin: 0 !important;
          }

          /* Remove styling artifacts */
          * {
            border-radius: 0 !important;
            box-shadow: none !important;
          }

          /* Hide UI elements */
          aside,
          nav,
          header,
          button,
          .no-print {
            display: none !important;
          }

          /* Show only printable content */
          body * {
            visibility: hidden;
          }

          .print-only,
          .print-only * {
            visibility: visible !important;
          }

          /* Position print content */
          .print-only {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            display: block !important;
            padding: 2cm 1.5cm !important;
            box-sizing: border-box !important;
          }

          /* Table styling with grey header */
          thead {
            background-color: #6b7280 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          thead th {
            background-color: #6b7280 !important;
            color: white !important;
            font-weight: bold !important;
          }

          th,
          td {
            border: 1px solid #333 !important;
            padding: 4px 6px !important;
            font-size: 10pt !important;
          }

          /* Table striping */
          tbody tr:nth-child(even) {
            background-color: #f9fafb !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Table structure */
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin-bottom: 12px !important;
          }

          /* Section spacing */
          .print-only > div {
            margin-bottom: 12px !important;
          }

          .print-only h3 {
            font-size: 12pt !important;
            font-weight: bold !important;
            margin: 8px 0 6px 0 !important;
            padding: 0 !important;
          }

          .print-only h4 {
            font-size: 11pt !important;
            font-weight: bold !important;
            margin: 6px 0 5px 0 !important;
            padding: 0 !important;
          }

          /* Print title */
          .print-title {
            text-align: left;
            margin-bottom: 12px;
            padding: 0;
          }

          .print-title h1 {
            font-size: 14pt;
            font-weight: bold;
            margin: 0 0 8px 0;
            padding: 0;
          }

          /* Signature section */
          .print-signature {
            margin-top: 30px;
            page-break-inside: avoid;
          }

          .print-signature-header {
            text-align: right;
            margin-bottom: 20px;
            font-size: 10pt;
          }

          .print-signature-grid {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
          }

          .print-signature-box {
            width: 40%;
            text-align: center;
          }

          .print-signature-label {
            margin-bottom: 70px !important;
            font-weight: bold;
            font-size: 10pt;
            line-height: 1.4;
          }

          .print-signature-line {
            border-top: 1px solid #000;
            padding-top: 3px;
            font-size: 10pt;
          }
        }
      `}</style>
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
                          {(d.fileBlob || d.file) && (
                            <>
                              <button
                                type="button"
                                onClick={() => handlePreviewFile(d.fileBlob || d.file!)}
                                className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                                title="Preview"
                                aria-label="Preview dokumen"
                              >
                                <Eye className="h-4 w-4 text-blue-600" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDownloadFile(d.fileBlob || d.file!)}
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
                          {(r.fileBlob || r.file) && (
                            <>
                              <button
                                type="button"
                                className="inline-flex items-center rounded p-1.5 hover:bg-blue-50"
                                onClick={() => handlePreviewFile(r.fileBlob || r.file!)}
                                title="Preview"
                                aria-label="Preview file"
                              >
                                <Eye className="h-4 w-4 text-blue-600" />
                              </button>
                              <button
                                type="button"
                                className="inline-flex items-center rounded p-1.5 hover:bg-emerald-50"
                                onClick={() => handleDownloadFile(r.fileBlob || r.file!)}
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

      {/* Save and Print */}
      <div className="col-span-full flex justify-end gap-3">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-700 focus:ring-offset-2 no-print"
        >
          <Printer className="h-4 w-4" />
          Cetak
        </button>
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? "Menyimpan..." : "Update"}
        </Button>
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
        onUpload={(file) => {
          dispatch({ type: "sk/set", payload: file.name });
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
        type={warningType === "api" ? "error" : "warning"}
        title={warningType === "api" ? "Gagal Menyimpan" : "Data Belum Lengkap"}
        message={
          warningType === "api"
            ? "Terjadi kesalahan saat menyimpan data. Silakan coba lagi."
            : "Mohon lengkapi data wajib sebelum menyimpan."
        }
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
              {getFileUrl(fileToPreview) ? (
                <object
                  data={getFileUrl(fileToPreview)!}
                  type="application/pdf"
                  className="h-[70vh] w-full border"
                  title="Preview dokumen"
                >
                  <p>PDF tidak dapat ditampilkan. <a href={getFileUrl(fileToPreview)!} target="_blank" rel="noopener noreferrer">Unduh file</a></p>
                </object>
              ) : (
                <p className="text-neutral-500">
                  Pratinjau tidak tersedia. File: {fileToPreview}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Print-only sections */}
      <div className="print-only" style={{ display: "none" }}>
        {/* Title */}
        <div className="print-title" style={{ marginBottom: "12px" }}>
          <h1>ProfilBUMDesa</h1>
        </div>

        {/* ========================================
            PROFILE SECTION (Page 1-2)
            ======================================== */}
        <div style={{ marginBottom: "12px" }}>
          <h3 style={{ fontSize: "12pt", fontWeight: "bold", margin: "8px 0 6px 0" }}>
            Profil BUM Desa
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
            <tbody>
              <tr>
                <td style={{ padding: "4px 6px", border: "1px solid #333", width: "30%", fontWeight: "bold" }}>
                  Nama BUM Desa
                </td>
                <td style={{ padding: "4px 6px", border: "1px solid #333" }}>
                  {state.form.namaLengkap || "-"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "4px 6px", border: "1px solid #333", fontWeight: "bold" }}>
                  Status Badan Hukum
                </td>
                <td style={{ padding: "4px 6px", border: "1px solid #333" }}>
                  {state.form.statusBadanHukum === "terbit" ? "Sudah Terbit" : state.form.statusBadanHukum === "proses" ? "Dalam Proses" : "-"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "4px 6px", border: "1px solid #333", fontWeight: "bold" }}>
                  Pendirian BUM Desa
                </td>
                <td style={{ padding: "4px 6px", border: "1px solid #333" }}>
                  {state.form.tahunPendirian || "-"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "4px 6px", border: "1px solid #333", fontWeight: "bold" }}>
                  Alamat Kantor
                </td>
                <td style={{ padding: "4px 6px", border: "1px solid #333" }}>
                  {state.form.alamatKantor || "-"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "4px 6px", border: "1px solid #333", fontWeight: "bold" }}>
                  Jumlah Pengurus BUM Desa
                </td>
                <td style={{ padding: "4px 6px", border: "1px solid #333" }}>
                  {state.form.jumlahPengurus || "-"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "4px 6px", border: "1px solid #333", fontWeight: "bold" }}>
                  Jumlah Pengurus Laki-laki
                </td>
                <td style={{ padding: "4px 6px", border: "1px solid #333" }}>
                  {state.form.pengurusL || "-"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "4px 6px", border: "1px solid #333", fontWeight: "bold" }}>
                  Jumlah Pengurus Perempuan
                </td>
                <td style={{ padding: "4px 6px", border: "1px solid #333" }}>
                  {state.form.pengurusP || "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Rekening BUM Desa */}
        {state.rekening.length > 0 && (
          <div style={{ marginBottom: "12px" }}>
            <h3 style={{ fontSize: "12pt", fontWeight: "bold", margin: "8px 0 6px 0" }}>
              Rekening BUM Desa
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
              <thead>
                <tr style={{ backgroundColor: "#6b7280" }}>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Bank
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Nama
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Nomor Rekening
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Keterangan
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.rekening.map((rek, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#f9fafb" }}>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{rek.bank}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{rek.nama}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{rek.nomor}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>
                      {rek.keterangan || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Peraturan Desa Pendirian BUM Desa */}
        {state.dokumen.length > 0 && (
          <div style={{ marginBottom: "12px" }}>
            <h3 style={{ fontSize: "12pt", fontWeight: "bold", margin: "8px 0 6px 0" }}>
              Peraturan Desa Pendirian BUM Desa
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
              <thead>
                <tr style={{ backgroundColor: "#6b7280" }}>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Tahun
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Nama
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Nomor
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.dokumen.map((dok, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#f9fafb" }}>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{dok.tahun}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{dok.nama}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{dok.nomor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ========================================
            STRUKTUR ORGANISASI SECTION (Page 3+)
            ======================================== */}
        {strukturState.pengurus.length > 0 && (
          <div style={{ marginBottom: "12px", pageBreakBefore: "always" }}>
            <h3 style={{ fontSize: "12pt", fontWeight: "bold", margin: "8px 0 6px 0" }}>
              Struktur Organisasi
            </h3>
            <h4 style={{ fontSize: "11pt", fontWeight: "bold", margin: "6px 0 5px 0" }}>
              Pengurus BUM Desa
            </h4>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
              <thead>
                <tr style={{ backgroundColor: "#6b7280" }}>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Jabatan
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Nama
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Pekerjaan
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Nomor Telepon
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Gaji
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Keterangan
                  </th>
                </tr>
              </thead>
              <tbody>
                {strukturState.pengurus.map((p, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#f9fafb" }}>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{p.jabatan}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{p.namaPengurus}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{p.pekerjaan}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{p.nomorTelepon}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{p.gaji}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{p.keterangan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SK Pengawas */}
        {strukturState.skPengawas.length > 0 && (
          <div style={{ marginBottom: "12px" }}>
            <h4 style={{ fontSize: "11pt", fontWeight: "bold", margin: "6px 0 5px 0" }}>
              Surat Keputusan Pengawas
            </h4>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
              <thead>
                <tr style={{ backgroundColor: "#6b7280" }}>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Periode
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Nomor
                  </th>
                </tr>
              </thead>
              <tbody>
                {strukturState.skPengawas.map((sk, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#f9fafb" }}>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>
                      {sk.periode || sk.tahun || "-"}
                    </td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{sk.nomor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SK Direktur */}
        {strukturState.skDirektur && strukturState.skDirektur.length > 0 && (
          <div style={{ marginBottom: "12px" }}>
            <h4 style={{ fontSize: "11pt", fontWeight: "bold", margin: "6px 0 5px 0" }}>
              Surat Keputusan Direktur
            </h4>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
              <thead>
                <tr style={{ backgroundColor: "#6b7280" }}>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Periode
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Nomor
                  </th>
                </tr>
              </thead>
              <tbody>
                {strukturState.skDirektur.map((sk, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#f9fafb" }}>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>
                      {sk.periode || sk.tahun || "-"}
                    </td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{sk.nomor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SK Pegawai */}
        {strukturState.skPegawai && strukturState.skPegawai.length > 0 && (
          <div style={{ marginBottom: "12px" }}>
            <h4 style={{ fontSize: "11pt", fontWeight: "bold", margin: "6px 0 5px 0" }}>
              Surat Keputusan Pegawai
            </h4>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
              <thead>
                <tr style={{ backgroundColor: "#6b7280" }}>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Periode
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Nomor
                  </th>
                </tr>
              </thead>
              <tbody>
                {strukturState.skPegawai.map((sk, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#f9fafb" }}>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>
                      {sk.periode || sk.tahun || "-"}
                    </td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{sk.nomor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SK Pengurus */}
        {strukturState.skPengurus && strukturState.skPengurus.length > 0 && (
          <div style={{ marginBottom: "12px" }}>
            <h4 style={{ fontSize: "11pt", fontWeight: "bold", margin: "6px 0 5px 0" }}>
              Surat Keputusan Pengurus
            </h4>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
              <thead>
                <tr style={{ backgroundColor: "#6b7280" }}>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Periode
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Nomor
                  </th>
                </tr>
              </thead>
              <tbody>
                {strukturState.skPengurus.map((sk, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#f9fafb" }}>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>
                      {sk.periode || sk.tahun || "-"}
                    </td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{sk.nomor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Berita Acara */}
        {strukturState.beritaAcara && strukturState.beritaAcara.length > 0 && (
          <div style={{ marginBottom: "12px" }}>
            <h4 style={{ fontSize: "11pt", fontWeight: "bold", margin: "6px 0 5px 0" }}>
              Berita Acara
            </h4>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
              <thead>
                <tr style={{ backgroundColor: "#6b7280" }}>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Periode
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Nomor
                  </th>
                </tr>
              </thead>
              <tbody>
                {strukturState.beritaAcara.map((ba, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#f9fafb" }}>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>
                      {ba.periode || ba.tahun || "-"}
                    </td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{ba.nomor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ========================================
            LEGALITAS SECTION (Page 4+)
            ======================================== */}
        {/* Anggaran Dasar */}
        {legalitasState.anggaranDasar && legalitasState.anggaranDasar.length > 0 && (
          <div style={{ marginBottom: "12px", pageBreakBefore: "always" }}>
            <h3 style={{ fontSize: "12pt", fontWeight: "bold", margin: "8px 0 6px 0" }}>
              Legalitas
            </h3>
            <h4 style={{ fontSize: "11pt", fontWeight: "bold", margin: "6px 0 5px 0" }}>
              Anggaran Dasar
            </h4>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
              <thead>
                <tr style={{ backgroundColor: "#6b7280" }}>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Tahun
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Nama
                  </th>
                </tr>
              </thead>
              <tbody>
                {legalitasState.anggaranDasar.map((dok, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#f9fafb" }}>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{dok.tahun}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{dok.nama}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Anggaran Rumah Tangga */}
        {legalitasState.anggaranRumahTangga && legalitasState.anggaranRumahTangga.length > 0 && (
          <div style={{ marginBottom: "12px" }}>
            <h4 style={{ fontSize: "11pt", fontWeight: "bold", margin: "6px 0 5px 0" }}>
              Anggaran Rumah Tangga
            </h4>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
              <thead>
                <tr style={{ backgroundColor: "#6b7280" }}>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Tahun
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Nama
                  </th>
                </tr>
              </thead>
              <tbody>
                {legalitasState.anggaranRumahTangga.map((dok, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#f9fafb" }}>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{dok.tahun}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{dok.nama}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* AHU Badan Hukum */}
        {legalitasState.ahuBadanHukum && legalitasState.ahuBadanHukum.length > 0 && (
          <div style={{ marginBottom: "12px" }}>
            <h4 style={{ fontSize: "11pt", fontWeight: "bold", margin: "6px 0 5px 0" }}>
              AHU Badan Hukum
            </h4>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
              <thead>
                <tr style={{ backgroundColor: "#6b7280" }}>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Tahun
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Nomor
                  </th>
                </tr>
              </thead>
              <tbody>
                {legalitasState.ahuBadanHukum.map((dok, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#f9fafb" }}>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{dok.tahun}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{dok.nomor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* NPWP */}
        {legalitasState.npwp && legalitasState.npwp.length > 0 && (
          <div style={{ marginBottom: "12px" }}>
            <h4 style={{ fontSize: "11pt", fontWeight: "bold", margin: "6px 0 5px 0" }}>
              NPWP
            </h4>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
              <thead>
                <tr style={{ backgroundColor: "#6b7280" }}>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Tahun
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Nomor
                  </th>
                </tr>
              </thead>
              <tbody>
                {legalitasState.npwp.map((dok, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#f9fafb" }}>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{dok.tahun}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{dok.nomor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* NIB */}
        {legalitasState.nib && legalitasState.nib.length > 0 && (
          <div style={{ marginBottom: "12px" }}>
            <h4 style={{ fontSize: "11pt", fontWeight: "bold", margin: "6px 0 5px 0" }}>
              NIB
            </h4>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
              <thead>
                <tr style={{ backgroundColor: "#6b7280" }}>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Tahun
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Nomor
                  </th>
                </tr>
              </thead>
              <tbody>
                {legalitasState.nib.map((dok, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#f9fafb" }}>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{dok.tahun}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{dok.nomor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Dokumen Aset Desa */}
        {legalitasState.dokumenAsetDesa && legalitasState.dokumenAsetDesa.length > 0 && (
          <div style={{ marginBottom: "12px" }}>
            <h4 style={{ fontSize: "11pt", fontWeight: "bold", margin: "6px 0 5px 0" }}>
              Dokumen Aset Desa
            </h4>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
              <thead>
                <tr style={{ backgroundColor: "#6b7280" }}>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Tahun
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Nama
                  </th>
                </tr>
              </thead>
              <tbody>
                {legalitasState.dokumenAsetDesa.map((dok, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#f9fafb" }}>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{dok.tahun}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{dok.nama}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Perdes Penyertaan Modal */}
        {legalitasState.perdesPenyertaanModal && legalitasState.perdesPenyertaanModal.length > 0 && (
          <div style={{ marginBottom: "12px", pageBreakBefore: legalitasState.anggaranDasar?.length === 0 && legalitasState.anggaranRumahTangga?.length === 0 && legalitasState.ahuBadanHukum?.length === 0 && legalitasState.npwp?.length === 0 && legalitasState.nib?.length === 0 && legalitasState.dokumenAsetDesa?.length === 0 ? "always" : "auto" }}>
            {legalitasState.anggaranDasar?.length === 0 && legalitasState.anggaranRumahTangga?.length === 0 && legalitasState.ahuBadanHukum?.length === 0 && legalitasState.npwp?.length === 0 && legalitasState.nib?.length === 0 && legalitasState.dokumenAsetDesa?.length === 0 && (
              <h3 style={{ fontSize: "12pt", fontWeight: "bold", margin: "8px 0 6px 0" }}>
                Legalitas
              </h3>
            )}
            <h4 style={{ fontSize: "11pt", fontWeight: "bold", margin: "6px 0 5px 0" }}>
              Perdes Penyertaan Modal
            </h4>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
              <thead>
                <tr style={{ backgroundColor: "#6b7280" }}>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Tahun
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Nama
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Nomor
                  </th>
                  <th style={{ padding: "4px 6px", border: "1px solid #333", color: "white", textAlign: "left" }}>
                    Nominal
                  </th>
                </tr>
              </thead>
              <tbody>
                {legalitasState.perdesPenyertaanModal.map((perdes, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#f9fafb" }}>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{perdes.tahun}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{perdes.nama}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>{perdes.nomor}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333" }}>
                      {perdes.nominal
                        ? "Rp " + new Intl.NumberFormat("id-ID").format(Number(perdes.nominal))
                        : "-"}
                    </td>
                  </tr>
                ))}
                {legalitasState.perdesPenyertaanModal.length > 0 && (
                  <tr>
                    <td colSpan={3} style={{ padding: "4px 6px", border: "1px solid #333", fontWeight: "bold", textAlign: "right" }}>
                      Total Modal
                    </td>
                    <td style={{ padding: "4px 6px", border: "1px solid #333", fontWeight: "bold" }}>
                      Rp {new Intl.NumberFormat("id-ID").format(
                        legalitasState.perdesPenyertaanModal.reduce(
                          (sum, p) => sum + (typeof p.nominal === "number" ? p.nominal : 0),
                          0
                        )
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ========================================
            SIGNATURE SECTION (Final Page)
            ======================================== */}
        <div className="print-signature">
          <div className="print-signature-header">
            {state.form.alamatKantor ? state.form.alamatKantor.split(",")[0] : "Purwodadi"},{" "}
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <div className="print-signature-grid">
            <div className="print-signature-box">
              <div className="print-signature-label">
                Mengetahui,
                <br />
                Kepala Desa
              </div>
              <div>
                (....................)
              </div>
            </div>
            <div className="print-signature-box">
              <div className="print-signature-label">
                Direktur BUM Desa
              </div>
              <div className="print-signature-line">
                {strukturState.pengurus.find((p) => p.jabatan.toLowerCase().includes("direktur"))?.namaPengurus || "(....................)"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
