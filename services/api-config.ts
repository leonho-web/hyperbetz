// API Configuration for third-party services
export const API_CONFIG = {
	// Tenor API (Google's GIF platform)
	tenor: {
		apiKey: process.env.NEXT_PUBLIC_TENOR_API_KEY || "", // Remove hardcoded demo key
		baseUrl: "https://tenor.googleapis.com/v2",
	},

	// Emoji API
	emoji: {
		apiKey: process.env.NEXT_PUBLIC_EMOJI_API_KEY || "", // Remove hardcoded demo key
		baseUrl: "https://emoji-api.com",
	},

	// Alternative: Giphy API (if you prefer Giphy over Tenor)
	giphy: {
		apiKey: process.env.NEXT_PUBLIC_GIPHY_API_KEY || "",
		baseUrl: "https://api.giphy.com/v1",
	},
};

// Rate limiting and caching helpers
export const createApiUrl = (
	service: keyof typeof API_CONFIG,
	endpoint: string,
	params: Record<string, string>
) => {
	const config = API_CONFIG[service];

	// Validate API key exists
	if (!config.apiKey) {
		throw new Error(
			`API key not configured for ${service}. Please set the appropriate environment variable.`
		);
	}

	const url = new URL(`${config.baseUrl}/${endpoint}`);

	// Add API key
	if (service === "tenor") {
		url.searchParams.set("key", config.apiKey);
	} else if (service === "emoji") {
		url.searchParams.set("access_key", config.apiKey);
	} else if (service === "giphy") {
		url.searchParams.set("api_key", config.apiKey);
	}

	// Add other parameters
	Object.entries(params).forEach(([key, value]) => {
		url.searchParams.set(key, value);
	});

	return url.toString();
};
