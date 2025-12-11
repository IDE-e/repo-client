export type FileNode =
  | {
      type: "folder";
      children: Record<string, FileNode>;
    }
  | {
      type: "file";
      route?: string;
    };
