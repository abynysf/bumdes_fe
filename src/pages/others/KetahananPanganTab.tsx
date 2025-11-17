import { useState } from "react";
import { useOthers } from "../../contexts/OthersContext";
import type { KetahananPanganDocument } from "../../contexts/OthersContext";
import { Table, type Column } from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import UploadBox from "../../components/ui/UploadBox";

export default function KetahananPanganTab() {
  const { ketahananPanganInfo, ketahananPanganDocuments, setKetahananPanganDocuments } = useOthers();

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  function handlePreview(doc: KetahananPanganDocument) {
    if (doc.fileUrl) {
      setPreviewUrl(doc.fileUrl);
      setPreviewModalOpen(true);
    }
  }

  function handleDownload(doc: KetahananPanganDocument) {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, "_blank");
    }
  }

  function handleUploadClick(docId: string) {
    setUploadingDocId(docId);
    setUploadFile(null);
    setUploadModalOpen(true);
  }

  function handleUploadSubmit() {
    if (!uploadFile || !uploadingDocId) return;

    // In a real app, this would upload to server and get back a URL
    const mockFileUrl = URL.createObjectURL(uploadFile);

    setKetahananPanganDocuments((prev: KetahananPanganDocument[]) =>
      prev.map((doc: KetahananPanganDocument) =>
        doc.id === uploadingDocId
          ? { ...doc, fileUrl: mockFileUrl, fileName: uploadFile.name }
          : doc
      )
    );

    setUploadModalOpen(false);
    setUploadFile(null);
    setUploadingDocId(null);
  }

  const columns: Column<KetahananPanganDocument>[] = [
    {
      header: "NO.",
      accessor: "no",
      width: "w-16",
      align: "center",
    },
    {
      header: "KELENGKAPAN",
      accessor: "kelengkapan",
      width: "w-64",
      align: "left",
    },
    {
      header: "PELAKSANA",
      accessor: "pelaksana",
      width: "w-48",
      align: "left",
    },
    {
      header: "AKSI",
      accessor: (doc: KetahananPanganDocument) => (
        <div className="flex gap-2 justify-center">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handlePreview(doc)}
            disabled={!doc.fileUrl}
          >
            Lihat
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleDownload(doc)}
            disabled={!doc.fileUrl}
          >
            Unduh
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleUploadClick(doc.id)}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            Upload
          </Button>
        </div>
      ),
      width: "w-64",
      align: "center",
    },
    {
      header: "KETERANGAN",
      accessor: "keterangan",
      width: "w-32",
      align: "center",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-lg font-bold uppercase">
          Dokumen Kegiatan Ketahanan Pangan Desa
        </h2>
      </div>

      {/* Read-only Info Fields */}
      <div className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-12 gap-4 items-center">
          <label className="col-span-4 text-sm font-medium text-neutral-700">
            Nama Desa
          </label>
          <div className="col-span-8">
            <div className="px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-md text-sm text-neutral-900">
              {ketahananPanganInfo.namaDesa}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 items-center">
          <label className="col-span-4 text-sm font-medium text-neutral-700">
            Nama BUM DESA
          </label>
          <div className="col-span-8">
            <div className="px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-md text-sm text-neutral-900">
              {ketahananPanganInfo.namaBumDesa}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 items-center">
          <label className="col-span-4 text-sm font-medium text-neutral-700">
            Tahun
          </label>
          <div className="col-span-8">
            <div className="px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-md text-sm text-neutral-900 w-32">
              {ketahananPanganInfo.tahun}
            </div>
          </div>
        </div>
      </div>

      {/* Section Labels */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-neutral-700">
          Kegiatan Ketahanan Pangan Desa
        </div>
        <div className="text-sm font-medium text-neutral-700">
          Total Dana Penyertaan Modal
        </div>
      </div>

      {/* Documents Table */}
      <div className="overflow-x-auto">
        <Table columns={columns} data={ketahananPanganDocuments} />
      </div>

      {/* Preview Modal */}
      <Modal
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title="Preview Dokumen"
        className="max-w-4xl"
      >
        <div className="w-full h-[600px]">
          <iframe
            src={previewUrl}
            className="w-full h-full border-0"
            title="Document Preview"
          />
        </div>
      </Modal>

      {/* Upload Modal */}
      <Modal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Dokumen"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Pilih File
            </label>
            <UploadBox
              accept=".pdf,.doc,.docx"
              onFileSelect={(file: File) => setUploadFile(file)}
            />
          </div>
          {uploadFile && (
            <p className="text-sm text-neutral-600">
              File terpilih: {uploadFile.name}
            </p>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="secondary"
              onClick={() => setUploadModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              onClick={handleUploadSubmit}
              disabled={!uploadFile}
            >
              Upload
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
