import { useState, useCallback } from "react";
import { Message } from "@/types/features/live-chat.types";
import { ChatHistoryApiResponse } from "@/types/features/chat-history.types";
import ApiService from "@/services/apiService";
import { convertChatHistoryApiMessages } from "@/lib/utils/features/live-chat/chat-history-converter";

interface UseChatHistoryReturn {
	isLoading: boolean;
	error: string | null;
	loadChatHistory: () => Promise<Message[]>;
	refreshChatHistory: () => Promise<Message[]>;
	clearError: () => void;
}

export const useChatHistory = (
	currentUsername?: string
): UseChatHistoryReturn => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadChatHistory = useCallback(async (): Promise<Message[]> => {
		setIsLoading(true);
		setError(null);

		try {
			console.log("🔄 Loading chat history...");
			const apiService = ApiService.getInstance();
			const response = await apiService.getChatHistory();

			console.log("📡 Chat history API response:", response);

			if (response.error) {
				throw new Error("Failed to load chat history");
			}

			// Convert API messages to internal format
			const messages = convertChatHistoryApiMessages(
				response.data || [],
				currentUsername
			);

			console.log("✅ Chat history loaded:", {
				rawCount: response.data?.length || 0,
				convertedCount: messages.length,
				messages: messages.slice(0, 3), // Log first 3 messages for debugging
			});

			// Sort messages by timestamp (oldest first)
			const sortedMessages = messages.sort(
				(a, b) => a.timestamp.getTime() - b.timestamp.getTime()
			);

			return sortedMessages;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Unknown error occurred";
			console.error("❌ Error loading chat history:", err);
			setError(errorMessage);
			return [];
		} finally {
			setIsLoading(false);
		}
	}, [currentUsername]);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	const refreshChatHistory = useCallback(async (): Promise<Message[]> => {
		// Force reload chat history (same as loadChatHistory but explicit name for refresh actions)
		return loadChatHistory();
	}, [loadChatHistory]);

	return {
		isLoading,
		error,
		loadChatHistory,
		refreshChatHistory,
		clearError,
	};
};
