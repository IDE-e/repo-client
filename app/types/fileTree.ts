import { FileNode } from "./menu";

export type FileTree = Record<string, FileNode>;

export const INITIAL_FILE_TREE: FileTree = {
  src: {
    type: "folder",
    children: {
      pages: {
        type: "folder",
        children: {
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
