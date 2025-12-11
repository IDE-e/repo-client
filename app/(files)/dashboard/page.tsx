import { headers } from "next/headers";

export const dynamic = "force-dynamic";

type BuildStatus = "Passing" | "Failing" | "Running";

type DashboardData = {
  summary: {
    activeBranch: string;
    lastDeploy: string;
    openIssues: {
      total: number;
      critical: number;
      major: number;
      minor: number;
    };
    build: {
      status: BuildStatus;
      lastRunLabel: string;
    };
  };
  tasks: {
    completed: number;
    total: number;
    items: Array<{
      id: string;
      done: boolean;
      title: string;
      meta: string;
      accent?: "point" | "danger";
    }>;
  };
  activity: Array<{
    hash: string;
    message: string;
    time: string;
  }>;
  environment: {
    runtime: string[];
    ui: string[];
    charts: string[];
  };
};

/**
 * Build a safe base url for server-side fetch against same-origin API routes.
 * - Next 15: headers() is async.
 * - Uses host header first.
 * - Falls back to env if you later add it.
 */
function getProtocol() {
  return process.env.NODE_ENV === "development" ? "http" : "https";
}

async function getBaseUrl() {
  // Prefer explicit env if you ever add it later
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  if (envUrl) return envUrl;

  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  return `${getProtocol()}://${host}`;
}

async function getDashboardData(): Promise<DashboardData> {
  const baseUrl = await getBaseUrl();

  const res = await fetch(`${baseUrl}/api/dashboard`, {
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);

  if (!json?.success) {
    throw new Error("Failed to load dashboard data");
  }

  return json.data as DashboardData;
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  const { summary, tasks, activity, environment } = data;

  console.log(data);

  const buildDot =
    summary.build.status === "Passing"
      ? "bg-[#22c55e]"
      : summary.build.status === "Failing"
      ? "bg-[#f97373]"
      : "bg-[#fbbf24]";

  return (
    <main className="space-y-8">
      {/* 제목 + 설명 */}
      <section className="space-y-2">
        <h1 className="text-3xl font-bold text-text-light">
          Project Dashboard
        </h1>
        <p className="text-sm text-text-soft">
          VS Code 스타일 레이아웃 안에서 프로젝트 상태와 작업 현황을 한눈에
          확인할 수 있는 대시보드입니다.
        </p>
      </section>

      {/* 상단 요약 카드들 */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-md border border-border-default bg-bg-default p-4 space-y-2">
          <div className="text-xs uppercase tracking-wide text-text-soft">
            Active Branch
          </div>
          <div className="text-lg font-semibold text-text-light">
            {summary.activeBranch}
          </div>
          <div className="text-xs text-text-deep">
            Last deploy:{" "}
            <span className="text-sub_point">{summary.lastDeploy}</span>
          </div>
        </div>

        <div className="rounded-md border border-border-default bg-bg-default p-4 space-y-2">
          <div className="text-xs uppercase tracking-wide text-text-soft">
            Open Issues
          </div>
          <div className="text-lg font-semibold text-text-light">
            {summary.openIssues.total}
          </div>
          <div className="flex items-center gap-2 text-xs text-text-deep">
            <span className="inline-flex h-2 w-2 rounded-full bg-[#f97373]" />
            {summary.openIssues.critical} critical · {summary.openIssues.major}{" "}
            major · {summary.openIssues.minor} minor
          </div>
        </div>

        <div className="rounded-md border border-border-default bg-bg-default p-4 space-y-2">
          <div className="text-xs uppercase tracking-wide text-text-soft">
            Build Status
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex h-2 w-2 rounded-full ${buildDot}`} />
            <span className="text-sm font-semibold text-text-light">
              {summary.build.status}
            </span>
          </div>
          <div className="text-xs text-text-deep">
            Last run:{" "}
            <span className="text-sub_point">{summary.build.lastRunLabel}</span>
          </div>
        </div>
      </section>

      {/* 할 일 / 작업 리스트 */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Left: Todo-like panel */}
        <div className="rounded-md border border-border-default bg-bg-default p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-light">
              Tasks (Today)
            </h2>
            <span className="text-[11px] text-text-soft">
              {tasks.completed} / {tasks.total} completed
            </span>
          </div>

          <ul className="space-y-2 text-sm">
            {tasks.items.map((t) => {
              const boxClass = t.done
                ? "bg-point border-point"
                : t.accent === "danger"
                ? "border border-[#f97373]"
                : t.accent === "point"
                ? "border border-point"
                : "border border-border-default";

              return (
                <li key={t.id} className="flex items-start gap-2">
                  <span
                    className={`mt-[5px] inline-flex h-3 w-3 rounded-sm ${boxClass}`}
                  />
                  <div>
                    <span className="text-text-light">{t.title}</span>
                    <div className="text-[11px] text-text-deep">{t.meta}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: Activity log / pseudo-console */}
        <div className="rounded-md border border-border-default bg-bg-dark">
          <div className="flex items-center justify-between border-b border-border-default px-4 py-2">
            <span className="text-xs text-text-soft">Activity Log</span>
            <span className="text-[11px] text-text-deep">today</span>
          </div>

          <div className="max-h-64 overflow-auto bg-bg-dark px-4 py-3 text-xs font-mono">
            <div className="text-text-deep">
              $ git log --oneline --max-count=5
            </div>
            <div className="mt-2 space-y-1">
              {activity.map((a) => (
                <div key={`${a.hash}-${a.time}`}>
                  <span className="text-sub_point">{a.hash}</span>
                  <span className="text-text-light"> {a.message}</span>
                  <span className="text-text-deep"> · {a.time}</span>
                </div>
              ))}
              <div className="pt-2 text-text-deep">...and more commits</div>
            </div>
          </div>
        </div>
      </section>

      {/* 하단: 간단한 설정 요약 */}
      <section className="rounded-md border border-border-default bg-bg-default p-4">
        <h2 className="mb-3 text-sm font-semibold text-text-light">
          Environment
        </h2>
        <div className="grid gap-4 md:grid-cols-3 text-xs text-text-soft">
          <div className="space-y-1">
            <div className="text-text-deep uppercase tracking-wide">
              Runtime
            </div>
            {environment.runtime.map((v) => (
              <div key={v}>{v}</div>
            ))}
          </div>
          <div className="space-y-1">
            <div className="text-text-deep uppercase tracking-wide">UI</div>
            {environment.ui.map((v) => (
              <div key={v}>{v}</div>
            ))}
          </div>
          <div className="space-y-1">
            <div className="text-text-deep uppercase tracking-wide">Charts</div>
            {environment.charts.map((v) => (
              <div key={v}>{v}</div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
