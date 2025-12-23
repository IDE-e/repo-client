"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Cpu, HardDrive, Network, Server } from "lucide-react";
import { BrokerStatus, BrokerEntry } from "@/app/types/type";

const STATUS_COLOR: Record<BrokerStatus, string> = {
  ONLINE: "#6ee7b7",
  DEGRADED: "#ffc148",
  OFFLINE: "#ff4f4f",
};

export default function BrokersPage() {
  const [brokers, setBrokers] = useState<BrokerEntry[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    Record<BrokerStatus, boolean>
  >({
    ONLINE: true,
    DEGRADED: true,
    OFFLINE: true,
  });
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchBrokers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/brokers");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      if (result.success) setBrokers(result.data);
    } catch (e) {
      console.error("❌ Failed to fetch brokers:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrokers();
    const t = setInterval(fetchBrokers, 5000);
    return () => clearInterval(t);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return brokers.filter(
      (b) =>
        statusFilter[b.status] &&
        (q === "" ||
          b.host.toLowerCase().includes(q) ||
          (b.rack ?? "").toLowerCase().includes(q))
    );
  }, [brokers, statusFilter, search]);

  return (
    <div className="flex flex-col h-full text-sm text-text-light">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-default px-4 py-2 bg-bg-default">
        <div className="flex items-center gap-2">
          <Server size={16} />
          <span className="font-semibold">Brokers</span>
          <span className="text-xs text-text-deep">
            ({brokers.length} total)
          </span>
        </div>

        <button
          className="flex items-center gap-1 px-2 py-1 rounded border border-border-light hover:bg-bg-hover disabled:opacity-50"
          onClick={fetchBrokers}
          disabled={isLoading}
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border-default text-xs">
        <span className="text-text-soft">Status:</span>
        {(["ONLINE", "DEGRADED", "OFFLINE"] as BrokerStatus[]).map((s) => (
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
          placeholder="Search host/rack..."
          className="ml-auto bg-bg-dark border border-border-light px-2 py-1 rounded outline-none text-text-light"
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto bg-bg-dark p-3 font-mono text-[12px] leading-relaxed custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="flex h-full items-center justify-center text-text-deep">
            No brokers to display
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="border border-border-default rounded bg-bg-default p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server size={14} />
                    <span className="text-text-light">{b.host}</span>
                    {b.rack && (
                      <span className="text-[10px] text-text-deep">
                        {b.rack}
                      </span>
                    )}
                  </div>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded border border-border-light"
                    style={{ color: STATUS_COLOR[b.status] }}
                  >
                    {b.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 text-[11px]">
                  <MiniMeter icon={Cpu} label="CPU" value={b.cpu} unit="%" />
                  <MiniMeter
                    icon={HardDrive}
                    label="MEM"
                    value={b.memory}
                    unit="%"
                  />
                  <MiniMeter
                    icon={HardDrive}
                    label="DISK"
                    value={b.disk}
                    unit="%"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
                  <MiniStat
                    icon={Network}
                    label="NET IN"
                    value={`${b.networkIn} MB/s`}
                  />
                  <MiniStat
                    icon={Network}
                    label="NET OUT"
                    value={`${b.networkOut} MB/s`}
                  />
                </div>

                <div className="mt-2 text-[10px] text-text-deep">
                  Updated: {new Date(b.updatedAt).toLocaleTimeString("ko-KR")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MiniMeter({
  icon: Icon,
  label,
  value,
  unit,
}: {
  icon: any;
  label: string;
  value: number;
  unit: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="border border-border-light rounded px-2 py-1 bg-bg-dark">
      <div className="flex items-center gap-1 text-text-soft">
        <Icon size={10} />
        <span>{label}</span>
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-text-light">
          {value}
          {unit}
        </span>
        <span className="text-[10px] text-text-deep">{pct}%</span>
      </div>
      <div className="mt-1 h-1 rounded bg-bg-default overflow-hidden">
        <div
          className="h-full"
          style={{ width: `${pct}%`, backgroundColor: "#4fc1ff" }}
        />
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="border border-border-light rounded px-2 py-1 bg-bg-dark">
      <div className="flex items-center gap-1 text-text-soft">
        <Icon size={10} />
        <span>{label}</span>
      </div>
      <div className="mt-1 text-text-light">{value}</div>
    </div>
  );
}
