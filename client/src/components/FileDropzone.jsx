import React, { useCallback, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

export default function FileDropzone({
  onFiles,
  accept,
  multiple = false,
  label = "Drop a file here, or click to browse",
  subLabel,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (fileList) => {
      const files = Array.from(fileList || []);
      if (files.length) onFiles(multiple ? files : [files[0]]);
    },
    [onFiles, multiple]
  );

  return (
    <div
      className={`dropzone cursor-pointer ${dragging ? "border-brand-500 bg-brand-50" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700">
        <UploadCloud size={22} />
      </span>
      <div>
        <p className="font-medium text-ink-800">{label}</p>
        {subLabel && <p className="mt-1 text-sm text-ink-500">{subLabel}</p>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
