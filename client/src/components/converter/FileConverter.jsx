import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { marked } from "marked";
import { Repeat, Loader2 } from "lucide-react";
import FileDropzone from "../FileDropzone.jsx";
import ResultPanel from "../ResultPanel.jsx";
import {
  downloadBlob,
  readFileAsArrayBuffer,
  readFileAsDataURL,
  readFileAsText,
  stripExtension,
} from "../../lib/fileHelpers.js";

const FORMAT_LABELS = {
  json: "JSON",
  csv: "CSV",
  xlsx: "XLSX",
  xml: "XML",
  markdown: "Markdown",
  html: "HTML",
  png: "PNG",
  jpg: "JPG",
  webp: "WEBP",
};

const EXT_TO_FORMAT = {
  json: "json",
  csv: "csv",
  xlsx: "xlsx",
  xls: "xlsx",
  xml: "xml",
  md: "markdown",
  markdown: "markdown",
  png: "png",
  jpg: "jpg",
  jpeg: "jpg",
  webp: "webp",
};

const MATRIX = {
  json: ["csv", "xml"],
  csv: ["json", "xlsx"],
  xlsx: ["csv", "json"],
  xml: ["json"],
  markdown: ["html"],
  png: ["jpg", "webp"],
  jpg: ["png", "webp"],
  webp: ["png", "jpg"],
};

function detectFormat(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  return EXT_TO_FORMAT[ext] || null;
}

// ---- conversion helpers ----

function csvParse(text) {
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
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || r[0] !== "");
}

function csvStringify(rows) {
  return rows
    .map((r) =>
      r
        .map((cell) => {
          const s = String(cell ?? "");
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(",")
    )
    .join("\n");
}

function jsonToCsvText(text) {
  const data = JSON.parse(text);
  const arr = Array.isArray(data) ? data : [data];
  const keys = Array.from(arr.reduce((set, obj) => {
    Object.keys(obj || {}).forEach((k) => set.add(k));
    return set;
  }, new Set()));
  const rows = [keys, ...arr.map((obj) => keys.map((k) => obj?.[k] ?? ""))];
  return csvStringify(rows);
}

function csvToJsonText(text) {
  const rows = csvParse(text);
  const [head, ...body] = rows;
  const arr = body.map((r) => {
    const obj = {};
    head.forEach((h, i) => (obj[h] = r[i] ?? ""));
    return obj;
  });
  return JSON.stringify(arr, null, 2);
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonToXmlNode(key, value) {
  if (Array.isArray(value)) {
    return value.map((v) => jsonToXmlNode(key, v)).join("");
  }
  if (value !== null && typeof value === "object") {
    const inner = Object.entries(value)
      .map(([k, v]) => jsonToXmlNode(k, v))
      .join("");
    return `<${key}>${inner}</${key}>`;
  }
  return `<${key}>${escapeXml(value)}</${key}>`;
}

function jsonToXmlText(text) {
  const data = JSON.parse(text);
  const body =
    data !== null && typeof data === "object" && !Array.isArray(data)
      ? Object.entries(data)
          .map(([k, v]) => jsonToXmlNode(k, v))
          .join("")
      : jsonToXmlNode("item", data);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<root>${body}</root>`;
}

function xmlNodeToJson(node) {
  const children = Array.from(node.children);
  if (children.length === 0) {
    return node.textContent;
  }
  const result = {};
  children.forEach((child) => {
    const value = xmlNodeToJson(child);
    if (result[child.tagName] !== undefined) {
      if (!Array.isArray(result[child.tagName])) {
        result[child.tagName] = [result[child.tagName]];
      }
      result[child.tagName].push(value);
    } else {
      result[child.tagName] = value;
    }
  });
  return result;
}

function xmlToJsonText(text) {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  const err = doc.querySelector("parsererror");
  if (err) throw new Error("Invalid XML");
  const root = doc.documentElement;
  const value = xmlNodeToJson(root);
  return JSON.stringify(value, null, 2);
}

async function imageConvert(file, targetFormat) {
  const dataUrl = await readFileAsDataURL(file);
  const img = await new Promise((resolve, reject) => {
    const el = new window.Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = dataUrl;
  });
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (targetFormat === "jpg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0);
  const mime = targetFormat === "png" ? "image/png" : targetFormat === "webp" ? "image/webp" : "image/jpeg";
  return new Promise((resolve) => canvas.toBlob(resolve, mime, 0.92));
}

export default function FileConverter() {
  const [file, setFile] = useState(null);
  const [sourceFormat, setSourceFormat] = useState(null);
  const [targetFormat, setTargetFormat] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [resultBlob, setResultBlob] = useState(null);
  const [resultName, setResultName] = useState("");

  const targets = useMemo(
    () => (sourceFormat ? MATRIX[sourceFormat] || [] : []),
    [sourceFormat]
  );

  const onFile = (files) => {
    const f = files[0];
    const fmt = detectFormat(f);
    if (!fmt || !MATRIX[fmt]) {
      setError(
        "That file type isn't supported yet. Try JSON, CSV, XLSX, XML, Markdown, PNG, JPG or WEBP."
      );
      return;
    }
    setFile(f);
    setSourceFormat(fmt);
    setTargetFormat(MATRIX[fmt][0]);
    setError("");
    setStatus("idle");
  };

  const run = async () => {
    setStatus("working");
    setError("");
    try {
      let blob, name;
      const base = stripExtension(file.name);

      if (["png", "jpg", "webp"].includes(sourceFormat)) {
        blob = await imageConvert(file, targetFormat);
        name = `${base}.${targetFormat}`;
      } else if (sourceFormat === "json" && targetFormat === "csv") {
        blob = new Blob([jsonToCsvText(await readFileAsText(file))], { type: "text/csv" });
        name = `${base}.csv`;
      } else if (sourceFormat === "json" && targetFormat === "xml") {
        blob = new Blob([jsonToXmlText(await readFileAsText(file))], { type: "application/xml" });
        name = `${base}.xml`;
      } else if (sourceFormat === "csv" && targetFormat === "json") {
        blob = new Blob([csvToJsonText(await readFileAsText(file))], { type: "application/json" });
        name = `${base}.json`;
      } else if (sourceFormat === "csv" && targetFormat === "xlsx") {
        const rows = csvParse(await readFileAsText(file));
        const ws = XLSX.utils.aoa_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        const out = XLSX.write(wb, { type: "array", bookType: "xlsx" });
        blob = new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        name = `${base}.xlsx`;
      } else if (sourceFormat === "xlsx" && (targetFormat === "csv" || targetFormat === "json")) {
        const buf = await readFileAsArrayBuffer(file);
        const wb = XLSX.read(buf, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        if (targetFormat === "csv") {
          blob = new Blob([XLSX.utils.sheet_to_csv(ws)], { type: "text/csv" });
          name = `${base}.csv`;
        } else {
          blob = new Blob([JSON.stringify(XLSX.utils.sheet_to_json(ws), null, 2)], {
            type: "application/json",
          });
          name = `${base}.json`;
        }
      } else if (sourceFormat === "xml" && targetFormat === "json") {
        blob = new Blob([xmlToJsonText(await readFileAsText(file))], { type: "application/json" });
        name = `${base}.json`;
      } else if (sourceFormat === "markdown" && targetFormat === "html") {
        const html = marked.parse(await readFileAsText(file));
        blob = new Blob([`<!doctype html>\n<meta charset="utf-8">\n${html}`], { type: "text/html" });
        name = `${base}.html`;
      } else {
        throw new Error("Unsupported conversion");
      }

      setResultBlob(blob);
      setResultName(name);
      setStatus("done");
    } catch (e) {
      console.error(e);
      setError("Couldn't convert that file. Double-check it matches the source format.");
      setStatus("error");
    }
  };

  const reset = () => {
    setFile(null);
    setSourceFormat(null);
    setTargetFormat(null);
    setResultBlob(null);
    setStatus("idle");
    setError("");
  };

  if (status === "done") {
    return (
      <ResultPanel
        title="Conversion complete"
        subtitle={`${FORMAT_LABELS[sourceFormat]} → ${FORMAT_LABELS[targetFormat]}`}
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
          label="Drop a file here, or click to browse"
          subLabel="Supports JSON, CSV, XLSX, XML, Markdown, PNG, JPG, WEBP"
        />
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="card p-6 text-center">
      <p className="mb-6 text-sm text-ink-500">
        <span className="font-medium text-ink-800">{file.name}</span> —{" "}
        {FORMAT_LABELS[sourceFormat]}
      </p>

      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        <span className="chip bg-ink-100 text-ink-600">{FORMAT_LABELS[sourceFormat]}</span>
        <Repeat size={16} className="text-ink-400" />
        <select
          value={targetFormat || ""}
          onChange={(e) => setTargetFormat(e.target.value)}
          className="rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700"
        >
          {targets.map((t) => (
            <option key={t} value={t}>
              {FORMAT_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <button className="btn-primary" onClick={run} disabled={status === "working" || !targetFormat}>
        {status === "working" ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Converting…
          </>
        ) : (
          <>
            <Repeat size={16} /> Convert to {FORMAT_LABELS[targetFormat]}
          </>
        )}
      </button>
    </div>
  );
}
