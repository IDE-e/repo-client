export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DiffPayload = {
  original: string;
  modified: string;
  language?: string; // optional hint for future use
  updatedAt: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

// ---- dev-friendly global singleton store ----
const g = globalThis as unknown as {
  __mockDiff?: DiffPayload;
};

function seedDiff(): DiffPayload {
  return {
    original: `
import React from "react";

export function Hello() {
  return <div>Hello world!</div>;
}
`.trimStart(),
    modified: `
import React from "react";

export function Hello({ name }) {
  return <div>Hello {name}</div>;
}
`.trimStart(),
    language: "typescript",
    updatedAt: new Date().toISOString(),
  };
}

if (!g.__mockDiff) {
  g.__mockDiff = seedDiff();
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// GET /api/diff
export async function GET() {
  try {
    return new Response(JSON.stringify({ success: true, data: g.__mockDiff }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: "Failed to fetch diff data" }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/diff  { original?, modified?, language? }
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const prev = g.__mockDiff ?? seedDiff();

    g.__mockDiff = {
      original:
        typeof body.original === "string" ? body.original : prev.original,
      modified:
        typeof body.modified === "string" ? body.modified : prev.modified,
      language:
        typeof body.language === "string" ? body.language : prev.language,
      updatedAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify({ success: true, data: g.__mockDiff }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: "Failed to update diff data" }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE /api/diff (reset to seed)
export async function DELETE() {
  try {
    g.__mockDiff = seedDiff();

    return new Response(JSON.stringify({ success: true, data: g.__mockDiff }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: "Failed to reset diff data" }),
      { status: 500, headers: corsHeaders }
    );
  }
}
