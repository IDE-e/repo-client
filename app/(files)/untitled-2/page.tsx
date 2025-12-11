"use client";

import { useMemo, useRef, useState } from "react";
import { FileText } from "lucide-react";

const INITIAL_CODE = `import React from "react";

export default function Untitled() {
  return (
    <div>
      Hello IDE-e
    </div>
  );
}
`;

const Untitled = () => {
  const [code, setCode] = useState(INITIAL_CODE);

  const lineRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const lineCount = useMemo(() => {
    // 최소 1줄 보장
    const count = code.split("\n").length;
    return Math.max(1, count);
  }, [code]);

  const lineNumbers = useMemo(
    () => Array.from({ length: lineCount }, (_, i) => i + 1),
    [lineCount]
  );

  const handleScroll = () => {
    const lineEl = lineRef.current;
    const taEl = textareaRef.current;
    if (!lineEl || !taEl) return;
    lineEl.scrollTop = taEl.scrollTop;
  };

  return (
    <div className="flex flex-col h-full">
      {/* 에디터 박스 */}
      <div className="flex-1 border border-border-default rounded bg-bg-dark overflow-hidden flex flex-col">
        {/* 상단: 파일 탭 느낌 */}
        <div className="flex items-center h-8 bg-bg-default border-b border-border-default text-xs">
          <div className="flex items-center gap-2 px-3 py-1 bg-bg-dark border-r border-border-default">
            <FileText size={12} className="text-text-deep" />
            <span className="text-sub_point">Untitled.tsx</span>
            <span className="text-text-deep">●</span>
          </div>
          <div className="flex-1" />
        </div>

        {/* 코드 본문 */}
        <div className="flex-1 overflow-hidden font-mono text-[12px] leading-5">
          <div className="flex h-full">
            {/* 라인 넘버 */}
            <div
              ref={lineRef}
              className="select-none bg-bg-dark border-r border-border-default text-right pr-3 pl-2 text-text-deep overflow-hidden"
            >
              <div className="py-1">
                {lineNumbers.map((n) => (
                  <div key={n} className="h-5">
                    {n}
                  </div>
                ))}
              </div>
            </div>

            {/* 실제 입력 영역 */}
            <textarea
              ref={textareaRef}
              className="flex-1 bg-transparent pl-3 py-1 outline-none resize-none text-text-default overflow-auto custom-scrollbar"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onScroll={handleScroll}
              spellCheck={false}
              placeholder="// Start typing..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Untitled;
