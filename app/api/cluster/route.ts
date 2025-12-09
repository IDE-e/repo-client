export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ClusterSummary = {
  clusterName: string;
  status: "HEALTHY" | "DEGRADED" | "DOWN";
  brokers: number;
  topics: number;
  partitions: number;
  underReplicated: number;
  messageInPerSec: number;
  messageOutPerSec: number;
  storageUsedGB: number;
  storageTotalGB: number;
  updatedAt: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

const g = globalThis as unknown as {
  __mockCluster?: ClusterSummary;
  __mockClusterTimer?: NodeJS.Timeout;
};

function seedCluster(): ClusterSummary {
  return {
    clusterName: "local-kafka",
    status: "HEALTHY",
    brokers: 3,
    topics: 18,
    partitions: 96,
    underReplicated: 0,
    messageInPerSec: 1200,
    messageOutPerSec: 1180,
    storageUsedGB: 320,
    storageTotalGB: 1024,
    updatedAt: new Date().toISOString(),
  };
}

if (!g.__mockCluster) {
  g.__mockCluster = seedCluster();
}

// dev에서 interval 중복 최소화
if (!g.__mockClusterTimer) {
  g.__mockClusterTimer = setInterval(() => {
    const c = g.__mockCluster!;
    // 작은 랜덤 워블
    const wobble = (v: number, range: number, min = 0) =>
      Math.max(min, Math.round(v + (Math.random() - 0.5) * range));

    c.messageInPerSec = wobble(c.messageInPerSec, 200, 100);
    c.messageOutPerSec = wobble(c.messageOutPerSec, 200, 100);
    c.storageUsedGB = Math.min(
      c.storageTotalGB,
      wobble(c.storageUsedGB, 10, 1)
    );

    // 상태는 underReplicated 기준으로 간단히 결정
    const roll = Math.random();
    if (roll < 0.05) c.underReplicated = 1;
    else if (roll < 0.08) c.underReplicated = 2;
    else c.underReplicated = 0;

    c.status =
      c.underReplicated === 0
        ? "HEALTHY"
        : c.underReplicated <= 1
        ? "DEGRADED"
        : "DOWN";

    c.updatedAt = new Date().toISOString();
  }, 5000);
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// GET /api/cluster
export async function GET() {
  try {
    return new Response(
      JSON.stringify({ success: true, data: g.__mockCluster }),
      { status: 200, headers: corsHeaders }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch cluster summary",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/cluster (부분 업데이트)
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    g.__mockCluster = {
      ...g.__mockCluster!,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify({ success: true, data: g.__mockCluster }),
      { status: 200, headers: corsHeaders }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to update cluster summary",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}
