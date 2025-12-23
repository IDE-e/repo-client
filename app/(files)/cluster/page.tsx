"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Server, Activity, Database, HardDrive } from "lucide-react";
import { ClusterStatus, ClusterSummary } from "@/app/types/type";

const STATUS_COLOR: Record<ClusterStatus, string> = {
  HEALTHY: "#6ee7b7",
  DEGRADED: "#ffc148",
  DOWN: "#ff4f4f",
};

export default function ClusterOverviewPage() {
  const [data, setData] = useState<ClusterSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCluster = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cluster");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      if (result.success) setData(result.data);
    } catch (e) {
      console.error("❌ Failed to fetch cluster:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCluster();
    const t = setInterval(fetchCluster, 5000);
    return () => clearInterval(t);
  }, []);

  const usagePercent =
    data && data.storageTotalGB > 0
      ? Math.min(100, (data.storageUsedGB / data.storageTotalGB) * 100)
      : 0;

  return (
    <div className="flex flex-col h-full text-sm text-text-light">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-default px-4 py-2 bg-bg-default">
        <div className="flex items-center gap-2">
          <Server size={16} />
          <span className="font-semibold">Cluster Overview</span>
          <span className="text-xs text-text-deep">
            {data?.clusterName ?? "loading..."}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1 px-2 py-1 rounded border border-border-light hover:bg-bg-hover disabled:opacity-50"
            onClick={fetchCluster}
            disabled={isLoading}
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border-default text-xs">
        <span className="text-text-soft">Status:</span>
        <span
          className="px-2 py-0.5 rounded border border-border-light font-mono"
          style={{ color: data ? STATUS_COLOR[data.status] : "#afb4bb" }}
        >
          {data?.status ?? "UNKNOWN"}
        </span>

        <span className="ml-3 text-text-soft">Updated:</span>
        <span className="font-mono text-text-deep">
          {data ? new Date(data.updatedAt).toLocaleTimeString("ko-KR") : "-"}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto bg-bg-dark p-4">
        {/* Top stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            icon={Activity}
            label="Brokers"
            value={data?.brokers ?? 0}
          />
          <StatCard icon={Database} label="Topics" value={data?.topics ?? 0} />
          <StatCard
            icon={Server}
            label="Partitions"
            value={data?.partitions ?? 0}
          />
          <StatCard
            icon={HardDrive}
            label="Under-Replicated"
            value={data?.underReplicated ?? 0}
            accent={data && data.underReplicated > 0 ? "#ffc148" : "#6ee7b7"}
          />
        </div>

        {/* Throughput + Storage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <Panel title="Throughput">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-soft">Message In/sec</span>
              <span className="font-mono text-text-light">
                {data?.messageInPerSec ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-text-soft">Message Out/sec</span>
              <span className="font-mono text-text-light">
                {data?.messageOutPerSec ?? 0}
              </span>
            </div>
          </Panel>

          <Panel title="Storage">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-soft">Used</span>
              <span className="font-mono">{data?.storageUsedGB ?? 0} GB</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-text-soft">Total</span>
              <span className="font-mono">{data?.storageTotalGB ?? 0} GB</span>
            </div>

            <div className="mt-3 h-2 rounded bg-bg-default overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${usagePercent}%`,
                  background: "linear-gradient(90deg, #4fc1ff, #6ee7b7)",
                }}
              />
            </div>
            <div className="mt-1 text-[10px] text-text-deep font-mono">
              {usagePercent.toFixed(1)}%
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: any;
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="border border-border-default rounded bg-bg-default px-3 py-2">
      <div className="flex items-center gap-2 text-xs text-text-soft">
        <Icon size={12} />
        <span>{label}</span>
      </div>
      <div
        className="mt-1 text-lg font-mono font-semibold"
        style={{ color: accent ?? "#ffffff" }}
      >
        {value}
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border-default rounded bg-bg-default p-3">
      <div className="text-xs text-text-soft mb-2">{title}</div>
      {children}
    </div>
  );
}
