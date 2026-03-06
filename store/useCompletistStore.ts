import { create } from "zustand";
import type { CompletistStats } from "@/lib/completist";

type CompletistState = CompletistStats & {
  loaded: boolean;
  loading: boolean;
  error: string | null;
  fetchCompletist: () => Promise<void>;
  setData: (data: Partial<CompletistStats>) => void;
  reset: () => void;
};

const initialState = {
  canales: [] as CompletistStats["canales"],
  totalCanalesCompletados: 0,
  totalTrofeosEnCompletados: 0,
  loaded: false,
  loading: false,
  error: null as string | null,
};

export const useCompletistStore = create<CompletistState>((set, get) => ({
  ...initialState,

  fetchCompletist: async () => {
    if (get().loaded || get().loading) return;
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/users/me/completist");
      if (!res.ok) {
        if (res.status === 401) {
          set({ ...initialState });
          return;
        }
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Error al cargar completista");
      }
      const data = await res.json();
      set({
        canales: data.canales ?? [],
        totalCanalesCompletados: data.totalCanalesCompletados ?? 0,
        totalTrofeosEnCompletados: data.totalTrofeosEnCompletados ?? 0,
        loaded: true,
        loading: false,
        error: null,
      });
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : "Error desconocido",
      });
    }
  },

  setData: (data) =>
    set((s) => ({
      ...s,
      ...data,
      loaded: true,
    })),

  reset: () => set(initialState),
}));
