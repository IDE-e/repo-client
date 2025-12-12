import { headers } from "next/headers";
import DashboardCharts from "./contents/dashboardCharts";

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

function getProtocol() {
  return process.env.NODE_ENV === "development" ? "http" : "https";
}

async function getBaseUrl() {
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

export default async function DashboardDemoPage() {
  const data = await getDashboardData();
  const { summary, tasks, activity, environment } = data;

  const buildDot =
    summary.build.status === "Passing"
      ? "bg-[#22c55e]"
      : summary.build.status === "Failing"
      ? "bg-[#f97373]"
      : "bg-[#fbbf24]";

  return (
    <main className="min-h-screen bg-bg-deep px-6 py-8 lg:px-10 lg:py-10">
      {/* 상단 헤더 (SaaS 대시보드 느낌) */}
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-light">
            Project Dashboard Demo
          </h1>
          <p className="mt-1 text-sm text-text-soft">
            VSCode 레이아웃 밖에서 독립적으로 사용하는 버전의 대시보드 데모
            화면입니다.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-soft">
          <span className="rounded-full bg-bg-default px-3 py-1">
            Branch:{" "}
            <span className="font-medium text-text-light">
              {summary.activeBranch}
            </span>
          </span>
          <span className="rounded-full bg-bg-default px-3 py-1">
            Last deploy:{" "}
            <span className="font-medium text-sub_point">
              {summary.lastDeploy}
            </span>
          </span>
        </div>
      </header>

      {/* 상단 요약 카드들 - 풀 width 그리드 */}
      <section className="mb-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border-default bg-bg-default p-5 space-y-3">
          <div className="text-xs uppercase tracking-wide text-text-soft">
            Open Issues
          </div>
          <div className="text-2xl font-semibold text-text-light">
            {summary.openIssues.total}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-text-deep">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#f97373]" />
              {summary.openIssues.critical} critical
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#fbbf24]" />
              {summary.openIssues.major} major
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#60a5fa]" />
              {summary.openIssues.minor} minor
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-border-default bg-bg-default p-5 space-y-3">
          <div className="text-xs uppercase tracking-wide text-text-soft">
            Build Status
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex h-2.5 w-2.5 rounded-full ${buildDot}`}
            />
            <span className="text-sm font-semibold text-text-light">
              {summary.build.status}
            </span>
          </div>
          <div className="text-xs text-text-deep">
            Last run:{" "}
            <span className="text-sub_point">{summary.build.lastRunLabel}</span>
          </div>
        </div>

        <div className="rounded-lg border border-border-default bg-bg-default p-5 space-y-3">
          <div className="text-xs uppercase tracking-wide text-text-soft">
            Tasks (Today)
          </div>
          <div className="text-2xl font-semibold text-text-light">
            {tasks.completed} / {tasks.total}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-dark">
            <div
              className="h-full bg-point transition-all"
              style={{
                width: `${(tasks.completed / tasks.total) * 100}%`,
              }}
            />
          </div>
          <div className="text-[11px] text-text-deep">
            Remaining: {tasks.total - tasks.completed} tasks
          </div>
        </div>
      </section>

      {/*  차트 섹션 */}
      <section className="mb-4">
        <DashboardCharts summary={summary} tasks={tasks} />
      </section>

      {/* 중간: 좌측 메인 / 우측 사이드 */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* 메인: Activity + pseudo-console */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border border-border-default bg-bg-dark">
            <div className="flex items-center justify-between border-b border-border-default px-4 py-3">
              <div className="text-xs font-medium text-text-soft">
                Recent Activity
              </div>
              <div className="text-[11px] text-text-deep">
                Last {activity.length} commits
              </div>
            </div>

            <div className="max-h-72 overflow-auto bg-bg-dark px-4 py-3 text-xs font-mono">
              <div className="text-text-deep">
                $ git log --oneline --max-count={activity.length}
              </div>
              <div className="mt-3 space-y-1.5">
                {activity.map((a) => (
                  <div key={`${a.hash}-${a.time}`}>
                    <span className="text-sub_point">{a.hash}</span>
                    <span className="text-text-light"> {a.message}</span>
                    <span className="text-text-deep"> · {a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Environment 요약을 조금 더 카드 스타일로 */}
          <div className="rounded-lg border border-border-default bg-bg-default p-4">
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
                <div className="text-text-deep uppercase tracking-wide">
                  Charts
                </div>
                {environment.charts.map((v) => (
                  <div key={v}>{v}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 사이드: Tasks 리스트만 따로 빼기 */}
        <aside className="rounded-lg border border-border-default bg-bg-default p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-light">Tasks</h2>
            <span className="text-[11px] text-text-soft">
              {tasks.completed} done
            </span>
          </div>

          <ul className="space-y-2 text-sm">
            {tasks.items.map((t) => {
              const border =
                t.accent === "danger"
                  ? "border-[#f97373]"
                  : t.accent === "point"
                  ? "border-point"
                  : "border-border-default";

              return (
                <li
                  key={t.id}
                  className={`rounded-md border ${border} bg-bg-default px-3 py-2 flex items-start gap-2`}
                >
                  <span
                    className={`mt-[4px] inline-flex h-3 w-3 rounded-sm ${
                      t.done
                        ? "bg-point border-point"
                        : "border border-border-default"
                    }`}
                  />
                  <div>
                    <div className="text-text-light">{t.title}</div>
                    <div className="text-[11px] text-text-deep">{t.meta}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>
      </section>
    </main>
  );
}
