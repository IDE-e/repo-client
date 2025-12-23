import { corsHeaders } from "@/app/types/header";
import { LogEntry } from "@/app/types/type";

// 메모리에 임시로 로그 저장
let logs: LogEntry[] = [];

// OPTIONS 요청 핸들러 (CORS preflight)
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET 요청 핸들러
export async function GET(request: Request) {
  console.log("🔵 GET /api/logs called");

  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get("level");

    console.log("📊 Current logs count:", logs.length);
    console.log("📊 Filter level:", level);

    let filteredLogs = logs;

    if (level) {
      filteredLogs = logs.filter((log) => log.level === level);
    }

    const responseData = {
      success: true,
      data: filteredLogs,
      count: filteredLogs.length,
    };

    console.log("Sending response:", responseData);

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("❌ GET /api/logs error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to fetch logs" }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST 요청 핸들러
export async function POST(request: Request) {
  console.log("🟢 POST /api/logs called");

  try {
    const contentType = request.headers.get("content-type");
    console.log("📝 Content-Type:", contentType);

    let body: any = {};

    try {
      const text = await request.text();
      console.log("📄 Request body text:", text);

      if (text) {
        body = JSON.parse(text);
      }
    } catch (parseError) {
      console.error("⚠️ Failed to parse body:", parseError);
    }

    const newLog: LogEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString("ko-KR"),
      level: body.level || "INFO",
      message: body.message || "No message provided",
      createdAt: new Date().toISOString(),
    };

    logs.push(newLog);

    console.log("New log added:", newLog);
    console.log("📊 Total logs:", logs.length);

    const responseData = { success: true, data: newLog };

    return new Response(JSON.stringify(responseData), {
      status: 201,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("❌ POST /api/logs error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to create log" }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE 요청 핸들러
export async function DELETE() {
  console.log("🔴 DELETE /api/logs called");

  try {
    const count = logs.length;
    logs = [];

    console.log(`Cleared ${count} logs`);

    const responseData = {
      success: true,
      message: `Cleared ${count} logs`,
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("❌ DELETE /api/logs error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to clear logs" }),
      { status: 500, headers: corsHeaders }
    );
  }
}
