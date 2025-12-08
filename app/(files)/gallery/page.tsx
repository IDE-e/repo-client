"use client";

import { useState } from "react";
import { Settings2, Square, SquareCheck, ArrowRight } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost";

export default function ComponentGalleryPage() {
  const [buttonVariant, setButtonVariant] = useState<Variant>("primary");

  const buttonClass = (variant: Variant) => {
    switch (variant) {
      case "primary":
        return "bg-darkblue hover:bg-semiblue text-white border border-darkblue";
      case "secondary":
        return "bg-bg-default hover:bg-bg-hover text-text-light border border-border-light";
      case "ghost":
      default:
        return "bg-transparent hover:bg-bg-hover text-text-light border border-transparent";
    }
  };

  return (
    <div className="flex h-full flex-col gap-6 text-sm text-text-light">
      {/* 상단 헤더 */}
      <section className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-default">
            UI Component Gallery
          </h1>
          <p className="text-xs text-text-soft">
            VS Code 스타일 레이아웃 안에서 공통 UI 컴포넌트들을 미리 보고, 코드
            스니펫까지 함께 확인할 수 있는 갤러리입니다.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-text-soft">
          <Settings2 size={14} />
          <span>Design System · v0.1.0</span>
        </div>
      </section>

      {/* 필터 / 카테고리 (형식용) */}
      <section className="flex items-center gap-2 text-xs">
        <span className="text-text-soft">Categories:</span>
        <div className="flex gap-1">
          <span className="px-2 py-0.5 rounded-full bg-deepblue text-white">
            All
          </span>
          <span className="px-2 py-0.5 rounded-full bg-bg-default text-text-soft">
            Buttons
          </span>
          <span className="px-2 py-0.5 rounded-full bg-bg-default text-text-soft">
            Badges
          </span>
          <span className="px-2 py-0.5 rounded-full bg-bg-default text-text-soft">
            Cards
          </span>
        </div>
      </section>

      {/* 컴포넌트 카드 그리드 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Button Component */}
        <div className="border border-border-default rounded bg-bg-dark flex flex-col overflow-hidden">
          <div className="px-3 py-2 text-xs bg-bg-default border-b border-border-default flex items-center justify-between">
            <span className="text-text-soft">Button</span>
            <span className="text-text-deep text-[11px]">
              components/ui/Button
            </span>
          </div>

          <div className="p-3 space-y-3">
            {/* 설명 */}
            <p className="text-xs text-text-soft">
              액션을 트리거하는 기본 버튼 컴포넌트입니다. 상태와 variant에 따라
              스타일이 달라집니다.
            </p>

            {/* Variant 선택 */}
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-text-soft">Variant:</span>
              <div className="flex gap-1">
                {(["primary", "secondary", "ghost"] as Variant[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setButtonVariant(v)}
                    className={`px-2 py-0.5 rounded border text-xs ${
                      buttonVariant === v
                        ? "bg-deepblue text-white border-darkblue"
                        : "bg-bg-default text-text-soft border-border-light hover:bg-bg-hover"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="border border-dashed border-border-light rounded p-4 bg-bg-night flex items-center justify-center gap-3">
              <button
                type="button"
                className={`inline-flex items-center gap-1 rounded px-3 py-1 text-xs font-semibold ${buttonClass(
                  buttonVariant
                )}`}
              >
                Click Me
                <ArrowRight size={12} />
              </button>
              <button
                type="button"
                className={`inline-flex items-center gap-1 rounded px-3 py-1 text-xs ${buttonClass(
                  buttonVariant
                )} opacity-60 cursor-not-allowed`}
              >
                Disabled
              </button>
            </div>

            {/* 코드 스니펫 */}
            <div className="text-[11px]">
              <div className="mb-1 text-text-soft">Usage</div>
              <pre className="bg-bg-night border border-border-default rounded p-2 whitespace-pre-wrap font-mono">
                {`<Button variant="${buttonVariant}">
  Click Me
</Button>`}
              </pre>
            </div>
          </div>
        </div>

        {/* Badge / Tag Component */}
        <div className="border border-border-default rounded bg-bg-dark flex flex-col overflow-hidden">
          <div className="px-3 py-2 text-xs bg-bg-default border-b border-border-default flex items-center justify-between">
            <span className="text-text-soft">Status Badge</span>
            <span className="text-text-deep text-[11px]">
              components/ui/Badge
            </span>
          </div>

          <div className="p-3 space-y-3">
            <p className="text-xs text-text-soft">
              상태나 타입을 간단히 표시하는 배지 컴포넌트입니다. 로그 레벨,
              태그, 진행 상태 등을 표현할 때 유용합니다.
            </p>

            <div className="border border-dashed border-border-light rounded p-4 bg-bg-night flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-[#12354a] text-[#4fc1ff] border border-[#1e4e6b]">
                <SquareCheck size={11} />
                ACTIVE
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-[#4a3a1a] text-warning border border-[#8c6f2a]">
                <AlertDot /> WARNING
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-[#5a1e1e] text-error border border-[#8b2e2e]">
                <Square size={11} />
                ERROR
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-bg-default text-text-soft border border-border-light">
                <Square size={11} />
                DRAFT
              </span>
            </div>

            <div className="text-[11px]">
              <div className="mb-1 text-text-soft">Usage</div>
              <pre className="bg-bg-night border border-border-default rounded p-2 whitespace-pre-wrap font-mono">
                {`<Badge variant="info">ACTIVE</Badge>
<Badge variant="warning">WARNING</Badge>
<Badge variant="error">ERROR</Badge>`}
              </pre>
            </div>
          </div>
        </div>

        {/* Info Card Component */}
        <div className="border border-border-default rounded bg-bg-dark flex flex-col overflow-hidden md:col-span-2">
          <div className="px-3 py-2 text-xs bg-bg-default border-b border-border-default flex items-center justify-between">
            <span className="text-text-soft">Info Card</span>
            <span className="text-text-deep text-[11px]">
              components/ui/InfoCard
            </span>
          </div>

          <div className="p-3 space-y-3">
            <p className="text-xs text-text-soft">
              통계, 상태, 설명 등을 간단히 보여주는 카드 컴포넌트입니다.
              대시보드 위젯, 설정 안내 등에 활용할 수 있습니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <InfoCard
                title="Requests / min"
                value="1,248"
                hint="+12.4% vs last hour"
                tone="info"
              />
              <InfoCard
                title="Error Rate"
                value="0.37%"
                hint="Within SLO (1%)"
                tone="success"
              />
              <InfoCard
                title="Queue Length"
                value="182"
                hint="Check worker scale"
                tone="warning"
              />
            </div>

            <div className="text-[11px]">
              <div className="mb-1 text-text-soft">Usage</div>
              <pre className="bg-bg-night border border-border-default rounded p-2 whitespace-pre-wrap font-mono">
                {`<InfoCard
  title="Requests / min"
  value="1,248"
  hint="+12.4% vs last hour"
  tone="info"
/>`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/** 작은 헬퍼 컴포넌트들 */

function AlertDot() {
  return <span className="inline-block w-2 h-2 rounded-full bg-warning" />;
}

type InfoCardProps = {
  title: string;
  value: string;
  hint?: string;
  tone?: "info" | "success" | "warning";
};

function InfoCard({ title, value, hint, tone = "info" }: InfoCardProps) {
  const toneClass =
    tone === "success"
      ? "border-[#1e5e3b] bg-[#0f2f23]"
      : tone === "warning"
      ? "border-[#8c6f2a] bg-[#4a3a1a]"
      : "border-[#1e4e6b] bg-[#12354a]";

  return (
    <div
      className={`rounded border px-3 py-2 flex flex-col gap-1 ${toneClass}`}
    >
      <div className="text-[11px] text-[#c4c4c4]">{title}</div>
      <div className="text-lg font-semibold text-[#f5f5f5]">{value}</div>
      {hint && <div className="text-[11px] text-text-light/80">{hint}</div>}
    </div>
  );
}
