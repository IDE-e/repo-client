export default function SettingsPage() {
  return (
    <div className="flex h-full text-sm text-text-light">
      {/* 왼쪽 카테고리 */}
      <aside className="w-56 border-r border-border-default pr-2 mr-4">
        <div className="mb-3">
          <input
            className="w-full bg-bg-dark border border-border-light rounded px-2 py-1 text-xs text-text-light outline-none focus:border-blue"
            placeholder="Search settings"
          />
        </div>
        <ul className="space-y-1 text-xs">
          <li className="px-2 py-1 rounded bg-deepblue text-white">General</li>
          <li className="px-2 py-1 rounded hover:bg-bg-hover cursor-pointer">
            Editor
          </li>
          <li className="px-2 py-1 rounded hover:bg-bg-hover cursor-pointer">
            Appearance
          </li>
          <li className="px-2 py-1 rounded hover:bg-bg-hover cursor-pointer">
            Integrations
          </li>
        </ul>
      </aside>

      {/* 오른쪽 설정 내용 */}
      <main className="flex-1 space-y-6">
        <section>
          <h1 className="text-xl font-bold mb-1 text-text-default">
            General Settings
          </h1>
          <p className="text-xs text-text-soft">
            기본 동작, 알림, 자동 저장 등의 설정을 관리합니다.
          </p>
        </section>

        <section className="space-y-4">
          {/* Auto Save */}
          <div className="border border-border-light rounded p-3 bg-bg-dark">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-sm font-semibold text-text-light">
                  Auto Save
                </h2>
                <p className="text-xs text-text-soft">
                  파일이 변경되었을 때 자동으로 저장하는 시점을 설정합니다.
                </p>
              </div>
              <select className="bg-bg-default border border-border-light text-xs rounded px-2 py-1 outline-none">
                <option>off</option>
                <option>afterDelay</option>
                <option>onFocusChange</option>
                <option>onWindowChange</option>
              </select>
            </div>
          </div>

          {/* Theme */}
          <div className="border border-border-light rounded p-3 bg-bg-dark">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-sm font-semibold text-text-light">
                  Color Theme
                </h2>
                <p className="text-xs text-text-soft">
                  인터페이스의 색상 테마를 변경합니다.
                </p>
              </div>
              <select className="bg-bg-default border border-border-light text-xs rounded px-2 py-1 outline-none">
                <option>Dark+ (default)</option>
                <option>Light+</option>
                <option>Monokai</option>
              </select>
            </div>
          </div>

          {/* Notifications */}
          <div className="border border-border-light rounded p-3 bg-bg-dark">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-sm font-semibold text-text-light">
                  Notifications
                </h2>
                <p className="text-xs text-text-soft">
                  빌드 실패, 배포 실패 등의 알림을 켜거나 끌 수 있습니다.
                </p>
              </div>
              <label className="inline-flex items-center gap-2 text-xs">
                <span>Enable</span>
                <input type="checkbox" className="accent-blue" defaultChecked />
              </label>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
