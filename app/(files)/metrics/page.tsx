"use client";

import { useState } from "react";
import { ArrowRight, BarChart2, Activity, Database } from "lucide-react";
import CustomChart from "@/app/components/chart/customChart";

type MetricType = "requests" | "errors" | "db";

const MOCK_DATA = {
  requests: [
    {
      label: "Requests/min",
      data: [
        { timestamp: Date.now() - 600000, value: 120 },
        { timestamp: Date.now() - 480000, value: 140 },
        { timestamp: Date.now() - 360000, value: 110 },
        { timestamp: Date.now() - 240000, value: 150 },
        { timestamp: Date.now() - 120000, value: 130 },
      ],
      borderColor: "#4fc1ff",
      backgroundColor: "rgba(79,193,255,0.2)",
      fill: true,
    },
  ],

  errors: [
    {
      label: "Error Rate (%)",
      data: [
        { timestamp: Date.now() - 600000, value: 0.4 },
        { timestamp: Date.now() - 480000, value: 0.8 },
        { timestamp: Date.now() - 360000, value: 1.2 },
        { timestamp: Date.now() - 240000, value: 0.6 },
        { timestamp: Date.now() - 120000, value: 0.3 },
      ],
      borderColor: "#ff6b6b",
      backgroundColor: "rgba(255,107,107,0.2)",
    },
  ],

  db: [
    {
      label: "DB Query/sec",
      data: [
        { timestamp: Date.now() - 600000, value: 400 },
        { timestamp: Date.now() - 480000, value: 370 },
        { timestamp: Date.now() - 360000, value: 450 },
        { timestamp: Date.now() - 240000, value: 490 },
        { timestamp: Date.now() - 120000, value: 520 },
      ],
      borderColor: "#6ee7b7",
      backgroundColor: "rgba(110,231,183,0.2)",
    },
  ],
};

export default function MetricsViewerPage() {
  const [selected, setSelected] = useState<MetricType>("requests");

  const renderIcon = (m: MetricType) => {
    if (m === "requests") return <Activity size={14} />;
    if (m === "errors") return <BarChart2 size={14} />;
    return <Database size={14} />;
  };

  return (
    <div className="flex h-full gap-6 text-sm text-text-light">
      {/* 좌측 사이드 메뉴 */}
      <aside className="w-48 border border-border-default rounded bg-bg-dark flex flex-col overflow-hidden">
        <div className="px-3 py-2 text-xs bg-bg-default border-b border-border-default text-text-soft">
          METRICS
        </div>

        {(["requests", "errors", "db"] as MetricType[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setSelected(m)}
            className={`flex items-center gap-2 px-3 py-2 text-left border-b border-border-default text-xs hover:bg-bg-hover ${
              selected === m ? "bg-deepblue/40 text-white" : "text-text-light"
            }`}
          >
            {renderIcon(m)}
            <span className="capitalize">{m}</span>
          </button>
        ))}
      </aside>

      {/* 우측 그래프 영역 */}
      <section className="flex-1 flex flex-col gap-3">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-text-default flex items-center gap-2">
              {renderIcon(selected)}
              <span className="capitalize">{selected}</span>
            </h1>
            <p className="text-xs text-text-soft">
              실시간 지표를 IDE 스타일로 시각화한 Metrics 패널입니다.
            </p>
          </div>

          <button className="inline-flex items-center gap-1 bg-darkblue hover:bg-semiblue px-3 py-1 text-xs rounded text-white">
            자세히 보기
            <ArrowRight size={12} />
          </button>
        </header>

        {/* 차트 */}
        <div className="border border-border-default rounded bg-bg-dark pb-6 p-3">
          <CustomChart
            type="line"
            datasets={MOCK_DATA[selected]}
            options={{
              height: 260,
              showLegend: true,
              legendPosition: "bottom",
              legendColor: "#afb4bb",
              animationOff: true,
              useCustomLegend: true,
            }}
            onElementClick={(v) => console.log("clicked: ", v)}
          />
        </div>

        {/* Description 패널 */}
        <div className="border border-border-default rounded bg-bg-dark p-3 text-xs text-text-soft">
          <div className="font-semibold text-text-default">Metric 설명</div>

          {selected === "requests" && (
            <p className="mt-1">
              분당 요청 수(Requests/min)는 API 서버의 트래픽과 부하 상황을
              보여주는 핵심 지표입니다.
            </p>
          )}
          {selected === "errors" && (
            <p className="mt-1">
              Error Rate는 전체 요청 대비 오류 비율을 나타내며 SLO 모니터링에
              사용됩니다.
            </p>
          )}
          {selected === "db" && (
            <p className="mt-1">
              DB Query/sec는 데이터베이스의 처리량을 나타내며 병목 구간 분석에
              활용됩니다.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
