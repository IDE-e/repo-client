import { corsHeaders } from "@/app/types/header";
import { AlertEntry, AlertLevel } from "@/app/types/type";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---- global singleton store (dev-friendly) ----
const g = globalThis as unknown as {
  __mockAlerts?: AlertEntry[];
};

if (!g.__mockAlerts) {
  g.__mockAlerts = [];
}

const alerts = g.__mockAlerts;

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// GET /api/alerts?level=WARN&ack=false
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get("level") as AlertLevel | null;
    const ack = searchParams.get("ack"); // "true" | "false" | null

    let data = alerts;

    if (level) data = data.filter((a) => a.level === level);
    if (ack === "true") data = data.filter((a) => a.acknowledged);
    if (ack === "false") data = data.filter((a) => !a.acknowledged);

    return new Response(
      JSON.stringify({ success: true, data, count: data.length }),
      { status: 200, headers: corsHeaders }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, error: "Failed to fetch alerts" }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/alerts
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const newAlert: AlertEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString("ko-KR"),
      level: body.level ?? "INFO",
      title: body.title ?? "Alert",
      message: body.message ?? "No details provided",
      source: body.source,
      acknowledged: false,
      createdAt: new Date().toISOString(),
    };

    alerts.push(newAlert);

    return new Response(JSON.stringify({ success: true, data: newAlert }), {
      status: 201,
      headers: corsHeaders,
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, error: "Failed to create alert" }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// PATCH /api/alerts  { id, acknowledged: true }
export async function PATCH(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const id = Number(body.id);

    const target = alerts.find((a) => a.id === id);
    if (!target) {
      return new Response(
        JSON.stringify({ success: false, error: "Alert not found" }),
        { status: 404, headers: corsHeaders }
      );
    }

    if (typeof body.acknowledged === "boolean") {
      target.acknowledged = body.acknowledged;
    }

    return new Response(JSON.stringify({ success: true, data: target }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, error: "Failed to update alert" }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE /api/alerts (전체 삭제)
export async function DELETE() {
  try {
    const count = alerts.length;
    alerts.splice(0, alerts.length);

    return new Response(
      JSON.stringify({ success: true, message: `Cleared ${count} alerts` }),
      { status: 200, headers: corsHeaders }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, error: "Failed to clear alerts" }),
      { status: 500, headers: corsHeaders }
    );
  }
}
