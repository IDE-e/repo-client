"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Layers, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { TopicEntry } from "@/app/types/type";

export default function TopicsPage() {
  const [topics, setTopics] = useState<TopicEntry[]>([]);
  const [search, setSearch] = useState<string>("");
  const [sortKey, setSortKey] = useState<
    "name" | "lag" | "in" | "out" | "size"
  >("lag");
  const [desc, setDesc] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchTopics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/topics");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      if (result.success) setTopics(result.data);
    } catch (e) {
      console.error("❌ Failed to fetch topics:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
    const t = setInterval(fetchTopics, 5000);
    return () => clearInterval(t);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = topics.filter(
      (t) => q === "" || t.name.toLowerCase().includes(q)
    );

    const getter = (t: TopicEntry) => {
      switch (sortKey) {
        case "name":
          return t.name;
        case "lag":
          return t.lag;
        case "in":
          return t.messageInPerSec;
        case "out":
          return t.messageOutPerSec;
        case "size":
          return t.sizeGB;
      }
    };

    const sorted = [...base].sort((a, b) => {
      const va = getter(a);
      const vb = getter(b);
      if (typeof va === "string" && typeof vb === "string") {
        return va.localeCompare(vb);
      }
      return Number(va) - Number(vb);
    });

    return desc ? sorted.reverse() : sorted;
  }, [topics, search, sortKey, desc]);

  return (
    <div className="flex flex-col h-full text-sm text-text-light">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-default px-4 py-2 bg-bg-default">
        <div className="flex items-center gap-2">
          <Layers size={16} />
          <span className="font-semibold">Topics</span>
          <span className="text-xs text-text-deep">
            ({topics.length} total)
          </span>
        </div>

        <button
          className="flex items-center gap-1 px-2 py-1 rounded border border-border-light hover:bg-bg-hover disabled:opacity-50"
          onClick={fetchTopics}
          disabled={isLoading}
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border-default text-xs">
        <span className="text-text-soft">Sort:</span>
        {(
          [
            ["lag", "Lag"],
            ["in", "In/sec"],
            ["out", "Out/sec"],
            ["size", "Size"],
            ["name", "Name"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setSortKey(k)}
            className={`px-2 py-0.5 rounded border border-border-light hover:bg-bg-hover ${
              sortKey === k ? "bg-bg-hover" : ""
            }`}
          >
            {label}
          </button>
        ))}

        <button
          onClick={() => setDesc((p) => !p)}
          className="px-2 py-0.5 rounded border border-border-light hover:bg-bg-hover"
          title="Toggle direction"
        >
          {desc ? (
            <span className="inline-flex items-center gap-1">
              Desc <ArrowDownRight size={10} />
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              Asc <ArrowUpRight size={10} />
            </span>
          )}
        </button>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search topics..."
          className="ml-auto bg-bg-dark border border-border-light px-2 py-1 rounded outline-none text-text-light"
        />
      </div>

      {/* Table-like List */}
      <div className="flex-1 overflow-auto bg-bg-dark p-3 font-mono text-[12px] leading-relaxed custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="flex h-full items-center justify-center text-text-deep">
            No topics to display
          </div>
        ) : (
          <div className="border border-border-default rounded overflow-hidden">
            <div className="grid grid-cols-12 gap-0 bg-bg-default text-[10px] text-text-soft px-3 py-2 border-b border-border-default">
              <div className="col-span-3">NAME</div>
              <div className="col-span-1">PART</div>
              <div className="col-span-1">RF</div>
              <div className="col-span-2">IN/sec</div>
              <div className="col-span-2">OUT/sec</div>
              <div className="col-span-2">LAG</div>
              <div className="col-span-1">GB</div>
            </div>

            {filtered.map((t) => (
              <div
                key={t.name}
                className="grid grid-cols-12 gap-0 px-3 py-2 border-b border-border-default last:border-b-0 hover:bg-bg-hover"
              >
                <div className="col-span-3 text-text-light">{t.name}</div>
                <div className="col-span-1 text-text-deep">{t.partitions}</div>
                <div className="col-span-1 text-text-deep">
                  {t.replicationFactor}
                </div>
                <div className="col-span-2">{t.messageInPerSec}</div>
                <div className="col-span-2">{t.messageOutPerSec}</div>
                <div
                  className="col-span-2"
                  style={{ color: t.lag > 300 ? "#ffc148" : "#afb4bb" }}
                >
                  {t.lag}
                </div>
                <div className="col-span-1 text-text-deep">{t.sizeGB}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
