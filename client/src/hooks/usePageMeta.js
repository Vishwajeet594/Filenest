import { useEffect } from "react";

/**
 * Hook to manage document meta tags for SEO
 * Updates title, description, and other meta tags based on page content
 */
export const usePageMeta = ({
  title,
  description,
  keywords = "",
  canonical = "",
  ogTitle = "",
  ogDescription = "",
  ogImage = "",
  twitterTitle = "",
  twitterDescription = "",
  twitterImage = "",
  robotsContent = "index, follow",
}) => {
  useEffect(() => {
    // Update title
    if (title) {
      document.title = title;
    }

    // Helper to update or create meta tag
    const updateMetaTag = (name, property, content, isProperty = false) => {
      let element = document.querySelector(
        isProperty ? `meta[property="${property}"]` : `meta[name="${name}"]`
      );

      if (!element && content) {
        element = document.createElement("meta");
        if (isProperty) {
          element.setAttribute("property", property);
        } else {
          element.setAttribute("name", name);
        }
        document.head.appendChild(element);
      }

      if (element && content) {
        element.setAttribute("content", content);
      }
    };

    // Update standard meta tags
    updateMetaTag("description", null, description || "");
    updateMetaTag("keywords", null, keywords || "");
    updateMetaTag("robots", null, robotsContent || "index, follow");

    // Update Open Graph tags
    updateMetaTag(null, "og:title", ogTitle || title || "");
    updateMetaTag(null, "og:description", ogDescription || description || "");
    updateMetaTag(null, "og:image", ogImage || "");
    updateMetaTag(null, "og:url", canonical || "");
    updateMetaTag(null, "og:type", "website");

    // Update Twitter Card tags
    updateMetaTag("twitter:card", null, "summary_large_image");
    updateMetaTag("twitter:title", null, twitterTitle || title || "");
    updateMetaTag("twitter:description", null, twitterDescription || description || "");
    updateMetaTag("twitter:image", null, twitterImage || ogImage || "");

    // Update canonical URL
    if (canonical) {
      let canonicalElement = document.querySelector('link[rel="canonical"]');
      if (!canonicalElement) {
        canonicalElement = document.createElement("link");
        canonicalElement.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalElement);
      }
      canonicalElement.setAttribute("href", canonical);
    }
  }, [
    title,
    description,
    keywords,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    twitterTitle,
    twitterDescription,
    twitterImage,
    robotsContent,
  ]);
};

export default usePageMeta;
