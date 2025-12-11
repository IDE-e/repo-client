import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Play, Star, Download } from "lucide-react";
import Image from "next/image";
import FileTreeItem from "./fileTreeItem";
import {
  DEBUG_BREAKPOINTS,
  DEBUG_CONFIGS,
  EXTENTION,
  GIT_CHANGE,
  GIT_HISTORY,
  SIDEBAR_ICONS,
} from "@/app/data/mock/menu";
import { FileNode } from "@/app/types/menu";

const fileTree: Record<string, FileNode> = {
  src: {
    type: "folder",
    children: {
      pages: {
        type: "folder",
        children: {
          // "welcome.tsx": { type: "file", route: "/welcome" },
          "alerts.tsx": { type: "file", route: "/alerts" },
          "api-client.tsx": { type: "file", route: "/api-client" },
          "dashboard.tsx": { type: "file", route: "/dashboard" },
          "brokers.tsx": { type: "file", route: "/brokers" },
          "cluster.tsx": { type: "file", route: "/cluster" },
          "topics.tsx": { type: "file", route: "/topics" },
          "health.tsx": { type: "file", route: "/health" },
          "diff-viewer.tsx": { type: "file", route: "/diff-viewer" },
          "log-explorer.tsx": { type: "file", route: "/log-explorer" },
          "metrics.tsx": { type: "file", route: "/metrics" },
          "gallery.tsx": { type: "file", route: "/gallery" },
          "logs.tsx": { type: "file", route: "/logs" },
          "markdown.tsx": { type: "file", route: "/markdown" },
          "settings.tsx": { type: "file", route: "/settings" },
          "terminal.tsx": { type: "file", route: "/terminal" },
          "vs-demo.tsx": { type: "file", route: "/vs-demo" },
        },
      },
      components: {
        type: "folder",
        children: {
          "Header.tsx": { type: "file" },
        },
      },
      "App.tsx": { type: "file" },
      "index.js": { type: "file" },
    },
  },
  public: {
    type: "folder",
    children: {
      "index.html": { type: "file" },
    },
  },
  "package.json": { type: "file" },
  "README.md": { type: "file" },
};

export function VSCodeLeftMenu() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [activeSidebar, setActiveSidebar] = useState<string>("explorer");
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({
    src: true,
    pages: true, // 기본으로 pages까지 열려 있게
  });

  const router = useRouter();

  const toggleFolder = (folder: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folder]: !prev[folder],
    }));
  };

  // 아이콘 클릭: 같은 아이콘 다시 클릭하면 접기/펼치기 토글, 다른 아이콘 클릭 시 해당 메뉴 활성 + 패널 열기
  const handleIconClick = (id: string) => {
    if (id === activeSidebar) {
      setSidebarCollapsed((prev) => !prev);
    } else {
      setActiveSidebar(id);
      setSidebarCollapsed(false);
    }
  };

  const handleFileClick = (route: string) => {
    router.push(route);
  };

  const activeMeta =
    SIDEBAR_ICONS.find((item) => item.id === activeSidebar) ?? SIDEBAR_ICONS[0];

  // 오른쪽 패널 내용 스위칭
  const renderSidebarContent = () => {
    switch (activeSidebar) {
      case "explorer":
        return (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="px-2 py-1 pb-3">
              <div className="text-xs text-text-default font-semibold mb-1 uppercase px-2">
                Project
              </div>
              {Object.entries(fileTree).map(([name, item]) => (
                <FileTreeItem
                  key={name}
                  name={name}
                  item={item}
                  expandedFolders={expandedFolders}
                  toggleFolder={toggleFolder}
                  onFileClick={handleFileClick}
                />
              ))}
            </div>
          </div>
        );

      case "search":
        return (
          <div className="flex-1 p-3 text-xs text-text-default flex flex-col gap-2">
            <input
              className="w-full rounded-sm bg-bg-dark border border-border-default px-2 py-1 text-[11px] outline-none focus:border-blue-500"
              placeholder="Search (mock) in workspace..."
            />
            <div className="text-[11px] text-text-soft">
              No results. Type a query and press Enter to simulate search.
            </div>
          </div>
        );

      case "git":
        return (
          <div className="flex-1 flex flex-col text-xs text-text-default">
            {/* Commit 입력 영역 */}
            <div className="p-3 border-b border-border-default flex flex-col gap-2">
              <input
                className="w-full rounded-sm bg-bg-dark border border-border-default px-2 py-1.5 text-[11px] outline-none focus:border-blue-500 placeholder:text-text-soft"
                placeholder="Message (Ctrl+Enter to commit)"
              />
              <div className="flex gap-2">
                <button className="flex-1 h-7 rounded-sm bg-[#0078d4] text-[11px] font-semibold text-white hover:bg-[#1a8ae6]">
                  Commit
                </button>
                <button className="w-7 h-7 rounded-sm bg-bg-dark border border-border-default text-text-soft text-[10px]">
                  ▾
                </button>
              </div>
            </div>

            {/* Changes + 히스토리 영역 */}
            <div className="flex-1 overflow-auto">
              {/* CHANGES 헤더 */}
              <div className="flex items-center justify-between px-3 py-2 text-[11px] text-text-soft font-semibold uppercase">
                <span>Changes</span>
                <span className="text-text-deep">{GIT_CHANGE.length}</span>
              </div>

              {/* Changes 리스트 */}
              <div>
                {GIT_CHANGE.map((change) => (
                  <div
                    key={change.file}
                    className="flex items-center justify-between px-3 py-1.5 hover:bg-bg-hover cursor-pointer text-[11px]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {/* 파일 아이콘 영역 (VS처럼 네모 + git 마크 느낌) */}
                      <div className="w-4 h-4 rounded-[2px] bg-[#0b4885] flex items-center justify-center text-[9px] text-white">
                        {/* 단순 G 표시 (mock) */}G
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-text-default truncate">
                          {change.file}
                        </span>
                        <span className="text-[10px] text-text-soft truncate">
                          {change.path}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#cca700] pl-2">M</span>
                  </div>
                ))}
              </div>

              {/* 히스토리 (GitLens 느낌 간단 버전) */}
              <div className="mt-2 border-t border-border-default">
                <div className="px-3 py-2 text-[11px] text-text-soft font-semibold uppercase">
                  History
                </div>
                <div className="px-3 pb-3">
                  {GIT_HISTORY.map((item, index) => (
                    <div
                      key={`${item.message}-${index}`}
                      className="flex items-start gap-2 text-[10px] text-text-soft"
                    >
                      {/* 타임라인 점 + 선 */}
                      <div className="flex flex-col items-center pt-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            item.isHead ? "bg-blue-500" : "bg-text-soft"
                          }`}
                        />
                        {index < GIT_HISTORY.length - 1 && (
                          <div className="w-px flex-1 bg-border-default mt-0.5" />
                        )}
                      </div>

                      {/* 커밋 내용 */}
                      <div className="flex-1 pb-2 min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[11px] text-text-default truncate">
                            {item.message}
                          </span>
                          {item.branch && (
                            <span className="text-[9px] px-1.5 py-[1px] rounded-full bg-[#373277] text-[#c5c0ff]">
                              {item.branch}
                            </span>
                          )}
                          {item.tag && (
                            <span className="text-[9px] px-1.5 py-[1px] rounded-full bg-[#5a3a10] text-[#f5c779]">
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <div className="text-[9px] text-text-soft">
                          {item.author} · {item.timeAgo}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "debug":
        return (
          <div className="flex-1 flex flex-col text-xs text-text-default">
            {/* 상단 Run 버튼 + 설정 선택 */}
            <div className="p-3 border-b border-border-default flex items-center gap-2">
              <button className="w-7 h-7 rounded-full bg-[#3fb950] flex items-center justify-center hover:bg-[#46c35a]">
                <Play size={13} className="translate-x-[1px]" />
              </button>
              <select className="flex-1 bg-bg-dark border border-border-default rounded-sm px-2 py-1 text-[11px] outline-none focus:border-blue-500">
                {DEBUG_CONFIGS.map((cfg) => (
                  <option key={cfg.name}>{cfg.name}</option>
                ))}
              </select>
            </div>

            {/* RUN AND DEBUG 리스트 */}
            <div className="px-3 py-2 text-[11px] text-text-soft font-semibold uppercase">
              Run and Debug
            </div>
            <div className="px-2 pb-2 flex flex-col gap-1">
              {DEBUG_CONFIGS.map((cfg) => (
                <button
                  key={cfg.name}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-[3px] hover:bg-bg-hover text-[11px] text-text-soft"
                >
                  <span className="truncate">{cfg.name}</span>
                  <span className="text-[9px] text-text-deep uppercase">
                    {cfg.request}
                  </span>
                </button>
              ))}
              <button className="mt-1 w-full text-left px-2 py-1.5 rounded-[3px] text-[11px] text-text-soft hover:bg-bg-hover">
                create a launch.json file
              </button>
            </div>

            {/* BREAKPOINTS 섹션 (GitLens 아래쪽 느낌) */}
            <div className="mt-1 border-t border-border-default">
              <div className="px-3 py-2 text-[11px] text-text-soft font-semibold uppercase">
                Breakpoints
              </div>
              <div className="px-3 pb-3 space-y-1">
                {DEBUG_BREAKPOINTS.map((bp) => (
                  <label
                    key={`${bp.file}-${bp.line}`}
                    className="flex items-center gap-2 text-[11px] text-text-soft cursor-pointer hover:bg-bg-hover/40 rounded-[3px] px-1 py-[2px]"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={bp.enabled}
                      className="w-3 h-3 accent-blue-500"
                    />
                    <span className="truncate">{bp.file}</span>
                    <span className="ml-auto text-[10px] text-text-deep">
                      line {bp.line}
                    </span>
                  </label>
                ))}
                {DEBUG_BREAKPOINTS.length === 0 && (
                  <div className="text-[10px] text-text-soft">
                    No breakpoints set.
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "extensions":
        return (
          <div className="flex-1 flex flex-col text-xs text-text-default">
            {/* 검색 영역 */}
            <div className="p-3 border-b border-border-default flex items-center gap-2">
              <div className="relative flex-1">
                <Search
                  size={12}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-text-soft"
                />
                <input
                  className="w-full rounded-sm bg-bg-dark border border-border-default pl-6 pr-2 py-1.5 text-[11px] outline-none focus:border-blue-500 placeholder:text-text-soft"
                  placeholder="Search Extensions in Marketplace"
                />
              </div>
            </div>

            {/* 추천/카테고리 영역 (간단 mock) */}
            <div className="px-3 pt-2 pb-1 text-[11px] text-text-soft font-semibold uppercase">
              Recommended
            </div>

            {/* 확장 목록 */}
            <div className="flex-1 overflow-auto pb-3">
              {EXTENTION.map((ext) => (
                <div
                  key={ext.id}
                  className="px-3 py-2 hover:bg-bg-hover cursor-pointer flex gap-2"
                >
                  {/* 좌측 아이콘/로고 자리 (네모 박스) */}
                  <div className="w-8 h-8 rounded-[3px] bg-bg-dark flex items-center justify-center text-[11px] text-text-soft flex-shrink-0">
                    <Image
                      width={30}
                      height={30}
                      src={ext.icon}
                      alt="Extension"
                    />
                  </div>

                  {/* 정보 영역 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex w-full flex-row justify-between">
                        <span className="text-[11px] text-text-default truncate">
                          {ext.name}
                        </span>
                        <div className="flex flex-col items-end justify-center gap-1 flex-shrink-0">
                          {ext.installed ? (
                            <span className="text-[9px] px-1.5 py-[1px] rounded-sm bg-deepblue text-sub_point">
                              Installed
                            </span>
                          ) : (
                            <button className="px-1.5 py-[1px] rounded-sm bg-[#0078d4] text-[10px] text-white hover:bg-[#1a8ae6]">
                              Install
                            </button>
                          )}
                        </div>
                        {/* {ext.installed && (
                          <span className="text-[9px] px-1.5 py-[1px] rounded-sm bg-deepblue text-sub_point">
                            Installed
                          </span>
                        )}
                        {!ext.enabled && ext.installed && (
                          <span className="text-[9px] px-1.5 py-[1px] rounded-sm bg-border-light text-white">
                            Disabled
                          </span>
                        )} */}
                      </div>
                    </div>
                    <div className="text-[10px] text-text-soft truncate">
                      {ext.author}
                    </div>
                    <div className="text-[10px] text-text-soft mt-0.5 line-clamp-2">
                      {ext.description}
                    </div>
                    <div className="flex flex-row justify-between">
                      {/* rating / downloads / actions */}
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-text-soft">
                        <span className="flex items-center gap-1">
                          <Star size={10} className="text-[#ffcc00]" />
                          <span>{ext.rating.toFixed(1)}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Download size={10} />
                          <span>{ext.downloads}</span>
                        </span>
                      </div>
                      {/* 설치/관리 버튼 영역 */}
                      {/* <div className="flex flex-col items-end justify-center gap-1 flex-shrink-0">
                        {ext.installed ? (
                          <span className="text-[9px] px-1.5 py-[1px] rounded-sm bg-deepblue text-sub_point">
                            Installed
                          </span>
                        ) : (
                          <button className="px-1.5 py-[1px] rounded-sm bg-[#0078d4] text-[10px] text-white hover:bg-[#1a8ae6]">
                            Install
                          </button>
                        )}
                      </div> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Left Sidebar - Icon Bar */}
      <div className="w-12 bg-[#333333] border-r border-border-default flex flex-col items-center py-2 gap-4">
        {SIDEBAR_ICONS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSidebar === item.id;

          return (
            <button
              key={item.id}
              className={`w-10 h-10 flex items-center justify-center rounded cursor-pointer
                text-[#858585] hover:text-white hover:bg-bg-hover
                relative
                ${
                  isActive
                    ? "bg-[#252526] text-white before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[2px] before:bg-blue-500"
                    : ""
                }`}
              title={item.label}
              onClick={() => handleIconClick(item.id)}
            >
              <Icon size={22} />
            </button>
          );
        })}
      </div>

      {/* Right Panel (Explorer / Search / Git / Debug / Extensions) */}
      <div
        className={`bg-bg-default border-r border-border-default flex flex-col overflow-hidden
          transition-[width] duration-300 ease-in-out
          ${sidebarCollapsed ? "w-0" : "w-64"}`}
      >
        {/* 헤더 영역: 활성 메뉴 이름 표시 */}
        <div className="flex items-center justify-between px-3 py-2 text-xs text-text-default uppercase font-semibold border-b border-border-default">
          <span>{activeMeta.label}</span>
        </div>

        {/* 내용부: 활성 메뉴에 따라 UI 변경 */}
        {renderSidebarContent()}
      </div>
    </>
  );
}
