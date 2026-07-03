import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Zap, EyeOff } from "lucide-react";
import ToolCard from "../components/ToolCard.jsx";
import { TOOLS, CATEGORY_META } from "../lib/toolsConfig.js";
import usePageMeta from "../hooks/usePageMeta.js";
import { useStructuredDataMultiple } from "../hooks/useStructuredData.js";
import { PAGE_META, ORGANIZATION_SCHEMA, WEB_APPLICATION_SCHEMA, getBreadcrumbSchema } from "../lib/seoConfig.js";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pdf", label: "PDF Tools" },
  { key: "viewer", label: "File Viewer" },
  { key: "converter", label: "Converter" },
];

export default function Home() {
  const [filter, setFilter] = useState("all");
  const shown =
    filter === "all" ? TOOLS : TOOLS.filter((t) => t.category === filter);

  // SEO: Update page meta tags
  const homeMeta = PAGE_META["/"];
  usePageMeta({
    title: homeMeta.title,
    description: homeMeta.description,
    keywords: homeMeta.keywords,
    canonical: "https://filenest.app/",
    ogTitle: homeMeta.title,
    ogDescription: homeMeta.description,
    ogImage: "https://filenest.app/og-image.png",
  });

  // SEO: Add structured data
  useStructuredDataMultiple([
    ORGANIZATION_SCHEMA,
    WEB_APPLICATION_SCHEMA,
    getBreadcrumbSchema("/"),
  ]);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-16 text-center md:pt-24">
        <span className="chip mx-auto mb-5 bg-brand-50 text-brand-700">
          Runs entirely in your browser
        </span>
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
          Every PDF and file tool you need, in one calm place
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-ink-500 md:text-lg">
          Merge, split and compress PDFs. View DOCX, XLSX and CSV files. Convert
          between formats. No uploads, no accounts, nothing kept.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/tools/merge-pdf" className="btn-primary">
            Merge a PDF
          </Link>
          <Link to="/tools" className="btn-secondary">
            Browse all tools
          </Link>
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-ink-500">
          <span className="flex items-center gap-2">
            <EyeOff size={16} className="text-brand-600" /> Files never leave your device
          </span>
          <span className="flex items-center gap-2">
            <Zap size={16} className="text-brand-600" /> Instant, no waiting on a server
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-brand-600" /> Free, no sign-up
          </span>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                filter === f.key
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-ink-200 bg-white text-ink-600 hover:border-brand-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filter === "all" ? (
          <div className="space-y-14">
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <div key={key}>
                <div className="mb-5">
                  <h2 className="text-2xl font-semibold">{meta.label}</h2>
                  <p className="text-sm text-ink-500">{meta.description}</p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {TOOLS.filter((t) => t.category === key).map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-ink-100 bg-white py-16">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <h2 className="text-2xl font-semibold md:text-3xl">
            Why people use Filenest
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 text-left md:grid-cols-3">
            <div>
              <EyeOff className="mb-3 text-brand-600" size={22} />
              <h3 className="font-semibold text-ink-900">Private by design</h3>
              <p className="mt-1 text-sm text-ink-500">
                Every tool processes files with JavaScript running on your own
                machine. Nothing is sent to a server.
              </p>
            </div>
            <div>
              <Zap className="mb-3 text-brand-600" size={22} />
              <h3 className="font-semibold text-ink-900">Fast, no queues</h3>
              <p className="mt-1 text-sm text-ink-500">
                Skip upload and download queues entirely — conversions happen
                the moment you drop a file in.
              </p>
            </div>
            <div>
              <ShieldCheck className="mb-3 text-brand-600" size={22} />
              <h3 className="font-semibold text-ink-900">Free, always</h3>
              <p className="mt-1 text-sm text-ink-500">
                No sign-up, no watermark, no page limits hidden behind a
                paywall.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
