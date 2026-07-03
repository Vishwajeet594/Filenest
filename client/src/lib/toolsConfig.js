// Central registry for every tool on the site.
// category: "pdf" | "viewer" | "converter"
export const TOOLS = [
  // ---- PDF TOOLS ----
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    category: "pdf",
    tagline: "Combine PDFs in the order you want.",
    description:
      "Stack multiple PDF files into one clean document. Drag to reorder before you merge.",
    icon: "Layers",
    accent: "brand",
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    category: "pdf",
    tagline: "Pull pages out, or break a file apart.",
    description:
      "Extract a page range or split every page of a PDF into separate files.",
    icon: "Scissors",
    accent: "sun",
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    category: "pdf",
    tagline: "Shrink file size for easy sharing.",
    description:
      "Reduce PDF size by re-optimizing structure and downsampling embedded images.",
    icon: "Minimize2",
    accent: "brand",
  },
  {
    slug: "pdf-to-images",
    name: "PDF to JPG",
    category: "pdf",
    tagline: "Export every page as an image.",
    description: "Convert each page of a PDF into a high-quality JPG or PNG.",
    icon: "Image",
    accent: "sun",
  },
  {
    slug: "images-to-pdf",
    name: "JPG to PDF",
    category: "pdf",
    tagline: "Turn photos into one PDF.",
    description: "Combine JPG, PNG or WEBP images into a single PDF document.",
    icon: "FileImage",
    accent: "brand",
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    category: "pdf",
    tagline: "Fix sideways or upside-down pages.",
    description: "Rotate all or selected pages by 90°, 180° or 270°.",
    icon: "RotateCw",
    accent: "sun",
  },
  {
    slug: "watermark-pdf",
    name: "Watermark PDF",
    category: "pdf",
    tagline: "Stamp text across every page.",
    description: "Add a custom text watermark with control over size, angle and opacity.",
    icon: "Stamp",
    accent: "brand",
  },
  {
    slug: "remove-pages",
    name: "Remove Pages",
    category: "pdf",
    tagline: "Delete the pages you don't need.",
    description: "Pick and delete individual pages from a PDF, then download the rest.",
    icon: "FileMinus",
    accent: "sun",
  },
  {
    slug: "page-numbers",
    name: "Add Page Numbers",
    category: "pdf",
    tagline: "Stamp page numbers onto every page.",
    description: "Add page numbers to a PDF with control over position and starting number.",
    icon: "Hash",
    accent: "brand",
  },

  // ---- FILE VIEWER ----
  {
    slug: "view-pdf",
    name: "View PDF",
    category: "viewer",
    kind: "pdf",
    tagline: "Open a PDF straight in your browser.",
    description: "No downloads or plugins — view PDF pages instantly.",
    icon: "FileText",
    accent: "brand",
  },
  {
    slug: "view-docx",
    name: "View Word (DOCX)",
    category: "viewer",
    kind: "docx",
    tagline: "Preview Word documents instantly.",
    description: "Open .docx files and read formatted content in the browser.",
    icon: "FileType",
    accent: "sun",
  },
  {
    slug: "view-xlsx",
    name: "View Excel (XLSX)",
    category: "viewer",
    kind: "xlsx",
    tagline: "Preview spreadsheets as tables.",
    description: "Open .xlsx or .xls files and browse each sheet as a table.",
    icon: "Table",
    accent: "brand",
  },
  {
    slug: "view-csv",
    name: "View CSV",
    category: "viewer",
    kind: "csv",
    tagline: "Preview CSV data as a table.",
    description: "Open comma-separated files and view them as a clean table.",
    icon: "Table2",
    accent: "sun",
  },
  {
    slug: "view-json",
    name: "View JSON",
    category: "viewer",
    kind: "json",
    tagline: "Pretty-printed, collapsible JSON.",
    description: "Open .json files with syntax highlighting and formatting.",
    icon: "Braces",
    accent: "brand",
  },
  {
    slug: "view-markdown",
    name: "View Markdown",
    category: "viewer",
    kind: "markdown",
    tagline: "Render Markdown as formatted text.",
    description: "Open .md files and see the rendered output.",
    icon: "Hash",
    accent: "sun",
  },
  {
    slug: "view-txt",
    name: "View Text",
    category: "viewer",
    kind: "txt",
    tagline: "Open plain text files instantly.",
    description: "View .txt or log files right in the browser.",
    icon: "FileText",
    accent: "brand",
  },

  // ---- FILE CONVERTER ----
  {
    slug: "convert-files",
    name: "File Converter",
    category: "converter",
    tagline: "Convert between JSON, CSV, XLSX, XML, Markdown and images.",
    description:
      "One tool, many formats — pick a source file and a target format.",
    icon: "Repeat",
    accent: "sun",
  },
];

export const CATEGORY_META = {
  pdf: {
    label: "PDF Tools",
    description: "Merge, split, compress and edit PDF files.",
  },
  viewer: {
    label: "File Viewer",
    description: "Open files directly in your browser — no software needed.",
  },
  converter: {
    label: "File Converter",
    description: "Convert between common data and document formats.",
  },
};

export function getToolBySlug(slug) {
  return TOOLS.find((t) => t.slug === slug);
}
