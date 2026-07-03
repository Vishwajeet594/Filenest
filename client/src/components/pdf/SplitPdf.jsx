import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { Scissors, Loader2 } from "lucide-react";
import FileDropzone from "../FileDropzone.jsx";
import ResultPanel from "../ResultPanel.jsx";
import { downloadBlob, stripExtension } from "../../lib/fileHelpers.js";

export default function SplitPdf() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState("range"); // range | all
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(1);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [resultBlob, setResultBlob] = useState(null);
  const [resultName, setResultName] = useState("");

  const onFile = async (files) => {
    const f = files[0];
    setError("");
    try {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const count = pdf.getPageCount();
      setFile(f);
      setPageCount(count);
      setFrom(1);
      setTo(count);
      setStatus("idle");
    } catch (e) {
      console.error(e);
      setError("Couldn't read that file as a PDF.");
    }
  };

  const run = async () => {
    setStatus("working");
    setError("");
    try {
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const base = stripExtension(file.name);

      if (mode === "range") {
        const start = Math.max(1, Math.min(from, pageCount));
        const end = Math.max(start, Math.min(to, pageCount));
        const out = await PDFDocument.create();
        const indices = [];
        for (let i = start; i <= end; i++) indices.push(i - 1);
        const pages = await out.copyPages(src, indices);
        pages.forEach((p) => out.addPage(p));
        const outBytes = await out.save();
        setResultBlob(new Blob([outBytes], { type: "application/pdf" }));
        setResultName(`${base}_pages_${start}-${end}.pdf`);
      } else {
        const zip = new JSZip();
        for (let i = 0; i < pageCount; i++) {
          const out = await PDFDocument.create();
          const [page] = await out.copyPages(src, [i]);
          out.addPage(page);
          const outBytes = await out.save();
          zip.file(`${base}_page_${i + 1}.pdf`, outBytes);
        }
        const zipBlob = await zip.generateAsync({ type: "blob" });
        setResultBlob(zipBlob);
        setResultName(`${base}_split.zip`);
      }
      setStatus("done");
    } catch (e) {
      console.error(e);
      setError("Something went wrong while splitting this PDF.");
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
        title="Your PDF is split"
        subtitle={mode === "range" ? "Your page range is ready." : `${pageCount} single-page files, zipped.`}
        onDownload={() => downloadBlob(resultBlob, resultName)}
        onReset={reset}
      />
    );
  }

  if (!file) {
    return (
      <div>
        <FileDropzone
          onFiles={onFile}
          accept="application/pdf"
          label="Drop a PDF here, or click to browse"
        />
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="card p-6">
      <p className="mb-5 text-sm text-ink-500">
        <span className="font-medium text-ink-800">{file.name}</span> — {pageCount} pages
      </p>

      <div className="mb-5 flex gap-2">
        <button
          className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium ${
            mode === "range"
              ? "border-brand-600 bg-brand-50 text-brand-700"
              : "border-ink-200 text-ink-600"
          }`}
          onClick={() => setMode("range")}
        >
          Extract a page range
        </button>
        <button
          className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium ${
            mode === "all"
              ? "border-brand-600 bg-brand-50 text-brand-700"
              : "border-ink-200 text-ink-600"
          }`}
          onClick={() => setMode("all")}
        >
          Split every page (.zip)
        </button>
      </div>

      {mode === "range" && (
        <div className="mb-5 flex items-center justify-center gap-3">
          <label className="text-sm text-ink-500">
            From
            <input
              type="number"
              min={1}
              max={pageCount}
              value={from}
              onChange={(e) => setFrom(Number(e.target.value))}
              className="ml-2 w-20 rounded-lg border border-ink-200 px-3 py-1.5"
            />
          </label>
          <label className="text-sm text-ink-500">
            To
            <input
              type="number"
              min={1}
              max={pageCount}
              value={to}
              onChange={(e) => setTo(Number(e.target.value))}
              className="ml-2 w-20 rounded-lg border border-ink-200 px-3 py-1.5"
            />
          </label>
        </div>
      )}

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <div className="flex justify-center">
        <button className="btn-primary" onClick={run} disabled={status === "working"}>
          {status === "working" ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Splitting…
            </>
          ) : (
            <>
              <Scissors size={16} /> Split PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
}
