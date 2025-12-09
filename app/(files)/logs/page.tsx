"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Info, Filter } from "lucide-react";

type LogLevel = "info" | "warn" | "error";

type LogEntry = {
  id: number;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  details?: string;
};

const MOCK_LOGS: LogEntry[] = [
  {
    id: 1,
    timestamp: "2025-11-14 10:31:22",
    level: "error",
    source: "api/auth",
    message: "Login request failed with 500 Internal Server Error",
    details:
      'POST /api/auth/login\nResponse: 500\nBody: {"error":"DB connection timeout"}',
  },
  {
    id: 2,
    timestamp: "2025-11-14 10:29:10",
    level: "warn",
    source: "worker/queue",
    message: "Job processing delayed (queue length: 182)",
    details:
      "Queue: notification-mails\nAverage delay: 12.3s\nLast processed job id: 48201",
  },
  {
    id: 3,
    timestamp: "2025-11-14 10:25:03",
    level: "info",
    source: "web/frontend",
    message: "User navigated to /dashboard",
    details: "userId=3912\npath=/dashboard\nuserAgent=Chrome/142.0",
  },
  {
    id: 4,
    timestamp: "2025-11-14 10:20:41",
    level: "info",
    source: "api/metrics",
    message: "Health check passed",
    details: "GET /api/health\nstatus=200\ndb=ok\nredis=ok",
  },
  {
    id: 5,
    timestamp: "2025-11-14 10:18:09",
    level: "warn",
    source: "db/pool",
    message: "Connection pool usage 85%",
    details: "max=50\nused=43\nidle=2",
  },
];

function levelColor(level: LogLevel) {
  switch (level) {
    case "error":
      return "text-error";
    case "warn":
      return "text-warning";
    case "info":
    default:
      return "text-[#4fc1ff]";
  }
}

function levelBadgeClass(level: LogLevel) {
  switch (level) {
    case "error":
      return "bg-[#5a1e1e] text-error border border-[#8b2e2e]";
    case "warn":
      return "bg-[#4a3a1a] text-warning border border-[#8c6f2a]";
    case "info":
    default:
      return "bg-[#12354a] text-[#4fc1ff] border border-[#1e4e6b]";
  }
}

function levelIcon(level: LogLevel) {
  switch (level) {
    case "error":
      return <AlertTriangle size={14} />;
    case "warn":
      return <AlertTriangle size={14} />;
    case "info":
    default:
      return <Info size={14} />;
  }
}

export default function LogsPage() {
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(MOCK_LOGS[0]);

  const filteredLogs = MOCK_LOGS.filter((log) => {
    const levelMatch =
      selectedLevel === "all" ? true : log.level === selectedLevel;
    const keyword = search.trim().toLowerCase();
    const searchMatch =
      keyword.length === 0 ||
      log.message.toLowerCase().includes(keyword) ||
      log.source.toLowerCase().includes(keyword);
    return levelMatch && searchMatch;
  });

  return (
    <div className="flex h-full flex-col gap-4 text-sm text-text-light">
      {/* 상단 헤더 */}
      <section className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-default">Log Viewer</h1>
          <p className="text-xs text-text-soft">
            애플리케이션에서 발생하는 로그를 VS Code 스타일로 모니터링합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* level 필터 버튼들 */}
          <div className="flex items-center gap-1 bg-bg-default border border-border-default rounded px-1 py-0.5">
            {["all", "info", "warn", "error"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl as LogLevel | "all")}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  selectedLevel === lvl
                    ? "bg-deepblue text-white"
                    : "text-text-soft hover:bg-bg-hover"
                }`}
              >
                {lvl.toUpperCase()}
              </button>
            ))}
          </div>

          {/* 검색창 */}
          <div className="flex items-center gap-1 bg-bg-dark border border-border-light rounded px-2 py-1 text-xs">
            <Filter size={12} className="text-text-deep" />
            <input
              className="bg-transparent outline-none text-text-light placeholder:text-text-deep"
              placeholder="Search message or source..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 메인 - 좌: 리스트, 우: 상세 */}
      <section className="flex flex-1 min-h-[320px] gap-4">
        {/* 로그 리스트 */}
        <div className="w-2/3 border border-border-default rounded bg-bg-dark flex flex-col overflow-hidden">
          <div className="px-3 py-2 text-xs bg-bg-default border-b border-border-default flex items-center justify-between">
            <span className="text-text-soft">LOGS</span>
            <span className="text-text-deep">
              {filteredLogs.length} / {MOCK_LOGS.length} entries
            </span>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-bg-dark border-b border-border-default">
                <tr className="text-text-soft">
                  <th className="text-left font-normal px-3 py-1 w-[150px]">
                    Time
                  </th>
                  <th className="text-left font-normal px-3 py-1 w-[80px]">
                    Level
                  </th>
                  <th className="text-left font-normal px-3 py-1 w-[140px]">
                    Source
                  </th>
                  <th className="text-left font-normal px-3 py-1">Message</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-4 text-center text-text-deep"
                    >
                      No logs found for current filters.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    const isActive = selectedLog?.id === log.id;
                    return (
                      <tr
                        key={log.id}
                        className={`cursor-pointer border-b border-border-default last:border-b-0 hover:bg-bg-default ${
                          isActive ? "bg-deepblue/40" : ""
                        }`}
                        onClick={() => setSelectedLog(log)}
                      >
                        <td className="px-3 py-1 align-top text-text-soft">
                          {log.timestamp}
                        </td>
                        <td className="px-3 py-1 align-top">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full ${levelBadgeClass(
                              log.level
                            )}`}
                          >
                            {levelIcon(log.level)}
                            <span>{log.level.toUpperCase()}</span>
                          </span>
                        </td>
                        <td className="px-3 py-1 align-top text-sub_point">
                          {log.source}
                        </td>
                        <td className="px-3 py-1 align-top">{log.message}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 상세 패널 */}
        <div className="w-1/3 border border-border-default rounded bg-bg-dark flex flex-col overflow-hidden">
          <div className="px-3 py-2 text-xs bg-bg-default border-b border-border-default flex items-center justify-between">
            <span className="text-text-soft">DETAIL</span>
            {selectedLog?.level === "error" ? (
              <span className="flex items-center gap-1 text-error text-[11px]">
                <AlertTriangle size={12} /> Needs attention
              </span>
            ) : selectedLog?.level === "warn" ? (
              <span className="flex items-center gap-1 text-warning text-[11px]">
                <AlertTriangle size={12} /> Check when possible
              </span>
            ) : (
              <span className="flex items-center gap-1 text-point text-[11px]">
                <CheckCircle2 size={12} /> Normal
              </span>
            )}
          </div>

          {selectedLog ? (
            <div className="flex-1 overflow-auto p-3 space-y-3 text-xs">
              <div className="space-y-1">
                <div className="text-text-soft">Timestamp</div>
                <div className="font-mono text-text-light">
                  {selectedLog.timestamp}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-text-soft">Level</div>
                <div className={`font-mono ${levelColor(selectedLog.level)}`}>
                  {selectedLog.level.toUpperCase()}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-text-soft">Source</div>
                <div className="font-mono text-sub_point">
                  {selectedLog.source}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-text-soft">Message</div>
                <div className="text-text-light">{selectedLog.message}</div>
              </div>

              {selectedLog.details && (
                <div className="space-y-1">
                  <div className="text-text-soft">Details</div>
                  <pre className="bg-bg-night border border-border-default rounded p-2 text-[11px] whitespace-pre-wrap font-mono text-text-light">
                    {selectedLog.details}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-text-deep">
              Select a log entry to see details.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
