/**
 * useSwapGasManager.ts
 * Manages gas fees, tooltips, and native currency logic for swaps
 */

import { useState, useEffect, useCallback } from "react";
import { useAppStore } from "@/store/store";
import {
	UseSwapGasManagerParams,
	UseSwapGasManagerReturn,
} from "@/types/walletProvider/swap-hooks.types";

export const useSwapGasManager = ({
	fromToken,
}: UseSwapGasManagerParams): UseSwapGasManagerReturn => {
	// --- STATE ---
	const [gasReservationAmount, setGasReservationAmount] = useState<number>(0);
	const [isLowBalance, setIsLowBalance] = useState<boolean>(false);
	const [toolTipMessage, setToolTipMessage] = useState<string>("");
	const [showToolTip, setShowToolTip] = useState<boolean>(false);

	// --- DEPENDENCIES ---
	const { chainId } = useAppStore((state) => state.blockchain.network);

	/**
	 * Function to determine gas fee reservation based on network
	 * @returns {Promise<number>} Gas fee reservation amount
	 */
	const getGasReservationAmount = useCallback(async (): Promise<number> => {
		// Set default fee
		let fee = 0.0025; // Default gas reservation for other networks

		try {
			switch (Number(chainId)) {
				case 1: // Ethereum
					fee = 0.015;
					break;
				case 137: // Polygon
					fee = 0.1;
					break;
				case 42161: // Arbitrum
					fee = 0.0012;
					break;
				case 10: // Optimism
					fee = 0.0012;
					break;
				case 324: // zkSync Era
					fee = 0.0015;
					break;
				case 8453: // Base
					fee = 0.0012;
					break;
				case 56: // BNB Chain
					fee = 0.0015;
					break;
				case 43114: // Avalanche
					fee = 0.003;
					break;
				case 59144: // Linea
					fee = 0.0015;
					break;
				default:
					fee = 0.0025; // Default gas reservation for other networks
					break;
			}
		} catch (error) {
			console.error("Error getting network ID:", error);
		}

		return fee;
	}, [chainId]);

	/**
	 * Check if token is a native currency
	 * @returns {boolean} True if native currency
	 */
	const isNativeCurrency = useCallback((): boolean => {
		if (!fromToken) {
			return false;
		}

		const nativeToken = fromToken.tags?.includes("native") || false;
		return nativeToken;
	}, [fromToken]);

	/**
	 * Get message for tooltip
	 */
	const getMessage = useCallback(async (): Promise<string> => {
		if (fromToken) {
			try {
				const gasAmount = await getGasReservationAmount();
				// const isNative = isNativeCurrency();

				// if (isNative) {
				return `${gasAmount} ${fromToken.symbol} is reserved to cover gas fees and avoid transaction failure.`;
				// }
				// return "";
			} catch (error) {
				console.error("Error getting gas reservation amount:", error);
				return `A small amount of ${fromToken.symbol} is reserved to cover gas fees and avoid transaction failure.`;
			}
		}
		return "";
	}, [
		fromToken,
		getGasReservationAmount,
		// isNativeCurrency
	]);

	// Update tooltip message when fromToken or gas amount changes
	useEffect(() => {
		const updateTooltip = async () => {
			// const message = await getMessage();
			// setToolTipMessage(message);
			// setShowToolTip(!!message);

			if (fromToken) {
				const isNative = isNativeCurrency();
				if (isNative) {
					setShowToolTip(true);
					const message = await getMessage();
					setToolTipMessage(message);
				} else {
					setShowToolTip(false);
				}
			} else {
				setShowToolTip(false);
			}
		};

		updateTooltip();
	}, [fromToken, getMessage, isNativeCurrency]);

	// Update gas reservation amount and USD values when needed
	useEffect(() => {
		const updateGasAndValues = async () => {
			try {
				const gasAmount = await getGasReservationAmount();
				setGasReservationAmount(gasAmount);

				// Check if balance is low for native currency (match original logic)
				if (fromToken && isNativeCurrency() && fromToken.balance) {
					const balance = parseFloat(fromToken.balance || "0");
					const isLow = balance < gasAmount;
					setIsLowBalance(isLow);
				} else {
					setIsLowBalance(false);
				}
			} catch (error) {
				console.error("Error updating gas values:", error);
			}
		};

		updateGasAndValues();
	}, [chainId, fromToken, getGasReservationAmount, isNativeCurrency]);

	return {
		// State
		gasReservationAmount,
		isLowBalance,
		toolTipMessage,
		showToolTip,

		// Computed values
		isNativeCurrency,

		// Actions
		getGasReservationAmount,
		getMessage,
	};
};
