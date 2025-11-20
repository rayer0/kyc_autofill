import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { UploadedFile } from "../types";
import { Button } from "./ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Props {
  file?: UploadedFile;
}

export function DocumentViewer({ file }: Props) {
  const [scale, setScale] = useState(1.1);

  useEffect(() => {
    setScale(1.1);
  }, [file?.id]);

  if (!file) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-500">
        Upload a document to preview it here.
      </div>
    );
  }

  const isPdf = file.type.includes("pdf");

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2 text-sm">
        <span className="font-medium text-slate-700">{file.name}</span>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setScale((s) => Math.min(s + 0.1, 2))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setScale((s) => Math.max(s - 0.1, 0.6))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-slate-50 p-4">
        {isPdf ? (
          <Document file={file.file} loading={<Loader />}>
            <Page pageNumber={1} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} />
          </Document>
        ) : (
          <img
            src={file.previewUrl}
            alt={file.name}
            className="mx-auto max-h-[calc(100vh-220px)] rounded shadow"
            style={{ transform: `scale(${scale})` }}
          />
        )}
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="flex h-full items-center justify-center text-slate-500">Loading preview…</div>
  );
}
