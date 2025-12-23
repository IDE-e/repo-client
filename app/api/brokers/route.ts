import { corsHeaders } from "@/app/types/header";
import { BrokerEntry, BrokerStatus } from "@/app/types/type";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const g = globalThis as unknown as {
  __mockBrokers?: BrokerEntry[];
  __mockBrokersTimer?: NodeJS.Timeout;
};

function seedBrokers(): BrokerEntry[] {
  const now = new Date().toISOString();
  return [1, 2, 3].map((n) => ({
    id: n,
    host: `broker-${n}.local`,
    rack: "rack-a",
    status: "ONLINE",
    cpu: 20 + Math.floor(Math.random() * 20),
    memory: 30 + Math.floor(Math.random() * 20),
    disk: 40 + Math.floor(Math.random() * 20),
    networkIn: 10 + Math.floor(Math.random() * 10),
    networkOut: 10 + Math.floor(Math.random() * 10),
    updatedAt: now,
  }));
}

function wobbleList(list: BrokerEntry[]) {
  const wobble = (v: number, range: number, min = 0, max = 100) =>
    Math.max(min, Math.min(max, Math.round(v + (Math.random() - 0.5) * range)));

  list.forEach((b) => {
    b.cpu = wobble(b.cpu, 10);
    b.memory = wobble(b.memory, 8);
    b.disk = wobble(b.disk, 4);
    b.networkIn = Math.max(0, wobble(b.networkIn, 6, 0, 9999));
    b.networkOut = Math.max(0, wobble(b.networkOut, 6, 0, 9999));

    const r = Math.random();
    if (r < 0.03) b.status = "DEGRADED";
    else if (r < 0.035) b.status = "OFFLINE";
    else b.status = "ONLINE";

    b.updatedAt = new Date().toISOString();
  });
}

if (!g.__mockBrokers) g.__mockBrokers = seedBrokers();

if (!g.__mockBrokersTimer) {
  g.__mockBrokersTimer = setInterval(() => {
    const list = g.__mockBrokers!;
    wobbleList(list);
  }, 4000);
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// GET /api/brokers?status=ONLINE
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as BrokerStatus | null;

    const data = status
      ? g.__mockBrokers!.filter((b) => b.status === status)
      : g.__mockBrokers!;

    return new Response(
      JSON.stringify({ success: true, data, count: data.length }),
      { status: 200, headers: corsHeaders }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, error: "Failed to fetch brokers" }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/brokers (브로커 추가/테스트)
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const id = body.id ?? g.__mockBrokers!.length + 1;

    const newBroker: BrokerEntry = {
      id,
      host: body.host ?? `broker-${id}.local`,
      rack: body.rack,
      status: body.status ?? "ONLINE",
      cpu: body.cpu ?? 10,
      memory: body.memory ?? 20,
      disk: body.disk ?? 30,
      networkIn: body.networkIn ?? 5,
      networkOut: body.networkOut ?? 5,
      updatedAt: new Date().toISOString(),
    };

    g.__mockBrokers!.push(newBroker);

    return new Response(JSON.stringify({ success: true, data: newBroker }), {
      status: 201,
      headers: corsHeaders,
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, error: "Failed to create broker" }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE /api/brokers (전체 초기화)
export async function DELETE() {
  try {
    const count = g.__mockBrokers!.length;
    g.__mockBrokers = seedBrokers();

    return new Response(
      JSON.stringify({ success: true, message: `Reset ${count} brokers` }),
      { status: 200, headers: corsHeaders }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, error: "Failed to reset brokers" }),
      { status: 500, headers: corsHeaders }
    );
  }
}
