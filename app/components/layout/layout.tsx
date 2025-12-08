"use client";

import { useEffect } from "react";
import { ChevronRight, FileText, X } from "lucide-react";
import { VSCodeHeader } from "./header";
import { VSCodeLeftMenu } from "./leftMenu";
import { VSCodeFooter } from "./footer";
import { usePathname, useRouter } from "next/navigation";
import { useVSCodeTabsStore } from "@/app/store/useVSCodeTabsStore";
import { Terminal } from "./terminal";
import { useLayoutStore } from "@/app/store/useLayoutStore";

type VSCodeLayoutProps = {
  children: React.ReactNode;
};

export default function VSCodeLayout({ children }: VSCodeLayoutProps) {
  const router = useRouter();
  const rawPathname = usePathname() || "/";
  const { tabs, activePath, openTab, closeTab, setActiveTab } =
    useVSCodeTabsStore();
  const { isTerminalOpen } = useLayoutStore();

  const trimmedLabel =
    rawPathname === "/" ? "home" : rawPathname.replace(/^\/+/, "");

  useEffect(() => {
    openTab(rawPathname, trimmedLabel);
  }, [rawPathname, trimmedLabel, openTab]);

  return (
    <div className="flex flex-col h-screen bg-bg-dark text-white font-mono">
      {/* Header */}
      <VSCodeHeader />

      {/* 본문 영역 (LeftMenu + 에디터) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Menu (아이콘 바 + Explorer) */}
        <VSCodeLeftMenu />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-bg-dark">
          {/* Tab Bar */}
          <div className="flex items-center h-9 bg-bg-default border-b border-border-default">
            <div className="flex">
              {tabs.map((tab) => {
                const isActive = tab.path === activePath;
                return (
                  <div
                    key={tab.path}
                    className={[
                      "flex items-center gap-2 px-4 py-2 border-r border-border-default text-sm cursor-pointer group",
                      isActive
                        ? "bg-bg-dark text-white"
                        : "bg-bg-default text-text-dark hover:bg-border-default",
                    ].join(" ")}
                    onClick={() => {
                      setActiveTab(tab.path);
                      if (tab.path !== rawPathname) {
                        router.push(tab.path);
                      }
                    }}
                  >
                    <FileText size={14} className="text-text-dark" />
                    <span className="max-w-[140px] truncate">{tab.label}</span>
                    <button
                      className="ml-1 opacity-60 group-hover:opacity-100 hover:bg-border-light rounded-sm p-[1px]"
                      onClick={(e) => {
                        e.stopPropagation();

                        const next = closeTab(tab.path);

                        if (tab.path === rawPathname) {
                          if (next) {
                            router.push(next);
                          } else {
                            router.push("/");
                          }
                        }
                      }}
                    >
                      <X size={12} className="text-text-dark" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 text-xs text-text-soft p-2 pl-5">
            <span>src</span>
            <ChevronRight size={12} className="text-text-deep" />
            <span>components</span>
            <ChevronRight size={12} className="text-text-deep" />
            <span className="text-text-light">{trimmedLabel}.tsx</span>
          </div>

          {/* Editor Content */}
          <div className="flex-1 overflow-auto p-5 bg-bg-dark custom-scrollbar">
            <div className="max-w-4xl w-full">{children}</div>
          </div>

          {isTerminalOpen && <Terminal />}
        </div>
      </div>

      {/* Footer / Status Bar: 화면 전체 너비를 차지 */}
      <VSCodeFooter />
    </div>
  );
}
