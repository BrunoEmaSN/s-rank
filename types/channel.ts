export type Channel = {
  id: string;
  userId: string;
  name: string;
  platform: string;
  trophies: number;
  createdAt: string;
  updatedAt: string;
  communityId?: string;
};

export type ChannelsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type ChannelsFilters = {
  platform: string;
  search: string;
};
