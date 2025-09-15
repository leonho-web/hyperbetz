import { User, UserInfoApiResponse } from "@/types/auth/auth.types";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import LocalStorageService, { UserData } from "@/services/localStorageService";

/**
 * Maps the raw user data object from the API to the application's internal `User` model.
 * This function acts as a crucial "anti-corruption layer," ensuring that the rest of the application
 * works with a clean, consistent, and predictable user object, regardless of the API's structure.
 *
 * @param apiUser - The raw user object received directly from the backend (`UserInfoApiResponse`).
 * @returns A clean, normalized `User` object ready for use in the application's state.
 */
const convertApiUserToUser = (apiUser: UserInfoApiResponse): User => {
	// Gracefully handle cases where social data might be missing from the API response.

	// console.log("This is apiUser", apiUser);

	const socialData = apiUser.social?.data || [];

	// Isolate specific social profiles to make logic clearer and more robust.
	const walletData = socialData.find((item) => item.format === "blockchain");
	const emailData = socialData.find((item) => item.format === "email");
	const oauthData = socialData.find((item) => item.format === "oauth");

	// Determine the primary authentication method based on the available social data.
	// This can be useful for UI elements, like showing a "connected with Google" badge.
	let authMethod: "email" | "wallet" | "oauth" = "wallet"; // Default assumption
	if (walletData) authMethod = "wallet";
	else if (oauthData) authMethod = "oauth";
	else if (emailData) authMethod = "email";

	// Construct the final, normalized User object for the application.
	return {
		id: apiUser.sessionId,
		username: apiUser.username,
		nickname: apiUser.nickname,
		autowd: apiUser.auto_wd,
		// Prioritize the verified email from social data, but fall back to the API's email.
		email: emailData?.publicIdentifier || apiUser.email,
		// Use the OAuth provider's photo as the avatar, if available.
		avatar: oauthData?.oauthAccountPhotos?.[0],
		balance: apiUser.balance,
		balanceToken: apiUser.balanceToken,
		// Make the VIP level more presentable for the UI.
		vipLevel: `Level ${apiUser.layer}`,
		isVerified: apiUser.status === "ACTIVE",
		// Prioritize the wallet address from social data, but fall back to the API's address.
		walletAddress: walletData?.address || apiUser.wallet_address,
		authMethod,
		status: apiUser.status,
		country: apiUser.country,
		phone: apiUser.phone,
		sessionId: apiUser.sessionId,
		lastLogin: apiUser.last_login,
		referralId: apiUser.referral_id,
		depositTotal: apiUser.depo_total,
		withdrawTotal: apiUser.wd_total,
		pendingDepo: apiUser.pendingDepo,
		autodepo: apiUser.auto_depo as "ON" | "OFF",
		pendingWd: apiUser.pendingWd,
		// Pass the raw social data through for any components that might need it.
		socialData: socialData,
	};
};

/**
 * Transforms the application's internal `User` object into the `UserData` format
 * suitable for persisting in `localStorage`. This is essential for preserving long-term,
 * client-side data that doesn't need to be fetched from the API on every session.
 *
 * @param user - The application's internal, normalized `User` object.
 * @returns A `UserData` object ready to be stringified and saved to `localStorage`.
 */
const convertUserToUserData = (user: User): UserData => {
	const storageService = LocalStorageService.getInstance();
	// IMPORTANT: First, retrieve any existing data from localStorage.
	const existingData = storageService.getUserData();

	// console.log("existingData from convertedUserToUserData", existingData);

	// This "hydration" or "merge" pattern is critical. It updates core user info
	// while preserving long-term stats that are only stored on the client.
	return {
		// --- Data updated from the live User object ---
		id: user.id,
		username: user.username,
		email: user.email || "",
		balance: user.balance,
		vipLevel: user.vipLevel,
		isVerified: user.isVerified,
		referralId: user.referralId || "",

		// --- Data preserved from existing localStorage entry ---
		// If there's no existing joinDate, set it to now. Otherwise, keep the old one.
		joinDate: existingData?.joinDate || new Date().toISOString(),
		totalWagered: existingData?.totalWagered || 0,
		totalWon: existingData?.totalWon || 0,
		gamesPlayed: existingData?.gamesPlayed || 0,
		winRate: existingData?.winRate || 0,
		biggestWin: existingData?.biggestWin || 0,
		favoriteGame: existingData?.favoriteGame || "Crash", // Default favorite game
		achievements: existingData?.achievements || [],
		bonuses: existingData?.bonuses || [],
		gameHistory: existingData?.gameHistory || [],
		favorites: existingData?.favorites || [],
	};
};

/**
 * Constructs a temporary, partial `User` object as a fallback mechanism.
 * This is used when the main backend API call fails or is in progress, allowing the UI
 * to render a basic, personalized state using data from the authentication provider (Dynamic SDK).
 * This provides a graceful degradation of the user experience instead of a blank screen.
 *
 * @param dynamicUser - The user object from the `useDynamicContext` hook.
 * @param primaryWallet - The primary wallet object from the `useDynamicContext` hook.
 * @returns A temporary `User` object with sensible default values.
 */
const createTemporaryUser = (
	dynamicUser: ReturnType<typeof useDynamicContext>["user"],
	primaryWallet: ReturnType<typeof useDynamicContext>["primaryWallet"]
): User => {
	return {
		// --- Information derived from the auth provider ---
		id: dynamicUser?.userId || "temp-id",
		// Create a username from the best available info, with multiple fallbacks.
		// 1. Try the first name.
		// 2. Try the part of the email before the '@'.
		// 3. Try the first 8 characters of the wallet address.
		// 4. Finally, default to "User".
		autowd: "OFF", // Default to OFF for temporary users
		username:
			dynamicUser?.firstName ||
			dynamicUser?.email?.split("@")[0] ||
			primaryWallet?.address?.slice(0, 8) ||
			"User",
		nickname: dynamicUser?.firstName || "Player",
		email: dynamicUser?.email,
		walletAddress: primaryWallet?.address,

		// --- Sensible defaults for a temporary/unloaded state ---
		avatar: undefined,
		balance: 0,
		balanceToken: [],
		vipLevel: "Bronze",
		isVerified: false,
		authMethod: "wallet",
		status: "ACTIVE", // Assume active until told otherwise
		country: "Unknown",
		phone: "",
		sessionId: "temp-session",
		lastLogin: new Date().toISOString(),
		referralId: "",
		depositTotal: 0,
		withdrawTotal: 0,
		socialData: [],
		autodepo: "OFF",
		pendingDepo: false,
		pendingWd: false, // Default to false for temporary users
	};
};

export { convertApiUserToUser, convertUserToUserData, createTemporaryUser };
