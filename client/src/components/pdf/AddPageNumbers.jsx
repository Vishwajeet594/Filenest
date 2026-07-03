import React, { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Hash, Loader2 } from "lucide-react";
import FileDropzone from "../FileDropzone.jsx";
import ResultPanel from "../ResultPanel.jsx";
import { downloadBlob, stripExtension } from "../../lib/fileHelpers.js";

const POSITIONS = [
  { key: "bottom-center", label: "Bottom center" },
  { key: "bottom-right", label: "Bottom right" },
  { key: "top-right", label: "Top right" },
];

export default function AddPageNumbers() {
  const [file, setFile] = useState(null);
  const [position, setPosition] = useState("bottom-center");
  const [startAt, setStartAt] = useState(1);
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
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const fontSize = 11;

      pdf.getPages().forEach((page, idx) => {
        const { width } = page.getSize();
        const label = String(Number(startAt) + idx);
        const textWidth = font.widthOfTextAtSize(label, fontSize);
        let x = width / 2 - textWidth / 2;
        let y = 24;
        if (position === "bottom-right") {
          x = width - textWidth - 36;
          y = 24;
        } else if (position === "top-right") {
          x = width - textWidth - 36;
          y = page.getSize().height - 36;
        }
        page.drawText(label, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.4, 0.44, 0.56),
        });
      });

      const outBytes = await pdf.save();
      setResultBlob(new Blob([outBytes], { type: "application/pdf" }));
      setStatus("done");
    } catch (e) {
      console.error(e);
      setError("Couldn't add page numbers to that PDF.");
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
        title="Page numbers added"
        subtitle="Every page is now numbered."
        onDownload={() => downloadBlob(resultBlob, `${stripExtension(file.name)}_numbered.pdf`)}
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
    <div className="card p-6">
      <p className="mb-5 text-center text-sm text-ink-500">
        <span className="font-medium text-ink-800">{file.name}</span>
      </p>

      <div className="mx-auto max-w-sm space-y-4">
        <div>
          <p className="mb-2 text-sm text-ink-600">Position</p>
          <div className="flex flex-wrap gap-2">
            {POSITIONS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPosition(p.key)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                  position === p.key
                    ? "border-brand-600 bg-brand-50 text-brand-700"
                    : "border-ink-200 text-ink-600"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <label className="block text-sm text-ink-600">
          Start numbering at
          <input
            type="number"
            min={0}
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2"
          />
        </label>
      </div>

      {error && (
        <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-center">
        <button className="btn-primary" onClick={run} disabled={status === "working"}>
          {status === "working" ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Numbering…
            </>
          ) : (
            <>
              <Hash size={16} /> Add page numbers
            </>
          )}
        </button>
      </div>
    </div>
  );
}
