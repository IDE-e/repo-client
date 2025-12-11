import { useEffect, useRef, useState } from "react";
import { Search, Settings, User } from "lucide-react";
import Image from "next/image";
import icon from "@/app/images/icon/logo96.png";
import { MENU_DEFS, MenuAction, MenuId, MenuItem } from "@/app/types/menu";
import { useRouter } from "next/navigation";

export function VSCodeHeader() {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<MenuId | null>(null);

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

  // 메뉴 액션 핸들러 맵
  const actionHandlers: Record<MenuAction, () => void> = {
    newFile: () => {
      console.log("New File");
      router.push("/untitled-1");
    },
    openFile: () => console.log("Open File"),
    openFolder: () => console.log("Open Folder"),
    save: () => console.log("Save"),
    saveAll: () => console.log("Save All"),
    undo: () => console.log("Undo"),
    redo: () => console.log("Redo"),
    cut: () => console.log("Cut"),
    copy: () => console.log("Copy"),
    paste: () => console.log("Paste"),
    commandPalette: () => console.log("Command Palette"),
    about: () => console.log("About"),
  };

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.disabled) return;
    actionHandlers[item.id]?.();
    setActiveMenu(null);
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
                        key={item.id}
                        type="button"
                        disabled={item.disabled}
                        className={[
                          "w-full flex items-center justify-between gap-3",
                          "px-3 py-[5px] text-[11px] text-text-soft",
                          item.disabled
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:bg-[#094771] hover:text-white",
                        ].join(" ")}
                        onClick={() => handleMenuItemClick(item)}
                      >
                        <span>{item.label}</span>
                        {item.shortcut && (
                          <span className="text-[10px] text-text-deep">
                            {item.shortcut}
                          </span>
                        )}
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
