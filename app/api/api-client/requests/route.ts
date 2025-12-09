export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type SavedRequest = {
  id: number;
  name: string;
  method: HttpMethod;
  url: string;
};

// 초기 시드(너 UI에 있던 mock 그대로)
const SEED: SavedRequest[] = [
  {
    id: 1,
    name: "Get Users",
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/users",
  },
  {
    id: 2,
    name: "Get Todos",
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/todos",
  },
  {
    id: 3,
    name: "Create Post",
    method: "POST",
    url: "https://jsonplaceholder.typicode.com/posts",
  },
];

// dev/HMR에서도 저장이 유지되게 global singleton
const g = globalThis as unknown as {
  __apiClientSavedRequests?: SavedRequest[];
};

if (!g.__apiClientSavedRequests) {
  g.__apiClientSavedRequests = [...SEED];
}

const store = () => g.__apiClientSavedRequests!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// GET /api/api-client/requests
export async function GET() {
  try {
    const data = store();
    return new Response(
      JSON.stringify({ success: true, data, count: data.length }),
      { status: 200, headers: corsHeaders }
    );
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch saved requests",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/api-client/requests
// body: { name?, method, url }
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const method = body.method as HttpMethod | undefined;
    const url = body.url as string | undefined;

    if (!method || !["GET", "POST", "PUT", "DELETE"].includes(method)) {
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

    // URL 유효성 체크(너무 빡세게 막진 않음)
    let parsed: URL | null = null;
    try {
      parsed = new URL(url);
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: "URL parse failed" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const name =
      typeof body.name === "string" && body.name.trim()
        ? body.name.trim()
        : `${method} ${parsed.pathname || "/"}`;

    const newReq: SavedRequest = {
      id: Date.now(),
      name,
      method,
      url,
    };

    store().unshift(newReq);

    return new Response(JSON.stringify({ success: true, data: newReq }), {
      status: 201,
      headers: corsHeaders,
    });
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: "Failed to save request" }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE /api/api-client/requests?id=123
// id 없으면 전체 삭제
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");

    const list = store();

    if (idParam) {
      const id = Number(idParam);
      const idx = list.findIndex((r) => r.id === id);

      if (idx === -1) {
        return new Response(
          JSON.stringify({ success: false, error: "Request not found" }),
          { status: 404, headers: corsHeaders }
        );
      }

      const removed = list.splice(idx, 1)[0];

      return new Response(JSON.stringify({ success: true, data: removed }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    const count = list.length;
    g.__apiClientSavedRequests = [];

    return new Response(
      JSON.stringify({ success: true, message: `Cleared ${count} requests` }),
      { status: 200, headers: corsHeaders }
    );
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: "Failed to delete request(s)" }),
      { status: 500, headers: corsHeaders }
    );
  }
}
