import { create } from "zustand";

export type DashboardStats = {
  followingCount: number;
  followersCount: number;
  unlockedTrophiesCount: number;
};

type DashboardStatsState = DashboardStats & {
  loaded: boolean;
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  setStats: (stats: Partial<DashboardStats>) => void;
  reset: () => void;
};

const initialState = {
  followingCount: 0,
  followersCount: 0,
  unlockedTrophiesCount: 0,
  loaded: false,
  loading: false,
  error: null as string | null,
};

export const useDashboardStatsStore = create<DashboardStatsState>((set, get) => ({
  ...initialState,

  fetchStats: async () => {
    if (get().loaded || get().loading) return;
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/users/me/dashboard-stats");
      if (!res.ok) {
        if (res.status === 401) {
          set({ ...initialState });
          return;
        }
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Error al cargar estadísticas");
      }
      const data = await res.json();
      set({
        followingCount: data.followingCount ?? 0,
        followersCount: data.followersCount ?? 0,
        unlockedTrophiesCount: data.unlockedTrophiesCount ?? 0,
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

  setStats: (stats) => {
    set((s) => ({ ...s, ...stats, loaded: true }));
  },

  reset: () => set(initialState),
}));
