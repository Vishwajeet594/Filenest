import React, { useState } from "react";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import { Stamp, Loader2 } from "lucide-react";
import FileDropzone from "../FileDropzone.jsx";
import ResultPanel from "../ResultPanel.jsx";
import { downloadBlob, stripExtension } from "../../lib/fileHelpers.js";

export default function WatermarkPdf() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.25);
  const [angle, setAngle] = useState(45);
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
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);

      pdf.getPages().forEach((page) => {
        const { width, height } = page.getSize();
        const fontSize = Math.max(24, Math.min(width, height) / 8);
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        page.drawText(text, {
          x: width / 2 - textWidth / 2,
          y: height / 2,
          size: fontSize,
          font,
          color: rgb(0.4, 0.44, 0.56),
          opacity: Number(opacity),
          rotate: degrees(Number(angle)),
        });
      });

      const outBytes = await pdf.save();
      setResultBlob(new Blob([outBytes], { type: "application/pdf" }));
      setStatus("done");
    } catch (e) {
      console.error(e);
      setError("Couldn't watermark that PDF.");
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
        title="Watermark added"
        subtitle="Every page now carries your watermark."
        onDownload={() => downloadBlob(resultBlob, `${stripExtension(file.name)}_watermarked.pdf`)}
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
        <label className="block text-sm text-ink-600">
          Watermark text
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm text-ink-600">
          Opacity ({Math.round(opacity * 100)}%)
          <input
            type="range"
            min="0.05"
            max="0.8"
            step="0.05"
            value={opacity}
            onChange={(e) => setOpacity(e.target.value)}
            className="mt-1 w-full"
          />
        </label>
        <label className="block text-sm text-ink-600">
          Angle ({angle}°)
          <input
            type="range"
            min="0"
            max="90"
            step="5"
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
            className="mt-1 w-full"
          />
        </label>
      </div>

      {error && (
        <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-center">
        <button className="btn-primary" onClick={run} disabled={status === "working" || !text}>
          {status === "working" ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Applying…
            </>
          ) : (
            <>
              <Stamp size={16} /> Add watermark
            </>
          )}
        </button>
      </div>
    </div>
  );
}
