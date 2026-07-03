import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileImage, Loader2 } from "lucide-react";
import FileDropzone from "../FileDropzone.jsx";
import SelectedFiles from "../SelectedFiles.jsx";
import ResultPanel from "../ResultPanel.jsx";
import { downloadBlob } from "../../lib/fileHelpers.js";

export default function ImagesToPdf() {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [resultBlob, setResultBlob] = useState(null);

  const addFiles = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setStatus("idle");
  };

  const removeFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const run = async () => {
    setStatus("working");
    setError("");
    try {
      const pdf = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const isPng = file.type.includes("png") || file.name.toLowerCase().endsWith(".png");
        const image = isPng ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      const outBytes = await pdf.save();
      setResultBlob(new Blob([outBytes], { type: "application/pdf" }));
      setStatus("done");
    } catch (e) {
      console.error(e);
      setError(
        "Couldn't build a PDF from these images. WEBP isn't supported yet — use JPG or PNG."
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
        title="Your PDF is ready"
        subtitle={`${files.length} image${files.length > 1 ? "s" : ""} combined into one PDF.`}
        onDownload={() => downloadBlob(resultBlob, "images.pdf")}
        onReset={reset}
      />
    );
  }

  return (
    <div>
      <FileDropzone
        onFiles={addFiles}
        accept="image/jpeg,image/png"
        multiple
        label="Drop JPG or PNG images here, or click to browse"
        subLabel="Add as many as you like — reorder them below"
      />

      <SelectedFiles files={files} onRemove={removeFile} onReorder={setFiles} />

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {files.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button className="btn-primary" onClick={run} disabled={status === "working"}>
            {status === "working" ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Building PDF…
              </>
            ) : (
              <>
                <FileImage size={16} /> Create PDF from {files.length} image
                {files.length > 1 ? "s" : ""}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
