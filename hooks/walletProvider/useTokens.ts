"use client";

import { useAppStore } from "@/store/store";
import {
	selectNativeToken,
	selectUsdtToken,
	selectUsdxToken,
} from "@/store/selectors/blockchain/blockchain.selectors";
import { useCallback, useMemo } from "react";
import { useDynamicAuth } from "../useDynamicAuth";

/**
 * A dedicated "Selector Hook" that provides a clean, public-facing API
 * for accessing all token-related state from the central Zustand store.
 *
 * It uses memoized selectors for performance and provides a consistent data
 * shape to any UI component that consumes it.
 */
export const useTokens = () => {
	// --- 1. Select State and Actions from the Store ---
	const { user, authToken } = useDynamicAuth();

	// Select the raw state from the token slice
	const tokens = useAppStore((state) => state.blockchain.token.tokens);
	const tokenFetchStatus = useAppStore(
		(state) => state.blockchain.token.tokenFetchStatus
	);
	// Select the primary action from the token slice
	const fetchTokens = useAppStore(
		(state) => state.blockchain.token.fetchTokens
	);

	// --- 2. Use Memoized Selectors to Get Derived Data ---
	// This is highly efficient. These values will only be recalculated if the
	// underlying `tokens` array actually changes.
	const nativeToken = useAppStore(selectNativeToken);
	const usdt = useAppStore(selectUsdtToken);
	const usdx = useAppStore(selectUsdxToken);

	// --- 3. Compute Derived UI State ---
	// Create the `isTokensLoading` boolean for easy use in UI components.
	const isTokensLoading = useMemo(
		() => tokenFetchStatus === "loading" || tokenFetchStatus === "idle",
		[tokenFetchStatus]
	);

	const refreshTokens = useCallback(() => {
		// This is the critical step: we ensure the action receives the auth context.
		// The `force: true` flag ensures the guard clause in the slice is bypassed.
		fetchTokens(true, { user, authToken });
	}, [fetchTokens, user, authToken]);

	// --- 4. Return the Final, Public API ---
	// This return object's structure perfectly mirrors your original useTokens hook.
	return {
		tokens,
		nativeToken,
		usdt,
		usdx,
		isTokensLoading,
		fetchTokens,
		refreshTokens,
	};
};
