import { create } from "zustand";
import type { Channel, ChannelsPagination, ChannelsFilters } from "@/types/channel";

type ChannelsState = {
  channels: Channel[];
  pagination: ChannelsPagination | null;
  filters: ChannelsFilters;
  loading: boolean;
  error: string | null;
  fetchChannels: (params?: { page?: number; platform?: string; search?: string }) => Promise<void>;
  setFilters: (filters: Partial<ChannelsFilters>) => void;
  setPage: (page: number) => void;
  reset: () => void;
};

const defaultFilters: ChannelsFilters = {
  platform: "",
  search: "",
};

const defaultPagination: ChannelsPagination = {
  page: 1,
  limit: 9,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
};

export const useChannelsStore = create<ChannelsState>((set, get) => ({
  channels: [],
  pagination: null,
  filters: defaultFilters,
  loading: false,
  error: null,

  fetchChannels: async (params = {}) => {
    set({ loading: true, error: null });
    const { filters, pagination } = get();
    const page = params.page ?? pagination?.page ?? 1;
    const platform = params.platform !== undefined ? params.platform : filters.platform;
    const search = params.search !== undefined ? params.search : filters.search;

    const searchParams = new URLSearchParams();
    searchParams.set("page", String(page));
    searchParams.set("limit", String(pagination?.limit ?? defaultPagination.limit));
    if (platform) searchParams.set("platform", platform);
    if (search) searchParams.set("search", search);

    try {
      const res = await fetch(`/api/channels?${searchParams.toString()}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Error al cargar canales");
      }
      const json = await res.json();
      set({
        channels: json.data,
        pagination: json.pagination,
        filters: { platform, search },
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

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  setPage: (page) => {
    set((state) => ({
      pagination: state.pagination ? { ...state.pagination, page } : { ...defaultPagination, page },
    }));
  },

  reset: () => {
    set({
      channels: [],
      pagination: null,
      filters: defaultFilters,
      error: null,
    });
  },
}));
