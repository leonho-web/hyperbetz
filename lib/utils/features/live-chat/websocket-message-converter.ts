import { ReceivedChatMessage } from "@/types/websockets/websockets.types";
import {
	//  Message,
	TextMessage,
} from "@/types/features/live-chat.types";
import { avatarRings } from "@/types/features/live-chat.types";

/**
 * Utility to convert WebSocket chat messages to internal Message format
 */
export const convertWebSocketMessageToMessage = (
	wsMessage: ReceivedChatMessage,
	currentUsername: string = ""
): TextMessage => {
	// Generate a random avatar ring color
	const randomRingColor =
		avatarRings[Math.floor(Math.random() * avatarRings.length)];

	// Generate text avatar from username (first two letters)
	const generateTextAvatar = (username: string): string => {
		const cleanUsername = username.replace(/[^a-zA-Z0-9]/g, "");
		return cleanUsername.length >= 2
			? cleanUsername.substring(0, 2).toUpperCase()
			: cleanUsername.length === 1
			? cleanUsername.toUpperCase() + "X"
			: "XX";
	};

	const message: TextMessage = {
		id: wsMessage.messageId,
		type: "text",
		content: wsMessage.text,
		userId: wsMessage.sender,
		username: wsMessage.sender,
		avatar: generateTextAvatar(wsMessage.sender),
		timestamp: new Date(wsMessage.timestamp),
		country: "", // No country flags
		ringColor: randomRingColor,
		isCurrentUser: wsMessage.sender === currentUsername,
		badge: wsMessage.isAgent ? "vip" : undefined,
	};

	return message;
};

/**
 * Utility to convert internal Message to WebSocket message format
 */
export const convertMessageToWebSocketMessage = (
	message: TextMessage
): { text: string; sender: string } => {
	return {
		text: message.content,
		sender: message.username,
	};
};

/**
 * Generate a unique message ID
 */
export const generateMessageId = (): string => {
	return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate message content before sending
 */
export const validateChatMessage = (text: string, sender: string): boolean => {
	if (!text || text.trim().length === 0) {
		console.warn("Cannot send empty message");
		return false;
	}

	if (!sender || sender.trim().length === 0) {
		console.warn("Cannot send message without sender");
		return false;
	}

	if (text.length > 1000) {
		console.warn("Message too long (max 1000 characters)");
		return false;
	}

	return true;
};
