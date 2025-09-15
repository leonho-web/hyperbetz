// --- Base Response Structure ---

// --- 1. getTokenList ---
export interface Token {
	symbol: string;
	name: string;
	decimals: number;
	address: string;
	icon: string;
	tags: string[];
	balance: string;
	usd_price: string;
	usdAmount?: string; // Dynamic USD amount from price API (optional)
}
export interface GetTokenListRequest {
	network: string;
	walletAddress: string;
	username: string;
}
export type GetTokenListResponse = Token[];

// --- 2. getConversion & 3. getAllowance ---
export interface AllowanceOrConversionData {
	unit: string;
	allowance: string;
	contractAddress: string;
}
export interface GetConversionRequest {
	network: string;
	fromToken: string;
	toToken: string;
	amount: number;
	username: string;
}
export type GetConversionResponse = AllowanceOrConversionData;

export interface GetAllowanceRequest {
	walletAddress: string;
	network: string;
	fromToken: string;
	username: string;
}
export type GetAllowanceResponse = AllowanceOrConversionData;

// --- 4. swap ---
export interface SwapData {
	from: string;
	to: string;
	data: string;
	value: string;
	gas: number;
	gasPrice: string;
}
export interface SwapRequest {
	network: string;
	fromToken: string;
	toToken: string;
	walletAddress: string;
	slippage: string;
	amount: string;
	username: string;
}
export type SwapResponse = SwapData;

// --- 5. getGasFee ---
export interface GasFeeTier {
	maxPriorityFeePerGas: string;
	maxFeePerGas: string;
}
export interface GasFeeData {
	baseFee: string;
	low: GasFeeTier;
	medium: GasFeeTier;
	high: GasFeeTier;
	instant: GasFeeTier;
}
export interface GetGasFeeRequest {
	network: string;
	username: string;
}
// Note: The response body for this one is slightly different from the others
export type GetGasFeeResponse = { error: false; data: GasFeeData };

// --- 6. tokenPrice ---
export interface TokenPriceData {
	currency: string;
	token_1: string;
	token_2: string;
}
export interface TokenPriceRequest {
	network: string;
	fromToken: string;
	toToken: string;
	username: string;
}
export type TokenPriceResponse = TokenPriceData;

// --- 7. getDstSwap ---
export interface DstSwapData {
	token_address: string;
	token_name: string;
	token_symbol: string;
	wallet_address: string;
}
export interface GetDstSwapRequest {
	network: number;
	username: string;
}
export type GetDstSwapResponse = DstSwapData;

// --- 8. depositWalletSwap ---
export interface DepositWalletSwapRequest {
	username: string;
	hash: string;
	network: string;
	amount: string;
}
// This endpoint returns a simple success message
export type DepositWalletSwapResponse = { error: false; message: "Success" };

// --- A Union Type for all possible successful responses ---
export type SwapApiSuccessResponse =
	| GetTokenListResponse
	| GetConversionResponse
	| GetAllowanceResponse
	| SwapResponse
	| GetGasFeeResponse
	| TokenPriceResponse
	| GetDstSwapResponse
	| DepositWalletSwapResponse;
