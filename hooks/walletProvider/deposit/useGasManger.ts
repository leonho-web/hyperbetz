"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppStore } from "@/store/store";
import { Token } from "@/types/blockchain/swap.types";

// --- HOOK'S "CONTRACT" ---
// We define the props this hook needs to receive from the main useDeposit hook.
interface UseGasManagerProps {
	selectedToken: Token | null;
}

/**
 * Manages all complex logic related to gas fees, native currency detection,
 * and the associated UI feedback (tooltips and balance checks). This is a faithful
 * implementation of the reference code's gas management logic.
 */
export const useGasManager = ({ selectedToken }: UseGasManagerProps) => {
	// --- STATE ---
	const chainId = useAppStore((state) => state.blockchain.network.chainId);
	const [gasReservationAmount, setGasReservationAmount] = useState(0);
	const [isLowBalance, setIsLowBalance] = useState(false);
	const [tooltipMessage, setTooltipMessage] = useState("");
	const [showTooltip, setShowTooltip] = useState(false);

	// --- DERIVED STATE (isNativeCurrency) ---
	// This is a faithful implementation of your original isNativeCurrency function.
	const isNativeCurrency = useMemo(() => {
		if (!selectedToken) return false;
		return selectedToken.tags?.includes("native") || false;
	}, [selectedToken]);

	// --- LOGIC IMPLEMENTATION (getGasReservationAmount) ---
	// This is a faithful implementation of your original getGasReservationAmount.
	// It is now a simple function within the hook, not an async callback.
	useEffect(() => {
		const getGasAmount = () => {
			const feeMap: Record<number, number> = {
				1: 0.015, // Ethereum
				137: 0.1, // Polygon
				42161: 0.0012, // Arbitrum
				10: 0.0012, // Optimism
				324: 0.0015, // zkSync Era
				8453: 0.0012, // Base
				56: 0.0015, // BNB Chain
				43114: 0.003, // Avalanche
				59144: 0.0015, // Linea
			};
			return feeMap[chainId || 0] || 0.0025; // Default fallback
		};
		setGasReservationAmount(getGasAmount());
	}, [chainId]);

	// --- LOGIC IMPLEMENTATION (Tooltip and Low Balance Checks) ---
	// This is a faithful implementation of your two separate useEffects for tooltips,
	// combined into one for efficiency.
	useEffect(() => {
		if (selectedToken && isNativeCurrency) {
			// Logic for native tokens
			const balance = parseFloat(selectedToken.balance || "0");

			setIsLowBalance(balance < gasReservationAmount);
			setShowTooltip(true);
			setTooltipMessage(
				`${gasReservationAmount} ${selectedToken.symbol} is reserved to cover gas fees.`
			);
		} else {
			// Logic for non-native tokens
			setIsLowBalance(false);
			setShowTooltip(false);
			setTooltipMessage("");
		}
	}, [selectedToken, isNativeCurrency, gasReservationAmount]);

	return {
		gasReservationAmount,
		isLowBalance,
		isNativeCurrency,
		tooltipMessage,
		showTooltip,
	};
};
