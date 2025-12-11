import {
  BellIcon,
  GitBranch,
  SatelliteDish,
  Terminal as TerminalIcon,
} from "lucide-react";
import { useLayoutStore } from "@/app/store/useLayoutStore";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export function VSCodeFooter() {
  const { isTerminalOpen, toggleTerminal } = useLayoutStore();
  const router = useRouter();

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
            "flex items-center gap-1 px-2 py-[4px] text-[11px]",
            isTerminalOpen ? "bg-blue-800" : "bg-transparent hover:bg-deepblue"
          )}
        >
          <TerminalIcon size={11} />
          <span>Terminal</span>
        </button>
      </div>

      <div className="flex items-center gap-5 text-white">
        <span>Ln 1, Col 1</span>
        <span>UTF-8</span>
        <span>JavaScript</span>
        <button
          className="flex gap-1 py-[4px] px-2 hover:bg-deepblue"
          onClick={() => {
            window.open("/test", "_blank", "noopener,noreferrer");
          }}
        >
          <SatelliteDish className="w-4 h-4" /> Go Live
        </button>
        <BellIcon className="w-4 h-4" />
      </div>
    </div>
  );
}
