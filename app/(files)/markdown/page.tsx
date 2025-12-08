"use client";

import { useMemo, useState } from "react";
import { FileText, Save, Type } from "lucide-react";
import ReactMarkdown from "react-markdown";

const INITIAL_MD = `# VS Code Style Markdown

This is a **live markdown editor** inside a VS Code-like layout.

---

## Features

- Split view: editor / preview
- Live rendering
- Dark theme friendly
- Great for writing docs, notes, or specs

> You can customize this page however you want 😊

\`\`\`ts
const hello = (name: string) => {
  console.log(\`Hello, \${name}\`);
};
\`\`\`
`;

export default function MarkdownPage() {
  const [filename, setFilename] = useState("README.md");
  const [content, setContent] = useState(INITIAL_MD);
  const [savedContent, setSavedContent] = useState(INITIAL_MD);

  const isDirty = content !== savedContent;

  const stats = useMemo(() => {
    const lines = content.split("\n").length;
    const chars = content.length;
    const words = content
      .split(/\s+/)
      .filter((w) => w.trim().length > 0).length;

    return { lines, chars, words };
  }, [content]);

  const handleSave = () => {
    setSavedContent(content);
    // 실제로는 여기서 API 호출 등으로 저장
  };

  return (
    <div className="flex h-full flex-col gap-4 text-sm text-text-light">
      {/* 상단 헤더 영역 */}
      <section className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-sub_point" />
          <div>
            <div className="flex items-center gap-2">
              <input
                className="bg-transparent border-b border-transparent focus:border-border-light outline-none text-base font-semibold text-text-default"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
              />
              {isDirty && (
                <span className="text-[11px] text-warning">● Unsaved</span>
              )}
            </div>
            <p className="text-xs text-text-soft">
              VS Code 스타일의 Markdown 편집기 예시입니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] text-text-soft">
            <Type size={12} />
            <span>
              {stats.words} words • {stats.lines} lines
            </span>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty}
            className="inline-flex items-center gap-1 rounded border border-border-light bg-bg-default px-2 py-1 text-xs hover:bg-bg-hover disabled:opacity-50"
          >
            <Save size={12} />
            Save
          </button>
        </div>
      </section>

      {/* 에디터 + 프리뷰 분할 영역 */}
      <section className="flex flex-1 min-h-[360px] gap-4">
        {/* 왼쪽: Markdown 에디터 */}
        <div className="w-1/2 border border-border-default rounded bg-bg-dark flex flex-col overflow-hidden">
          <div className="px-3 py-2 text-xs bg-bg-default border-b border-border-default flex items-center justify-between">
            <span className="text-text-soft">EDITOR</span>
            <span className="text-text-deep text-[11px]">Markdown (.md)</span>
          </div>

          <textarea
            className="flex-1 w-full resize-none bg-bg-dark text-text-light font-mono text-[12px] p-3 outline-none custom-scrollbar"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* 오른쪽: Preview */}
        <div className="w-1/2 border border-border-default rounded bg-bg-dark flex flex-col overflow-hidden">
          <div className="px-3 py-2 text-xs bg-bg-default border-b border-border-default flex items-center justify-between">
            <span className="text-text-soft">PREVIEW</span>
            <span className="text-text-deep text-[11px]">
              Rendered Markdown
            </span>
          </div>

          <div className="flex-1 overflow-auto p-4 prose prose-invert max-w-none prose-pre:bg-bg-night prose-pre:border prose-pre:border-border-default prose-code:text-sub_warning">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </section>

      {/* 하단 상태 영역 (작은 상태바 느낌) */}
      <section className="flex items-center justify-between text-[11px] text-text-soft border-t border-border-default pt-2 mt-auto">
        <div className="flex items-center gap-3">
          <span>
            Lines: <span className="text-text-light">{stats.lines}</span>
          </span>
          <span>
            Characters: <span className="text-text-light">{stats.chars}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>Markdown Editor</span>
          <span className="text-text-deep">UTF-8</span>
        </div>
      </section>
    </div>
  );
}
