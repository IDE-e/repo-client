import { useEffect, useRef, useState } from "react";
import { Terminal as TerminalIcon } from "lucide-react";

type Line = {
  id: number;
  text: string;
};

const MOCK_OUTPUTS: Record<string, string[]> = {
  "pnpm dev": [
    " > web@dev",
    " > next dev",
    "",
    "ready - started server on 0.0.0.0:3000, url: http://localhost:3000",
    "event - compiled client and server successfully",
  ],
  help: ["Available mock commands:", "  • pnpm dev", "  • hello", "  • clear"],
  hello: ["Hello, developer 👋", "This is a mock terminal output."],
};

let lineId = 0;

export function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { id: ++lineId, text: "› pnpm dev" },
    { id: ++lineId, text: "ready - mock dev server started" },
  ]);
  const [input, setInput] = useState("");
  const [height, setHeight] = useState(200); // px
  const [isResizing, setIsResizing] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragStartYRef = useRef<number | null>(null);
  const dragStartHeightRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when lines change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // Mouse move / up for resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      if (dragStartYRef.current == null || dragStartHeightRef.current == null)
        return;

      const delta = dragStartYRef.current - e.clientY; // drag up → height++
      const nextHeight = Math.min(
        500,
        Math.max(120, dragStartHeightRef.current + delta)
      );
      setHeight(nextHeight);
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        dragStartYRef.current = null;
        dragStartHeightRef.current = null;
      }
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsResizing(true);
    dragStartYRef.current = e.clientY;
    dragStartHeightRef.current = containerRef.current.offsetHeight;
  };

  const handleRunCommand = (command: string) => {
    if (!command.trim()) return;

    const newLines: Line[] = [];

    // Echo input
    newLines.push({
      id: ++lineId,
      text: `› ${command}`,
    });

    if (command === "clear") {
      // clear all and bail out
      setLines([]);
      return;
    }

    const output = MOCK_OUTPUTS[command];

    if (output && output.length > 0) {
      for (const line of output) {
        newLines.push({ id: ++lineId, text: line });
      }
    } else {
      newLines.push({
        id: ++lineId,
        text: `command not found: ${command}`,
      });
      newLines.push({
        id: ++lineId,
        text: `type "help" for available mock commands`,
      });
    }

    setLines((prev) => [...prev, ...newLines]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const cmd = input;
      setInput("");
      handleRunCommand(cmd);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className="border-t border-border-default bg-bg-default text-xs flex flex-col"
    >
      {/* Resize handle (상단 얇은 바) */}
      <div
        className="h-1 w-full cursor-row-resize bg-bg-default hover:bg-border-default"
        onMouseDown={handleDragStart}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1 border-b border-border-default select-none">
        <div className="flex items-center gap-2 text-text-soft">
          <TerminalIcon size={12} />
          <span className="text-[11px] tracking-wide">TERMINAL</span>
        </div>
      </div>

      {/* Content + Input */}
      <div
        ref={scrollRef}
        className="flex-1 px-3 py-2 font-mono text-[11px] overflow-auto custom-scrollbar"
      >
        {lines.map((line) => (
          <div key={line.id} className="text-text-soft whitespace-pre-wrap">
            {line.text}
          </div>
        ))}

        {/* Input line */}
        <div className="flex items-center text-text-soft mt-1">
          <span className="mr-1">›</span>
          <input
            className="bg-transparent outline-none border-none flex-1 text-[11px] text-text-light"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
