import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Layers, Loader2 } from "lucide-react";
import FileDropzone from "../FileDropzone.jsx";
import SelectedFiles from "../SelectedFiles.jsx";
import ResultPanel from "../ResultPanel.jsx";
import { downloadBlob } from "../../lib/fileHelpers.js";

export default function MergePdf() {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | working | done | error
  const [error, setError] = useState("");
  const [resultBlob, setResultBlob] = useState(null);

  const addFiles = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setStatus("idle");
  };

  const removeFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const merge = async () => {
    setStatus("working");
    setError("");
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const bytes = await merged.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      setResultBlob(blob);
      setStatus("done");
    } catch (e) {
      console.error(e);
      setError(
        "One of these files could not be read as a PDF. Make sure every file is a valid, non-corrupted PDF."
      );
      setStatus("error");
    }
  };

  const reset = () => {
    setFiles([]);
    setResultBlob(null);
    setStatus("idle");
    setError("");
  };

  if (status === "done") {
    return (
      <ResultPanel
        title="Your PDF is merged"
        subtitle={`${files.length} files combined into one document.`}
        onDownload={() => downloadBlob(resultBlob, "merged.pdf")}
        onReset={reset}
      />
    );
  }

  return (
    <div>
      <FileDropzone
        onFiles={addFiles}
        accept="application/pdf"
        multiple
        label="Drop PDF files here, or click to browse"
        subLabel="Add two or more PDFs — you can reorder them below"
      />

      <SelectedFiles files={files} onRemove={removeFile} onReorder={setFiles} />

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {files.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            className="btn-primary"
            onClick={merge}
            disabled={files.length < 2 || status === "working"}
          >
            {status === "working" ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Merging…
              </>
            ) : (
              <>
                <Layers size={16} /> Merge {files.length} PDFs
              </>
            )}
          </button>
        </div>
      )}
      {files.length === 1 && (
        <p className="mt-3 text-center text-sm text-ink-400">
          Add at least one more PDF to merge.
        </p>
      )}
    </div>
  );
}
