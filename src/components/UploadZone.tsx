import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { Button } from "./ui/button";
import { useKYCStore } from "../store/useKYCStore";

const ACCEPTED_TYPES = {
  "image/jpeg": [],
  "image/png": [],
  "application/pdf": [],
};

export function UploadZone() {
  const { addFiles, uploadedFiles, removeFile } = useKYCStore();

  const onDrop = (accepted: File[]) => addFiles(accepted);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 text-center text-slate-500 transition hover:border-slate-400 ${
          isDragActive ? "border-slate-400 bg-slate-50" : "border-slate-200"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mb-3 h-10 w-10 text-slate-400" />
        <p className="text-sm font-medium">Drop PDFs or images here, or click to browse</p>
        <p className="text-xs text-slate-400">PDF first pages will be used for AI extraction</p>
      </div>
      {uploadedFiles.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            Uploaded files
          </div>
          <ul className="divide-y divide-slate-100 text-sm text-slate-700">
            {uploadedFiles.map((file) => (
              <li key={file.id} className="flex items-center justify-between px-4 py-2">
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remove file"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
