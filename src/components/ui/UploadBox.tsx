import { useRef } from "react";

type Props = {
  accept?: string;
  onFileSelect: (file: File) => void;
};

export default function UploadBox({ accept, onFileSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }

  return (
    <div
      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-emerald-500 bg-emerald-50 p-8 text-center"
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-emerald-600">
        Seret & letakkan berkas atau klik untuk telusuri
      </p>
      <p className="mt-1 text-xs text-neutral-500">Format yang didukung: PDF</p>
    </div>
  );
}
