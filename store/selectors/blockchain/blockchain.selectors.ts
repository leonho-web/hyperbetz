import { AppStore } from "@/store/store";
import { Token } from "@/types/blockchain/swap.types";
import { TransactionStatus } from "@/types/blockchain/transactions.types";
import { createSelector } from "reselect";

// --- BASE SELECTORS for the Blockchain domain ---
const selectTransactions = (state: AppStore) =>
	state.blockchain.transaction.transactions;
const selectAllTokens = (state: AppStore) => state.blockchain.token.tokens;

// --- TRANSACTION SELECTORS ---

/**
 * Selects the count of transactions that are currently in the "pending" state.
 */
export const selectPendingTransactionCount = createSelector(
	[selectTransactions],
	(transactions) =>
		transactions.filter((tx) => tx.status === TransactionStatus.PENDING)
			.length
);

/**
 * Selects the most recently added transaction from the list.
 */
export const selectMostRecentTransaction = createSelector(
	[selectTransactions],
	(transactions) => (transactions.length > 0 ? transactions[0] : null)
);

// --- TOKEN SELECTORS ---
// This is also the perfect home for token-related selectors.

/**
 * Selects the native token from the full token list.
 */
export const selectNativeToken = createSelector(
	[selectAllTokens],
	(tokens: Token[]) => tokens.find((t) => t.tags?.includes("native")) || null
);

/**
 * Selects the USDT token from the full token list.
 */
export const selectUsdtToken = createSelector(
	[selectAllTokens],
	(tokens: Token[]) =>
		tokens.find((t) => t.symbol.toUpperCase() === "USDT") || null
);

// --- TOKEN SELECTORS (Now Complete) ---
/**
 * [NEW] Selects the USDX token from the full token list, case-insensitively.
 */
export const selectUsdxToken = createSelector(
	[selectAllTokens],
	(tokens: Token[]) =>
		tokens.find((t) => t.symbol.toUpperCase() === "USDX") || null
);
