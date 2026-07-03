import React from "react";
import ToolCard from "../components/ToolCard.jsx";
import { TOOLS } from "../lib/toolsConfig.js";

export default function ViewerHub() {
  const tools = TOOLS.filter((t) => t.category === "viewer");
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
