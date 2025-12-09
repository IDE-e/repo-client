export default function TerminalPage() {
  return (
    <div className="space-y-8 text-sm text-text-light">
      {/* 상단 제목 + 설명 */}
      <section>
        <h1 className="text-3xl font-bold mb-2 text-text-default">
          Project Dashboard
        </h1>
        <p className="text-text-soft">
          VS Code style layout 안에서 프로젝트 상태를 한눈에 확인할 수 있는
          대시보드 예시입니다.
        </p>
      </section>

      {/* 3열 카드 영역 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tasks */}
        <div className="bg-bg-default border border-border-default rounded-md p-4 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-point">
            Tasks
          </h2>
          <ul className="space-y-2">
            <li className="flex items-center justify-between">
              <span>Implement Chart Widget</span>
              <span className="text-xs px-2 py-0.5 rounded bg-bg-dark text-sub_warning">
                In Progress
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Connect API</span>
              <span className="text-xs px-2 py-0.5 rounded bg-bg-dark text-sub_point">
                Todo
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Refactor Layout</span>
              <span className="text-xs px-2 py-0.5 rounded bg-bg-dark text-point">
                Done
              </span>
            </li>
          </ul>
        </div>

        {/* Status */}
        <div className="bg-bg-default border border-border-default rounded-md p-4 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-point">
            Status
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-text-soft">Branch</span>
              <span className="font-mono text-text-light">main</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-soft">Last Deploy</span>
              <span className="font-mono text-text-light">
                2025-11-14 10:32
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-soft">Errors</span>
              <span className="font-mono text-point">0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-soft">Warnings</span>
              <span className="font-mono text-warning">3</span>
            </div>
          </div>
        </div>

        {/* Shortcuts */}
        <div className="bg-bg-default border border-border-default rounded-md p-4 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-point">
            Shortcuts
          </h2>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center justify-between">
              <span>Toggle Sidebar</span>
              <span className="font-mono bg-bg-dark px-2 py-0.5 rounded">
                Ctrl + B
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Search Files</span>
              <span className="font-mono bg-bg-dark px-2 py-0.5 rounded">
                Ctrl + P
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Open Command Palette</span>
              <span className="font-mono bg-bg-dark px-2 py-0.5 rounded">
                Ctrl + Shift + P
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* 하단 터미널 스타일 박스 */}
      <section className="bg-bg-dark border border-border-default rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-3 py-1.5 text-xs bg-bg-default border-b border-border-default">
          <span className="text-text-soft">TERMINAL</span>
          <span className="text-text-deep">bash</span>
        </div>
        <div className="p-3 font-mono text-xs space-y-1">
          <div>
            <span className="text-lightblue">➜</span>{" "}
            <span className="text-sub_point">app</span>{" "}
            <span className="text-text-light">pnpm dev</span>
          </div>
          <div className="text-green">
            ready - started server on http://localhost:3000
          </div>
          <div className="text-green">compiled successfully in 1.2s ✔</div>
        </div>
      </section>
    </div>
  );
}
