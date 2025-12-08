import { GitBranch, Terminal as TerminalIcon } from "lucide-react";
import { useLayoutStore } from "@/app/store/useLayoutStore";
import clsx from "clsx";

export function VSCodeFooter() {
  const { isTerminalOpen, toggleTerminal } = useLayoutStore();

  return (
    <div className="w-full h-6 bg-blue flex items-center justify-between px-4 text-xs">
      <div className="flex items-center gap-4 text-white">
        <div className="flex items-center gap-1">
          <GitBranch size={12} />
          <span>main</span>
        </div>
        <span>0 ↓ · 0 ↑</span>

        {/* Terminal Toggle */}
        <button
          type="button"
          onClick={toggleTerminal}
          className={clsx(
            "flex items-center gap-1 px-2 py-[2px] rounded-sm text-[11px]",
            isTerminalOpen ? "bg-blue-800" : "bg-transparent hover:bg-blue-900"
          )}
        >
          <TerminalIcon size={11} />
          <span>Terminal</span>
        </button>
      </div>

      <div className="flex items-center gap-4 text-white">
        <span>Ln 1, Col 1</span>
        <span>UTF-8</span>
        <span>JavaScript</span>
      </div>
    </div>
  );
}
