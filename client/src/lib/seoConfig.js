// SEO Configuration and metadata for all pages
export const SITE_URL = import.meta.env.VITE_SITE_URL || "https://filenest-g40x.onrender.com";
export const SITE_NAME = "Filenest";
export const SITE_DESCRIPTION =
  "Merge, split, compress and convert PDFs. View and convert DOCX, XLSX, CSV, JSON and more — free, fast, and entirely in your browser. No uploads, no sign-up.";
export const SITE_IMAGE = `${SITE_URL}/og-image.png`;

// Page metadata for SEO
export const PAGE_META = {
  "/": {
    title: "Filenest — PDF Tools, File Viewer & Converter",
    description:
      "Merge, split, compress and convert PDFs. View DOCX, XLSX, CSV, JSON and more — free, fast, and entirely in your browser. No uploads, no sign-up.",
    keywords: "PDF tools, file converter, file viewer, merge PDF, split PDF, compress PDF",
    ogType: "website",
  },
  "/tools": {
    title: "All PDF Tools & File Converters | Filenest",
    description:
      "Browse all 20+ free tools for working with PDFs, images, and documents. Merge, split, compress PDFs. View DOCX, XLSX, CSV files directly in your browser.",
    keywords: "PDF tools, file converter, document tools, free online tools",
    ogType: "website",
  },
  "/viewer": {
    title: "File Viewer | Open PDFs, DOCX, XLSX & More | Filenest",
    description:
      "Open and preview PDFs, Word documents (DOCX), Excel spreadsheets (XLSX), CSV files, JSON, and Markdown directly in your browser. No downloads needed.",
    keywords: "file viewer, PDF viewer, DOCX viewer, XLSX viewer, online document preview",
    ogType: "website",
  },
  "/privacy": {
    title: "Privacy Policy | Filenest",
    description:
      "Filenest is privacy-first. All tools run entirely in your browser. No files are uploaded to our servers. No data is collected.",
    keywords: "privacy, data protection, secure file tools",
    ogType: "website",
  },
  // Tool page templates
  "/tools/:slug": {
    titleTemplate: "{name} - Free Online Tool | Filenest",
    descriptionTemplate:
      "{description} Works entirely in your browser. Fast, secure, no uploads needed.",
    keywords: "PDF tool, free online converter, document processing",
    ogType: "website",
  },
};

// Tool-specific SEO metadata
export const TOOL_SEO_META = {
  "merge-pdf": {
    title: "Merge PDF - Combine Multiple PDFs Online | Filenest",
    description:
      "Combine multiple PDF files into one document. Drag to reorder pages before merging. Free, secure, works in your browser.",
    keywords: "merge PDF, combine PDFs, PDF joiner, free online tool",
  },
  "split-pdf": {
    title: "Split PDF - Extract Pages Online | Filenest",
    description:
      "Split a PDF into separate files or extract specific pages. Works entirely in your browser. No uploads, instant results.",
    keywords: "split PDF, extract PDF pages, PDF splitter, free online",
  },
  "compress-pdf": {
    title: "Compress PDF - Reduce File Size | Filenest",
    description:
      "Reduce PDF file size while maintaining quality. Compress images and optimize structure. Free, secure, in-browser tool.",
    keywords: "compress PDF, reduce PDF size, PDF optimizer, free online",
  },
  "pdf-to-images": {
    title: "PDF to JPG - Convert Pages to Images | Filenest",
    description:
      "Convert each page of your PDF to JPG or PNG images. Free, secure, works entirely in your browser.",
    keywords: "PDF to JPG, PDF to PNG, convert PDF to images, free online",
  },
  "images-to-pdf": {
    title: "JPG to PDF - Convert Images to PDF | Filenest",
    description:
      "Combine JPG, PNG, and WEBP images into a single PDF document. Free, fast, in-browser conversion.",
    keywords: "JPG to PDF, image to PDF, convert images to PDF, free online",
  },
  "rotate-pdf": {
    title: "Rotate PDF - Fix Page Orientation | Filenest",
    description:
      "Rotate PDF pages by 90°, 180°, or 270°. Fix sideways or upside-down pages. Free, instant, browser-based.",
    keywords: "rotate PDF, fix PDF orientation, PDF rotator, free online",
  },
  "watermark-pdf": {
    title: "Watermark PDF - Add Text Overlay | Filenest",
    description:
      "Add custom text watermarks to your PDF pages. Control size, angle, and opacity. Free, secure, in-browser.",
    keywords: "watermark PDF, add watermark, PDF watermark tool, free online",
  },
  "remove-pages": {
    title: "Remove PDF Pages - Delete Pages Online | Filenest",
    description:
      "Remove or delete specific pages from your PDF. Select which pages to keep and download. Free, secure, instant.",
    keywords: "remove PDF pages, delete PDF pages, PDF page remover, free online",
  },
  "page-numbers": {
    title: "Add Page Numbers to PDF | Filenest",
    description:
      "Add automatic page numbering to your PDF. Control position and starting number. Free, secure, browser-based.",
    keywords: "add page numbers, PDF page numbers, numbering tool, free online",
  },
  "view-pdf": {
    title: "PDF Viewer - Open PDFs Online | Filenest",
    description:
      "View PDF files directly in your browser without plugins or downloads. Fast, secure, no upload needed.",
    keywords: "PDF viewer, online PDF viewer, view PDF, free online",
  },
  "view-docx": {
    title: "Word Viewer - Preview DOCX Files Online | Filenest",
    description:
      "Open and preview Word documents (DOCX) directly in your browser. Formatted content, no download needed.",
    keywords: "DOCX viewer, Word viewer, online Word preview, free",
  },
  "view-xlsx": {
    title: "Excel Viewer - Preview XLSX Files Online | Filenest",
    description:
      "View Excel spreadsheets (XLSX) as tables in your browser. Multiple sheets, no downloads, instant preview.",
    keywords: "XLSX viewer, Excel viewer, spreadsheet viewer, free online",
  },
  "view-csv": {
    title: "CSV Viewer - Preview CSV Files Online | Filenest",
    description:
      "Open and view CSV files as formatted tables. No uploads, fast loading, browser-based viewer.",
    keywords: "CSV viewer, comma-separated values, data viewer, free",
  },
  "view-json": {
    title: "JSON Viewer - Pretty Print JSON Files | Filenest",
    description:
      "Open JSON files with syntax highlighting and tree view. Collapse/expand nested structures, no uploads.",
    keywords: "JSON viewer, JSON formatter, syntax highlighting, free",
  },
  "view-markdown": {
    title: "Markdown Viewer - Render MD Files Online | Filenest",
    description:
      "Preview Markdown files (.md) rendered as formatted HTML. No uploads, instant preview, browser-based.",
    keywords: "Markdown viewer, MD viewer, markdown preview, free online",
  },
};

// Breadcrumb schema data
export const getBreadcrumbSchema = (path, toolName = null) => {
  const breadcrumbs = [{ name: "Home", url: "/" }];

  if (path.includes("/tools")) {
    breadcrumbs.push({ name: "Tools", url: "/tools" });
    if (toolName) {
      breadcrumbs.push({ name: toolName, url: path });
    }
  } else if (path === "/viewer") {
    breadcrumbs.push({ name: "File Viewer", url: "/viewer" });
  } else if (path === "/privacy") {
    breadcrumbs.push({ name: "Privacy", url: "/privacy" });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
};

// Organization schema
export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: SITE_DESCRIPTION,
  sameAs: [
    "https://twitter.com/filenest",
    "https://github.com/filenest/filenest",
  ],
};

// WebApplication schema
export const WEB_APPLICATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: "Utility",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "500",
  },
};

// FAQ schema for tools
export const getFAQSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

// Get page meta data
export const getPageMeta = (pathname) => {
  const meta = PAGE_META[pathname] || PAGE_META["/"];
  return {
    canonical: `${SITE_URL}${pathname}`,
    ...meta,
  };
};

// Get tool-specific meta
export const getToolMeta = (toolSlug, toolName, toolDescription) => {
  const toolMeta = TOOL_SEO_META[toolSlug] || {};
  const templateMeta = PAGE_META["/tools/:slug"] || {};

  return {
    title: toolMeta.title || templateMeta.titleTemplate?.replace("{name}", toolName),
    description: toolMeta.description || templateMeta.descriptionTemplate?.replace("{description}", toolDescription),
    keywords: toolMeta.keywords || templateMeta.keywords,
    canonical: `${SITE_URL}/tools/${toolSlug}`,
  };
};

// Sitemap configuration
export const SITEMAP_ROUTES = [
  "/",
  "/tools",
  "/viewer",
  "/privacy",
];

// Get all tool routes
export const getToolRoutes = (tools) => {
  return tools.map((tool) => `/tools/${tool.slug}`);
};
