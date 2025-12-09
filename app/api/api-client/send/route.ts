export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

function isValidMethod(m: any): m is HttpMethod {
  return ["GET", "POST", "PUT", "DELETE"].includes(m);
}

// POST /api/api-client/send
// body: { method, url, body? }
export async function POST(request: Request) {
  const start = Date.now();

  try {
    const payload = await request.json().catch(() => ({}));
    const method = payload.method;
    const url = payload.url;

    if (!isValidMethod(method)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid method" }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!url || typeof url !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid url" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // URL 기본 검증
    let target: URL;
    try {
      target = new URL(url);
      if (!["http:", "https:"].includes(target.protocol)) {
        throw new Error("Only http/https allowed");
      }
    } catch (e) {
      return new Response(
        JSON.stringify({ success: false, error: "URL parse failed" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    // POST/PUT만 body 사용
    if (method === "POST" || method === "PUT") {
      // payload.body는 object|string 모두 받을 수 있게
      if (payload.body !== undefined) {
        options.body =
          typeof payload.body === "string"
            ? payload.body
            : JSON.stringify(payload.body);
      }
    }

    // 간단 타임아웃
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    options.signal = controller.signal;

    const res = await fetch(target.toString(), options).finally(() =>
      clearTimeout(timer)
    );

    const contentType = res.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");

    let bodyText = "";
    try {
      if (isJson) {
        const json = await res.json();
        bodyText = JSON.stringify(json, null, 2);
      } else {
        bodyText = await res.text();
      }
    } catch {
      // 응답 파싱 실패해도 죽지 않게
      bodyText = "";
    }

    const elapsedMs = Date.now() - start;

    return new Response(
      JSON.stringify({
        success: true,
        status: res.status,
        statusText: res.statusText,
        contentType,
        isJson,
        body: bodyText,
        elapsedMs,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (e: any) {
    const elapsedMs = Date.now() - start;

    return new Response(
      JSON.stringify({
        success: false,
        status: 0,
        statusText: "Error",
        error: e?.name === "AbortError" ? "Request timeout" : "Request failed",
        elapsedMs,
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}
