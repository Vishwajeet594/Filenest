import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileMinus, Loader2 } from "lucide-react";
import FileDropzone from "../FileDropzone.jsx";
import ResultPanel from "../ResultPanel.jsx";
import { downloadBlob, stripExtension } from "../../lib/fileHelpers.js";

export default function RemovePages() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [selected, setSelected] = useState(new Set());
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [resultBlob, setResultBlob] = useState(null);

  const onFile = async (files) => {
    const f = files[0];
    setError("");
    try {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setFile(f);
      setPageCount(pdf.getPageCount());
      setSelected(new Set());
      setStatus("idle");
    } catch (e) {
      console.error(e);
      setError("Couldn't read that file as a PDF.");
    }
  };

  const toggle = (i) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const run = async () => {
    setStatus("working");
    setError("");
    try {
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const out = await PDFDocument.create();
      const keepIndices = [];
      for (let i = 0; i < pageCount; i++) {
        if (!selected.has(i)) keepIndices.push(i);
      }
      const pages = await out.copyPages(src, keepIndices);
      pages.forEach((p) => out.addPage(p));
      const outBytes = await out.save();
      setResultBlob(new Blob([outBytes], { type: "application/pdf" }));
      setStatus("done");
    } catch (e) {
      console.error(e);
      setError("Couldn't process that PDF.");
      setStatus("error");
    }
  };

  const reset = () => {
    setFile(null);
    setResultBlob(null);
    setStatus("idle");
    setError("");
    setSelected(new Set());
  };

  if (status === "done") {
    return (
      <ResultPanel
        title="Pages removed"
        subtitle={`${selected.size} page${selected.size === 1 ? "" : "s"} removed, ${
          pageCount - selected.size
        } remaining.`}
        onDownload={() => downloadBlob(resultBlob, `${stripExtension(file.name)}_edited.pdf`)}
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
      <p className="mb-5 text-center text-sm text-ink-500">
        <span className="font-medium text-ink-800">{file.name}</span> — {pageCount} pages. Tap
        the pages you want to remove.
      </p>

      <div className="grid grid-cols-5 gap-3 sm:grid-cols-8">
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={`flex aspect-[3/4] items-center justify-center rounded-lg border-2 text-sm font-medium transition-colors ${
              selected.has(i)
                ? "border-red-400 bg-red-50 text-red-500 line-through"
                : "border-ink-200 bg-white text-ink-600 hover:border-brand-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-center">
        <button
          className="btn-primary"
          onClick={run}
          disabled={status === "working" || selected.size === 0 || selected.size === pageCount}
        >
          {status === "working" ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Removing…
            </>
          ) : (
            <>
              <FileMinus size={16} /> Remove {selected.size || ""} page
              {selected.size === 1 ? "" : "s"}
            </>
          )}
        </button>
      </div>
      {selected.size === pageCount && pageCount > 0 && (
        <p className="mt-3 text-center text-sm text-ink-400">
          You can't remove every page — leave at least one.
        </p>
      )}
    </div>
  );
}
