// Cache for generated avatars to ensure consistency per user
const avatarCache = new Map<string, string>();

/**
 * Generate a random avatar for a user based on their username
 * Uses dicebear to create visual SVG avatars with consistent randomization per user
 * @param username - The username to generate avatar for
 * @param size - Size of the avatar (default: 40)
 * @returns Promise<SVG data URL string>
 */
export async function generateUserAvatarAsync(
	username: string,
	size: number = 40
): Promise<string> {
	// Check if we're in a browser environment
	if (typeof window === "undefined") {
		console.log(
			"generateUserAvatar called on server side, returning empty string"
		);
		return "";
	}

	// Check if we already generated an avatar for this user
	const cacheKey = `${username}_${size}`;
	if (avatarCache.has(cacheKey)) {
		return avatarCache.get(cacheKey)!;
	}

	try {
		// Dynamic imports for client-side only - using adventurer style for visual SVG avatars
		const { createAvatar } = await import("@dicebear/core");
		const { adventurer } = await import("@dicebear/collection");

		// Use username as seed for consistent randomization
		const seed = username;

		const avatar = createAvatar(adventurer, {
			seed,
			size,
		});

		const svgString = avatar.toString();

		// Use browser's btoa function to encode to base64
		let dataUrl: string;
		try {
			dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
		} catch {
			// If btoa fails, use URL encoding as fallback
			console.warn("btoa failed, using URL encoding fallback");
			dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
				svgString
			)}`;
		}

		// Cache the result
		avatarCache.set(cacheKey, dataUrl);

		return dataUrl;
	} catch (error) {
		console.error("Failed to generate avatar for user:", username, error);
		return "";
	}
}

/**
 * Synchronous version that returns cached result or empty string
 */
export function generateUserAvatar(
	username: string,
	size: number = 40
): string {
	// Check if we're in a browser environment
	if (typeof window === "undefined") {
		console.log(
			"generateUserAvatar called on server side, returning empty string"
		);
		return "";
	}

	// Check if we already generated an avatar for this user
	const cacheKey = `${username}_${size}`;
	if (avatarCache.has(cacheKey)) {
		return avatarCache.get(cacheKey)!;
	}

	// If not cached, trigger async generation but return empty for now
	generateUserAvatarAsync(username, size).catch(console.error);
	return "";
}

/**
 * Clear the avatar cache (useful for testing or memory management)
 */
export function clearAvatarCache(): void {
	avatarCache.clear();
}

/**
 * Get cache size for debugging
 */
export function getAvatarCacheSize(): number {
	return avatarCache.size;
}
