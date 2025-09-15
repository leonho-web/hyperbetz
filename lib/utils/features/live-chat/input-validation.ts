/**
 * Input validation and sanitization utilities for live chat
 */

// Maximum message length to prevent spam and maintain performance
export const MAX_MESSAGE_LENGTH = 500;
export const MAX_USERNAME_LENGTH = 50;
export const MAX_CAPTION_LENGTH = 200;

// Regex patterns for validation
const VALID_USERNAME_PATTERN = /^[a-zA-Z0-9_-]+$/;
const HARMFUL_PATTERNS = [
	/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script tags
	/javascript:/gi, // JavaScript URLs
	/on\w+\s*=/gi, // Event handlers
	/data:.*base64/gi, // Base64 data URLs (potential XSS)
];

/**
 * Sanitize message content to prevent XSS attacks
 */
export const sanitizeMessageContent = (content: string): string => {
	if (!content || typeof content !== "string") {
		return "";
	}

	let sanitized = content.trim();

	// Remove harmful patterns
	HARMFUL_PATTERNS.forEach((pattern) => {
		sanitized = sanitized.replace(pattern, "");
	});

	// Encode HTML entities
	sanitized = sanitized
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#x27;");

	return sanitized.slice(0, MAX_MESSAGE_LENGTH);
};

/**
 * Validate username format
 */
export const validateUsername = (
	username: string
): { isValid: boolean; error?: string } => {
	if (!username || typeof username !== "string") {
		return { isValid: false, error: "Username is required" };
	}

	const trimmed = username.trim();

	if (trimmed.length === 0) {
		return { isValid: false, error: "Username cannot be empty" };
	}

	if (trimmed.length > MAX_USERNAME_LENGTH) {
		return {
			isValid: false,
			error: `Username too long (max ${MAX_USERNAME_LENGTH} characters)`,
		};
	}

	if (!VALID_USERNAME_PATTERN.test(trimmed)) {
		return {
			isValid: false,
			error: "Username can only contain letters, numbers, hyphens, and underscores",
		};
	}

	return { isValid: true };
};

/**
 * Validate message content
 */
export const validateMessageContent = (
	content: string
): { isValid: boolean; error?: string } => {
	if (!content || typeof content !== "string") {
		return { isValid: false, error: "Message content is required" };
	}

	const trimmed = content.trim();

	if (trimmed.length === 0) {
		return { isValid: false, error: "Message cannot be empty" };
	}

	if (trimmed.length > MAX_MESSAGE_LENGTH) {
		return {
			isValid: false,
			error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)`,
		};
	}

	return { isValid: true };
};

/**
 * Validate and sanitize slash command input
 */
export const validateSlashCommand = (
	input: string
): { isValid: boolean; sanitized?: string; error?: string } => {
	if (!input || typeof input !== "string") {
		return { isValid: false, error: "Command is required" };
	}

	const trimmed = input.trim();

	if (!trimmed.startsWith("/")) {
		return { isValid: false, error: "Command must start with /" };
	}

	if (trimmed.length > MAX_MESSAGE_LENGTH) {
		return { isValid: false, error: "Command too long" };
	}

	// Basic sanitization for slash commands
	const sanitized = trimmed.replace(/[<>'"]/g, "");

	return { isValid: true, sanitized };
};

/**
 * Validate file upload
 */
export const validateImageUpload = (
	file: File
): { isValid: boolean; error?: string } => {
	if (!file) {
		return { isValid: false, error: "File is required" };
	}

	// Check file type
	if (!file.type.startsWith("image/")) {
		return { isValid: false, error: "Only image files are allowed" };
	}

	// Check file size (max 5MB)
	const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
	if (file.size > MAX_FILE_SIZE) {
		return { isValid: false, error: "File size too large (max 5MB)" };
	}

	// Check for potentially malicious file extensions
	const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
	const fileExtension = file.name
		.toLowerCase()
		.substring(file.name.lastIndexOf("."));

	if (!allowedExtensions.includes(fileExtension)) {
		return { isValid: false, error: "File type not supported" };
	}

	return { isValid: true };
};

/**
 * Rate limiting for messages (client-side)
 */
class MessageRateLimiter {
	private messageTimestamps: number[] = [];
	private readonly maxMessages = 10; // Max messages per minute
	private readonly timeWindow = 60 * 1000; // 1 minute

	canSendMessage(): boolean {
		const now = Date.now();

		// Remove old timestamps
		this.messageTimestamps = this.messageTimestamps.filter(
			(timestamp) => now - timestamp < this.timeWindow
		);

		return this.messageTimestamps.length < this.maxMessages;
	}

	recordMessage(): void {
		this.messageTimestamps.push(Date.now());
	}

	getTimeUntilNextMessage(): number {
		if (this.canSendMessage()) return 0;

		const oldestTimestamp = Math.min(...this.messageTimestamps);
		return this.timeWindow - (Date.now() - oldestTimestamp);
	}
}

export const messageRateLimiter = new MessageRateLimiter();
