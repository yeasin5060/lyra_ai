import type { ConnectedAccountConfig, UserProfileIdentity } from "./integrations.types.js";

export class IntegrationsService {
  private userProfile: UserProfileIdentity = {
    name: "Yeasin Munshi",
    role: "Full-Stack & AI Systems Architect",
    location: "Dhaka, Bangladesh",
    socials: {
      facebook: "https://www.facebook.com/yeasin.munshi.980/",
      linkedin: "https://www.linkedin.com/in/yeasin-munshi-aa7467288/",
      github: "https://github.com/yeasin5060",
      whatsapp: "+880 Personal & Business",
      gmail: "yeasindev01@gmail.com"
    }
  };

  private accounts: ConnectedAccountConfig[] = [
    {
      id: "facebook",
      platform: "facebook",
      name: "Facebook",
      displayName: "Yeasin Munshi",
      username: "yeasin.munshi.980",
      profileUrl: "https://www.facebook.com/yeasin.munshi.980/",
      status: "connected",
      accessTokenProvided: true,
      unreadCount: 0,
      lastSyncedAt: new Date().toISOString(),
      accentColor: "#1877F2"
    },
    {
      id: "linkedin",
      platform: "linkedin",
      name: "LinkedIn",
      displayName: "Yeasin Munshi",
      username: "yeasin-munshi-aa7467288",
      profileUrl: "https://www.linkedin.com/in/yeasin-munshi-aa7467288/",
      status: "connected",
      accessTokenProvided: true,
      unreadCount: 0,
      lastSyncedAt: new Date().toISOString(),
      accentColor: "#0A66C2"
    },
    {
      id: "whatsapp",
      platform: "whatsapp",
      name: "WhatsApp",
      displayName: "Yeasin Munshi",
      username: "+880 Instant Messenger",
      profileUrl: "https://wa.me/",
      status: "active",
      accessTokenProvided: true,
      unreadCount: 0,
      lastSyncedAt: new Date().toISOString(),
      accentColor: "#25D366"
    },
    {
      id: "gmail",
      platform: "gmail",
      name: "Gmail Inbox",
      displayName: "Yeasin Munshi Workspace",
      username: "yeasindev01@gmail.com",
      profileUrl: "https://mail.google.com",
      status: "active",
      accessTokenProvided: true,
      unreadCount: 0,
      lastSyncedAt: new Date().toISOString(),
      accentColor: "#EA4335"
    },
    {
      id: "youtube",
      platform: "youtube",
      name: "YouTube Studio",
      displayName: "Yeasin Tech",
      username: "Yeasin Munshi Studio",
      profileUrl: "https://youtube.com",
      status: "standby",
      accessTokenProvided: false,
      unreadCount: 0,
      lastSyncedAt: new Date().toISOString(),
      accentColor: "#FF0000"
    },
    {
      id: "instagram",
      platform: "instagram",
      name: "Instagram",
      displayName: "Yeasin Munshi",
      username: "@yeasin.munshi",
      profileUrl: "https://instagram.com",
      status: "standby",
      accessTokenProvided: false,
      unreadCount: 0,
      lastSyncedAt: new Date().toISOString(),
      accentColor: "#E4405F"
    },
    {
      id: "spotify",
      platform: "spotify",
      name: "Spotify",
      displayName: "Yeasin Munshi Audio",
      username: "Yeasin Stream Flow",
      profileUrl: "https://spotify.com",
      status: "active",
      accessTokenProvided: true,
      unreadCount: 0,
      lastSyncedAt: new Date().toISOString(),
      accentColor: "#1DB954"
    },
    {
      id: "twitter",
      platform: "twitter",
      name: "X (Twitter)",
      displayName: "Yeasin Munshi",
      username: "@yeasin_dev",
      profileUrl: "https://x.com",
      status: "standby",
      accessTokenProvided: false,
      unreadCount: 0,
      lastSyncedAt: new Date().toISOString(),
      accentColor: "#1DA1F2"
    }
  ];

  public getUserProfile(): UserProfileIdentity {
    return this.userProfile;
  }

  public getAllAccounts(): ConnectedAccountConfig[] {
    return this.accounts;
  }

  public getAccount(platformId: string): ConnectedAccountConfig | undefined {
    return this.accounts.find((a) => a.id.toLowerCase() === platformId.toLowerCase());
  }

  public updateAccountCredentials(
    platformId: string,
    data: { token?: string; username?: string; profileUrl?: string }
  ): ConnectedAccountConfig | null {
    const acc = this.getAccount(platformId);
    if (!acc) return null;

    if (data.username) acc.username = data.username;
    if (data.profileUrl) acc.profileUrl = data.profileUrl;
    acc.status = "connected";
    acc.accessTokenProvided = true;
    acc.lastSyncedAt = new Date().toISOString();

    return acc;
  }
}

export const integrationsService = new IntegrationsService();
