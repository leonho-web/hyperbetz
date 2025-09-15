/**
 * useSwapTokenPrices.ts
 * Manages USD price fetching for swap tokens
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import TransactionService from "@/services/walletProvider/TransactionService";
import {
	UseSwapTokenPricesParams,
	UseSwapTokenPricesReturn,
} from "@/types/walletProvider/swap-hooks.types";
import { useAppStore } from "@/store/store";
import LocalStorageService from "@/services/localStorageService";

export const useSwapTokenPrices = ({
	fromToken,
	toToken,
}: UseSwapTokenPricesParams): UseSwapTokenPricesReturn => {
	// --- STATE ---
	const [fromTokenUsdPrice, setFromTokenUsdPrice] = useState<string>("");
	const [toTokenUsdPrice, setToTokenUsdPrice] = useState<string>("");
	const [isFetchingPrices, setIsFetchingPrices] = useState<boolean>(false);
	const { chainId } = useAppStore((state) => state.blockchain.network);

	// --- DEPENDENCIES ---
	const username = useMemo(() => {
		return LocalStorageService.getInstance().getUserData()?.username;
	}, []);

	/**
	 * Fetch USD prices for both tokens - manual trigger function
	 */
	const fetchTokenPrices = useCallback(async (): Promise<void> => {
		if (!fromToken || !toToken || !chainId || !username) {
			return;
		}

		setIsFetchingPrices(true);

		try {
			const transactionService = TransactionService.getInstance();
			const response = await transactionService.getTokenPrice({
				network: chainId?.toString(),
				fromToken: fromToken.address,
				toToken: toToken.address,
				username,
			});

			if (response.success && response.priceData) {
				const { token_1, token_2 } = response.priceData;
				setFromTokenUsdPrice(token_1);
				setToTokenUsdPrice(token_2);
			}
		} catch (error) {
			console.error("Error fetching token prices:", error);
			setFromTokenUsdPrice("");
			setToTokenUsdPrice("");
		} finally {
			setIsFetchingPrices(false);
		}
	}, [fromToken, toToken, username, chainId]);

	/**
	 * Update token prices when tokens change
	 */
	useEffect(() => {
		if (!fromToken || !toToken || !chainId || !username) {
			setFromTokenUsdPrice("");
			setToTokenUsdPrice("");
			return;
		}

		let cancelled = false;

		const fetchPrices = async (): Promise<void> => {
			setIsFetchingPrices(true);

			try {
				const transactionService = TransactionService.getInstance();
				const response = await transactionService.getTokenPrice({
					network: chainId?.toString(),
					fromToken: fromToken.address,
					toToken: toToken.address,
					username,
				});

				if (!cancelled && response.success && response.priceData) {
					const { token_1, token_2 } = response.priceData;
					setFromTokenUsdPrice(token_1);
					setToTokenUsdPrice(token_2);
				}
			} catch (error) {
				if (!cancelled) {
					console.error("Error fetching token prices:", error);
					setFromTokenUsdPrice("");
					setToTokenUsdPrice("");
				}
			} finally {
				if (!cancelled) {
					setIsFetchingPrices(false);
				}
			}
		};

		const timeoutId = setTimeout(fetchPrices, 100); // Small debounce

		return () => {
			cancelled = true;
			clearTimeout(timeoutId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fromToken?.address, toToken?.address, chainId, username]);

	return {
		// State
		fromTokenUsdPrice,
		toTokenUsdPrice,
		isFetchingPrices,

		// Actions
		fetchTokenPrices,
	};
};
