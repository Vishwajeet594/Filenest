import { useEffect } from "react";

/**
 * Hook to inject JSON-LD structured data into the document head
 * Used for breadcrumbs, FAQ, organization schema, etc.
 */
export const useStructuredData = (schema) => {
  useEffect(() => {
    if (!schema) return;

    // Create or update structured data script tag
    const scriptId = `schema-${schema["@type"]?.replace(/\s+/g, "-").toLowerCase()}`;
    let scriptElement = document.getElementById(scriptId);

    if (!scriptElement) {
      scriptElement = document.createElement("script");
      scriptElement.id = scriptId;
      scriptElement.type = "application/ld+json";
      document.head.appendChild(scriptElement);
    }

    scriptElement.textContent = JSON.stringify(schema);
  }, [schema]);
};

/**
 * Inject multiple structured data schemas
 */
export const useStructuredDataMultiple = (schemas) => {
  useEffect(() => {
    if (!schemas || !Array.isArray(schemas)) return;

    schemas.forEach((schema, index) => {
      if (!schema) return;

      const scriptId = `schema-${index}-${schema["@type"]?.replace(/\s+/g, "-").toLowerCase()}`;
      let scriptElement = document.getElementById(scriptId);

      if (!scriptElement) {
        scriptElement = document.createElement("script");
        scriptElement.id = scriptId;
        scriptElement.type = "application/ld+json";
        document.head.appendChild(scriptElement);
      }

      scriptElement.textContent = JSON.stringify(schema);
    });
  }, [schemas]);
};

export default useStructuredData;
