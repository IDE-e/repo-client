export default function DashboardPage() {
  return (
    <main className="space-y-8">
      {/* 제목 + 설명 */}
      <section className="space-y-2">
        <h1 className="text-3xl font-bold text-text-light">
          Project Dashboard
        </h1>
        <p className="text-sm text-text-soft">
          VS Code 스타일 레이아웃 안에서 프로젝트 상태와 작업 현황을 한눈에
          확인할 수 있는 대시보드입니다.
        </p>
      </section>

      {/* 상단 요약 카드들 */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-md border border-border-default bg-bg-default p-4 space-y-2">
          <div className="text-xs uppercase tracking-wide text-text-soft">
            Active Branch
          </div>
          <div className="text-lg font-semibold text-text-light">main</div>
          <div className="text-xs text-text-deep">
            Last deploy:{" "}
            <span className="text-sub_point">2025-11-14 10:32</span>
          </div>
        </div>

        <div className="rounded-md border border-border-default bg-bg-default p-4 space-y-2">
          <div className="text-xs uppercase tracking-wide text-text-soft">
            Open Issues
          </div>
          <div className="text-lg font-semibold text-text-light">12</div>
          <div className="flex items-center gap-2 text-xs text-text-deep">
            <span className="inline-flex h-2 w-2 rounded-full bg-[#f97373]" />3
            critical · 4 major · 5 minor
          </div>
        </div>

        <div className="rounded-md border border-border-default bg-bg-default p-4 space-y-2">
          <div className="text-xs uppercase tracking-wide text-text-soft">
            Build Status
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-[#22c55e]" />
            <span className="text-sm font-semibold text-text-light">
              Passing
            </span>
          </div>
          <div className="text-xs text-text-deep">
            Last run: <span className="text-sub_point">#184 · 2 min ago</span>
          </div>
        </div>
      </section>

      {/* 할 일 / 작업 리스트 */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Left: Todo-like panel */}
        <div className="rounded-md border border-border-default bg-bg-default p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-light">
              Tasks (Today)
            </h2>
            <span className="text-[11px] text-text-soft">3 / 6 completed</span>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="mt-[5px] inline-flex h-3 w-3 rounded-sm border border-point" />
              <div>
                <span className="text-text-light">
                  Refactor chart widget for pie chart support
                </span>
                <div className="text-[11px] text-text-deep">
                  /src/components/chart/CustomChart.tsx
                </div>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[5px] inline-flex h-3 w-3 rounded-sm bg-point" />
              <div>
                <span className="text-text-light">
                  Implement VSCode-like layout for main app
                </span>
                <div className="text-[11px] text-text-deep">
                  merged into main
                </div>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[5px] inline-flex h-3 w-3 rounded-sm border border-[#f97373]" />
              <div>
                <span className="text-text-light">
                  Fix sidebar collapse animation jitter on mobile
                </span>
                <div className="text-[11px] text-text-deep">
                  high priority · layout/VSCodeLeftMenu.tsx
                </div>
              </div>
            </li>
          </ul>
        </div>

        {/* Right: Activity log / pseudo-console */}
        <div className="rounded-md border border-border-default bg-bg-dark">
          <div className="flex items-center justify-between border-b border-border-default px-4 py-2">
            <span className="text-xs text-text-soft">Activity Log</span>
            <span className="text-[11px] text-text-deep">today</span>
          </div>
          <div className="max-h-64 overflow-auto bg-bg-dark px-4 py-3 text-xs font-mono">
            <div className="text-text-deep">
              $ git log --oneline --max-count=5
            </div>
            <div className="mt-2 space-y-1">
              <div>
                <span className="text-sub_point">a1b2c3d</span>
                <span className="text-text-light">
                  {" "}
                  feat: add VSCode layout wrapper
                </span>
                <span className="text-text-deep"> · 10:12</span>
              </div>
              <div>
                <span className="text-sub_point">e4f5g6h</span>
                <span className="text-text-light">
                  {" "}
                  refactor: extract left menu component
                </span>
                <span className="text-text-deep"> · 09:43</span>
              </div>
              <div>
                <span className="text-sub_point">i7j8k9l</span>
                <span className="text-text-light">
                  {" "}
                  chore: update chart tooltip format
                </span>
                <span className="text-text-deep"> · 09:01</span>
              </div>
              <div className="pt-2 text-text-deep">...and more commits</div>
            </div>
          </div>
        </div>
      </section>

      {/* 하단: 간단한 설정 요약 */}
      <section className="rounded-md border border-border-default bg-bg-default p-4">
        <h2 className="mb-3 text-sm font-semibold text-text-light">
          Environment
        </h2>
        <div className="grid gap-4 md:grid-cols-3 text-xs text-text-soft">
          <div className="space-y-1">
            <div className="text-text-deep uppercase tracking-wide">
              Runtime
            </div>
            <div>Node 20.x</div>
            <div>Next.js App Router</div>
          </div>
          <div className="space-y-1">
            <div className="text-text-deep uppercase tracking-wide">UI</div>
            <div>VSCode-like layout</div>
            <div>Tailwind + lucide-react</div>
          </div>
          <div className="space-y-1">
            <div className="text-text-deep uppercase tracking-wide">Charts</div>
            <div>react-chartjs-2</div>
            <div>CustomChart wrapper ready</div>
          </div>
        </div>
      </section>
    </main>
  );
}
