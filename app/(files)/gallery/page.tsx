"use client";

import { useMemo, useState } from "react";
import {
  Settings2,
  Square,
  SquareCheck,
  ArrowRight,
  Type,
  ToggleLeft,
  CheckIcon,
} from "lucide-react";
import { CategoryId, Variant } from "@/app/types/type";

const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "buttons", label: "Buttons" },
  { id: "badges", label: "Badges" },
  { id: "cards", label: "Cards" },
  { id: "forms", label: "Forms" },
  { id: "checkbox", label: "Checkbox" },
];

export default function ComponentGalleryPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [buttonVariant, setButtonVariant] = useState<Variant>("primary");
  const [inputValue, setInputValue] = useState<string>("");
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [isChecked, setIsChecked] = useState<boolean>(false);

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

  const shouldShow = (cat: CategoryId) =>
    activeCategory === "all" || activeCategory === cat;

  // (옵션) 카테고리별 개수 표시를 원하면 확장 가능
  const categoryLabel = useMemo(() => {
    const map: Record<CategoryId, string> = {
      all: "All",
      buttons: "Buttons",
      badges: "Badges",
      cards: "Cards",
      forms: "Forms",
      checkbox: "Checkbox",
    };
    return map[activeCategory];
  }, [activeCategory]);

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
          <div className="mt-1 text-[10px] text-text-deep">
            Category: {categoryLabel}
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-text-soft">
          <Settings2 size={14} />
          <span>Design System · v0.1.0</span>
        </div>
      </section>

      {/* 필터 / 카테고리 */}
      <section className="flex items-center gap-2 text-xs">
        <span className="text-text-soft">Categories:</span>
        <div className="flex gap-1">
          {CATEGORIES.map((c) => {
            const active = activeCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.id)}
                className={`px-2 py-0.5 rounded-full border text-xs transition ${
                  active
                    ? "bg-deepblue text-white border-darkblue"
                    : "bg-bg-default text-text-soft border-border-light hover:bg-bg-hover"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 컴포넌트 카드 그리드 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ---------------- Buttons ---------------- */}
        {shouldShow("buttons") && (
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
                액션을 트리거하는 기본 버튼 컴포넌트입니다. 상태와 variant에
                따라 스타일이 달라집니다.
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
        )}

        {/* ---------------- Badges ---------------- */}
        {shouldShow("badges") && (
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
        )}

        {/* ---------------- Cards ---------------- */}
        {shouldShow("cards") && (
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
        )}

        {/* ---------------- Forms: Text Input ---------------- */}
        {shouldShow("forms") && (
          <div className="border border-border-default rounded bg-bg-dark flex flex-col overflow-hidden">
            <div className="px-3 py-2 text-xs bg-bg-default border-b border-border-default flex items-center justify-between">
              <span className="text-text-soft">Text Input</span>
              <span className="text-text-deep text-[11px]">
                components/ui/TextInput
              </span>
            </div>

            <div className="p-3 space-y-3">
              <p className="text-xs text-text-soft">
                검색, 설정 값 입력, 필터 등 기본 텍스트 입력 컴포넌트입니다.
                포커스/에러/헬퍼 텍스트 패턴을 확장하기 좋습니다.
              </p>

              <div className="border border-dashed border-border-light rounded p-4 bg-bg-night space-y-2">
                <label className="text-[11px] text-text-soft">Label</label>
                <div className="flex items-center gap-2 rounded border border-border-light bg-bg-dark px-2 py-1">
                  <Type size={12} className="text-text-deep" />
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type something..."
                    className="w-full bg-transparent text-xs outline-none text-text-light placeholder:text-text-deep"
                  />
                </div>
                <div className="text-[10px] text-text-deep">
                  Helper: value length {inputValue.length}
                </div>
              </div>

              <div className="text-[11px]">
                <div className="mb-1 text-text-soft">Usage</div>
                <pre className="bg-bg-night border border-border-default rounded p-2 whitespace-pre-wrap font-mono">
                  {`<TextInput
  label="Label"
  placeholder="Type something..."
  value={value}
  onChange={setValue}
/>`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- Forms: Switch Toggle ---------------- */}
        {shouldShow("forms") && (
          <div className="border border-border-default rounded bg-bg-dark flex flex-col overflow-hidden">
            <div className="px-3 py-2 text-xs bg-bg-default border-b border-border-default flex items-center justify-between">
              <span className="text-text-soft">Switch</span>
              <span className="text-text-deep text-[11px]">
                components/ui/Switch
              </span>
            </div>

            <div className="p-3 space-y-3">
              <p className="text-xs text-text-soft">
                설정 ON/OFF, 기능 토글에 쓰는 스위치 컴포넌트입니다. 상태를
                명확히 보여주는 UI라 대시보드/환경설정에 잘 어울립니다.
              </p>

              <div className="border border-dashed border-border-light rounded p-4 bg-bg-night flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ToggleLeft size={14} className="text-text-soft" />
                  <span className="text-xs">Enable live refresh</span>
                </div>

                <Switch checked={isEnabled} onChange={setIsEnabled} />
              </div>

              <div className="text-[11px]">
                <div className="mb-1 text-text-soft">Usage</div>
                <pre className="bg-bg-night border border-border-default rounded p-2 whitespace-pre-wrap font-mono">
                  {`<Switch
  checked={enabled}
  onChange={setEnabled}
/>`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- Forms: Checkbox ---------------- */}
        {shouldShow("checkbox") && (
          <div className="border border-border-default rounded bg-bg-dark flex flex-col overflow-hidden md:col-span-2">
            <div className="px-3 py-2 text-xs bg-bg-default border-b border-border-default flex items-center justify-between">
              <span className="text-text-soft">Checkbox</span>
              <span className="text-text-deep text-[11px]">
                components/ui/Checkbox
              </span>
            </div>

            <div className="p-3 space-y-3">
              <p className="text-xs text-text-soft">
                필터 조건, 약관 동의, 설정 옵션 선택 등에 쓰는 체크박스입니다.
                리스트/테이블 필터 UI에 붙이기 좋습니다.
              </p>

              <div className="border border-dashed border-border-light rounded p-4 bg-bg-night flex flex-wrap gap-3">
                <label className="flex items-center gap-2 text-xs">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span>Show only critical items</span>
                </label>

                <span className="text-[10px] text-text-deep">
                  Current: {isChecked ? "checked" : "unchecked"}
                </span>
              </div>

              <div className="text-[11px]">
                <div className="mb-1 text-text-soft">Usage</div>
                <pre className="bg-bg-night border border-border-default rounded p-2 whitespace-pre-wrap font-mono">
                  {`<Checkbox
  checked={checked}
  onChange={setChecked}
/>`}
                </pre>
              </div>
            </div>
          </div>
        )}
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

/** Switch (simple, design-system friendly) */
function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full border transition ${
        checked
          ? "bg-deepblue border-darkblue"
          : "bg-bg-default border-border-light"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
          checked ? "translate-x-4" : "translate-x-1"
        }`}
      />
    </button>
  );
}

/** Checkbox (minimal) */
function Checkbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`inline-flex h-4 w-4 items-center justify-center rounded border ${
        checked
          ? "bg-deepblue border-darkblue"
          : "bg-bg-dark border-border-light"
      }`}
      aria-pressed={checked}
      title="checkbox"
    >
      {checked && <CheckIcon size={10} className="text-white" />}
    </button>
  );
}
