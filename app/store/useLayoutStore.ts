import { create } from "zustand";

type LayoutState = {
  isTerminalOpen: boolean;
  toggleTerminal: () => void;
  openTerminal: () => void;
  closeTerminal: () => void;
};

export const useLayoutStore = create<LayoutState>((set) => ({
  isTerminalOpen: false,
  toggleTerminal: () =>
    set((state) => ({ isTerminalOpen: !state.isTerminalOpen })),
  openTerminal: () => set({ isTerminalOpen: true }),
  closeTerminal: () => set({ isTerminalOpen: false }),
}));
