"use client";

import { useState } from "react";
import { DiffEditor } from "@monaco-editor/react";
import { SplitSquareVertical, Columns } from "lucide-react";

export default function DiffViewerPage() {
  const [mode, setMode] = useState<"split" | "inline">("split");

  const oldCode = `
import React from "react";

export function Hello() {
  return <div>Hello world!</div>;
}
`;

  const newCode = `
import React from "react";

export function Hello({ name }) {
  return <div>Hello {name}</div>;
}
`;

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-default">Diff Viewer</h1>
          <p className="text-xs text-text-soft">
            Monaco 기반 코드 비교 뷰어입니다. VS Code 스타일로 구현되었습니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode("split")}
            className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
              mode === "split"
                ? "bg-deepblue text-white"
                : "bg-bg-default text-text-soft hover:bg-bg-hover"
            }`}
          >
            <SplitSquareVertical size={14} />
            Split
          </button>

          <button
            onClick={() => setMode("inline")}
            className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
              mode === "inline"
                ? "bg-deepblue text-white"
                : "bg-bg-default text-text-soft hover:bg-bg-hover"
            }`}
          >
            <Columns size={14} />
            Inline
          </button>
        </div>
      </div>

      {/* Diff Editor */}
      <div className="border border-border-default rounded bg-bg-dark h-96">
        <DiffEditor
          key={mode}
          original={oldCode}
          modified={newCode}
          theme="vs-dark"
          height="100%"
          options={{
            readOnly: false,
            fontSize: 13,
            minimap: { enabled: false },
            renderSideBySide: mode === "split",
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
}
