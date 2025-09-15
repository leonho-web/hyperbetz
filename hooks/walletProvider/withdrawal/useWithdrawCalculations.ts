"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/store/store";
import { useDynamicAuth } from "@/hooks/useDynamicAuth";
import TransactionService from "@/services/walletProvider/TransactionService";

const DEFAULT_MIN_WITHDRAW = 0.05; // A sensible fallback in USD

// --- HOOK'S "CONTRACT" ---
interface UseWithdrawCalculationsProps {
	withdrawAmount: string;
}

/**
 * The definitive, feature-complete hook for all off-chain withdrawal calculations.
 *
 * It is responsible for:
 * 1. Fetching the DYNAMIC minimum withdrawal amount from the /getWalletAgent API.
 * 2. Calculating the withdrawal fee based on the user's input.
 * 3. Calculating the final total payout.
 */
export const useWithdrawCalculations = ({
	withdrawAmount,
}: UseWithdrawCalculationsProps) => {
	// --- 1. Get Dependencies from State and Context ---
	const { chainId } = useAppStore((state) => state.blockchain.network);
	const { authToken, isLoggedIn } = useDynamicAuth();

	// --- 2. Manage the Hook's Own State ---
	const [fee, setFee] = useState(0);
	const [totalPayout, setTotalPayout] = useState(0);
	const [minWithdrawAmount, setMinWithdrawAmount] =
		useState(DEFAULT_MIN_WITHDRAW);
	const [isLoadingConfig, setIsLoadingConfig] = useState(false);

	// --- 3. The Core Logic Effects ---

	// Effect 1: Synchronous Fee and Payout calculation
	useEffect(() => {
		const amount = parseFloat(withdrawAmount);
		if (isNaN(amount) || amount <= 0) {
			setFee(0);
			setTotalPayout(0);
			return;
		}
		const calculatedFee = amount * 0.01; // 1% fee
		const calculatedPayout = amount - calculatedFee;
		setFee(calculatedFee);
		setTotalPayout(calculatedPayout);
	}, [withdrawAmount]);

	// Effect 2: Asynchronous fetching of the DYNAMIC Minimum Withdrawal Amount
	useEffect(() => {
		let isActive = true;

		const fetchWithdrawConfig = async () => {
			// Guard clause: Do not run if essential info is missing.
			if (!isLoggedIn || !authToken || !chainId) {
				setMinWithdrawAmount(DEFAULT_MIN_WITHDRAW);
				return;
			}

			setIsLoadingConfig(true);
			try {
				const transactionService = TransactionService.getInstance();
				const response = await transactionService.getWalletAgentData(
					String(chainId), // Pass network as string if needed by service
					authToken
				);

				if (
					isActive &&
					!response.error &&
					response.data?.setting?.withdraw
				) {
					const minAmount = parseFloat(
						response.data.setting.withdraw
					);
					// console.log("minWithdrawalAmount from API", minAmount);
					setMinWithdrawAmount(
						isNaN(minAmount) ? DEFAULT_MIN_WITHDRAW : minAmount
					);
					// console.log(
					// 	"minWithdrawalAmount set to",
					// 	minWithdrawAmount
					// );
				} else {
					setMinWithdrawAmount(DEFAULT_MIN_WITHDRAW);
				}
			} catch (error) {
				if (isActive) setMinWithdrawAmount(DEFAULT_MIN_WITHDRAW);
				console.error("Failed to fetch wallet agent config:", error);
			} finally {
				if (isActive) setIsLoadingConfig(false);
			}
		};

		fetchWithdrawConfig();

		return () => {
			isActive = false;
		};
	}, [chainId, authToken, isLoggedIn]);

	// --- 4. Return the Final, Public API ---
	return {
		fee,
		totalPayout,
		minWithdrawAmount, // The dynamic, API-driven value
		isLoadingConfig, // A loading state for the UI to consume
	};
};
