"use client";

import { ChevronRight } from "lucide-react";

const codeLines = [
  {
    no: 1,
    content: (
      <>
        <span className="text-lightblue">import</span>{" "}
        <span className="text-sub_point">&#123;</span>
        <span className="text-point"> Line </span>
        <span className="text-sub_point">&#125;</span>{" "}
        <span className="text-lightblue">from</span>{" "}
        <span className="text-sub_error">"react-chartjs-2"</span>;
      </>
    ),
  },
  {
    no: 2,
    content: (
      <>
        <span className="text-lightblue">import</span>{" "}
        <span className="text-sub_point">&#123;</span>
        <span className="text-point"> Chart </span>
        <span className="text-sub_point">&#125;</span>{" "}
        <span className="text-lightblue">from</span>{" "}
        <span className="text-sub_error">"chart.js"</span>;
      </>
    ),
  },
  {
    no: 3,
    content: <>&nbsp;</>,
  },
  {
    no: 4,
    content: (
      <>
        <span className="text-lightblue">type</span>{" "}
        <span className="text-point">ChartPoint</span> = &#123;{" "}
        <span className="text-sub_point">x</span>:{" "}
        <span className="text-point">number</span>;{" "}
        <span className="text-sub_point">y</span>:{" "}
        <span className="text-point">number</span>; &#125;;
      </>
    ),
  },
  {
    no: 5,
    content: <>&nbsp;</>,
  },
  {
    no: 6,
    content: (
      <>
        <span className="text-lightblue">const</span>{" "}
        <span className="text-sub_point">data</span> = &#123;
      </>
    ),
  },
  {
    no: 7,
    content: (
      <>
        &nbsp;&nbsp;<span className="text-sub_point">datasets</span>: [ &#123;
      </>
    ),
  },
  {
    no: 8,
    content: (
      <>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span className="text-sub_point">label</span>:{" "}
        <span className="text-sub_error">"Response Time"</span>,
      </>
    ),
  },
  {
    no: 9,
    content: (
      <>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span className="text-sub_point">data</span>: [
        <span className="text-sub_green">&#123; x: 0, y: 120 &#125;</span>,{" "}
        <span className="text-sub_green">&#123; x: 1, y: 98 &#125;</span>],
      </>
    ),
  },
  {
    no: 10,
    content: (
      <>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span className="text-sub_point">borderColor</span>:{" "}
        <span className="text-sub_error">"rgba(78, 201, 176, 1)"</span>,
      </>
    ),
  },
  {
    no: 11,
    content: (
      <>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span className="text-sub_point">tension</span>:{" "}
        <span className="text-sub_green">0.2</span>,
      </>
    ),
  },
  {
    no: 12,
    content: <>&nbsp;&nbsp;&#125;],</>,
  },
  {
    no: 13,
    content: <>&#125;;</>,
  },
  {
    no: 14,
    content: <>&nbsp;</>,
  },
  {
    no: 15,
    content: (
      <>
        <span className="text-lightblue">export</span>{" "}
        <span className="text-lightblue">default</span>{" "}
        <span className="text-lightblue">function</span>{" "}
        <span className="text-sub_warning">CustomChart</span>()
        {" {"}
      </>
    ),
  },
  {
    no: 16,
    content: (
      <>
        &nbsp;&nbsp;<span className="text-lightblue">return</span> (
      </>
    ),
  },
  {
    no: 17,
    content: (
      <>
        &nbsp;&nbsp;&nbsp;&nbsp;&lt;
        <span className="text-point">Line</span> data=
        <span className="text-sub_point">&#123;data&#125;</span> /&gt;
      </>
    ),
  },
  {
    no: 18,
    content: <>&nbsp;&nbsp;);</>,
  },
  {
    no: 19,
    content: <>{"}"}</>,
  },
];

export default function VSCodeLikeEditorPage() {
  return (
    <>
      <div className="flex flex-col h-full gap-4 text-sm text-text-light">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 text-xs text-text-soft">
          <span>src</span>
          <ChevronRight size={12} className="text-text-deep" />
          <span>components</span>
          <ChevronRight size={12} className="text-text-deep" />
          <span className="text-text-light">CustomChart.tsx</span>
        </div>

        {/* Editor + Terminal 영역 */}
        <div className="flex-1 flex flex-col gap-4">
          {/* 코드 에디터 영역 */}
          <div className="flex-1 border border-border-default rounded bg-bg-dark overflow-hidden flex flex-col">
            {/* 상단: 파일 탭 느낌 (Editor 안의 탭) */}
            <div className="flex items-center h-8 bg-bg-default border-b border-border-default text-xs">
              <div className="flex items-center gap-2 px-3 py-1 bg-bg-dark border-r border-border-default">
                <span className="text-sub_point">CustomChart.tsx</span>
                <span className="text-text-deep">●</span>
              </div>
              <div className="flex-1" />
            </div>

            {/* 코드 본문 */}
            <div className="flex-1 overflow-auto font-mono text-[12px] leading-5">
              <div className="flex">
                {/* 왼쪽 라인 넘버 영역 */}
                <div className="select-none bg-bg-dark border-r border-border-default text-right pr-3 pl-2 text-text-deep">
                  {codeLines.map((line) => (
                    <div key={line.no} className="h-5">
                      {line.no}
                    </div>
                  ))}
                </div>

                {/* 코드 텍스트 영역 */}
                <div className="flex-1 pl-3 py-1">
                  {codeLines.map((line) => (
                    <div key={line.no} className="h-5 whitespace-pre">
                      {line.content}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 하단 TERMINAL 패널 */}
          <div className="h-40 border border-border-default rounded bg-bg-dark overflow-hidden flex flex-col">
            {/* 탭 바 */}
            <div className="flex items-center h-7 bg-bg-default border-b border-border-default text-xs">
              <div className="px-3 py-1 text-text-soft border-r border-border-default">
                TERMINAL
              </div>
              <div className="px-3 py-1 text-text-deep">PROBLEMS</div>
              <div className="px-3 py-1 text-text-deep">OUTPUT</div>
              <div className="flex-1" />
              <div className="px-3 text-[11px] text-text-deep">bash</div>
            </div>

            {/* 터미널 내용 */}
            <div className="flex-1 overflow-auto px-3 py-2 font-mono text-[11px]">
              <div>
                <span className="text-[#16c60c]">➜</span>{" "}
                <span className="text-sub_point">app</span>{" "}
                <span className="text-text-light">pnpm dev</span>
              </div>
              <div className="text-green">
                ready - started server on http://localhost:3000
              </div>
              <div className="text-green">compiled successfully in 1.3s ✔</div>
              <div className="mt-1 text-text-light">
                GET <span className="text-sub_point">/api/metrics</span>{" "}
                <span className="text-point">200</span>{" "}
                <span className="text-text-soft">(98ms)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
