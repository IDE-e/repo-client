export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ServiceStatus = "UP" | "DEGRADED" | "DOWN";

type ServiceHealth = {
  name: string;
  status: ServiceStatus;
  latencyMs: number;
  errorRate: number; // %
  updatedAt: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

const g = globalThis as unknown as {
  __mockHealth?: ServiceHealth[];
  __mockHealthTimer?: NodeJS.Timeout;
};

function seedHealth(): ServiceHealth[] {
  const now = new Date().toISOString();
  const names = ["api", "auth", "worker", "db", "cache", "gateway"];
  return names.map((name) => ({
    name,
    status: "UP",
    latencyMs: 20 + Math.floor(Math.random() * 60),
    errorRate: parseFloat((Math.random() * 0.5).toFixed(2)),
    updatedAt: now,
  }));
}

if (!g.__mockHealth) g.__mockHealth = seedHealth();

if (!g.__mockHealthTimer) {
  g.__mockHealthTimer = setInterval(() => {
    g.__mockHealth!.forEach((s) => {
      s.latencyMs = Math.max(
        1,
        Math.round(s.latencyMs + (Math.random() - 0.5) * 30)
      );
      s.errorRate = parseFloat(
        Math.max(
          0,
          Math.min(5, s.errorRate + (Math.random() - 0.5) * 0.4)
        ).toFixed(2)
      );

      if (s.errorRate > 2 || s.latencyMs > 200) s.status = "DEGRADED";
      else s.status = "UP";

      if (Math.random() < 0.01) s.status = "DOWN";

      s.updatedAt = new Date().toISOString();
    });
  }, 4000);
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  try {
    return new Response(
      JSON.stringify({
        success: true,
        data: g.__mockHealth,
        count: g.__mockHealth!.length,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, error: "Failed to fetch health" }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = body.name;

    if (!name) {
      return new Response(
        JSON.stringify({ success: false, error: "name is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const target = g.__mockHealth!.find((s) => s.name === name);

    if (!target) {
      const newService: ServiceHealth = {
        name,
        status: body.status ?? "UP",
        latencyMs: body.latencyMs ?? 0,
        errorRate: body.errorRate ?? 0,
        updatedAt: new Date().toISOString(),
      };
      g.__mockHealth!.push(newService);

      return new Response(JSON.stringify({ success: true, data: newService }), {
        status: 201,
        headers: corsHeaders,
      });
    }

    target.status = body.status ?? target.status;
    target.latencyMs = body.latencyMs ?? target.latencyMs;
    target.errorRate = body.errorRate ?? target.errorRate;
    target.updatedAt = new Date().toISOString();

    return new Response(JSON.stringify({ success: true, data: target }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, error: "Failed to update health" }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE() {
  try {
    const count = g.__mockHealth!.length;
    g.__mockHealth = seedHealth();

    return new Response(
      JSON.stringify({ success: true, message: `Reset ${count} services` }),
      { status: 200, headers: corsHeaders }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, error: "Failed to reset health" }),
      { status: 500, headers: corsHeaders }
    );
  }
}
