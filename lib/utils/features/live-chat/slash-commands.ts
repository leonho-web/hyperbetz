import {
	Message,
	RainMessage,
	SystemMessage,
} from "@/types/features/live-chat.types";

export interface SlashCommandResult {
	success: boolean;
	message?: RainMessage | SystemMessage;
	error?: string;
}

export interface SlashCommand {
	name: string;
	description: string;
	usage: string;
	template: string;
	example: string;
}

// Available slash commands with their definitions
export const SLASH_COMMANDS: SlashCommand[] = [
	{
		name: "/rain",
		description: "Split money among multiple recipients or a group",
		usage: "/rain <amount> <target>",
		template: "/rain <amount> <target>",
		example: "/rain 100 all",
	},
	{
		name: "/tip",
		description: "Send a specific amount to a single recipient",
		usage: "/tip <amount> <username>",
		template: "/tip <amount> <username>",
		example: "/tip 50 @JohnDoe",
	},
];

// Filter commands based on input
export const filterCommands = (input: string): SlashCommand[] => {
	if (!input.startsWith("/")) return [];

	const searchTerm = input.toLowerCase().trim();

	// If user just types "/", show all commands
	if (searchTerm === "/") {
		return SLASH_COMMANDS;
	}

	// Filter by partial matches
	return SLASH_COMMANDS.filter((cmd) =>
		cmd.name.toLowerCase().startsWith(searchTerm)
	);
};

export interface UserBalance {
	balance: number;
	currency: string;
	isValid: boolean;
}

// Enhanced user balance with better validation and error handling
export const getUserBalance = (username: string): UserBalance => {
	try {
		// Check if we're on the client side
		if (typeof window === "undefined") {
			// Return default balance for SSR
			return {
				balance: 1000,
				currency: "BFG",
				isValid: true,
			};
		}

		// Mock implementation with localStorage fallback for demo purposes
		// TODO: Replace with actual API call to backend
		const savedBalance = localStorage.getItem(`userBalance_${username}`);

		if (savedBalance) {
			const parsed = JSON.parse(savedBalance);
			return {
				balance: parseFloat(parsed.balance) || 0,
				currency: parsed.currency || "BFG",
				isValid: true,
			};
		}

		// Default mock balance for new users
		const defaultBalance = {
			balance: 1000,
			currency: "BFG",
			isValid: true,
		};

		// Save default balance
		localStorage.setItem(
			`userBalance_${username}`,
			JSON.stringify(defaultBalance)
		);
		return defaultBalance;
	} catch (error) {
		console.error(`Error getting balance for ${username}:`, error);
		return {
			balance: 0,
			currency: "BFG",
			isValid: false,
		};
	}
};

// Enhanced balance update with error handling and validation
export const updateUserBalance = (
	username: string,
	newBalance: number
): boolean => {
	try {
		if (!username || isNaN(newBalance) || newBalance < 0) {
			console.error("Invalid parameters for balance update");
			return false;
		}

		// Check if we're on the client side
		if (typeof window === "undefined") {
			console.log(
				`[SSR] Would update ${username} balance to ${newBalance}`
			);
			return true;
		}

		const currentBalance = getUserBalance(username);
		const updatedBalance = {
			balance: newBalance,
			currency: currentBalance.currency,
			isValid: true,
		};

		// TODO: Replace with actual API call to backend
		localStorage.setItem(
			`userBalance_${username}`,
			JSON.stringify(updatedBalance)
		);
		console.log(
			`Updated ${username} balance to ${newBalance} ${currentBalance.currency}`
		);
		return true;
	} catch (error) {
		console.error(`Error updating balance for ${username}:`, error);
		return false;
	}
};

// Get all usernames from messages for targeting
export const getAllUsernames = (messages: Message[]): string[] => {
	const usernames = new Set<string>();
	messages.forEach((message) => {
		if (
			message.username &&
			message.username !== "You" &&
			message.username !== "System"
		) {
			usernames.add(message.username);
		}
	});
	return Array.from(usernames);
};

// Parse and validate rain command
export const parseRainCommand = (
	input: string,
	senderUsername: string,
	availableUsers: string[]
): SlashCommandResult => {
	// Remove the /rain prefix and trim
	const commandParts = input.replace("/rain", "").trim().split(" ");

	if (commandParts.length < 2) {
		return {
			success: false,
			error: "Usage: /rain <amount> <target> (target can be @username, all, or random)",
		};
	}

	const amountStr = commandParts[0];
	const target = commandParts.slice(1).join(" ");

	// Validate amount
	const amount = parseFloat(amountStr);
	if (isNaN(amount) || amount <= 0) {
		return {
			success: false,
			error: "Amount must be a positive number",
		};
	}

	// Check user balance
	const userBalance = getUserBalance(senderUsername);
	if (!userBalance.isValid) {
		return {
			success: false,
			error: "Unable to verify your balance. Please try again later.",
		};
	}

	if (amount > userBalance.balance) {
		return {
			success: false,
			error: `Insufficient balance. You have ${userBalance.balance} ${userBalance.currency}`,
		};
	}

	// Determine recipients
	let recipients: string[] = [];
	// let targetDisplay = target;

	if (target === "all") {
		recipients = availableUsers.filter((user) => user !== senderUsername);
		// targetDisplay = "everyone";
	} else if (target === "random") {
		const availableForRandom = availableUsers.filter(
			(user) => user !== senderUsername
		);
		const randomCount = Math.min(3, availableForRandom.length); // Random select up to 3 users
		recipients = availableForRandom
			.sort(() => 0.5 - Math.random())
			.slice(0, randomCount);
		// targetDisplay = `${randomCount} random users`;
	} else if (target.startsWith("@")) {
		const username = target.substring(1);
		if (username === senderUsername) {
			return {
				success: false,
				error: "You cannot rain on yourself!",
			};
		}
		if (!availableUsers.includes(username)) {
			return {
				success: false,
				error: `User @${username} not found in chat`,
			};
		}
		recipients = [username];
		// targetDisplay = `@${username}`;
	} else {
		return {
			success: false,
			error: "Invalid target. Use @username, all, or random",
		};
	}

	if (recipients.length === 0) {
		return {
			success: false,
			error: "No valid recipients found",
		};
	}

	// Calculate distribution
	const distributedAmount = amount / recipients.length;

	// Update sender balance
	const newSenderBalance = userBalance.balance - amount;
	const balanceUpdateSuccess = updateUserBalance(
		senderUsername,
		newSenderBalance
	);

	if (!balanceUpdateSuccess) {
		return {
			success: false,
			error: "Failed to process transaction. Please try again.",
		};
	}

	// Update recipients' balances (in a real app)
	recipients.forEach((recipient) => {
		const recipientBalance = getUserBalance(recipient);
		if (recipientBalance.isValid) {
			updateUserBalance(
				recipient,
				recipientBalance.balance + distributedAmount
			);
		}
	});

	// Create rain message
	const rainMessage: RainMessage = {
		id: Date.now().toString(),
		type: "rain",
		userId: "current",
		username: senderUsername,
		avatar: "/your-avatar.png",
		timestamp: new Date(),
		country: "🌧️", // Rain emoji as country for system messages
		ringColor: "ring-yellow-500",
		isCurrentUser: true,
		amount: amount,
		currency: userBalance.currency,
		target: target,
		recipients: recipients,
		distributedAmount: distributedAmount,
	};

	return {
		success: true,
		message: rainMessage,
	};
};

// Parse and validate tip command
export const parseTipCommand = (
	input: string,
	senderUsername: string,
	availableUsers: string[]
): SlashCommandResult => {
	// Remove /tip prefix and trim
	const commandContent = input.replace("/tip", "").trim();

	if (!commandContent) {
		return {
			success: false,
			error: "Usage: /tip <amount> <username>",
		};
	}

	const commandParts = commandContent.split(/\s+/);

	if (commandParts.length < 2) {
		return {
			success: false,
			error: "Usage: /tip <amount> <username>",
		};
	}

	const amountStr = commandParts[0];
	const targetUsername = commandParts[1].replace("@", ""); // Remove @ if present

	// Validate amount
	const amount = parseFloat(amountStr);
	if (isNaN(amount) || amount <= 0) {
		return {
			success: false,
			error: "Amount must be a positive number",
		};
	}

	// Check if trying to tip themselves
	if (targetUsername === senderUsername) {
		return {
			success: false,
			error: "You cannot tip yourself!",
		};
	}

	// Check if user exists
	if (!availableUsers.includes(targetUsername)) {
		return {
			success: false,
			error: `User @${targetUsername} not found in chat`,
		};
	}

	// Check sender balance
	const userBalance = getUserBalance(senderUsername);
	if (!userBalance.isValid) {
		return {
			success: false,
			error: "Unable to verify your balance. Please try again later.",
		};
	}

	if (amount > userBalance.balance) {
		return {
			success: false,
			error: `Insufficient balance. You have ${userBalance.balance} ${userBalance.currency}`,
		};
	}

	// Update balances
	const newSenderBalance = userBalance.balance - amount;
	const senderUpdateSuccess = updateUserBalance(
		senderUsername,
		newSenderBalance
	);

	if (!senderUpdateSuccess) {
		return {
			success: false,
			error: "Failed to process transaction. Please try again.",
		};
	}

	const recipientBalance = getUserBalance(targetUsername);
	if (!recipientBalance.isValid) {
		// Rollback sender balance
		updateUserBalance(senderUsername, userBalance.balance);
		return {
			success: false,
			error: "Unable to verify recipient balance. Transaction cancelled.",
		};
	}

	const recipientUpdateSuccess = updateUserBalance(
		targetUsername,
		recipientBalance.balance + amount
	);

	if (!recipientUpdateSuccess) {
		// Rollback sender balance
		updateUserBalance(senderUsername, userBalance.balance);
		return {
			success: false,
			error: "Failed to complete transaction. Please try again.",
		};
	}

	// Create tip system message (we'll use SystemMessage for tips)
	const tipMessage: SystemMessage = {
		id: Date.now().toString(),
		type: "system",
		userId: "system",
		username: "System",
		avatar: "/system-avatar.png",
		timestamp: new Date(),
		country: "💰",
		ringColor: "ring-green-500",
		content: `💰 @${senderUsername} tipped ${amount} ${userBalance.currency} to @${targetUsername}!`,
		systemType: "tip",
		relatedData: {
			sender: senderUsername,
			recipient: targetUsername,
			amount: amount,
			currency: userBalance.currency,
		},
	};

	return {
		success: true,
		message: tipMessage,
	};
};

// Create system message for rain announcement
export const createRainSystemMessage = (
	rainMessage: RainMessage
): SystemMessage => {
	const recipientsText =
		rainMessage.recipients.length === 1
			? `@${rainMessage.recipients[0]}`
			: rainMessage.target === "all"
			? "everyone"
			: `${rainMessage.recipients.length} users`;

	return {
		id: (Date.now() + 1).toString(),
		type: "system",
		userId: "system",
		username: "System",
		avatar: "/system-avatar.png",
		timestamp: new Date(),
		country: "💸",
		ringColor: "ring-green-500",
		content: `💸 @${rainMessage.username} rained ${rainMessage.amount} ${
			rainMessage.currency
		} on ${recipientsText}! (${rainMessage.distributedAmount.toFixed(
			2
		)} each)`,
		systemType: "rain",
		relatedData: {
			animation: true,
			amount: rainMessage.amount,
			currency: rainMessage.currency,
			recipients: rainMessage.recipients,
		},
	};
};

// Create error system message
export const createErrorSystemMessage = (error: string): SystemMessage => {
	return {
		id: Date.now().toString(),
		type: "system",
		userId: "system",
		username: "System",
		avatar: "/system-avatar.png",
		timestamp: new Date(),
		country: "❌",
		ringColor: "ring-red-500",
		content: `❌ ${error}`,
		systemType: "error",
	};
};
