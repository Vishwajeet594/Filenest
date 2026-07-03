import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, FileStack } from "lucide-react";
import { TOOLS } from "../../lib/toolsConfig.js";

const pdfTools = TOOLS.filter((t) => t.category === "pdf");

export default function Header() {
  const [open, setOpen] = useState(false);
  const [pdfMenu, setPdfMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-ink-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <FileStack size={18} />
          </span>
          <span className="font-display text-xl font-semibold text-ink-900">
            Filenest
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <div
            className="relative"
            onMouseEnter={() => setPdfMenu(true)}
            onMouseLeave={() => setPdfMenu(false)}
          >
            <button className="rounded-full px-4 py-2 text-sm font-medium text-ink-600 hover:bg-white hover:text-ink-900">
              PDF Tools
            </button>
            {pdfMenu && (
              <div className="absolute left-0 top-full w-64 rounded-xl2 border border-ink-100 bg-white p-2 shadow-card">
                {pdfTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    to={`/tools/${tool.slug}`}
                    className="block rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-brand-50 hover:text-brand-700"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <NavLink
            to="/viewer"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-medium ${
                isActive ? "bg-white text-brand-700" : "text-ink-600 hover:bg-white hover:text-ink-900"
              }`
            }
          >
            File Viewer
          </NavLink>
          <NavLink
            to="/tools/convert-files"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-medium ${
                isActive ? "bg-white text-brand-700" : "text-ink-600 hover:bg-white hover:text-ink-900"
              }`
            }
          >
            Converter
          </NavLink>
          <NavLink
            to="/tools"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-medium ${
                isActive ? "bg-white text-brand-700" : "text-ink-600 hover:bg-white hover:text-ink-900"
              }`
            }
          >
            All Tools
          </NavLink>
        </nav>

        <div className="hidden md:block">
          <Link to="/tools/merge-pdf" className="btn-primary">
            Open a tool
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-ink-700 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-100 bg-white px-5 py-4 md:hidden">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
            PDF Tools
          </p>
          <div className="mb-4 grid grid-cols-2 gap-1">
            {pdfTools.map((tool) => (
              <Link
                key={tool.slug}
                to={`/tools/${tool.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-brand-50"
              >
                {tool.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-1 border-t border-ink-100 pt-3">
            <Link to="/viewer" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-brand-50">
              File Viewer
            </Link>
            <Link to="/tools/convert-files" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-brand-50">
              Converter
            </Link>
            <Link to="/tools" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-brand-50">
              All Tools
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
