export interface UserProfileIdentity {
  name: string;
  role: string;
  location: string;
  socials: {
    facebook: string;
    linkedin: string;
    github?: string;
    whatsapp?: string;
    gmail?: string;
  };
}

export interface ConnectedAccountConfig {
  id: string;
  platform: "facebook" | "linkedin" | "whatsapp" | "instagram" | "gmail" | "youtube" | "twitter" | "spotify" | "telegram";
  name: string;
  displayName: string;
  username: string;
  profileUrl: string;
  status: "connected" | "active" | "standby" | "disconnected";
  accessTokenProvided: boolean;
  unreadCount: number;
  lastSyncedAt: string;
  accentColor: string;
}
