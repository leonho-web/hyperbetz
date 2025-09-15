// src/types/auth/types.ts

// NOTE: This import seems to create a circular dependency if UserData from localStorageService also imports from this file.
// It's generally better for services to import types, not the other way around.
// I'm keeping it as you provided, but it's something to be aware of.
import { UserData } from "@/services/localStorageService";

/**
 * Defines the balance information for a specific cryptocurrency token.
 */
export interface TokenBalance {
	tokenSymbol: string;
	tokenName: string;
	decimals: number;
	tokenContractAddress: string;
	tokenIcon: string;
	freetoken: boolean;
}

/**
 * Defines the raw data structure for a user's social login information,
 * typically from a service like Dynamic.xyz.
 */
interface SocialData {
	address?: string;
	chain?: string;
	id: string;
	nameService?: Record<string, unknown>;
	publicIdentifier: string;
	walletName?: string;
	walletProvider?: string;
	format: "blockchain" | "email" | "oauth";
	lastSelectedAt?: string;
	signInEnabled: boolean;
	email?: string;
	oauthProvider?: string;
	oauthUsername?: string;
	oauthDisplayName?: string;
	oauthAccountId?: string;
	oauthAccountPhotos?: string[];
	oauthEmails?: string[];
	oauthMetadata?: Record<string, unknown>;
}

/**
 * Represents the complete, raw user data structure as it is received directly from the backend API.
 * This interface should be used for typing the direct output of API calls before it's mapped to the application's internal `User` model.
 */
export interface UserInfoApiResponse {
	username: string;
	nickname: string;
	wallet_address: string;
	balance: number;
	balanceToken: TokenBalance[];
	status: string;
	depo_total: number;
	wd_total: number;
	layer: number;
	country: string;
	phone: string;
	email: string;
	sessionId: string;
	last_login: string;
	last_ip: string;
	referrer: string;
	referral_id: string;
	pendingDepo: boolean;
	pendingDepoNetwork: string;
	pendingDepoAmount: string;
	pendingDepoCurrency: string;
	pendingWd: boolean;
	pendingWdNetwork: string;
	pendingWdAmount: string;
	pendingWdCurrency: string;
	auto_depo: string;
	auto_wd: string;
	last_time_wd: string;
	total_wd_today: number;
	max_wd_perday: number;
	totp_username: string;
	totp_secret: string;
	totp_qr: string;
	twofa_type: string;
	login_type: string;
	social?: {
		data?: Array<SocialData>;
	};
}

/**
 * Defines the primary, normalized User object used throughout the application's internal state (e.g., in React context, UI components).
 * This model is typically created by mapping data from `UserInfoApiResponse` to a more consistent and UI-friendly structure.
 */
export interface User {
	id: string;
	username: string;
	nickname: string;
	email?: string;
	avatar?: string;
	balance: number;
	balanceToken: TokenBalance[];
	vipLevel: string;
	isVerified: boolean;
	walletAddress?: string;
	authMethod: "email" | "wallet" | "oauth";
	status: string;
	country: string;
	phone: string;
	sessionId: string;
	pendingDepo: boolean;
	autodepo: "ON" | "OFF";
	lastLogin: string;
	referralId: string;
	depositTotal: number;
	withdrawTotal: number;
	socialData?: Array<SocialData>;
	/** The user's setting for automatic withdrawals ('ON' or 'OFF'). */
	autowd: string;
	pendingWd: boolean;
}

/**
 * Defines the possible states of a user's account in the application.
 * This is more scalable than a simple boolean flag.
 * - 'guest': The user is not logged in.
 * - 'pending_registration': The user is authenticated but needs to complete profile setup (e.g., set a nickname).
 * - 'authenticated': The user is fully logged in and registered.
 */
export type AccountStatus = "guest" | "pending_registration" | "authenticated";

/**
 * Defines the complete shape of the authentication context's value.
 * This context provides user state, login/logout functions, and loading status to all consuming components.
 */
export interface AuthContextType {
	/** The currently authenticated user object, or null if no user is logged in. */
	user: User | null;
	/** Raw user data, possibly from an intermediate service or local storage. */
	userData: UserData | null;
	/** A boolean flag indicating if a user is currently authenticated. */
	isLoggedIn: boolean;
	/** A boolean flag indicating if a crypto wallet is connected. */
	isWalletConnected: boolean;
	/** A boolean flag indicating if an authentication-related process (e.g., fetching user data) is in progress. */
	isLoading: boolean;
	/** A boolean flag indicating that the initial authentication check on app load has completed. */
	isAuthCheckComplete: boolean;
	/** Auth token that is allocated after authentication has successfully completed */
	authToken: string;

	/** A function to initiate the login process. */
	login: () => void;
	/** A function to log the user out and clear their session. */
	logout: () => void;
	/** A function to manually trigger a refresh of the user's data from the backend. */
	refreshUserData: (chainId?: number) => void;
	/** A stateful boolean to control the visibility of the login modal. */
	showLoginModal: boolean;
	/** The setter function for `showLoginModal`. */
	setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
	accountStatus: AccountStatus;
	onRegisterSubmit: (nickname: string, referrer_id?: string) => Promise<void>;
}

/**
 * Defines the shape of the request body for registering a new wallet.
 * This is typically sent to the backend when a user is linking a new wallet address to their account.
 */
export interface RegisterWalletRequestBody {
	wallet_address: string;
	nickname: string;
	referrer_id?: string;
	login_type: string;
}
