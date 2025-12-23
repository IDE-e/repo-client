"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  BarChart2,
  Activity,
  Database,
  RefreshCw,
} from "lucide-react";
import CustomChart from "@/app/components/chart/customChart";
import { ChartDataset, MetricDataPoint, MetricType } from "@/app/types/type";

const METRIC_CONFIGS: Record<
  MetricType,
  {
    label: string;
    borderColor: string;
    backgroundColor: string;
    icon: any;
    description: string;
  }
> = {
  requests: {
    label: "Requests/min",
    borderColor: "#4fc1ff",
    backgroundColor: "rgba(79,193,255,0.2)",
    icon: Activity,
    description:
      "분당 요청 수(Requests/min)는 API 서버의 트래픽과 부하 상황을 보여주는 핵심 지표입니다.",
  },
  errors: {
    label: "Error Rate (%)",
    borderColor: "#ff6b6b",
    backgroundColor: "rgba(255,107,107,0.2)",
    icon: BarChart2,
    description:
      "Error Rate는 전체 요청 대비 오류 비율을 나타내며 SLO 모니터링에 사용됩니다.",
  },
  db: {
    label: "DB Query/sec",
    borderColor: "#6ee7b7",
    backgroundColor: "rgba(110,231,183,0.2)",
    icon: Database,
    description:
      "DB Query/sec는 데이터베이스의 처리량을 나타내며 병목 구간 분석에 활용됩니다.",
  },
};

export default function MetricsViewerPage() {
  const [selected, setSelected] = useState<MetricType>("requests");
  const [metricsData, setMetricsData] = useState<
    Record<MetricType, MetricDataPoint[]>
  >({
    requests: [],
    errors: [],
    db: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // API에서 특정 metric 데이터 가져오기
  const fetchMetricData = async (type: MetricType) => {
    try {
      console.log(`📊 Fetching ${type} data...`);
      const response = await fetch(`/api/metrics?type=${type}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setMetricsData((prev) => ({
          ...prev,
          [type]: result.data,
        }));
        console.log(`${type} data loaded:`, result.data.length, "points");
      }
    } catch (error) {
      console.error(`❌ Failed to fetch ${type} data:`, error);
    }
  };

  // metrics 데이터
  const fetchAllMetrics = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchMetricData("requests"),
        fetchMetricData("errors"),
        fetchMetricData("db"),
      ]);
      setLastUpdate(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchAllMetrics();
  }, []);

  // 주기적으로 현재 선택된 metric만 업데이트 (5초마다)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMetricData(selected);
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [selected]);

  // 차트 데이터셋 준비
  const getChartDataset = (type: MetricType): ChartDataset[] => {
    const config = METRIC_CONFIGS[type];
    const data = metricsData[type];

    return [
      {
        label: config.label,
        data,
        borderColor: config.borderColor,
        backgroundColor: config.backgroundColor,
        fill: true,
      },
    ];
  };

  const config = METRIC_CONFIGS[selected];
  const Icon = config.icon;
  const currentValue =
    metricsData[selected].length > 0
      ? metricsData[selected][metricsData[selected].length - 1].value
      : 0;

  return (
    <div className="flex h-full gap-6 text-sm text-text-light">
      {/* 좌측 사이드 메뉴 */}
      <aside className="w-48 border border-border-default rounded bg-bg-dark flex flex-col overflow-hidden">
        <div className="px-3 py-2 text-xs bg-bg-default border-b border-border-default text-text-soft">
          METRICS
        </div>

        {(["requests", "errors", "db"] as MetricType[]).map((m) => {
          const MetricIcon = METRIC_CONFIGS[m].icon;
          const latestValue =
            metricsData[m].length > 0
              ? metricsData[m][metricsData[m].length - 1].value
              : 0;

          return (
            <button
              key={m}
              type="button"
              onClick={() => setSelected(m)}
              className={`flex items-center justify-between gap-2 px-3 py-2 text-left border-b border-border-default text-xs hover:bg-bg-hover ${
                selected === m ? "bg-deepblue/40 text-white" : "text-text-light"
              }`}
            >
              <div className="flex items-center gap-2">
                <MetricIcon size={14} />
                <span className="capitalize">{m}</span>
              </div>
              <span className="text-[10px] text-text-deep font-mono">
                {latestValue}
              </span>
            </button>
          );
        })}

        {/* 마지막 업데이트 시간 */}
        {lastUpdate && (
          <div className="mt-auto px-3 py-2 text-[10px] text-text-deep border-t border-border-default">
            Updated: {lastUpdate.toLocaleTimeString("ko-KR")}
          </div>
        )}
      </aside>

      {/* 우측 그래프 영역 */}
      <section className="flex-1 flex flex-col gap-3">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-text-default flex items-center gap-2">
              <Icon size={18} />
              <span className="capitalize">{selected}</span>
              <span className="text-sm font-mono text-point ml-2">
                {currentValue.toFixed(selected === "errors" ? 2 : 0)}
              </span>
            </h1>
            <p className="text-xs text-text-soft">
              실시간 지표를 IDE 스타일로 시각화한 Metrics 패널입니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAllMetrics}
              disabled={isLoading}
              className="inline-flex items-center gap-1 bg-bg-default hover:bg-bg-hover border border-border-light px-3 py-1 text-xs rounded disabled:opacity-50"
            >
              <RefreshCw
                size={12}
                className={isLoading ? "animate-spin" : ""}
              />
              새로고침
            </button>

            <button className="inline-flex items-center gap-1 bg-darkblue hover:bg-semiblue px-3 py-1 text-xs rounded text-white">
              자세히 보기
              <ArrowRight size={12} />
            </button>
          </div>
        </header>

        {/* 차트 */}
        <div className="border border-border-default rounded bg-bg-dark pb-6 p-3">
          {metricsData[selected].length > 0 ? (
            <CustomChart
              type="line"
              datasets={getChartDataset(selected)}
              options={{
                height: 260,
                showLegend: true,
                legendPosition: "bottom",
                legendColor: "#afb4bb",
                animationOff: false,
                useCustomLegend: true,
              }}
              onElementClick={(v) => console.log("clicked: ", v)}
            />
          ) : (
            <div className="flex items-center justify-center h-[260px] text-text-deep">
              데이터를 불러오는 중...
            </div>
          )}
        </div>

        {/* Description 패널 */}
        <div className="border border-border-default rounded bg-bg-dark p-3 text-xs text-text-soft">
          <div className="font-semibold text-text-default mb-1">
            Metric 설명
          </div>
          <p>{config.description}</p>

          <div className="mt-2 pt-2 border-t border-border-default">
            <div className="flex items-center justify-between text-[11px]">
              <span>데이터 포인트:</span>
              <span className="text-text-light">
                {metricsData[selected].length}개
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] mt-1">
              <span>업데이트 주기:</span>
              <span className="text-text-light">5초</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
