// Message types and interfaces
export interface BaseMessage {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  timestamp: Date;
  country: string;
  badge?: keyof typeof userBadges;
  ringColor: string;
  isCurrentUser?: boolean;
  replyCount?: number;
  threadId?: string;
}

export interface TextMessage extends BaseMessage {
  type: "text";
  content: string;
}

export interface WinMessage extends BaseMessage {
  type: "win";
  game: string;
  amount: number;
  currency: string;
  multiplier?: string;
}

export interface ShareMessage extends BaseMessage {
  type: "share";
  content: string;
  sharedAmount: number;
  sharedCurrency: string;
}

export interface EmojiMessage extends BaseMessage {
  type: "emoji";
  emoji: string;
}

export interface GifMessage extends BaseMessage {
  type: "gif";
  gifUrl: string;
  caption?: string;
}

export interface ImageMessage extends BaseMessage {
  type: "image";
  imageUrl: string;
  caption?: string;
}

export interface ReplyMessage extends BaseMessage {
  type: "reply";
  content: string;
  referencedMessage: {
    id: string;
    username: string;
    content: string;
    type:
      | "text"
      | "win"
      | "emoji"
      | "share"
      | "gif"
      | "image"
      | "reply"
      | "rain"
      | "system";
    avatar: string;
    country: string;
    game?: string;
    amount?: number;
    currency?: string;
    emoji?: string;
    gifUrl?: string;
    imageUrl?: string;
  };
}

export interface RainMessage extends BaseMessage {
  type: "rain";
  amount: number;
  currency: string;
  target: string; // "all", "random", or "@username"
  recipients: string[]; // list of usernames who received the rain
  distributedAmount: number; // amount per recipient
}

export interface SystemMessage extends BaseMessage {
  type: "system";
  content: string;
  systemType: "rain" | "tip" | "error" | "info";
  relatedData?: Record<string, unknown>; // for storing additional data like rain animation info
}

export type Message =
  | TextMessage
  | WinMessage
  | ShareMessage
  | EmojiMessage
  | GifMessage
  | ImageMessage
  | ReplyMessage
  | RainMessage
  | SystemMessage;

export interface Language {
  code: string;
  name: string;
  flag: string;
  dir: "ltr" | "rtl";
}
// Chat room options
export interface ChatRoom {
  code: string;
  name: string;
  flag: string;
}

// User badge types
export const userBadges = {
  legend: { label: "Legend", color: "bg-red-600", textColor: "text-white" },
  vip: { label: "VIP", color: "bg-yellow-600", textColor: "text-black" },
  pro: { label: "Pro", color: "bg-blue-600", textColor: "text-white" },
  newbie: { label: "New", color: "bg-green-600", textColor: "text-white" },
  moderator: {
    label: "Moderator",
    color: "bg-purple-600",
    textColor: "text-white",
  },
} as const;

// Avatar ring colors
export const avatarRings = [
  "ring-red-500",
  "ring-blue-500",
  "ring-green-500",
  "ring-yellow-500",
  "ring-purple-500",
  "ring-pink-500",
  "ring-orange-500",
  "ring-cyan-500",
] as const;
