export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TopicEntry = {
  name: string;
  partitions: number;
  replicationFactor: number;
  messageInPerSec: number;
  messageOutPerSec: number;
  lag: number;
  sizeGB: number;
  updatedAt: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

const g = globalThis as unknown as {
  __mockTopics?: TopicEntry[];
  __mockTopicsTimer?: NodeJS.Timeout;
};

function seedTopics(): TopicEntry[] {
  const now = new Date().toISOString();
  const base = [
    "orders",
    "payments",
    "users",
    "logs",
    "metrics",
    "notifications",
    "analytics",
  ];

  return base.map((name) => ({
    name,
    partitions: 6 + Math.floor(Math.random() * 6),
    replicationFactor: 2,
    messageInPerSec: 50 + Math.floor(Math.random() * 200),
    messageOutPerSec: 40 + Math.floor(Math.random() * 200),
    lag: Math.floor(Math.random() * 500),
    sizeGB: 5 + Math.floor(Math.random() * 50),
    updatedAt: now,
  }));
}

if (!g.__mockTopics) g.__mockTopics = seedTopics();

if (!g.__mockTopicsTimer) {
  g.__mockTopicsTimer = setInterval(() => {
    const wobble = (v: number, range: number, min = 0) =>
      Math.max(min, Math.round(v + (Math.random() - 0.5) * range));

    g.__mockTopics!.forEach((t) => {
      t.messageInPerSec = wobble(t.messageInPerSec, 50, 0);
      t.messageOutPerSec = wobble(t.messageOutPerSec, 50, 0);
      t.lag = wobble(t.lag, 120, 0);
      t.sizeGB = wobble(t.sizeGB, 2, 1);
      t.updatedAt = new Date().toISOString();
    });
  }, 5000);
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// GET /api/topics?name=orders
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (name) {
      const topic = g.__mockTopics!.find((t) => t.name === name);
      if (!topic) {
        return new Response(
          JSON.stringify({ success: false, error: "Topic not found" }),
          { status: 404, headers: corsHeaders }
        );
      }

      return new Response(JSON.stringify({ success: true, data: topic }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: g.__mockTopics!,
        count: g.__mockTopics!.length,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, error: "Failed to fetch topics" }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/topics (토픽 추가)
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

    const exists = g.__mockTopics!.some((t) => t.name === name);
    if (exists) {
      return new Response(
        JSON.stringify({ success: false, error: "Topic already exists" }),
        { status: 409, headers: corsHeaders }
      );
    }

    const newTopic: TopicEntry = {
      name,
      partitions: body.partitions ?? 6,
      replicationFactor: body.replicationFactor ?? 2,
      messageInPerSec: body.messageInPerSec ?? 0,
      messageOutPerSec: body.messageOutPerSec ?? 0,
      lag: body.lag ?? 0,
      sizeGB: body.sizeGB ?? 1,
      updatedAt: new Date().toISOString(),
    };

    g.__mockTopics!.push(newTopic);

    return new Response(JSON.stringify({ success: true, data: newTopic }), {
      status: 201,
      headers: corsHeaders,
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, error: "Failed to create topic" }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE /api/topics (전체 초기화)
export async function DELETE() {
  try {
    const count = g.__mockTopics!.length;
    g.__mockTopics = seedTopics();

    return new Response(
      JSON.stringify({ success: true, message: `Reset ${count} topics` }),
      { status: 200, headers: corsHeaders }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, error: "Failed to reset topics" }),
      { status: 500, headers: corsHeaders }
    );
  }
}
