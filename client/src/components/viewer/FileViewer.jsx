import React, { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import * as XLSX from "xlsx";
import mammoth from "mammoth";
import { marked } from "marked";
import { Loader2, RotateCcw } from "lucide-react";
import FileDropzone from "../FileDropzone.jsx";
import { readFileAsArrayBuffer, readFileAsText } from "../../lib/fileHelpers.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const ACCEPT = {
  pdf: "application/pdf",
  docx: ".docx",
  xlsx: ".xlsx,.xls",
  csv: ".csv",
  json: ".json,application/json",
  markdown: ".md,.markdown",
  txt: ".txt,.log",
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || r[0] !== "");
}

function JsonPretty({ value }) {
  const text = JSON.stringify(value, null, 2);
  return (
    <pre className="max-h-[70vh] overflow-auto rounded-xl bg-ink-900 p-5 text-xs leading-relaxed text-ink-100">
      {text}
    </pre>
  );
}

function TableView({ rows }) {
  if (!rows.length) return <p className="text-sm text-ink-500">No rows found.</p>;
  const [head, ...body] = rows;
  return (
    <div className="max-h-[70vh] overflow-auto rounded-xl border border-ink-100">
      <table className="min-w-full text-left text-sm">
        <thead className="sticky top-0 bg-ink-50">
          <tr>
            {head.map((h, i) => (
              <th key={i} className="whitespace-nowrap border-b border-ink-100 px-4 py-2 font-semibold text-ink-700">
                {h || `Column ${i + 1}`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((r, ri) => (
            <tr key={ri} className={ri % 2 ? "bg-white" : "bg-ink-50/40"}>
              {r.map((c, ci) => (
                <td key={ci} className="whitespace-nowrap border-b border-ink-50 px-4 py-2 text-ink-600">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function FileViewer({ kind }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [content, setContent] = useState(null); // shape depends on kind
  const [sheetIndex, setSheetIndex] = useState(0);

  useEffect(() => {
    if (!file) return;
    load(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const load = async (f) => {
    setStatus("working");
    setError("");
    setContent(null);
    try {
      if (kind === "pdf") {
        const buf = await readFileAsArrayBuffer(f);
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
        const pages = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.3 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
          pages.push(canvas.toDataURL("image/png"));
        }
        setContent({ pages });
      } else if (kind === "docx") {
        const buf = await readFileAsArrayBuffer(f);
        const { value } = await mammoth.convertToHtml({ arrayBuffer: buf });
        setContent({ html: value });
      } else if (kind === "xlsx") {
        const buf = await readFileAsArrayBuffer(f);
        const wb = XLSX.read(buf, { type: "array" });
        const sheets = wb.SheetNames.map((name) => ({
          name,
          rows: XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, blankrows: false }).map(
            (r) => r.map((c) => (c === undefined || c === null ? "" : String(c)))
          ),
        }));
        setSheetIndex(0);
        setContent({ sheets });
      } else if (kind === "csv") {
        const text = await readFileAsText(f);
        setContent({ rows: parseCsv(text) });
      } else if (kind === "json") {
        const text = await readFileAsText(f);
        setContent({ value: JSON.parse(text) });
      } else if (kind === "markdown") {
        const text = await readFileAsText(f);
        setContent({ html: marked.parse(text) });
      } else if (kind === "txt") {
        const text = await readFileAsText(f);
        setContent({ text });
      }
      setStatus("done");
    } catch (e) {
      console.error(e);
      setError("Couldn't open that file — make sure the format matches this viewer.");
      setStatus("error");
    }
  };

  const reset = () => {
    setFile(null);
    setContent(null);
    setStatus("idle");
    setError("");
  };

  if (!file) {
    return <FileDropzone onFiles={(f) => setFile(f[0])} accept={ACCEPT[kind]} label="Drop a file here, or click to browse" />;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="truncate text-sm text-ink-500">
          <span className="font-medium text-ink-800">{file.name}</span>
        </p>
        <button onClick={reset} className="btn-secondary !px-3 !py-1.5 text-xs">
          <RotateCcw size={13} /> New file
        </button>
      </div>

      {status === "working" && (
        <p className="flex items-center justify-center gap-2 py-16 text-sm text-ink-500">
          <Loader2 size={16} className="animate-spin" /> Opening…
        </p>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {status === "done" && content && (
        <div className="card p-5">
          {kind === "pdf" && (
            <div className="flex flex-col items-center gap-4">
              {content.pages.map((src, i) => (
                <img key={i} src={src} alt={`Page ${i + 1}`} className="max-w-full rounded-lg border border-ink-100 shadow-soft" />
              ))}
            </div>
          )}

          {kind === "docx" && (
            <div
              className="rendered-doc"
              dangerouslySetInnerHTML={{ __html: content.html }}
            />
          )}

          {kind === "xlsx" && (
            <div>
              {content.sheets.length > 1 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {content.sheets.map((s, i) => (
                    <button
                      key={s.name}
                      onClick={() => setSheetIndex(i)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                        sheetIndex === i
                          ? "border-brand-600 bg-brand-50 text-brand-700"
                          : "border-ink-200 text-ink-600"
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
              <TableView rows={content.sheets[sheetIndex]?.rows || []} />
            </div>
          )}

          {kind === "csv" && <TableView rows={content.rows} />}

          {kind === "json" && <JsonPretty value={content.value} />}

          {kind === "markdown" && (
            <div className="rendered-doc" dangerouslySetInnerHTML={{ __html: content.html }} />
          )}

          {kind === "txt" && (
            <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap rounded-xl bg-ink-50 p-5 text-sm leading-relaxed text-ink-700">
              {content.text}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
