"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type VSTab = {
  path: string; // 실제 라우터 경로 ("/", "/about", "/docs/intro" 등)
  label: string; // 탭에 보여줄 이름 ("home", "about", "intro" 등)
};

type VSCodeTabsState = {
  tabs: VSTab[];
  activePath: string | null;

  openTab: (path: string, label?: string) => void;
  closeTab: (path: string) => string | null; // 닫은 후 next active path 반환
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
        const filtered = tabs.filter((t) => t.path !== path);

        let nextActive: string | null = activePath;

        // 지금 닫은 탭이 active였다면, 마지막 탭을 active로
        if (activePath === path) {
          nextActive = filtered.length
            ? filtered[filtered.length - 1].path
            : null;
        }

        set({
          tabs: filtered,
          activePath: nextActive,
        });

        return nextActive;
      },

      setActiveTab: (path) => {
        set({ activePath: path });
      },
    }),
    {
      name: "vscode-tabs-store", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // 필요한 값만 저장하고 싶으면 아래처럼 partialize 사용
      partialize: (state) => ({
        tabs: state.tabs,
        activePath: state.activePath,
      }),
    }
  )
);
