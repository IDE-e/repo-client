import { Search, FileCode, GitBranch, Box, Bug } from "lucide-react";
import extentionIcon1 from "@/app/images/icon/crop.png";
import extentionIcon2 from "@/app/images/icon/leaderboard.png";
import extentionIcon3 from "@/app/images/icon/mask.png";
import extentionIcon4 from "@/app/images/icon/vector.png";

// 좌측 메뉴 아이콘 목록
export const SIDEBAR_ICONS = [
  { icon: FileCode, label: "Explorer", id: "explorer" },
  { icon: Search, label: "Search", id: "search" },
  { icon: GitBranch, label: "Source Control", id: "git" },
  { icon: Bug, label: "Run and Debug", id: "debug" },
  { icon: Box, label: "Extensions", id: "extensions" },
];

// Extension
export const EXTENTION = [
  {
    id: "theme-pack",
    name: "VS Theme Pack",
    author: "Team VS",
    description: "A collection of popular dark and light themes.",
    icon: extentionIcon1,
    rating: 4.8,
    downloads: "120k",
    installed: true,
    enabled: true,
  },
  {
    id: "eslint",
    name: "ESLint",
    author: "Dirk B.",
    description: "Integrates ESLint JavaScript into your editor.",
    icon: extentionIcon2,
    rating: 4.6,
    downloads: "3.5M",
    installed: true,
    enabled: true,
  },
  {
    id: "prettier",
    name: "Prettier",
    author: "Prettier",
    description: "An opinionated code formatter for multiple languages.",
    icon: extentionIcon3,
    rating: 4.7,
    downloads: "6.1M",
    installed: true,
    enabled: true,
  },
  {
    id: "gitlens",
    name: "GitLens",
    author: "GitKraken",
    description: "Supercharge the Git capabilities built into your editor.",
    icon: extentionIcon4,
    rating: 4.9,
    downloads: "15M",
    installed: false,
    enabled: false,
  },
];

// git change
export const GIT_CHANGE = [
  {
    file: "header.tsx",
    path: "apps/web/app/components/header.tsx",
    status: "M",
  },
  {
    file: "leftMenu.tsx",
    path: "apps/web/app/components/leftMenu.tsx",
    status: "M",
  },
];

// git history
export const GIT_HISTORY = [
  {
    message: "fix: Rename header component",
    author: "yeonii20",
    timeAgo: "2 hours ago",
    branch: "feature/design",
    isHead: true,
  },
  {
    message: "feat: Apply terminal component",
    author: "yeonii20",
    timeAgo: "5 hours ago",
  },
  {
    message: "style: tailwind css lint",
    author: "Suyoooi",
    timeAgo: "1 day ago",
  },
  {
    message: "Merge pull request #23 from origin/main",
    author: "CI",
    timeAgo: "2 days ago",
    tag: "origin/main",
  },
];

// debug configs
export const DEBUG_CONFIGS = [
  {
    name: "Launch Web (Next.js)",
    request: "launch",
  },
  {
    name: "Attach to Node.js server",
    request: "attach",
  },
];

// debug breakpoints
export const DEBUG_BREAKPOINTS = [
  {
    file: "apps/web/app/pages/api-client.tsx",
    line: 42,
    enabled: true,
  },
  {
    file: "apps/web/app/pages/terminal.tsx",
    line: 88,
    enabled: false,
  },
];
