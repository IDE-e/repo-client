export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Variant = "primary" | "secondary" | "ghost";

type GalleryPayload = {
  meta: {
    title: string;
    version: string;
    updatedAt: string;
  };
  categories: Array<{
    id: string;
    label: string;
    activeByDefault: boolean;
  }>;
  button: {
    description: string;
    variants: Variant[];
    usageTemplate: (variant: Variant) => string;
  };
  badge: {
    description: string;
    examples: Array<{
      label: string;
      tone: "info" | "warning" | "error" | "draft";
      icon: "check" | "dot" | "square";
    }>;
    usageSnippet: string;
  };
  infoCard: {
    description: string;
    examples: Array<{
      title: string;
      value: string;
      hint?: string;
      tone: "info" | "success" | "warning";
    }>;
    usageSnippet: string;
  };
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

// ---- dev-friendly global singleton store ----
const g = globalThis as unknown as {
  __mockComponentGallery?: Omit<GalleryPayload, "button"> & {
    button: Omit<GalleryPayload["button"], "usageTemplate">;
  };
};

function seedGallery() {
  const now = new Date().toISOString();

  g.__mockComponentGallery = {
    meta: {
      title: "UI Component Gallery",
      version: "v0.1.0",
      updatedAt: now,
    },
    categories: [
      { id: "all", label: "All", activeByDefault: true },
      { id: "buttons", label: "Buttons", activeByDefault: false },
      { id: "badges", label: "Badges", activeByDefault: false },
      { id: "cards", label: "Cards", activeByDefault: false },
    ],
    button: {
      description:
        "액션을 트리거하는 기본 버튼 컴포넌트입니다. 상태와 variant에 따라 스타일이 달라집니다.",
      variants: ["primary", "secondary", "ghost"],
    },
    badge: {
      description:
        "상태나 타입을 간단히 표시하는 배지 컴포넌트입니다. 로그 레벨, 태그, 진행 상태 등에 활용합니다.",
      examples: [
        { label: "ACTIVE", tone: "info", icon: "check" },
        { label: "WARNING", tone: "warning", icon: "dot" },
        { label: "ERROR", tone: "error", icon: "square" },
        { label: "DRAFT", tone: "draft", icon: "square" },
      ],
      usageSnippet: `<Badge variant="info">ACTIVE</Badge>
<Badge variant="warning">WARNING</Badge>
<Badge variant="error">ERROR</Badge>`,
    },
    infoCard: {
      description:
        "통계, 상태, 설명 등을 간단히 보여주는 카드 컴포넌트입니다. 대시보드 위젯, 설정 안내 등에 활용할 수 있습니다.",
      examples: [
        {
          title: "Requests / min",
          value: "1,248",
          hint: "+12.4% vs last hour",
          tone: "info",
        },
        {
          title: "Error Rate",
          value: "0.37%",
          hint: "Within SLO (1%)",
          tone: "success",
        },
        {
          title: "Queue Length",
          value: "182",
          hint: "Check worker scale",
          tone: "warning",
        },
      ],
      usageSnippet: `<InfoCard
  title="Requests / min"
  value="1,248"
  hint="+12.4% vs last hour"
  tone="info"
/>`,
    },
  };
}

if (!g.__mockComponentGallery) seedGallery();

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// GET /api/component-gallery
export async function GET() {
  try {
    const base = g.__mockComponentGallery!;

    const payload: GalleryPayload = {
      ...base,
      button: {
        ...base.button,
        usageTemplate: (variant) => `<Button variant="${variant}">
  Click Me
</Button>`,
      },
    };

    return new Response(JSON.stringify({ success: true, data: payload }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch component gallery",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// PATCH /api/component-gallery  { version?: "v0.1.1" }
export async function PATCH(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const base = g.__mockComponentGallery!;
    if (typeof body.version === "string") {
      base.meta.version = body.version;
    }

    base.meta.updatedAt = new Date().toISOString();

    return new Response(JSON.stringify({ success: true, data: base }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to update component gallery",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}
