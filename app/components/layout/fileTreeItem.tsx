import { useEffect, useState, MouseEvent } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  File as FileIconDefault,
  FileJson,
  FileText,
  FileCode2,
  BookOpen,
  Trash2,
} from "lucide-react";
import { FileNode } from "@/app/types/menu";

// 파일 이름에 따라 아이콘 매핑
const getFileIcon = (name: string) => {
  const lower = name.toLowerCase();

  if (lower === "package.json") return FileJson;
  if (lower === "readme.md") return BookOpen;

  if (/\.(tsx|jsx|ts|js)$/.test(lower)) return FileCode2;
  if (/\.(md|mdx)$/.test(lower)) return FileText;

  return FileIconDefault;
};

interface FileTreeItemProps {
  name: string;
  item: FileNode;
  depth?: number;
  path: string[];
  expandedFolders: Record<string, boolean>;
  toggleFolder: (folder: string) => void;
  onFileClick: (route: string) => void;
  onDelete: (path: string[], route?: string) => void;
}

const FileTreeItem = ({
  name,
  item,
  depth = 0,
  path,
  expandedFolders,
  toggleFolder,
  onFileClick,
  onDelete,
}: FileTreeItemProps) => {
  const isExpanded = expandedFolders[name];

  const [contextPos, setContextPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setContextPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (!contextPos) return;
    const close = () => setContextPos(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [contextPos]);

  // --- 폴더 ---
  if (item.type === "folder") {
    return (
      <>
        <div
          className="flex items-center gap-1 px-2 py-0.5 hover:bg-bg-hover cursor-pointer text-sm"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => toggleFolder(name)}
          onContextMenu={handleContextMenu}
        >
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <Folder size={14} className="text-text-dark" />
          <span className="text-text-default">{name}</span>
        </div>

        {isExpanded && "children" in item && item.children && (
          <div>
            {Object.entries(item.children).map(([childName, childItem]) => (
              <FileTreeItem
                key={childName}
                name={childName}
                item={childItem}
                depth={depth + 1}
                path={[...path, childName]}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
                onFileClick={onFileClick}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}

        {contextPos && (
          <div
            className="fixed z-50 min-w-[140px] bg-[#252526] border border-border-default rounded-[2px] shadow-lg text-[11px] text-text-soft"
            style={{ top: contextPos.y, left: contextPos.x }}
          >
            <button
              type="button"
              className="w-full px-3 py-[5px] flex items-center gap-2 hover:bg-[#094771] hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(path);
                setContextPos(null);
              }}
            >
              <Trash2 size={12} />
              <span>Delete “{name}”</span>
            </button>
          </div>
        )}
      </>
    );
  }

  // --- 파일 ---
  const Icon = getFileIcon(name);

  return (
    <>
      <div
        className="flex items-center gap-1 px-2 py-0.5 hover:bg-bg-hover cursor-pointer text-sm"
        style={{ paddingLeft: `${depth * 12 + 20}px` }}
        onClick={() => {
          if (item.route) {
            onFileClick(item.route);
          } else {
            console.log("no route mapped for", name);
          }
        }}
        onContextMenu={handleContextMenu}
      >
        <Icon size={14} className="text-text-dark" />
        <span className="text-text-default">{name}</span>
      </div>

      {contextPos && (
        <div
          className="fixed z-50 min-w-[140px] bg-[#252526] border border-border-default rounded-[2px] shadow-lg text-[11px] text-text-soft"
          style={{ top: contextPos.y, left: contextPos.x }}
        >
          <button
            type="button"
            className="w-full px-3 py-[5px] flex items-center gap-2 hover:bg-[#094771] hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(path, item.route);
              setContextPos(null);
            }}
          >
            <Trash2 size={12} />
            <span>Delete “{name}”</span>
          </button>
        </div>
      )}
    </>
  );
};

export default FileTreeItem;
