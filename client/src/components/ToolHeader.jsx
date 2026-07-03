import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ToolIcon from "./ToolIcon.jsx";
import { CATEGORY_META } from "../lib/toolsConfig.js";

const ACCENTS = {
  brand: "bg-brand-50 text-brand-700",
  sun: "bg-sun-50 text-sun-700",
};

export default function ToolHeader({ tool }) {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-8 pt-12 text-center">
      <nav className="mb-6 flex items-center justify-center gap-1 text-xs text-ink-400">
        <Link to="/" className="hover:text-brand-700">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link to="/tools" className="hover:text-brand-700">
          {CATEGORY_META[tool.category]?.label || "Tools"}
        </Link>
        <ChevronRight size={12} />
        <span className="text-ink-600">{tool.name}</span>
      </nav>
      <span
        className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
          ACCENTS[tool.accent] || ACCENTS.brand
        }`}
      >
        <ToolIcon name={tool.icon} size={26} />
      </span>
      <h1 className="text-3xl font-semibold md:text-4xl">{tool.name}</h1>
      <p className="mx-auto mt-3 max-w-lg text-ink-500">{tool.description}</p>
    </div>
  );
}
