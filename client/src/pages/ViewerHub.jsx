import React from "react";
import ToolCard from "../components/ToolCard.jsx";
import { TOOLS } from "../lib/toolsConfig.js";
import usePageMeta from "../hooks/usePageMeta.js";
import { useStructuredDataMultiple } from "../hooks/useStructuredData.js";
import { PAGE_META, getBreadcrumbSchema } from "../lib/seoConfig.js";

export default function ViewerHub() {
  const tools = TOOLS.filter((t) => t.category === "viewer");

  // SEO: Update page meta tags
  const viewerMeta = PAGE_META["/viewer"];
  usePageMeta({
    title: viewerMeta.title,
    description: viewerMeta.description,
    keywords: viewerMeta.keywords,
    canonical: "https://filenest.app/viewer",
    ogTitle: viewerMeta.title,
    ogDescription: viewerMeta.description,
    ogImage: "https://filenest.app/og-image.png",
  });

  // SEO: Add structured data
  useStructuredDataMultiple([getBreadcrumbSchema("/viewer")]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold md:text-4xl">File Viewer</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-500">
          Open files directly in your browser. Pick a format below — nothing is
          uploaded anywhere.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
