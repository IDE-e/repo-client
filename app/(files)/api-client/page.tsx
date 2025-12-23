"use client";

import { useEffect, useState } from "react";
import { Globe, Play, Loader2, Save, Trash2, ChevronDown } from "lucide-react";
import { HttpMethod, SavedRequest } from "@/app/types/type";

export default function ApiClientPage() {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/users");
  const [body, setBody] = useState<string>(
    '{\n  "title": "Test",\n  "body": "Content",\n  "userId": 1\n}'
  );

  const [savedRequests, setSavedRequests] = useState<SavedRequest[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [isSending, setIsSending] = useState(false);
  const [responseStatus, setResponseStatus] = useState<string | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseBody, setResponseBody] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------
  // Saved Requests API
  // ---------------------------
  const fetchSavedRequests = async () => {
    try {
      const res = await fetch("/api/api-client/requests", {
        method: "GET",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();

      if (result.success) {
        setSavedRequests(result.data);

        // 최초 선택값 자동 세팅
        if (result.data.length > 0 && selectedId == null) {
          const first = result.data[0];
          setSelectedId(first.id);
          setMethod(first.method);
          setUrl(first.url);
        }
      }
    } catch (e) {
      console.error("❌ Failed to load saved requests:", e);
    }
  };

  useEffect(() => {
    fetchSavedRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/api-client/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, url }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();

      if (result.success) {
        const newReq: SavedRequest = result.data;
        setSavedRequests((prev) => [newReq, ...prev]);
        setSelectedId(newReq.id);
      }
    } catch (e) {
      console.error("❌ Failed to save request:", e);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/api-client/requests?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();

      if (result.success) {
        setSavedRequests((prev) => prev.filter((r) => r.id !== id));
        if (selectedId === id) setSelectedId(null);
      }
    } catch (e) {
      console.error("❌ Failed to delete request:", e);
    }
  };

  const handleSelectRequest = (req: SavedRequest) => {
    setSelectedId(req.id);
    setMethod(req.method);
    setUrl(req.url);
  };

  // ---------------------------
  // Send Proxy API
  // ---------------------------
  const handleSend = async () => {
    setIsSending(true);
    setResponseStatus(null);
    setResponseTime(null);
    setResponseBody(null);
    setError(null);

    try {
      // body 처리: POST/PUT만
      let parsedBody: any = undefined;

      if (method === "POST" || method === "PUT") {
        try {
          parsedBody = safeParse(body);
        } catch {
          setError("Invalid JSON in request body");
          setIsSending(false);
          return;
        }
      }

      const res = await fetch("/api/api-client/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          url,
          body: parsedBody,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        setError(result.error ?? "Request failed");
        setResponseStatus("Error");
        setResponseTime(result.elapsedMs ?? null);
        setIsSending(false);
        return;
      }

      setResponseTime(result.elapsedMs ?? null);
      setResponseStatus(`${result.status} ${result.statusText}`);
      setResponseBody(result.body || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setResponseStatus("Error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-4 text-sm text-text-light">
      {/* 상단 헤더 */}
      <section className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-default">API Client</h1>
          <p className="text-xs text-text-soft">
            VS Code 스타일 HTTP 클라이언트. 실제 API 요청을 보내고 응답을 확인할
            수 있습니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1 rounded border border-border-light bg-bg-default px-2 py-1 text-xs hover:bg-bg-hover"
          >
            <Save size={12} />
            Save Request
          </button>
        </div>
      </section>

      {/* 메인 레이아웃: 좌측 요청 리스트 / 우측 에디터+응답 */}
      <section className="flex flex-1 min-h-[320px] gap-4">
        {/* 좌측: Saved Requests */}
        <aside className="w-1/3 border border-border-default rounded bg-bg-dark flex flex-col overflow-hidden">
          <div className="px-3 py-2 text-xs bg-bg-default border-b border-border-default flex items-center justify-between">
            <span className="text-text-soft">REQUESTS</span>
            <span className="text-text-deep text-[11px]">
              {savedRequests.length} saved
            </span>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar">
            {savedRequests.length === 0 ? (
              <div className="p-3 text-xs text-text-deep">
                No saved requests. Create and save one from the editor.
              </div>
            ) : (
              <ul className="text-xs">
                {savedRequests.map((req) => {
                  const active = selectedId === req.id;
                  return (
                    <li
                      key={req.id}
                      className={`flex items-center justify-between gap-2 px-3 py-2 border-b border-border-default last:border-b-0 cursor-pointer hover:bg-bg-default ${
                        active ? "bg-deepblue/40" : ""
                      }`}
                      onClick={() => handleSelectRequest(req)}
                    >
                      <div className="flex flex-col">
                        <span className="font-mono text-[11px] text-sub_point">
                          {req.method}
                        </span>
                        <span className="truncate text-text-light">
                          {req.url}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="text-text-deep hover:text-error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(req.id);
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        {/* 우측: 요청 편집 + 응답 */}
        <div className="flex-1 flex flex-col gap-4">
          {/* 요청 편집 영역 */}
          <div className="border border-border-default rounded bg-bg-dark">
            <div className="px-3 py-2 text-xs bg-bg-default border-b border-border-default flex items-center justify-between">
              <span className="text-text-soft">REQUEST</span>
              <span className="flex items-center gap-1 text-text-deep text-[11px]">
                <Globe size={12} />
                HTTP
              </span>
            </div>

            {/* Method + URL + Send 버튼 */}
            <div className="flex items-center gap-2 border-b border-border-default px-3 py-2">
              <div className="relative">
                <select
                  className="appearance-none bg-bg-default border border-border-light rounded px-2 py-1 pr-6 text-xs outline-none text-text-light"
                  value={method}
                  onChange={(e) => setMethod(e.target.value as HttpMethod)}
                >
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                  <option>DELETE</option>
                </select>
                <ChevronDown
                  size={12}
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-text-soft"
                />
              </div>

              <input
                className="flex-1 bg-bg-dark border border-border-light rounded px-2 py-1 text-xs outline-none text-text-light placeholder:text-text-deep"
                placeholder="https://api.example.com/resource"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />

              <button
                type="button"
                onClick={handleSend}
                disabled={isSending}
                className="inline-flex items-center gap-1 rounded bg-darkblue px-3 py-1 text-xs font-semibold hover:bg-semiblue disabled:opacity-60"
              >
                {isSending ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Play size={12} />
                )}
                Send
              </button>
            </div>

            {/* Body 입력 */}
            <div className="p-3 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-text-soft">Request Body</span>
                <span className="text-[11px] text-text-deep">
                  {method === "GET" || method === "DELETE"
                    ? "GET/DELETE 요청은 보통 body를 사용하지 않습니다."
                    : "JSON 형식"}
                </span>
              </div>
              <textarea
                className="mt-1 h-32 w-full resize-none rounded border border-border-light bg-bg-night px-2 py-1 font-mono text-[11px] outline-none text-text-light"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                disabled={method === "GET" || method === "DELETE"}
              />
            </div>
          </div>

          {/* 응답 영역 */}
          <div className="flex-1 border border-border-default rounded bg-bg-dark flex flex-col overflow-hidden">
            <div className="px-3 py-2 text-xs bg-bg-default border-b border-border-default flex items-center justify-between">
              <span className="text-text-soft">RESPONSE</span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-text-soft">
                  Status:{" "}
                  <span
                    className={
                      responseStatus?.startsWith("2")
                        ? "text-point"
                        : responseStatus && !error
                        ? "text-warn"
                        : error
                        ? "text-error"
                        : "text-text-deep"
                    }
                  >
                    {responseStatus ?? "--"}
                  </span>
                </span>
                <span className="text-text-soft">
                  Time:{" "}
                  <span className="text-text-light">
                    {responseTime != null ? `${responseTime} ms` : "--"}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-3">
              {error ? (
                <div className="bg-bg-night border border-error/50 rounded p-3 text-xs text-error">
                  <div className="font-semibold mb-1">Error</div>
                  <div>{error}</div>
                </div>
              ) : responseBody ? (
                <pre className="bg-bg-night border border-border-default rounded p-2 text-[11px] whitespace-pre-wrap font-mono text-text-light">
                  {responseBody}
                </pre>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-text-deep">
                  Send a request to see the response here.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/** JSON parse 실패해도 죽지 않게 안전하게 */
function safeParse(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}
