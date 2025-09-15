import { Message } from "../features/live-chat.types";

interface WsMessage {
	type:
		| "DEPOSITNOTIFICATION"
		| "WITHDRAWNOTIFICATION"
		| "AUTODEPOWDSTATUSNOTIFICATION"
		| "LIVECHATMESSAGE";
	data: Message; // The payload for the message
}

// Live chat message payload for WebSocket
interface LiveChatMessagePayload {
	text: string;
	sender: string;
	isAgent?: string;
	timestamp?: number;
	messageId?: string;
}

// Received message format from WebSocket
interface ReceivedChatMessage {
	text: string;
	sender: string;
	isAgent?: boolean;
	timestamp: number;
	messageId: string;
}

type Callback<T> = (data: T) => void;

export type {
	WsMessage,
	Callback,
	LiveChatMessagePayload,
	ReceivedChatMessage,
};
