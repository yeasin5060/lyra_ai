export interface PlatformStats {
  id: string;
  name: string;
  category: "social" | "video" | "messaging" | "productivity" | "music";
  username: string;
  status: "connected" | "active" | "syncing" | "disconnected";
  followersOrSubscribers?: string;
  unreadCount: number;
  highlightStat: string;
  latestActivity: string;
  accentColor: string;
  summaryBangla: string;
  summaryEnglish: string;
}

export interface AllMediaOverview {
  totalPlatforms: number;
  totalUnreadNotifications: number;
  activeMediaStream: string;
  platforms: PlatformStats[];
}
