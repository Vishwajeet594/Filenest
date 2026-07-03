import React from "react";
import { Link } from "react-router-dom";
import { FileStack } from "lucide-react";
import { TOOLS } from "../../lib/toolsConfig.js";

export default function Footer() {
  const pdfTools = TOOLS.filter((t) => t.category === "pdf").slice(0, 6);
  const viewerTools = TOOLS.filter((t) => t.category === "viewer").slice(0, 6);

  return (
    <footer className="border-t border-ink-100 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
                <FileStack size={16} />
              </span>
              <span className="font-display text-lg font-semibold text-ink-900">
                Filenest
              </span>
            </div>
            <p className="text-sm leading-relaxed text-ink-500">
              Every file runs through your own browser. Nothing is uploaded to a server.
            </p>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
              PDF Tools
            </p>
            <ul className="space-y-2">
              {pdfTools.map((t) => (
                <li key={t.slug}>
                  <Link to={`/tools/${t.slug}`} className="text-sm text-ink-600 hover:text-brand-700">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
              File Viewer
            </p>
            <ul className="space-y-2">
              {viewerTools.map((t) => (
                <li key={t.slug}>
                  <Link to={`/tools/${t.slug}`} className="text-sm text-ink-600 hover:text-brand-700">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
              Filenest
            </p>
            <ul className="space-y-2">
              <li>
                <Link to="/tools" className="text-sm text-ink-600 hover:text-brand-700">
                  All tools
                </Link>
              </li>
              <li>
                <Link to="/tools/convert-files" className="text-sm text-ink-600 hover:text-brand-700">
                  File converter
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-ink-600 hover:text-brand-700">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-ink-100 pt-6 text-xs text-ink-400">
          © {new Date().getFullYear()} Filenest. All processing happens locally in your browser.
        </div>
      </div>
    </footer>
  );
}
