"use client";

import { useState, useCallback } from "react";

// A type to manage the wager input for each tier individually.
// The key will be the tier level (e.g., '1', '2').
type WagerInputs = Record<string, string>;

/**
 * The "brain" for the Affiliate Calculator. This hook manages the state for
 * all wager inputs and provides a clean API for updating them and calculating earnings.
 */
export const useAffiliateCalculator = () => {
	const [wagerInputs, setWagerInputs] = useState<WagerInputs>({});

	/**
	 * A single, unified handler for updating the wager amount for any tier.
	 * @param tierLevel - The level of the tier being updated (e.g., "1").
	 * @param amount - The new wager amount from the input field.
	 */
	const handleWagerChange = useCallback(
		(tierLevel: string, amount: string) => {
			// Basic input sanitization
			const sanitizedAmount = amount.replace(/[^0-9.]/g, "");
			setWagerInputs((prev) => ({
				...prev,
				[tierLevel]: sanitizedAmount,
			}));
		},
		[]
	);

	/**
	 * A pure calculation function.
	 * @param wager - The wager amount as a number.
	 * @param percentage - The commission percentage as a string (e.g., "0.15").
	 * @returns The calculated earnings.
	 */
	const calculateEarnings = (
		wager: number,
		percentage: string | null
	): number => {
		if (percentage === null || isNaN(wager) || wager <= 0) {
			return 0;
		}
		return wager * (parseFloat(percentage) / 100);
	};

	return {
		wagerInputs,
		handleWagerChange,
		calculateEarnings,
	};
};
