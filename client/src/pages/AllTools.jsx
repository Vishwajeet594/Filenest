import React from "react";
import ToolCard from "../components/ToolCard.jsx";
import { TOOLS, CATEGORY_META } from "../lib/toolsConfig.js";

export default function AllTools() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold md:text-4xl">All tools</h1>
        <p className="mt-3 text-ink-500">
          {TOOLS.length} tools for working with PDFs and everyday files.
        </p>
      </div>

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
    </div>
  );
}
