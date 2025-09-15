import { Message, userBadges } from "@/types/features/live-chat.types";
import { ChatHistoryApiMessage } from "@/types/features/chat-history.types";

/**
 * Validate and convert badge string to valid badge type
 */
const validateBadge = (badge?: string): keyof typeof userBadges | undefined => {
	if (!badge) return undefined;
	const validBadges = Object.keys(userBadges) as Array<
		keyof typeof userBadges
	>;
	return validBadges.includes(badge as keyof typeof userBadges)
		? (badge as keyof typeof userBadges)
		: undefined;
};

/**
 * Convert a chat history API message to internal Message format
 */
export const convertChatHistoryApiMessageToMessage = (
	apiMessage: ChatHistoryApiMessage,
	currentUsername?: string
): Message => {
	// Generate a unique ID from the message data
	const messageId = `${apiMessage.sender}_${
		apiMessage.sent_at
	}_${Math.random().toString(36).substr(2, 9)}`;

	const baseMessage = {
		id: messageId,
		userId: apiMessage.sender,
		username: apiMessage.sender,
		avatar: generateTextAvatar(apiMessage.sender),
		timestamp: new Date(apiMessage.sent_at),
		country: "", // Not provided by API
		ringColor: getRandomRingColor(),
		isCurrentUser: currentUsername
			? apiMessage.sender === currentUsername
			: false,
		// No badge info in API response
	};

	// Parse message content to potentially detect different message types
	const messageText = apiMessage.message_text;

	// Check if this looks like a reply (starts with @username)
	const replyMatch = messageText.match(/^@(\w+)\s+(.+)$/);
	if (replyMatch) {
		const [, referencedUsername, content] = replyMatch;
		return {
			...baseMessage,
			type: "reply",
			content: content,
			referencedMessage: {
				id: `ref_${referencedUsername}`,
				username: referencedUsername,
				content: "", // We don't have the original message content
				type: "text",
				avatar: generateTextAvatar(referencedUsername),
				country: "",
			},
		};
	}

	// For now, treat all other messages as text messages
	// In the future, you could add more parsing logic for wins, system messages, etc.
	const message: Message = {
		...baseMessage,
		type: "text",
		content: messageText,
	};

	return message;
};

/**
 * Convert multiple chat history API messages to internal Message format
 */
export const convertChatHistoryApiMessages = (
	apiMessages: ChatHistoryApiMessage[],
	currentUsername?: string
): Message[] => {
	return apiMessages.map((apiMessage) =>
		convertChatHistoryApiMessageToMessage(apiMessage, currentUsername)
	);
};

/**
 * Generate text avatar from username
 */
const generateTextAvatar = (username: string): string => {
	const cleanUsername = username.replace(/[^a-zA-Z0-9]/g, "");
	return cleanUsername.length >= 2
		? cleanUsername.substring(0, 2).toUpperCase()
		: cleanUsername.length === 1
		? cleanUsername.toUpperCase() + "X"
		: "XX";
};

/**
 * Get a random ring color for avatars
 */
const getRandomRingColor = (): string => {
	const colors = [
		"ring-red-500",
		"ring-blue-500",
		"ring-green-500",
		"ring-yellow-500",
		"ring-purple-500",
		"ring-pink-500",
		"ring-orange-500",
		"ring-cyan-500",
	];
	return colors[Math.floor(Math.random() * colors.length)];
};

// Legacy converter for backward compatibility (if the old format is still needed)
export interface LegacyChatHistoryMessage {
	id: string;
	userId: string;
	username: string;
	avatar?: string;
	timestamp: string;
	content: string;
	type:
		| "text"
		| "win"
		| "emoji"
		| "gif"
		| "image"
		| "reply"
		| "rain"
		| "system";
	country?: string;
	badge?: string;
	ringColor?: string;
	game?: string;
	amount?: number;
	currency?: string;
	multiplier?: string;
	emoji?: string;
	gifUrl?: string;
	imageUrl?: string;
	caption?: string;
	referencedMessage?: {
		id: string;
		username: string;
		content: string;
		type: string;
		avatar?: string;
		country?: string;
	};
	systemType?: "rain" | "tip" | "error" | "info";
}

export const convertLegacyChatHistoryMessageToMessage = (
	historyMessage: LegacyChatHistoryMessage,
	currentUsername?: string
): Message => {
	const baseMessage = {
		id: historyMessage.id,
		userId: historyMessage.userId,
		username: historyMessage.username,
		avatar:
			historyMessage.avatar ||
			generateTextAvatar(historyMessage.username),
		timestamp: new Date(historyMessage.timestamp),
		country: historyMessage.country || "",
		ringColor: historyMessage.ringColor || getRandomRingColor(),
		isCurrentUser: currentUsername
			? historyMessage.username === currentUsername
			: false,
		...(historyMessage.badge && {
			badge: validateBadge(historyMessage.badge),
		}),
	};

	switch (historyMessage.type) {
		case "text":
			return {
				...baseMessage,
				type: "text",
				content: historyMessage.content,
			};

		case "win":
			return {
				...baseMessage,
				type: "win",
				game: historyMessage.game || "Unknown Game",
				amount: historyMessage.amount || 0,
				currency: historyMessage.currency || "USD",
				...(historyMessage.multiplier && {
					multiplier: historyMessage.multiplier,
				}),
			};

		case "emoji":
			return {
				...baseMessage,
				type: "emoji",
				emoji: historyMessage.emoji || "😀",
			};

		case "gif":
			return {
				...baseMessage,
				type: "gif",
				gifUrl: historyMessage.gifUrl || "",
				...(historyMessage.caption && {
					caption: historyMessage.caption,
				}),
			};

		case "image":
			return {
				...baseMessage,
				type: "image",
				imageUrl: historyMessage.imageUrl || "",
				...(historyMessage.caption && {
					caption: historyMessage.caption,
				}),
			};

		case "reply":
			return {
				...baseMessage,
				type: "reply",
				content: historyMessage.content,
				referencedMessage: historyMessage.referencedMessage
					? {
							id: historyMessage.referencedMessage.id,
							username: historyMessage.referencedMessage.username,
							content: historyMessage.referencedMessage.content,
							type: historyMessage.referencedMessage.type as
								| "text"
								| "win"
								| "emoji"
								| "gif"
								| "image"
								| "reply"
								| "rain"
								| "system"
								| "share",
							avatar:
								historyMessage.referencedMessage.avatar ||
								generateTextAvatar(
									historyMessage.referencedMessage.username
								),
							country:
								historyMessage.referencedMessage.country || "",
					  }
					: {
							id: "",
							username: "Unknown",
							content: "",
							type: "text",
							avatar: generateTextAvatar("Unknown"),
							country: "",
					  },
			};

		case "rain":
			return {
				...baseMessage,
				type: "rain",
				amount: historyMessage.amount || 0,
				currency: historyMessage.currency || "USD",
				target: "all",
				recipients: [],
				distributedAmount: 0,
			};

		case "system":
			return {
				...baseMessage,
				type: "system",
				content: historyMessage.content,
				systemType:
					(historyMessage.systemType as
						| "rain"
						| "tip"
						| "error"
						| "info") || "info",
			};

		default:
			return {
				...baseMessage,
				type: "text",
				content: historyMessage.content,
			};
	}
};
