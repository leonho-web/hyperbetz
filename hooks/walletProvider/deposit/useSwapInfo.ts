"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/store/store";
import { SwapInfo } from "@/types/walletProvider/transaction-service.types";
import { useDynamicAuth } from "@/hooks/useDynamicAuth";
import TransactionService from "@/services/walletProvider/TransactionService";

/**
 * A dedicated, robust hook to fetch and provide the destination wallet
 * information required for performing swaps.
 *
 * It is resilient to race conditions and memory leaks by using a useEffect
 * cleanup function to cancel obsolete state updates.
 *
 * @returns An object containing the `dstSwapInfo` and a `isLoading` flag.
 */
export const useSwapInfo = () => {
	const { chainId } = useAppStore((state) => state.blockchain.network);
	const { user, authToken, isLoggedIn } = useDynamicAuth();
	const username = user?.username;

	const [dstSwapInfo, setDstSwapInfo] = useState<SwapInfo | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		// A flag to prevent state updates if the component unmounts or the dependencies change
		// before the async operation completes.
		let isActive = true;

		const fetchDstSwap = async () => {
			// Guard clause: Do not run if essential information is missing.
			if (!isLoggedIn || !chainId || !username || !authToken) {
				setDstSwapInfo(null);
				return;
			}

			setIsLoading(true);
			try {
				const transactionService = TransactionService.getInstance();
				const result = await transactionService.getDestinationSwapInfo(
					String(chainId),
					username,
					authToken
				);

				// --- THE CRITICAL CHECK ---
				// Only update the state if this effect is still the "active" one.
				if (isActive) {
					if (result.success && result.swapInfo) {
						setDstSwapInfo(result.swapInfo);
					} else {
						setDstSwapInfo(null);
						console.error(
							"Failed to fetch destination swap info:",
							result.error
						);
					}
				}
			} catch (error) {
				if (isActive) {
					setDstSwapInfo(null);
					console.error(
						"An unexpected error occurred while fetching swap info:",
						error
					);
				}
			} finally {
				if (isActive) {
					setIsLoading(false);
				}
			}
		};

		fetchDstSwap();

		// --- THE CLEANUP FUNCTION ---
		// This function runs when the component unmounts OR when the effect is re-run
		// due to a dependency change (e.g., the user switches networks).
		return () => {
			isActive = false;
		};
	}, [chainId, isLoggedIn, username, authToken]);

	return {
		dstSwapInfo,
		isLoading,
	};
};
