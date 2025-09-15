/**
 * WebSocket Live Chat Demo Component
 *
 * This is a simple demo component to test the WebSocket live chat functionality.
 * You can add this to any page to test the WebSocket connection.
 */

"use client";

import React, { useState } from "react";
import { useLiveChatWebSocket } from "@/hooks/useLiveChatWebSocket";
import {
	convertWebSocketMessageToMessage,
	validateChatMessage,
} from "@/lib/utils/features/live-chat/websocket-message-converter";
import { Message } from "@/types/features/live-chat.types";

export function WebSocketChatDemo() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [username, setUsername] = useState(
		"TestUser_" + Math.floor(Math.random() * 1000)
	);
	const [connectionStatus, setConnectionStatus] =
		useState<string>("disconnected");
	const [isConnecting, setIsConnecting] = useState(false);

	const { connect, disconnect, sendMessage, isConnected } =
		useLiveChatWebSocket({
			username,
			autoConnect: false, // Manual control for demo
			onMessageReceived: (wsMessage) => {
				// console.log("📨 Received WebSocket message:", wsMessage);
				const message = convertWebSocketMessageToMessage(
					wsMessage,
					username
				);
				setMessages((prev) => [...prev, message]);
			},
			onConnectionStatusChange: (status) => {
				console.log("🔌 Connection status changed:", status);
				setConnectionStatus(status);
				setIsConnecting(
					status === "connecting" || status === "reconnecting"
				);
			},
		});

	const handleConnect = () => {
		// console.log("🔌 Connecting to chat WebSocket...");
		connect();
	};

	const handleDisconnect = () => {
		// console.log("🔌 Disconnecting from chat WebSocket...");
		disconnect();
	};

	const handleSendMessage = () => {
		if (!validateChatMessage(inputValue, username)) {
			return;
		}

		// console.log("📤 Sending message:", {
		// 	text: inputValue,
		// 	sender: username,
		// });

		const success = sendMessage(inputValue, username);

		if (success) {
			setInputValue("");
		} else {
			console.error("❌ Failed to send message");
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const getStatusColor = () => {
		switch (connectionStatus) {
			case "connected":
				return "text-green-600 bg-green-100";
			case "connecting":
			case "reconnecting":
				return "text-yellow-600 bg-yellow-100";
			case "error":
			case "disconnected":
				return "text-red-600 bg-red-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	};

	const getStatusText = () => {
		switch (connectionStatus) {
			case "connected":
				return "🟢 Connected";
			case "connecting":
				return "🟡 Connecting...";
			case "reconnecting":
				return "🟡 Reconnecting...";
			case "error":
				return "🔴 Error";
			case "disconnected":
				return "⚫ Disconnected";
			default:
				return "⚪ Unknown";
		}
	};

	return (
		<div className="max-w-md mx-auto mt-8 p-4 border rounded-lg shadow-lg">
			<h2 className="text-xl font-bold mb-4">WebSocket Live Chat Demo</h2>

			{/* Connection Status */}
			<div
				className={`p-2 rounded mb-4 text-sm font-medium ${getStatusColor()}`}
			>
				{getStatusText()}
			</div>

			{/* Username Input */}
			<div className="mb-4">
				<label className="block text-sm font-medium mb-1">
					Username:
				</label>
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					disabled={isConnected()}
					className="w-full p-2 border rounded text-sm"
					placeholder="Enter your username"
				/>
			</div>

			{/* Connection Controls */}
			<div className="flex gap-2 mb-4">
				<button
					onClick={handleConnect}
					disabled={isConnected() || isConnecting || !username.trim()}
					className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
				>
					{isConnecting ? "Connecting..." : "Connect"}
				</button>
				<button
					onClick={handleDisconnect}
					disabled={!isConnected()}
					className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
				>
					Disconnect
				</button>
			</div>

			{/* Messages Display */}
			<div className="border rounded p-3 h-48 overflow-y-auto mb-4 bg-gray-50">
				{messages.length === 0 ? (
					<p className="text-gray-500 text-sm">
						No messages yet. Connect and send a message!
					</p>
				) : (
					messages.map((message) => (
						<div key={message.id} className="mb-2 text-sm">
							<span
								className={`font-medium ${
									message.isCurrentUser
										? "text-blue-600"
										: "text-gray-700"
								}`}
							>
								{message.username}:
							</span>
							<span className="ml-2">
								{message.type === "text"
									? message.content
									: "Non-text message"}
							</span>
							<span className="text-xs text-gray-400 ml-2">
								{message.timestamp.toLocaleTimeString()}
							</span>
						</div>
					))
				)}
			</div>

			{/* Message Input */}
			<div className="flex gap-2">
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyPress={handleKeyPress}
					disabled={!isConnected()}
					placeholder={
						isConnected()
							? "Type a message..."
							: "Connect to send messages"
					}
					className="flex-1 p-2 border rounded text-sm disabled:bg-gray-100"
					maxLength={1000}
				/>
				<button
					onClick={handleSendMessage}
					disabled={!isConnected() || !inputValue.trim()}
					className="px-4 py-2 bg-blue-600 text-white rounded text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
				>
					Send
				</button>
			</div>

			{/* Debug Info */}
			<div className="mt-4 p-2 bg-gray-100 rounded text-xs">
				<p>
					<strong>WebSocket URL:</strong>{" "}
					wss://chat.xx88zz77.site?wsKey=WS-03
				</p>
				<p>
					<strong>Send Event:</strong> send_message
				</p>
				<p>
					<strong>Receive Event:</strong> receive_message
				</p>
				<p>
					<strong>Connected:</strong> {isConnected() ? "Yes" : "No"}
				</p>
				<p>
					<strong>Messages Count:</strong> {messages.length}
				</p>
			</div>
		</div>
	);
}

export default WebSocketChatDemo;
