import { SITE_URL, SITEMAP_ROUTES, getToolRoutes } from "./seoConfig.js";

/**
 * Generate XML sitemap for SEO
 */
export const generateSitemap = (tools = []) => {
  const baseRoutes = SITEMAP_ROUTES;
  const toolRoutes = getToolRoutes(tools);
  const allRoutes = [...baseRoutes, ...toolRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map((route) => {
    // Determine priority and change frequency
    let priority = "0.8";
    let changefreq = "weekly";

    if (route === "/") {
      priority = "1.0";
      changefreq = "daily";
    } else if (route === "/tools") {
      priority = "0.9";
      changefreq = "weekly";
    } else if (route === "/viewer") {
      priority = "0.8";
      changefreq = "monthly";
    } else if (route === "/privacy") {
      priority = "0.5";
      changefreq = "yearly";
    } else if (route.startsWith("/tools/")) {
      priority = "0.8";
      changefreq = "monthly";
    }

    return `  <url>
    <loc>${SITE_URL}${route}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>`;

  return sitemap;
};

/**
 * Parse tools array and generate sitemap URL entries
 */
export const generateSitemapFromTools = (tools) => {
  if (!Array.isArray(tools)) return generateSitemap([]);
  return generateSitemap(tools);
};

export default generateSitemap;
