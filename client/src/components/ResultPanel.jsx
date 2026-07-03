import React from "react";
import { CheckCircle2, Download, RotateCcw } from "lucide-react";

export default function ResultPanel({ title, subtitle, onDownload, onReset, extra }) {
  return (
    <div className="card flex flex-col items-center gap-4 p-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <CheckCircle2 size={28} />
      </span>
      <div>
        <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onDownload && (
          <button className="btn-primary" onClick={onDownload}>
            <Download size={16} /> Download
          </button>
        )}
        <button className="btn-secondary" onClick={onReset}>
          <RotateCcw size={16} /> Start over
        </button>
      </div>
      {extra}
    </div>
  );
}
