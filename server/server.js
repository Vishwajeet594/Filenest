import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// The client is built separately (npm run build) into client/dist.
const distPath = path.join(__dirname, "..", "client", "dist");

app.use(express.static(distPath));

// SEO: Sitemap endpoint
app.get("/sitemap.xml", (req, res) => {
  const tools = [
    { slug: "merge-pdf" },
    { slug: "split-pdf" },
    { slug: "compress-pdf" },
    { slug: "pdf-to-images" },
    { slug: "images-to-pdf" },
    { slug: "rotate-pdf" },
    { slug: "watermark-pdf" },
    { slug: "remove-pages" },
    { slug: "page-numbers" },
    { slug: "view-pdf" },
    { slug: "view-docx" },
    { slug: "view-xlsx" },
    { slug: "view-csv" },
    { slug: "view-json" },
    { slug: "view-markdown" },
  ];

  const siteUrl = process.env.SITE_URL || "https://filenest-g40x.onrender.com";

  const baseRoutes = [
    { path: "/", priority: "1.0", changefreq: "daily" },
    { path: "/tools", priority: "0.9", changefreq: "weekly" },
    { path: "/viewer", priority: "0.8", changefreq: "monthly" },
    { path: "/privacy", priority: "0.5", changefreq: "yearly" },
  ];

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add base routes
  baseRoutes.forEach(({ path: routePath, priority, changefreq }) => {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${siteUrl}${routePath}</loc>\n`;
    sitemap += `    <changefreq>${changefreq}</changefreq>\n`;
    sitemap += `    <priority>${priority}</priority>\n`;
    sitemap += `  </url>\n`;
  });

  // Add tool routes
  tools.forEach(({ slug }) => {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${siteUrl}/tools/${slug}</loc>\n`;
    sitemap += `    <changefreq>monthly</changefreq>\n`;
    sitemap += `    <priority>0.8</priority>\n`;
    sitemap += `  </url>\n`;
  });

  sitemap += "</urlset>";

  res.type("application/xml");
  res.send(sitemap);
});

// SEO: robots.txt endpoint (serves from static, but fallback)
app.get("/robots.txt", (req, res) => {
  const siteUrl = process.env.SITE_URL || "https://filenest-g40x.onrender.com";
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /*.json$

User-agent: AdsBot-Google
User-agent: Googlebot
Crawl-delay: 0

User-agent: *
Crawl-delay: 1

Sitemap: ${siteUrl}/sitemap.xml
`;
  res.type("text/plain");
  res.send(robots);
});

// SPA fallback so client-side routes like /tools/merge-pdf work on refresh.
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Filenest is running on port ${PORT}`);
});
