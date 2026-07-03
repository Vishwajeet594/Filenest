import React, { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { RotateCw, Loader2 } from "lucide-react";
import FileDropzone from "../FileDropzone.jsx";
import ResultPanel from "../ResultPanel.jsx";
import { downloadBlob, stripExtension } from "../../lib/fileHelpers.js";

export default function RotatePdf() {
  const [file, setFile] = useState(null);
  const [angle, setAngle] = useState(90);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [resultBlob, setResultBlob] = useState(null);

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
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      pdf.getPages().forEach((page) => {
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + angle) % 360));
      });
      const outBytes = await pdf.save();
      setResultBlob(new Blob([outBytes], { type: "application/pdf" }));
      setStatus("done");
    } catch (e) {
      console.error(e);
      setError("Couldn't rotate that PDF.");
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
        title="Your PDF is rotated"
        subtitle="Every page has been rotated."
        onDownload={() => downloadBlob(resultBlob, `${stripExtension(file.name)}_rotated.pdf`)}
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
        {[90, 180, 270].map((a) => (
          <button
            key={a}
            onClick={() => setAngle(a)}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${
              angle === a
                ? "border-brand-600 bg-brand-50 text-brand-700"
                : "border-ink-200 text-ink-600"
            }`}
          >
            {a}°
          </button>
        ))}
      </div>
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
      <button className="btn-primary" onClick={run} disabled={status === "working"}>
        {status === "working" ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Rotating…
          </>
        ) : (
          <>
            <RotateCw size={16} /> Rotate {angle}°
          </>
        )}
      </button>
    </div>
  );
}
