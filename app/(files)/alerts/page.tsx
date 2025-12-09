"use client";

import { useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  Bell,
  Filter,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
} from "lucide-react";

type AlertLevel = "INFO" | "WARN" | "ERROR" | "CRITICAL";

type AlertEntry = {
  id: number;
  timestamp: string;
  level: AlertLevel;
  title: string;
  message: string;
  source?: string;
  acknowledged: boolean;
  createdAt: string;
};

const LEVEL_COLOR: Record<AlertLevel, string> = {
  INFO: "#4fc1ff",
  WARN: "#ffc148",
  ERROR: "#ff6b6b",
  CRITICAL: "#ff4f4f",
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertEntry[]>([]);
  const [levels, setLevels] = useState<Record<AlertLevel, boolean>>({
    INFO: true,
    WARN: true,
    ERROR: true,
    CRITICAL: true,
  });
  const [showAck, setShowAck] = useState(true);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/alerts");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      if (result.success) setAlerts(result.data);
    } catch (e) {
      console.error("❌ Failed to fetch alerts:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const t = setInterval(fetchAlerts, 5000);
    return () => clearInterval(t);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return alerts.filter((a) => {
      if (!levels[a.level]) return false;
      if (!showAck && a.acknowledged) return false;

      if (q === "") return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.message.toLowerCase().includes(q) ||
        (a.source ?? "").toLowerCase().includes(q)
      );
    });
  }, [alerts, levels, showAck, search]);

  const toggleAck = async (id: number, next: boolean) => {
    try {
      const res = await fetch("/api/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, acknowledged: next }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      if (result.success) {
        setAlerts((prev) => prev.map((a) => (a.id === id ? result.data : a)));
      }
    } catch (e) {
      console.error("❌ Ack update failed:", e);
    }
  };

  const addRandomAlert = async () => {
    const samples: Omit<
      AlertEntry,
      "id" | "timestamp" | "acknowledged" | "createdAt"
    >[] = [
      {
        level: "INFO",
        title: "Consumer group stable",
        message: "Rebalance completed without errors.",
        source: "consumer/orders",
      },
      {
        level: "WARN",
        title: "High lag detected",
        message: "Lag is rising on topic 'payments'.",
        source: "topic/payments",
      },
      {
        level: "ERROR",
        title: "Broker degraded",
        message: "Disk IO wait exceeded threshold.",
        source: "broker-2.local",
      },
      {
        level: "CRITICAL",
        title: "Service down",
        message: "Gateway health check failed consecutively.",
        source: "gateway",
      },
    ];

    const s = samples[Math.floor(Math.random() * samples.length)];

    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      if (result.success) setAlerts((prev) => [...prev, result.data]);
    } catch (e) {
      console.error("❌ Failed to add alert:", e);
    }
  };

  const clearAlerts = async () => {
    try {
      const res = await fetch("/api/alerts", { method: "DELETE" });
      const result = await res.json();
      if (result.success) setAlerts([]);
    } catch (e) {
      console.error("❌ Failed to clear alerts:", e);
    }
  };

  return (
    <div className="flex flex-col h-full text-sm text-text-light">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-default px-4 py-2 bg-bg-default">
        <div className="flex items-center gap-2">
          <Bell size={16} />
          <span className="font-semibold">Alerts</span>
          <span className="text-xs text-text-deep">({alerts.length})</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1 px-2 py-1 rounded border border-border-light hover:bg-bg-hover disabled:opacity-50"
            onClick={fetchAlerts}
            disabled={isLoading}
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            className="flex items-center gap-1 px-2 py-1 rounded border border-border-light hover:bg-bg-hover"
            onClick={addRandomAlert}
          >
            <Plus size={14} />
            Simulate
          </button>

          <button
            className="flex items-center gap-1 px-2 py-1 rounded border border-border-light hover:bg-bg-hover text-error"
            onClick={clearAlerts}
          >
            <Trash2 size={14} />
            Clear
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border-default text-xs">
        <div className="flex items-center gap-2">
          <Filter size={12} />
          <span>Level:</span>
        </div>

        {(["INFO", "WARN", "ERROR", "CRITICAL"] as AlertLevel[]).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setLevels((p) => ({ ...p, [lvl]: !p[lvl] }))}
            className="px-2 py-0.5 rounded border border-border-light hover:bg-bg-hover"
            style={{
              color: LEVEL_COLOR[lvl],
              opacity: levels[lvl] ? 1 : 0.4,
            }}
          >
            {lvl}
          </button>
        ))}

        <button
          onClick={() => setShowAck((p) => !p)}
          className="px-2 py-0.5 rounded border border-border-light hover:bg-bg-hover"
        >
          {showAck ? "Show ACK" : "Hide ACK"}
        </button>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title/source/message..."
          className="ml-auto bg-bg-dark border border-border-light px-2 py-1 rounded outline-none text-text-light"
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto bg-bg-dark p-3 font-mono text-[12px] leading-relaxed custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="flex h-full items-center justify-center text-text-deep">
            No alerts to display
          </div>
        ) : (
          filtered.map((a) => (
            <div
              key={a.id}
              className="flex items-start gap-3 border border-border-default rounded bg-bg-default px-3 py-2 mb-2"
            >
              <button
                className="mt-0.5"
                onClick={() => toggleAck(a.id, !a.acknowledged)}
                title="Toggle acknowledge"
              >
                {a.acknowledged ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <Circle size={14} />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-text-deep">{a.timestamp}</span>
                  <span style={{ color: LEVEL_COLOR[a.level] }}>
                    [{a.level}]
                  </span>
                  <span className="text-text-light">{a.title}</span>
                  {a.source && (
                    <span className="text-[10px] text-text-deep">
                      @{a.source}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-text-soft">{a.message}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
