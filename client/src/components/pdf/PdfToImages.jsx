import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import FileDropzone from "../FileDropzone.jsx";
import ResultPanel from "../ResultPanel.jsx";
import { downloadBlob, stripExtension } from "../../lib/fileHelpers.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export default function PdfToImages() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState("jpg");
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState("");
  const [resultBlob, setResultBlob] = useState(null);
  const [resultName, setResultName] = useState("");

  const onFile = (files) => {
    setFile(files[0]);
    setStatus("idle");
    setError("");
  };

  const run = async () => {
    setStatus("working");
    setError("");
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const total = pdf.numPages;
      setProgress({ done: 0, total });

      const base = stripExtension(file.name);
      const mime = format === "png" ? "image/png" : "image/jpeg";
      const ext = format === "png" ? "png" : "jpg";

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const images = [];

      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, mime, 0.92));
        images.push({ name: `${base}_page_${i}.${ext}`, blob });
        setProgress({ done: i, total });
      }

      if (images.length === 1) {
        setResultBlob(images[0].blob);
        setResultName(images[0].name);
      } else {
        const zip = new JSZip();
        images.forEach((img) => zip.file(img.name, img.blob));
        const zipBlob = await zip.generateAsync({ type: "blob" });
        setResultBlob(zipBlob);
        setResultName(`${base}_images.zip`);
      }
      setStatus("done");
    } catch (e) {
      console.error(e);
      setError("Couldn't render that PDF. Try a different file.");
      setStatus("error");
    }
  };

  const reset = () => {
    setFile(null);
    setResultBlob(null);
    setStatus("idle");
    setError("");
  };

  if (status === "done") {
    return (
      <ResultPanel
        title="Images ready"
        subtitle={
          progress.total > 1
            ? `${progress.total} pages exported as a .zip`
            : "1 page exported as an image"
        }
        onDownload={() => downloadBlob(resultBlob, resultName)}
        onReset={reset}
      />
    );
  }

  if (!file) {
    return (
      <FileDropzone
        onFiles={onFile}
        accept="application/pdf"
        label="Drop a PDF here, or click to browse"
      />
    );
  }

  return (
    <div className="card p-6 text-center">
      <p className="mb-5 text-sm text-ink-500">
        <span className="font-medium text-ink-800">{file.name}</span>
      </p>

      <div className="mb-6 flex justify-center gap-2">
        {["jpg", "png"].map((f) => (
          <button
            key={f}
            onClick={() => setFormat(f)}
            className={`rounded-full border px-4 py-2 text-sm font-medium uppercase ${
              format === f
                ? "border-brand-600 bg-brand-50 text-brand-700"
                : "border-ink-200 text-ink-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <button className="btn-primary" onClick={run} disabled={status === "working"}>
        {status === "working" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Rendering {progress.done}/{progress.total || "…"}
          </>
        ) : (
          <>
            <ImageIcon size={16} /> Convert to {format.toUpperCase()}
          </>
        )}
      </button>
    </div>
  );
}
