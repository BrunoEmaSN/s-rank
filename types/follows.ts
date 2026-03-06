export type FollowedStreamer = {
  streamerId: string;
  displayName: string | null;
  username: string | null;
  avatarUrl: string | null;
  channelName: string | null;
  platform: string | null;
  trophies: number;
  followedAt: string;
};

export type Follower = {
  userId: string;
  displayName: string | null;
  username: string | null;
  avatarUrl: string | null;
  followedAt: string;
};

export type FollowsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
