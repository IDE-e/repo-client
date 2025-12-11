"use client";

import Editor from "@monaco-editor/react";
import { useViewportSize } from "@/app/hooks/useViewportSize";

export default function Untitled() {
  const { height } = useViewportSize();

  const editorHeight = Math.max(240, height - 220);

  return (
    <div
      className="w-full border border-border-default rounded overflow-hidden"
      style={{ height: editorHeight }}
    >
      <Editor
        height="100%"
        defaultLanguage="typescript"
        defaultValue={`export default function Untitled() {\n  return <div />;\n}`}
        theme="vs-dark"
        options={{
          fontSize: 12,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}
