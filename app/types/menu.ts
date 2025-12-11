export type FileNode =
  | {
      type: "folder";
      children: Record<string, FileNode>;
    }
  | {
      type: "file";
      route?: string;
    };

// app/types/menu.ts

export type MenuId =
  | "file"
  | "edit"
  | "selection"
  | "view"
  | "go"
  | "run"
  | "terminal"
  | "help";

export type MenuAction =
  | "newFile"
  | "openFile"
  | "openFolder"
  | "save"
  | "saveAll"
  | "undo"
  | "redo"
  | "cut"
  | "copy"
  | "paste"
  | "commandPalette"
  | "about";

export type MenuItem = {
  id: MenuAction;
  label: string;
  disabled?: boolean;
  shortcut?: string;
};

export const MENU_DEFS: {
  id: MenuId;
  label: string;
  items: MenuItem[];
}[] = [
  {
    id: "file",
    label: "File",
    items: [
      { id: "newFile", label: "New File" },
      { id: "openFile", label: "Open File..." },
      { id: "openFolder", label: "Open Folder..." },
      { id: "save", label: "Save", shortcut: "Ctrl+S" },
      { id: "saveAll", label: "Save All", shortcut: "Ctrl+K S" },
    ],
  },
  {
    id: "edit",
    label: "Edit",
    items: [
      { id: "undo", label: "Undo", shortcut: "Ctrl+Z" },
      { id: "redo", label: "Redo", shortcut: "Ctrl+Y" },
      { id: "cut", label: "Cut" },
      { id: "copy", label: "Copy" },
      { id: "paste", label: "Paste" },
    ],
  },
  {
    id: "selection",
    label: "Selection",
    items: [
      { id: "cut", label: "Cut" },
      { id: "copy", label: "Copy" },
      { id: "paste", label: "Paste" },
    ],
  },
  {
    id: "view",
    label: "View",
    items: [
      {
        id: "commandPalette",
        label: "Command Palette...",
        shortcut: "Ctrl+Shift+P",
      },
    ],
  },
  {
    id: "go",
    label: "Go",
    items: [
      { id: "commandPalette", label: "Go to File..." },
      { id: "commandPalette", label: "Go to Symbol..." },
    ],
  },
  {
    id: "run",
    label: "Run",
    items: [
      { id: "commandPalette", label: "Run Without Debugging" },
      { id: "commandPalette", label: "Start Debugging" },
    ],
  },
  {
    id: "terminal",
    label: "Terminal",
    items: [
      { id: "commandPalette", label: "New Terminal" },
      { id: "commandPalette", label: "Split Terminal" },
    ],
  },
  {
    id: "help",
    label: "Help",
    items: [
      { id: "about", label: "About" },
      { id: "commandPalette", label: "Documentation" },
    ],
  },
];
