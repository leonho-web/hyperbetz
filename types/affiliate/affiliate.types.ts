// Affiliate API Types

/**
 * Represents a single affiliate rate level returned by getAffiliateRate.
 */
export interface AffiliateRate {
	/** Percentage for lottery games (can be null) */
	lottery_percent: string | null;
	/** Percentage for sport games */
	sport_percent: string;
	/** Percentage for live casino games */
	lc_percent: string;
	/** Percentage for slot games */
	slot_percent: string;
	/** Affiliate level */
	level: string;
	/** Minimum turnover for this level */
	min_to: string;
	/** Maximum turnover for this level */
	max_to: string;
}

/**
 * Response for getAffiliateRate API.
 */
export interface GetAffiliateRateResponse {
	/** Indicates if there was an error */
	error: boolean;
	/** Array of affiliate rate levels */
	data: AffiliateRate[];
}

/**
 * Bonus data structure used in multiple affiliate bonus APIs.
 */
export interface AffiliateBonusData {
	/** Bonus available to claim */
	available_bonus: number;
	/** Bonus pending approval or processing */
	pending_bonus: number;
	/** Total bonus earned */
	total_bonus: number;
}

/**
 * Response for getAffiliateBonus API.
 */
export interface GetAffiliateBonusResponse {
	/** Indicates if there was an error */
	error: boolean;
	/** Last claim amount */
	last_claim: number;
	/** Date of last claim */
	last_claim_date: string;
	/** Total wagered last month */
	last_month_total_wager: string;
	/** Status of bonus claim */
	status: boolean;
	/** Bonus data */
	data: AffiliateBonusData;
}

/**
 * Response for getAffiliateBonusByDownline API.
 */
export interface GetAffiliateBonusByDownlineResponse {
	/** Indicates if there was an error */
	error: boolean;
	/** Bonus data for downline */
	data: AffiliateBonusData;
}

/**
 * Response for getAffiliateHistory API.
 */
export interface GetAffiliateHistoryResponse {
	/** Indicates if there was an error */
	error: boolean;
	/** Bonus data for history */
	data: AffiliateBonusData;
}

/**
 * Request body for getAffiliateRate API.
 */
export interface GetAffiliateRateRequest {
	/** API key for authentication */
	api_key: string;
	/** Optional username for personalized rate */
	username?: string;
	/** Optional JWT type */
	jwt_type?: string;
}

/**
 * Request body for getAffiliateBonus API.
 */
export interface GetAffiliateBonusRequest {
	// /** API key for authentication */
	// api_key: string;
	/** Username for bonus lookup */
	username: string;
	// /** Optional JWT type */
	// jwt_type?: string;
}

/**
 * Request body for getAffiliateBonusByDownline API.
 */
export interface GetAffiliateBonusByDownlineRequest {
	// /** API key for authentication */
	// api_key: string;
	/** Username for downline bonus lookup */
	username: string;
	// /** Optional JWT type */
	// jwt_type?: string;
}

/**
 * Request body for getAffiliateHistory API.
 */
export interface GetAffiliateHistoryRequest {
	/** API key for authentication */
	api_key: string;
	/** Username for history lookup */
	username: string;
	/** Start date for history */
	from_date: string;
	/** End date for history */
	to_date: string;
	/** Page number for pagination */
	page_number: number;
	/** Number of records per page */
	limit: number;
	/** Optional JWT type */
	jwt_type?: string;
}

/**
 * Sorting options for getDownline API.
 */
export type DownlineOrder = "unclaimed_amount" | "last_login";

/**
 * A single downline record returned by getDownline.
 */
export interface DownlineEntry {
	/** Nickname of the referred user */
	nickname: string;
	/** Last deposit amount */
	last_deposit: number;
	/** Last deposit timestamp (YYYY-MM-DD HH:mm:ss) */
	last_deposit_date: string;
	/** Total wagered amount */
	total_wager: number;
	/** Affiliate tier level */
	tier: number;
	/** Unclaimed commission amount */
	unclaimed_amount: number;
	/** Currency/token code */
	token: string;
	/** Last login timestamp (YYYY-MM-DD HH:mm:ss) */
	last_login: string;
	/** Registration timestamp (YYYY-MM-DD HH:mm:ss) */
	date_registered: string;
}

/**
 * Request body for getDownline API.
 */
export interface GetDownlineRequest {
	/** API key for authentication */
	api_key: string;
	/** Username of the affiliate */
	username: string;
	/** Default password credential */
	password: string;
	/** Page number for pagination */
	page_number: number;
	/** Number of records per page */
	limit: number;
	/** Sort order: by unclaimed amount or last login */
	order: DownlineOrder;
	/** JWT type, e.g., "dyn" */
	jwt_type: string;
}

/**
 * Response for getDownline API.
 */
export interface GetDownlineResponse {
	/** Indicates if there was an error */
	error: boolean;
	/** Response message */
	message: string;
	/** Total number of records across all pages */
	total_data: number;
	/** Page indicator in "X of Y" format */
	page: string;
	/** Total unclaimed amount across the result set */
	total_unclaim: number;
	/** Total wager last month (can be null) */
	total_wager_last_month: number | null;
	/** Downline records */
	data: DownlineEntry[];
}

/**
 * Request body for claimAffiliateBonus API.
 * Note: api_key and jwt_type are attached by the ApiService.
 */
export interface ClaimAffiliateBonusRequest {
	/** Username who is claiming the bonus */
	username: string;
}

/**
 * Response for claimAffiliateBonus API.
 */
export interface ClaimAffiliateBonusResponse {
	/** Indicates if there was an error */
	error: boolean;
	/** Human-readable status message */
	message: string;
	/** Amount that was claimed in this operation */
	amount_claimed: number;
	/** Balance before the claim */
	last_balance: number;
	/** Balance after the claim */
	balance_final: number;
}
