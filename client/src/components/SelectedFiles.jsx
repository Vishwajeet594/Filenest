import React from "react";
import { X, ArrowUp, ArrowDown, FileText } from "lucide-react";
import { formatBytes } from "../lib/fileHelpers.js";

export default function SelectedFiles({ files, onRemove, onReorder }) {
  if (!files.length) return null;

  const move = (index, dir) => {
    const next = [...files];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onReorder(next);
  };

  return (
    <ul className="mt-5 space-y-2">
      {files.map((file, i) => (
        <li
          key={`${file.name}-${i}`}
          className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white px-4 py-3"
        >
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-500">
            <FileText size={16} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink-800">{file.name}</p>
            <p className="text-xs text-ink-400">{formatBytes(file.size)}</p>
          </div>
          {onReorder && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="rounded p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 disabled:opacity-30"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="Move up"
              >
                <ArrowUp size={15} />
              </button>
              <button
                type="button"
                className="rounded p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 disabled:opacity-30"
                onClick={() => move(i, 1)}
                disabled={i === files.length - 1}
                aria-label="Move down"
              >
                <ArrowDown size={15} />
              </button>
            </div>
          )}
          <button
            type="button"
            className="rounded p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600"
            onClick={() => onRemove(i)}
            aria-label="Remove file"
          >
            <X size={16} />
          </button>
        </li>
      ))}
    </ul>
  );
}
