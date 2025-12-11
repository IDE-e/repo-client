import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FileTree, INITIAL_FILE_TREE } from "../types/fileTree";
import { FileNode } from "../types/menu";

type FileTreeState = {
  tree: FileTree;
  reset: () => void;
  addNode: (path: string[]) => void;
  deleteNode: (path: string[]) => void;
};

const cloneTree = (tree: FileTree): FileTree =>
  structuredClone ? structuredClone(tree) : JSON.parse(JSON.stringify(tree));

const getChildrenRef = (
  root: FileTree,
  path: string[]
): Record<string, FileNode> | null => {
  let children: Record<string, FileNode> = root;

  for (const segment of path) {
    const node = children[segment];
    if (!node || node.type !== "folder") return null;
    children = node.children;
  }

  return children;
};

export const useFileTreeStore = create<FileTreeState>()(
  persist(
    (set, get) => ({
      tree: INITIAL_FILE_TREE,

      reset: () => set({ tree: INITIAL_FILE_TREE }),

      addNode: (path) =>
        set((state) => {
          if (!path.length) return state;

          const tree = cloneTree(state.tree);
          const parentPath = path.slice(0, -1);
          const name = path[path.length - 1];

          // 부모 폴더 children 찾기
          const parentChildren =
            parentPath.length === 0 ? tree : getChildrenRef(tree, parentPath);

          if (!parentChildren) {
            console.warn("parent folder not found for addNode:", path);
            return state;
          }

          // 이미 같은 이름 있으면 추가 안 함 (원하면 덮어쓰기도 가능)
          if (parentChildren[name]) {
            console.warn("node already exists:", path);
            return state;
          }

          // 간단 규칙: . 이 있으면 파일, 없으면 폴더로 취급
          const isFolder = !name.includes(".");

          parentChildren[name] = isFolder
            ? {
                type: "folder",
                children: {},
              }
            : {
                type: "file",
                // route는 나중에 따로 세팅할 수 있음
              };

          console.log("after addNode:", tree);
          return { tree };
        }),

      deleteNode: (path) =>
        set((state) => {
          console.log("deleteNode called with path:", path);

          if (path.length === 0) return state;

          const tree = cloneTree(state.tree);
          const parentPath = path.slice(0, -1);
          const name = path[path.length - 1];

          const parentChildren =
            parentPath.length === 0 ? tree : getChildrenRef(tree, parentPath);

          if (!parentChildren || !parentChildren[name]) {
            console.warn("target not found for delete:", path);
            return state;
          }

          delete parentChildren[name];

          console.log("after delete:", tree);
          return { tree };
        }),
    }),
    {
      name: "ide-file-tree",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
