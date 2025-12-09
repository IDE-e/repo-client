// app/api/metrics/route.ts

type MetricDataPoint = {
  timestamp: number;
  value: number;
};

type MetricType = "requests" | "errors" | "db";

// 각 metric별로 최근 20개의 데이터 포인트 저장
const metricsHistory: Record<MetricType, MetricDataPoint[]> = {
  requests: [],
  errors: [],
  db: [],
};

// 초기 데이터 생성 (서버 시작 시 한 번만)
function initializeMetrics() {
  const now = Date.now();

  // 최근 10분 데이터 생성
  for (let i = 20; i >= 0; i--) {
    const timestamp = now - i * 30000; // 30초 간격

    metricsHistory.requests.push({
      timestamp,
      value: Math.floor(100 + Math.random() * 50),
    });

    metricsHistory.errors.push({
      timestamp,
      value: parseFloat((Math.random() * 2).toFixed(2)),
    });

    metricsHistory.db.push({
      timestamp,
      value: Math.floor(350 + Math.random() * 200),
    });
  }
}

// 서버 시작 시 초기화 (한 번만)
if (metricsHistory.requests.length === 0) {
  initializeMetrics();
}

// 새로운 데이터 포인트 생성
function generateNewDataPoint(type: MetricType): MetricDataPoint {
  const now = Date.now();
  let value: number;

  // 이전 값을 기반으로 자연스러운 변화 생성
  const history = metricsHistory[type];
  const lastValue = history.length > 0 ? history[history.length - 1].value : 0;

  switch (type) {
    case "requests":
      // 100~200 사이에서 ±20 범위로 변동
      value = Math.max(
        80,
        Math.min(200, lastValue + (Math.random() - 0.5) * 40)
      );
      value = Math.floor(value);
      break;

    case "errors":
      // 0~3% 사이에서 ±0.5 범위로 변동
      value = Math.max(0, Math.min(3, lastValue + (Math.random() - 0.5) * 1));
      value = parseFloat(value.toFixed(2));
      break;

    case "db":
      // 300~600 사이에서 ±50 범위로 변동
      value = Math.max(
        250,
        Math.min(650, lastValue + (Math.random() - 0.5) * 100)
      );
      value = Math.floor(value);
      break;

    default:
      value = 0;
  }

  return { timestamp: now, value };
}

// 주기적으로 새 데이터 추가 (10초마다)
setInterval(() => {
  (["requests", "errors", "db"] as MetricType[]).forEach((type) => {
    const newPoint = generateNewDataPoint(type);
    metricsHistory[type].push(newPoint);

    // 최대 50개까지만 유지 (약 25분)
    if (metricsHistory[type].length > 50) {
      metricsHistory[type].shift();
    }
  });
}, 10000); // 10초마다 업데이트

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// 타입 가드 함수
function isValidMetricType(type: string | null): type is MetricType {
  return type !== null && ["requests", "errors", "db"].includes(type);
}

// GET: 특정 metric 데이터 가져오기
export async function GET(request: Request) {
  console.log("📊 GET /api/metrics called");

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!isValidMetricType(type)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid metric type. Use: requests, errors, or db",
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    const data = metricsHistory[type];

    console.log(`✅ Returning ${data.length} data points for ${type}`);

    return new Response(
      JSON.stringify({
        success: true,
        type,
        data,
        count: data.length,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("❌ GET /api/metrics error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to fetch metrics" }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST: 수동으로 데이터 포인트 추가 (테스트용)
export async function POST(request: Request) {
  console.log("🟢 POST /api/metrics called");

  try {
    const body = await request.json();
    const { type, value } = body;

    if (!isValidMetricType(type)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid metric type",
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    const newPoint: MetricDataPoint = {
      timestamp: Date.now(),
      value: value ?? generateNewDataPoint(type).value,
    };

    metricsHistory[type].push(newPoint);

    // 최대 50개까지만 유지
    if (metricsHistory[type].length > 50) {
      metricsHistory[type].shift();
    }

    console.log(`✅ Added data point to ${type}:`, newPoint);

    return new Response(
      JSON.stringify({
        success: true,
        type,
        data: newPoint,
      }),
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("❌ POST /api/metrics error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to add metric" }),
      { status: 500, headers: corsHeaders }
    );
  }
}
