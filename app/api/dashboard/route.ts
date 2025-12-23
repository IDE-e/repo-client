import { corsHeaders } from "@/app/types/header";
import { DashboardData } from "@/app/types/type";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  const mock: DashboardData = {
    summary: {
      activeBranch: "main",
      lastDeploy: "2025-11-14 10:32",
      openIssues: {
        total: 12,
        critical: 3,
        major: 4,
        minor: 5,
      },
      build: {
        status: "Passing",
        lastRunLabel: "#184 · 2 min ago",
      },
    },
    tasks: {
      completed: 3,
      total: 6,
      items: [
        {
          id: "t1",
          done: false,
          title: "Refactor chart widget for pie chart support",
          meta: "/src/components/chart/CustomChart.tsx",
          accent: "point",
        },
        {
          id: "t2",
          done: true,
          title: "Implement VSCode-like layout for main app",
          meta: "merged into main",
        },
        {
          id: "t3",
          done: false,
          title: "Fix sidebar collapse animation jitter on mobile",
          meta: "high priority · layout/VSCodeLeftMenu.tsx",
          accent: "danger",
        },
      ],
    },
    activity: [
      {
        hash: "a1b2c3d",
        message: "feat: add VSCode layout wrapper",
        time: "10:12",
      },
      {
        hash: "e4f5g6h",
        message: "refactor: extract left menu component",
        time: "09:43",
      },
      {
        hash: "i7j8k9l",
        message: "chore: update chart tooltip format",
        time: "09:01",
      },
    ],
    environment: {
      runtime: ["Node 20.x", "Next.js App Router"],
      ui: ["VSCode-like layout", "Tailwind + lucide-react"],
      charts: ["react-chartjs-2", "CustomChart wrapper ready"],
    },
  };

  return new Response(JSON.stringify({ success: true, data: mock }), {
    status: 200,
    headers: corsHeaders,
  });
}
