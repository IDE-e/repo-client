"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw, HeartPulse, Filter } from "lucide-react";

type ServiceStatus = "UP" | "DEGRADED" | "DOWN";

type ServiceHealth = {
  name: string;
  status: ServiceStatus;
  latencyMs: number;
  errorRate: number;
  updatedAt: string;
};

const STATUS_COLOR: Record<ServiceStatus, string> = {
  UP: "#6ee7b7",
  DEGRADED: "#ffc148",
  DOWN: "#ff4f4f",
};

export default function HealthPage() {
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    Record<ServiceStatus, boolean>
  >({
    UP: true,
    DEGRADED: true,
    DOWN: true,
  });
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchHealth = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/health");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      if (result.success) setServices(result.data);
    } catch (e) {
      console.error("❌ Failed to fetch health:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const t = setInterval(fetchHealth, 4000);
    return () => clearInterval(t);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return services.filter(
      (s) =>
        statusFilter[s.status] && (q === "" || s.name.toLowerCase().includes(q))
    );
  }, [services, statusFilter, search]);

  return (
    <div className="flex flex-col h-full text-sm text-text-light">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-default px-4 py-2 bg-bg-default">
        <div className="flex items-center gap-2">
          <HeartPulse size={16} />
          <span className="font-semibold">Service Health</span>
          <span className="text-xs text-text-deep">({services.length})</span>
        </div>

        <button
          className="flex items-center gap-1 px-2 py-1 rounded border border-border-light hover:bg-bg-hover disabled:opacity-50"
          onClick={fetchHealth}
          disabled={isLoading}
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border-default text-xs">
        <div className="flex items-center gap-2">
          <Filter size={12} />
          <span>Status:</span>
        </div>

        {(["UP", "DEGRADED", "DOWN"] as ServiceStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter((p) => ({ ...p, [s]: !p[s] }))}
            className="px-2 py-0.5 rounded border border-border-light hover:bg-bg-hover"
            style={{
              color: STATUS_COLOR[s],
              opacity: statusFilter[s] ? 1 : 0.4,
            }}
          >
            {s}
          </button>
        ))}

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search service..."
          className="ml-auto bg-bg-dark border border-border-light px-2 py-1 rounded outline-none text-text-light"
        />
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto bg-bg-dark p-3 font-mono text-[12px] custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="flex h-full items-center justify-center text-text-deep">
            No services to display
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
            {filtered.map((s) => (
              <div
                key={s.name}
                className="border border-border-default rounded bg-bg-default p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-text-light">{s.name}</span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded border border-border-light"
                    style={{ color: STATUS_COLOR[s.status] }}
                  >
                    {s.status}
                  </span>
                </div>

                <div className="mt-3 text-[11px]">
                  <Row label="Latency" value={`${s.latencyMs} ms`} />
                  <Row
                    label="Error Rate"
                    value={`${s.errorRate.toFixed(2)} %`}
                  />
                </div>

                <div className="mt-2 text-[10px] text-text-deep">
                  Updated: {new Date(s.updatedAt).toLocaleTimeString("ko-KR")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-border-default last:border-b-0">
      <span className="text-text-soft">{label}</span>
      <span className="text-text-light">{value}</span>
    </div>
  );
}
