import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type VSTab = {
  path: string;
  label: string;
};

type VSCodeTabsState = {
  tabs: VSTab[];
  activePath: string | null;

  openTab: (path: string, label?: string) => void;
  closeTab: (path: string) => string | null; // 닫은 뒤 이동할 경로(탭 path) 반환
  setActiveTab: (path: string) => void;
};

export const useVSCodeTabsStore = create<VSCodeTabsState>()(
  persist(
    (set, get) => ({
      tabs: [],
      activePath: null,

      openTab: (path, label) => {
        const { tabs } = get();

        const exists = tabs.some((t) => t.path === path);

        const normalizedLabel =
          label ??
          (path === "/"
            ? "home"
            : path.replace(/^\/+/, "").split("/").slice(-1)[0] || "untitled");

        set({
          tabs: exists ? tabs : [...tabs, { path, label: normalizedLabel }],
          activePath: path,
        });
      },

      closeTab: (path) => {
        const { tabs, activePath } = get();

        const index = tabs.findIndex((t) => t.path === path);
        // 삭제할 탭이 없으면 아무 변화 없음
        if (index === -1) return activePath;

        const filtered = tabs.filter((t) => t.path !== path);

        let nextActive: string | null = activePath;

        if (activePath === path) {
          if (filtered.length === 0) {
            // 더 이상 탭이 없으면 activePath는 null
            nextActive = null;
          } else if (index < filtered.length) {
            // 닫은 탭 오른쪽 탭으로
            nextActive = filtered[index].path;
          } else {
            // 닫은 탭이 마지막이었다면, 새 마지막 탭으로
            nextActive = filtered[filtered.length - 1].path;
          }
        }

        set({
          tabs: filtered,
          activePath: nextActive,
        });

        // 라우터가 이동할 "다음 경로" (탭 path)를 반환
        return nextActive;
      },

      setActiveTab: (path) => {
        set({ activePath: path });
      },
    }),
    {
      name: "vscode-tabs-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tabs: state.tabs,
        activePath: state.activePath,
      }),
    }
  )
);
