export interface InboundMessage {
  id: string;
  platform: "facebook" | "whatsapp" | "instagram" | "gmail" | "linkedin" | "twitter";
  platformName: string;
  senderName: string;
  senderAvatar?: string;
  messageText: string;
  timeAgo: string;
  priority: "high" | "normal";
  read: boolean;
}

// Clean state: No dummy accounts or fake messages. Real messages will appear once accounts are connected.
export const INBOUND_MESSAGES: InboundMessage[] = [];
