"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { sanitizeAmountInput, formatFullAmount } from "@/lib/utils";
import { Token } from "@/types/blockchain/swap.types";

export const useDepositFormState = () => {
	// --- STATE ---
	const [selectedToken, setSelectedToken] = useState<Token | null>(null);
	const [depositAmount, setDepositAmount] = useState("");
	const [depositType, setDepositType] = useState<"direct" | "swap">("direct");
	const [isBalanceInsufficient, setIsBalanceInsufficient] = useState(false);

	// --- DERIVED STATE ---
	const formattedBalance = useMemo(() => {
		if (!selectedToken?.balance) return "0.00";
		return parseFloat(formatFullAmount(selectedToken.balance)).toFixed(6);
	}, [selectedToken]);

	// --- ACTIONS ---
	const selectToken = useCallback((token: Token) => {
		let tokenType = token.tags?.includes("native") ? "swap" : "direct";
		if (["USDT", "USDC", "USD₮0"].includes(token.symbol)) {
			tokenType = "direct";
		} else {
			tokenType = "swap";
		}
		setDepositType(tokenType as "direct" | "swap");
		setSelectedToken(token);
		setDepositAmount("");
		setIsBalanceInsufficient(false);
	}, []);

	const handleAmountChange = useCallback((value: string) => {
		const sanitizedValue = sanitizeAmountInput(value);
		setDepositAmount(sanitizedValue);
	}, []);

	useEffect(() => {
		if (selectedToken && depositAmount) {
			setIsBalanceInsufficient(
				parseFloat(depositAmount) > parseFloat(selectedToken.balance)
			);
		} else {
			setIsBalanceInsufficient(false);
		}
	}, [depositAmount, selectedToken]);

	// --- THE DEFINITIVE FIX IS HERE ---

	const resetFormState = useCallback(() => {
		setSelectedToken(null);
		setDepositAmount("");
		setIsBalanceInsufficient(false);
		setDepositType("direct");
	}, []);

	return {
		// State
		selectedToken,
		depositAmount,
		depositType,
		isBalanceInsufficient,
		formattedBalance,

		// Actions
		selectToken,
		handleAmountChange,
		resetFormState,
		setDepositAmount, // Expose the raw setter for the main hook to use
		setIsBalanceInsufficient, // Expose for the main hook
	};
};
