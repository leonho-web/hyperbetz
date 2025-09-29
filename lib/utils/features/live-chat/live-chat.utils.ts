import { Message } from "@/types/features/live-chat.types";

export function formatTime(date: Date): string {
	return date.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
}

// Process message content to highlight tags
export const processMessageContent = (
	content: string,
	currentUsername?: string
) => {
	return content.replace(/@(\w+)/g, (match, username) => {
		// Check if the tagged user is the current user
		const isCurrentUser = currentUsername && username === currentUsername;

		if (isCurrentUser) {
			// Special highlighting for when current user is tagged
			return `<span class="text-orange-400 font-semibold bg-orange-100/20 px-1 rounded border border-orange-400/30 animate-pulse">@${username}</span>`;
		} else {
			// Regular tag highlighting with text-primary class
			return `<span class="text-primary font-medium">@${username}</span>`;
		}
	});
};

// Get all unique usernames for tag suggestions
export const getAllUsernames = (
	messages: Message[],
	currentUsername?: string
) => {
	const usernames = messages.map((msg) => msg.username);
	return [...new Set(usernames)].filter(
		(name) =>
			name !== "You" && name !== "System" && name !== currentUsername
	);
};

// Extract background color and text color from ring class
export const getCountryFlagStyles = (ringColor: string) => {
	const colorMap: Record<string, { bg: string; text: string }> = {
		"ring-red-500": { bg: "bg-red-500", text: "text-white" },
		"ring-blue-500": { bg: "bg-blue-500", text: "text-white" },
		"ring-green-500": { bg: "bg-green-500", text: "text-white" },
		"ring-yellow-500": { bg: "bg-yellow-500", text: "text-black" },
		"ring-purple-500": { bg: "bg-purple-500", text: "text-white" },
		"ring-pink-500": { bg: "bg-pink-500", text: "text-white" },
		"ring-orange-500": { bg: "bg-orange-500", text: "text-white" },
		"ring-cyan-500": { bg: "bg-cyan-500", text: "text-black" },
		"ring-green-400": { bg: "bg-green-400", text: "text-black" },
		"ring-blue-400": { bg: "bg-blue-400", text: "text-white" },
		"ring-purple-400": { bg: "bg-purple-400", text: "text-white" },
	};

	return colorMap[ringColor] || { bg: "bg-gray-500", text: "text-white" };
};
