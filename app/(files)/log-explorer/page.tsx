"use client";

import { useEffect, useRef, useState } from "react";
import {
  Download,
  Filter,
  TerminalSquare,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { LogLevel, LogEntry } from "@/app/types/type";

const COLORS: Record<LogLevel, string> = {
  INFO: "#4fc1ff",
  WARN: "#ffc148",
  ERROR: "#ff4f4f",
};

export default function LogExplorerPage() {
  const [logs, setLogs] = useState<Omit<LogEntry, "createdAt">[]>([]);
  const [levels, setLevels] = useState<Record<LogLevel, boolean>>({
    INFO: true,
    WARN: true,
    ERROR: true,
  });
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // API
  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      console.log("🔍 Fetching logs from /api/log-explorer");
      const response = await fetch("/api/log-explorer");

      console.log("📡 Response status:", response.status);
      console.log("📡 Response headers:", response.headers.get("content-type"));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log("📄 Response text:", text);

      if (!text) {
        console.warn("⚠️ Empty response body");
        setLogs([]);
        return;
      }

      const result = JSON.parse(text);

      if (result.success) {
        setLogs(result.data);
        console.log("Logs loaded:", result.data.length);
      }
    } catch (error) {
      console.error("❌ Failed to fetch logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 새 로그 추가 (API 호출)
  const addLog = async (level: LogLevel, message: string) => {
    try {
      const response = await fetch("/api/log-explorer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ level, message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setLogs((prev) => [...prev, result.data]);
      }
    } catch (error) {
      console.error("Failed to add log:", error);
    }
  };

  // 모든 로그 삭제
  const clearLogs = async () => {
    try {
      const response = await fetch("/api/log-explorer", {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setLogs([]);
      }
    } catch (error) {
      console.error("Failed to clear logs:", error);
    }
  };

  // Mock log generator (시뮬레이션용)
  useEffect(() => {
    const interval = setInterval(() => {
      const levels: LogLevel[] = ["INFO", "WARN", "ERROR"];
      const lvl = levels[Math.floor(Math.random() * levels.length)];

      const messages = {
        INFO: [
          "Request completed successfully.",
          "User logged in.",
          "Database connection established.",
          "Cache updated.",
        ],
        WARN: [
          "Response time is slower than expected.",
          "Deprecated API used.",
          "Memory usage is high.",
        ],
        ERROR: [
          "Unhandled exception occurred!",
          "Database connection failed.",
          "Authentication error.",
        ],
      };

      const messageList = messages[lvl];
      const message =
        messageList[Math.floor(Math.random() * messageList.length)];

      addLog(lvl, message);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // 컴포넌트 마운트 시 로그 로드
  useEffect(() => {
    fetchLogs();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const filteredLogs = logs.filter(
    (l) =>
      levels[l.level] &&
      (searchText === "" ||
        l.message.toLowerCase().includes(searchText.toLowerCase()))
  );

  const downloadLogs = () => {
    const blob = new Blob(
      filteredLogs.map((l) => `${l.timestamp} [${l.level}] ${l.message}\n`),
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "logs.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full text-sm text-text-light">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-default px-4 py-2 bg-bg-default">
        <div className="flex items-center gap-2">
          <TerminalSquare size={16} />
          <span className="font-semibold">Log Explorer</span>
          <span className="text-xs text-text-deep">({logs.length} logs)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1 px-2 py-1 rounded border border-border-light hover:bg-bg-hover disabled:opacity-50"
            onClick={fetchLogs}
            disabled={isLoading}
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            className="flex items-center gap-1 px-2 py-1 rounded border border-border-light hover:bg-bg-hover text-error"
            onClick={clearLogs}
          >
            <Trash2 size={14} />
            Clear
          </button>

          <button
            className="flex items-center gap-1 px-2 py-1 rounded border border-border-light hover:bg-bg-hover"
            onClick={downloadLogs}
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border-default text-xs">
        <div className="flex items-center gap-2">
          <Filter size={12} />
          <span>Level:</span>
        </div>

        {(["INFO", "WARN", "ERROR"] as LogLevel[]).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setLevels((p) => ({ ...p, [lvl]: !p[lvl] }))}
            className="px-2 py-0.5 rounded border border-border-light hover:bg-bg-hover"
            style={{
              color: COLORS[lvl],
              opacity: levels[lvl] ? 1 : 0.4,
            }}
          >
            {lvl}
          </button>
        ))}

        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search logs..."
          className="ml-auto bg-bg-dark border border-border-light px-2 py-1 rounded outline-none text-text-light"
        />
      </div>

      {/* Log Output */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto bg-bg-dark p-3 font-mono text-[12px] leading-relaxed custom-scrollbar"
      >
        {filteredLogs.length === 0 ? (
          <div className="flex h-full items-center justify-center text-text-deep">
            No logs to display
          </div>
        ) : (
          filteredLogs.map((l) => (
            <div key={l.id} className="flex gap-3">
              <span className="text-text-deep">{l.timestamp}</span>
              <span style={{ color: COLORS[l.level] }}>[{l.level}]</span>
              <span>{l.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
