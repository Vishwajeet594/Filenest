import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Minimize2, Loader2 } from "lucide-react";
import FileDropzone from "../FileDropzone.jsx";
import ResultPanel from "../ResultPanel.jsx";
import { downloadBlob, formatBytes, stripExtension } from "../../lib/fileHelpers.js";

export default function CompressPdf() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [resultBlob, setResultBlob] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);

  const onFile = async (files) => {
    const f = files[0];
    setFile(f);
    setOriginalSize(f.size);
    setStatus("idle");
    setError("");
    run(f);
  };

  const run = async (f) => {
    setStatus("working");
    setError("");
    try {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });

      // Best-effort compression: rebuild the object graph with streams
      // enabled and compact structure. Deep image re-encoding is out of
      // scope for a pure client-side tool, so gains vary by source PDF.
      const outBytes = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      const blob = new Blob([outBytes], { type: "application/pdf" });
      setResultBlob(blob);
      setStatus("done");
    } catch (e) {
      console.error(e);
      setError("Couldn't process that file — make sure it's a valid PDF.");
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
    const saved = originalSize - resultBlob.size;
    const pct = originalSize ? Math.max(0, Math.round((saved / originalSize) * 100)) : 0;
    return (
      <ResultPanel
        title="Your PDF is compressed"
        subtitle={
          saved > 0
            ? `${formatBytes(originalSize)} → ${formatBytes(resultBlob.size)} (${pct}% smaller)`
            : `${formatBytes(originalSize)} → ${formatBytes(resultBlob.size)} — this PDF was already tightly packed`
        }
        onDownload={() => downloadBlob(resultBlob, `${stripExtension(file.name)}_compressed.pdf`)}
        onReset={reset}
      />
    );
  }

  return (
    <div>
      <FileDropzone
        onFiles={onFile}
        accept="application/pdf"
        label="Drop a PDF here, or click to browse"
        subLabel="Compression starts automatically"
      />
      {status === "working" && (
        <p className="mt-5 flex items-center justify-center gap-2 text-sm text-ink-500">
          <Loader2 size={16} className="animate-spin" /> Compressing…
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
      <p className="mt-6 flex items-center justify-center gap-2 text-xs text-ink-400">
        <Minimize2 size={14} /> Best results on PDFs with lightly-optimized structure or embedded fonts.
      </p>
    </div>
  );
}
