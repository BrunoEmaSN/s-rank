import { create } from "zustand";
import type { ActividadRecienteItem } from "@/lib/recent-activity";

type RecentActivityState = {
  items: ActividadRecienteItem[];
  loaded: boolean;
  loading: boolean;
  error: string | null;
  fetchRecentActivity: (limit?: number) => Promise<void>;
  setItems: (items: ActividadRecienteItem[]) => void;
  reset: () => void;
};

const initialState = {
  items: [] as ActividadRecienteItem[],
  loaded: false,
  loading: false,
  error: null as string | null,
};

export const useRecentActivityStore = create<RecentActivityState>(
  (set, get) => ({
    ...initialState,

    fetchRecentActivity: async (limit = 5) => {
      if (get().loaded || get().loading) return;
      set({ loading: true, error: null });
      try {
        const res = await fetch(
          `/api/users/me/recent-activity?limit=${encodeURIComponent(limit)}`
        );
        if (!res.ok) {
          if (res.status === 401) {
            set({ ...initialState });
            return;
          }
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error ?? "Error al cargar actividad reciente");
        }
        const data = await res.json();
        set({
          items: Array.isArray(data) ? data : [],
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

    setItems: (items) => set({ items, loaded: true }),

    reset: () => set(initialState),
  })
);
