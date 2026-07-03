import React from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { getToolBySlug, TOOLS } from "../lib/toolsConfig.js";
import ToolHeader from "../components/ToolHeader.jsx";
import ToolCard from "../components/ToolCard.jsx";
import usePageMeta from "../hooks/usePageMeta.js";
import { useStructuredDataMultiple } from "../hooks/useStructuredData.js";
import { getToolMeta, getBreadcrumbSchema } from "../lib/seoConfig.js";

import MergePdf from "../components/pdf/MergePdf.jsx";
import SplitPdf from "../components/pdf/SplitPdf.jsx";
import CompressPdf from "../components/pdf/CompressPdf.jsx";
import PdfToImages from "../components/pdf/PdfToImages.jsx";
import ImagesToPdf from "../components/pdf/ImagesToPdf.jsx";
import RotatePdf from "../components/pdf/RotatePdf.jsx";
import WatermarkPdf from "../components/pdf/WatermarkPdf.jsx";
import RemovePages from "../components/pdf/RemovePages.jsx";
import AddPageNumbers from "../components/pdf/AddPageNumbers.jsx";
import FileViewer from "../components/viewer/FileViewer.jsx";
import FileConverter from "../components/converter/FileConverter.jsx";

const PDF_COMPONENTS = {
  "merge-pdf": MergePdf,
  "split-pdf": SplitPdf,
  "compress-pdf": CompressPdf,
  "pdf-to-images": PdfToImages,
  "images-to-pdf": ImagesToPdf,
  "rotate-pdf": RotatePdf,
  "watermark-pdf": WatermarkPdf,
  "remove-pages": RemovePages,
  "page-numbers": AddPageNumbers,
};

export default function ToolPage() {
  const { slug } = useParams();
  const tool = getToolBySlug(slug);

  if (!tool) return <Navigate to="/tools" replace />;

  // SEO: Get tool-specific meta
  const toolMeta = getToolMeta(tool.slug, tool.name, tool.description);

  usePageMeta({
    title: toolMeta.title,
    description: toolMeta.description,
    keywords: toolMeta.keywords,
    canonical: toolMeta.canonical,
    ogTitle: toolMeta.title,
    ogDescription: toolMeta.description,
    ogImage: "https://filenest.app/og-image.png",
  });

  // SEO: Add structured data with breadcrumbs
  useStructuredDataMultiple([getBreadcrumbSchema(`/tools/${slug}`, tool.name)]);

  let body;
  if (tool.category === "pdf") {
    const Cmp = PDF_COMPONENTS[tool.slug];
    body = Cmp ? <Cmp /> : <p>Coming soon.</p>;
  } else if (tool.category === "viewer") {
    body = <FileViewer kind={tool.kind} />;
  } else if (tool.category === "converter") {
    body = <FileConverter />;
  }

  const related = TOOLS.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, 3);

  return (
    <div>
      <ToolHeader tool={tool} />
      <div className="mx-auto max-w-2xl px-5 pb-16">{body}</div>

      {related.length > 0 && (
        <div className="border-t border-ink-100 bg-white py-14">
          <div className="mx-auto max-w-5xl px-5">
            <h2 className="mb-5 text-center text-xl font-semibold">You might also need</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link to="/tools" className="text-sm font-medium text-brand-700 hover:underline">
                See all tools →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
