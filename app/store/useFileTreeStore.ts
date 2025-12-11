import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FileTree, INITIAL_FILE_TREE } from "../types/fileTree";
import { FileNode } from "../types/menu";

type FileTreeState = {
  tree: FileTree;
  reset: () => void;
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
      name: "ide-file-tree", // 🔹 localStorage key
      storage: createJSONStorage(() => localStorage),
      // partialize: (state) => ({ tree: state.tree }),
    }
  )
);
