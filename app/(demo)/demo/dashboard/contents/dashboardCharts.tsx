"use client";

import CustomChart from "@/app/components/chart/customChart";

type BuildStatus = "Passing" | "Failing" | "Running";

type DashboardChartsProps = {
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
  };
};

export default function DashboardCharts({
  summary,
  tasks,
}: DashboardChartsProps) {
  const now = Date.now();
  const points = 10; // 라인 차트 포인트 개수 (데모용)

  // 🔹 데모용 Open Issues 트렌드 라인 (최근 N 포인트짜리 가짜 시계열)
  const issuesTrendData = Array.from({ length: points }, (_, idx) => ({
    timestamp: now - (points - idx) * 60 * 60 * 1000, // 1시간 간격
    value: Math.max(
      0,
      summary.openIssues.total - (points - idx - 1) * 2 // 대충 증가/감소 느낌만 주는 mock
    ),
  }));

  // 🔹 데모용 Tasks Progress 라인 (완료/전체 비율로 대충 스케일)
  const ratio = tasks.total === 0 ? 0 : tasks.completed / tasks.total;
  const tasksTrendData = Array.from({ length: points }, (_, idx) => ({
    timestamp: now - (points - idx) * 60 * 60 * 1000,
    value: Math.round((idx / (points - 1)) * ratio * tasks.total),
  }));

  // 🔹 데모용 Build Duration 라인 (단위: 분 느낌의 가짜 데이터)
  const buildDurationData = Array.from({ length: points }, (_, idx) => ({
    timestamp: now - (points - idx) * 60 * 60 * 1000,
    value: Math.max(
      1,
      Math.round(5 + Math.sin(idx / 2) * 3 + Math.random() * 2) // 3~10분 근처
    ),
  }));

  const buildDurationData2 = Array.from({ length: points }, (_, idx) => ({
    timestamp: now - (points - idx) * 60 * 60 * 1000,
    value: Math.max(
      1,
      Math.round(7 + Math.sin(idx / 2) * 3 + Math.random() * 2) // 3~10분 근처
    ),
  }));

  // 🔹 파이 차트용 이슈 심각도 분포
  const issuesPieData = {
    Critical: summary.openIssues.critical,
    Major: summary.openIssues.major,
    Minor: summary.openIssues.minor,
  };

  return (
    <div className="space-y-4">
      {/* 상단: Open Issues + Severity Pie */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Open Issues Trend */}
        <div className="lg:col-span-2 rounded-lg border border-border-default bg-bg-default p-4 pb-7">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-text-light">
              Open Issues Trend
            </h3>
            <span className="text-[11px] text-text-soft">
              Last {points} hours (demo)
            </span>
          </div>

          <CustomChart
            type="line"
            datasets={[
              {
                label: "Open Issues",
                data: issuesTrendData,
                borderColor: "#f97373",
                backgroundColor: "#f9737333",
                fill: true,
              },
            ]}
            options={{
              height: 200,
              legendPosition: "bottom",
              showLegend: true,
              tickCount: 6,
              useCustomLegend: true,
            }}
          />
        </div>

        {/* Issues by Severity (Pie) */}
        <div className="rounded-lg border border-border-default bg-bg-default p-4 pb-7">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-text-light">
              Issues by Severity
            </h3>
            <span className="text-[11px] text-text-soft">Current</span>
          </div>

          <CustomChart
            type="pie"
            datasets={[
              {
                label: "Open Issues",
                data: issuesPieData,
                borderColor: ["#f97373", "#fbbf24", "#60a5fa"],
              },
            ]}
            options={{
              height: 200,
              legendPosition: "right",
              legendColor: "#afb4bb",
            }}
            download={false}
          />
        </div>
      </div>

      {/* 하단: Tasks Progress + Build Duration */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Tasks Progress */}
        <div className="rounded-lg border border-border-default bg-bg-default p-4 pb-7">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-text-light">
              Tasks Progress
            </h3>
            <span className="text-[11px] text-text-soft">
              {tasks.completed} / {tasks.total} completed
            </span>
          </div>

          <CustomChart
            type="line"
            datasets={[
              {
                label: "Completed Tasks (demo)",
                data: tasksTrendData,
                borderColor: "#4fb3f9",
                backgroundColor: "#4fb3f933",
                fill: true,
              },
            ]}
            options={{
              height: 200,
              legendPosition: "bottom",
              showLegend: true,
              tickCount: 6,
              useCustomLegend: true,
            }}
          />
        </div>

        {/* Build Duration Trend */}
        <div className="rounded-lg border border-border-default bg-bg-default p-4 pb-7">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-text-light">
              Build Duration (min)
            </h3>
            <span className="text-[11px] text-text-soft">
              Last {points} runs (demo)
            </span>
          </div>

          <CustomChart
            type="bar"
            datasets={[
              {
                label: "Build Duration",
                data: buildDurationData,
                borderColor: "#369659",
                backgroundColor: "#36965933",
                fill: true,
              },
              {
                label: "Build Duration Comparison",
                data: buildDurationData2,
                borderColor: "#b67d4f",
                backgroundColor: "#b67d4f33",
                fill: true,
              },
            ]}
            options={{
              height: 200,
              legendPosition: "bottom",
              showLegend: true,
              tickCount: 6,
              useCustomLegend: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}
