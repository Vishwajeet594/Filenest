import React from "react";
import { Link } from "react-router-dom";
import ToolIcon from "./ToolIcon.jsx";

const ACCENTS = {
  brand: "bg-brand-50 text-brand-700",
  sun: "bg-sun-50 text-sun-700",
};

export default function ToolCard({ tool }) {
  return (
    <Link
      to={`/tools/${tool.slug}`}
      className="card group flex flex-col gap-4 p-5 transition-transform hover:-translate-y-0.5 hover:shadow-lg"
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
          ACCENTS[tool.accent] || ACCENTS.brand
        }`}
      >
        <ToolIcon name={tool.icon} size={20} />
      </span>
      <div>
        <h3 className="text-base font-semibold text-ink-900 group-hover:text-brand-700">
          {tool.name}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-500">{tool.tagline}</p>
      </div>
    </Link>
  );
}
