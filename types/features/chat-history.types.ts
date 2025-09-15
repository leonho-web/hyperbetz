export interface ChatHistoryRequest {
	api_key: string;
	ws_key: string;
}

// Raw message format from the API
export interface ChatHistoryApiMessage {
	ws_key: string;
	message_text: string;
	sender: string;
	sent_at: string; // ISO string
}

// API response format
export interface ChatHistoryApiResponse {
	error: boolean;
	data: ChatHistoryApiMessage[];
}

// Legacy interface for backward compatibility (if needed)
export interface ChatHistoryMessage {
	id: string;
	userId: string;
	username: string;
	avatar?: string;
	timestamp: string; // ISO string from API
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
	// Additional fields based on message type
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

export interface ChatHistoryResponse {
	messages: ChatHistoryMessage[];
	total: number;
	page?: number;
	limit?: number;
}
