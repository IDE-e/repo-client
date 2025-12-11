import { FileNode } from "@/app/types/menu";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  File as FileIconDefault,
  FileJson,
  FileText,
  FileCode2,
  BookOpen,
} from "lucide-react";

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
  expandedFolders: Record<string, boolean>;
  toggleFolder: (folder: string) => void;
  onFileClick: (route: string) => void;
}

const FileTreeItem = ({
  name,
  item,
  depth = 0,
  expandedFolders,
  toggleFolder,
  onFileClick,
}: FileTreeItemProps) => {
  const isExpanded = expandedFolders[name];

  if (item.type === "folder") {
    return (
      <div>
        <div
          className="flex items-center gap-1 px-2 py-0.5 hover:bg-bg-hover cursor-pointer text-sm"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => toggleFolder(name)}
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
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
                onFileClick={onFileClick}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const Icon = getFileIcon(name);

  return (
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
    >
      <Icon size={14} className="text-text-dark" />
      <span className="text-text-default">{name}</span>
    </div>
  );
};

export default FileTreeItem;
