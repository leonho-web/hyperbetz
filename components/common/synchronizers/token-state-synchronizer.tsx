// "use a client";

// import { useEffect, useRef } from "react";
// import { useAppStore } from "@/store/store";
// import { useDynamicAuth } from "@/hooks/useDynamicAuth";

// /**
//  * An invisible "bridge" component with a single responsibility:
//  * to synchronize the user's token list with the current network.
//  * It listens for changes to the `chainId` in the `network` slice and
//  * triggers the `fetchTokens` action in the `token` slice.
//  */
// export const TokenStateSynchronizer = () => {
// 	// 1. Get the relevant STATE from the store.
// 	// We select the `chainId` to use as our primary trigger.
// 	const chainId = useAppStore((state) => state.blockchain.network.chainId);
// 	const { user, authToken } = useDynamicAuth();

// 	// 2. Get the relevant ACTIONS from the store.
// 	const fetchTokens = useAppStore(
// 		(state) => state.blockchain.token.fetchTokens
// 	);
// 	const clearTokens = useAppStore(
// 		(state) => state.blockchain.token._clearTokens
// 	);

// 	// 3. Use a ref to track the last network we fetched tokens for.
// 	// This is a crucial optimization to prevent redundant API calls.
// 	const lastFetchedChainId = useRef<number | null>(null);

// 	// 4. The main effect that triggers the data fetching.
// 	useEffect(() => {
// 		// Guard clause: If there is no chainId, the user is likely disconnected.
// 		// We should clear any existing token data.
// 		if (!chainId) {
// 			clearTokens();
// 			lastFetchedChainId.current = null; // Reset the ref
// 			return;
// 		}

// 		// Optimization: If the current chainId is the same as the one we last
// 		// fetched for, do nothing. This prevents re-fetching when other
// 		// parts of the app cause a re-render.
// 		if (chainId === lastFetchedChainId.current) {
// 			return;
// 		}

// 		// If we've reached here, the network has changed.
// 		console.log(
// 			`Network changed to Chain ID: ${chainId}. Fetching new token list...`,
// 			`Passing user and authToken: ${user} and ${authToken.slice(
// 				0,
// 				10
// 			)}...`
// 		);

// 		// Trigger the fetch action for the new network.
// 		fetchTokens(false, { user, authToken });

// 		// After triggering the fetch, update the ref to the current chainId.
// 		lastFetchedChainId.current = chainId;
// 	}, [chainId]); // This effect re-runs whenever the chainId changes.
// 	// }, [chainId, fetchTokens, clearTokens]); // This effect re-runs whenever the chainId changes.

// 	// This component renders nothing to the DOM.
// 	return null;
// };

"use client";

import { useEffect, useRef, useCallback } from "react"; // <-- Import useCallback
import { useAppStore } from "@/store/store";
import { useDynamicAuth } from "@/hooks/useDynamicAuth";

export const TokenStateSynchronizer = () => {
	// --- 1. Get State & Dependencies ---
	const { user, authToken } = useDynamicAuth();
	const chainId = useAppStore((state) => state.blockchain.network.chainId);

	// --- 2. Get Actions from the store ---
	const fetchTokensAction = useAppStore(
		(state) => state.blockchain.token.fetchTokens
	);
	const clearTokensAction = useAppStore(
		(state) => state.blockchain.token._clearTokens
	);

	// --- 3. THE FIX (Part 1): Wrap actions in useCallback ---
	// This memoizes the functions, making them stable dependencies for the main useEffect.
	const fetchTokens = useCallback(
		(...args: Parameters<typeof fetchTokensAction>) => {
			return fetchTokensAction(...args);
		},
		[fetchTokensAction]
	);

	const clearTokens = useCallback(() => {
		return clearTokensAction();
	}, [clearTokensAction]);

	const lastFetchedChainId = useRef<number | null>(null);

	// --- 4. The main effect ---
	useEffect(() => {
		// Guard clause: If dependencies aren't ready, clear the state.
		if (!chainId || !user || !authToken) {
			clearTokens();
			lastFetchedChainId.current = null;
			return;
		}

		if (chainId === lastFetchedChainId.current) {
			return;
		}

		// console.log(
		// 	`Network changed to Chain ID: ${chainId}. Fetching new token list...`
		// );

		// --- 5. THE FIX (Part 2): Call the action with the correct arguments ---
		// The dependencies object is the first argument.
		fetchTokens(true, { user, authToken });

		lastFetchedChainId.current = chainId;

		// --- 6. THE FIX (Part 3): Add `user` and `authToken` to the dependency array ---
		// This ensures the effect re-runs if the user logs in on the same network.
	}, [chainId, user, authToken, fetchTokens, clearTokens]);

	return null;
};
