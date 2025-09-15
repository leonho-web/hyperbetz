import { useEffect, useCallback, useRef } from "react";
import WebSocketService from "@/services/webSocketService";
import { ReceivedChatMessage } from "@/types/websockets/websockets.types";

interface UseLiveChatWebSocketOptions {
	onMessageReceived?: (message: ReceivedChatMessage) => void;
	onConnectionStatusChange?: (status: string) => void;
	username?: string;
	autoConnect?: boolean;
}

export const useLiveChatWebSocket = ({
	onMessageReceived,
	onConnectionStatusChange,
	username,
	autoConnect = true,
}: UseLiveChatWebSocketOptions = {}) => {
	const unsubscribeRef = useRef<(() => void) | null>(null);
	const statusUnsubscribeRef = useRef<(() => void) | null>(null);

	// Connect to chat WebSocket
	const connect = useCallback(() => {
		if (username) {
			WebSocketService.connectToChat(username);
		}
	}, [username]);

	// Disconnect from chat WebSocket
	const disconnect = useCallback(() => {
		WebSocketService.disconnectFromChat();
	}, []);

	// Send a chat message
	const sendMessage = useCallback((text: string, sender: string) => {
		return WebSocketService.sendChatMessage({
			text,
			sender,
			isAgent: "false",
		});
	}, []);

	// Get connection status
	const isConnected = useCallback(() => {
		return WebSocketService.isChatConnected();
	}, []);

	useEffect(() => {
		// Subscribe to chat messages
		if (onMessageReceived) {
			unsubscribeRef.current =
				WebSocketService.subscribeToChatMessages(onMessageReceived);
		}

		// Subscribe to connection status changes
		if (onConnectionStatusChange) {
			WebSocketService.onChatStatusChange = onConnectionStatusChange;
		}

		// Auto-connect if enabled and username is provided
		if (autoConnect && username) {
			connect();
		}

		// Cleanup on unmount
		return () => {
			if (unsubscribeRef.current) {
				unsubscribeRef.current();
			}
			if (statusUnsubscribeRef.current) {
				statusUnsubscribeRef.current();
			}
		};
	}, [
		username,
		onMessageReceived,
		onConnectionStatusChange,
		autoConnect,
		connect,
	]);

	return {
		connect,
		disconnect,
		sendMessage,
		isConnected,
	};
};
