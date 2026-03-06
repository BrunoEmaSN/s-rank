import { create } from "zustand";
import type { CanalFavorito } from "@/lib/favorite-channel";

type FavoriteChannelState = {
  canal: CanalFavorito | null;
  loaded: boolean;
  loading: boolean;
  error: string | null;
  fetchFavoriteChannel: () => Promise<void>;
  setCanal: (canal: CanalFavorito | null) => void;
  reset: () => void;
};

const initialState = {
  canal: null as CanalFavorito | null,
  loaded: false,
  loading: false,
  error: null as string | null,
};

export const useFavoriteChannelStore = create<FavoriteChannelState>(
  (set, get) => ({
    ...initialState,

    fetchFavoriteChannel: async () => {
      if (get().loaded || get().loading) return;
      set({ loading: true, error: null });
      try {
        const res = await fetch("/api/users/me/favorite-channel");
        if (!res.ok) {
          if (res.status === 401) {
            set({ ...initialState });
            return;
          }
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error ?? "Error al cargar canal favorito");
        }
        const data = await res.json();
        set({
          canal: data,
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

    setCanal: (canal) => set({ canal, loaded: true }),

    reset: () => set(initialState),
  })
);
