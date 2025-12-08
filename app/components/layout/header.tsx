import { useEffect, useRef, useState } from "react";
import { Search, Settings, User } from "lucide-react";
import Image from "next/image";
import icon from "@/app/images/icon/logo96.png";

type MenuId =
  | "file"
  | "edit"
  | "selection"
  | "view"
  | "go"
  | "run"
  | "terminal"
  | "help";

const MENU_DEFS: {
  id: MenuId;
  label: string;
  items: string[];
}[] = [
  {
    id: "file",
    label: "File",
    items: ["New File", "Open File...", "Open Folder...", "Save", "Save All"],
  },
  {
    id: "edit",
    label: "Edit",
    items: ["Undo", "Redo", "Cut", "Copy", "Paste"],
  },
  {
    id: "selection",
    label: "Selection",
    items: ["Select All", "Expand Selection", "Shrink Selection"],
  },
  {
    id: "view",
    label: "View",
    items: ["Command Palette...", "Appearance", "Explorer", "Extensions"],
  },
  {
    id: "go",
    label: "Go",
    items: ["Back", "Forward", "Go to File...", "Go to Symbol..."],
  },
  {
    id: "run",
    label: "Run",
    items: ["Run Without Debugging", "Start Debugging", "Run Task..."],
  },
  {
    id: "terminal",
    label: "Terminal",
    items: ["New Terminal", "Split Terminal", "Run Task..."],
  },
  {
    id: "help",
    label: "Help",
    items: ["Documentation", "Release Notes", "About"],
  },
];

export function VSCodeHeader() {
  const [activeMenu, setActiveMenu] = useState<MenuId | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!headerRef.current) return;
      if (!headerRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };

    if (activeMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenu]);

  const toggleMenu = (id: MenuId) => {
    setActiveMenu((prev) => (prev === id ? null : id));
  };

  return (
    <header
      ref={headerRef}
      className="relative flex items-center h-9 bg-[#323233] border-b border-border-default px-2"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Image
            src={icon}
            alt="icon"
            width={22}
            height={22}
            className="mx-1.5"
          />
        </div>

        {/* 상단 메뉴들 */}
        <nav className="flex gap-1 text-xs text-text-default">
          {MENU_DEFS.map((menu) => {
            const isActive = activeMenu === menu.id;

            return (
              <div key={menu.id} className="relative">
                <button
                  type="button"
                  onClick={() => toggleMenu(menu.id)}
                  className={[
                    "px-2 py-[2px] rounded-[2px] cursor-pointer select-none",
                    "hover:text-white hover:bg-[#3c3c3c]",
                    isActive ? "bg-[#3c3c3c] text-white" : "",
                  ].join(" ")}
                >
                  {menu.label}
                </button>

                {/* 드롭다운 */}
                {isActive && (
                  <div className="absolute left-0 top-full mt-[2px] min-w-[180px] bg-[#252526] border border-border-default rounded-[2px] shadow-lg z-50">
                    {menu.items.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className="w-full text-left px-3 py-[5px] text-[11px] text-text-soft hover:bg-[#094771] hover:text-white"
                        // 실제 동작은 나중에 onClick에 붙이면 됨
                        onClick={() => {
                          // TODO: 메뉴 동작 연결
                          setActiveMenu(null);
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Search
          size={14}
          className="text-text-default cursor-pointer hover:text-white"
        />
        <Settings
          size={14}
          className="text-text-default cursor-pointer hover:text-white"
        />
        <User
          size={14}
          className="text-text-default cursor-pointer hover:text-white"
        />
      </div>
    </header>
  );
}
