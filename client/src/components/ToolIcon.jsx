import {
  Layers,
  Scissors,
  Minimize2,
  Image,
  FileImage,
  RotateCw,
  Stamp,
  FileMinus,
  Lock,
  FileText,
  FileType,
  Table,
  Table2,
  Braces,
  Hash,
  Repeat,
  FileQuestion,
} from "lucide-react";

const MAP = {
  Layers,
  Scissors,
  Minimize2,
  Image,
  FileImage,
  RotateCw,
  Stamp,
  FileMinus,
  Lock,
  FileText,
  FileType,
  Table,
  Table2,
  Braces,
  Hash,
  Repeat,
};

export default function ToolIcon({ name, ...props }) {
  const Cmp = MAP[name] || FileQuestion;
  return <Cmp {...props} />;
}
