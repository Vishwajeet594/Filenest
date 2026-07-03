import React from "react";

export default function Privacy() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <h1 className="text-3xl font-semibold">Privacy</h1>
      <p className="mt-4 text-ink-600">
        Filenest doesn't have a server that touches your files. Every tool on
        this site — the PDF tools, the file viewer, and the converter — runs
        entirely as JavaScript inside your own browser tab.
      </p>
      <div className="mt-8 space-y-5 text-sm leading-relaxed text-ink-600">
        <p>
          <strong className="text-ink-900">What happens to a file you open here:</strong>{" "}
          it's read locally using your browser's File API, processed in memory, and the
          result is offered back to you as a download. It is never transmitted anywhere.
        </p>
        <p>
          <strong className="text-ink-900">What we don't collect:</strong> file contents,
          file names, or the results of any conversion.
        </p>
        <p>
          <strong className="text-ink-900">Basic analytics:</strong> if analytics are
          enabled on this deployment, they only see page views, not file activity.
        </p>
      </div>
    </div>
  );
}
