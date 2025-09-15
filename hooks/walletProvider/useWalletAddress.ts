"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useDynamicAuth } from "@/hooks/useDynamicAuth";

/**
 * A hook that provides wallet address information for copy functionality.
 * This hook combines data from both the Dynamic SDK and the custom auth context
 * to provide the most accurate wallet address information.
 *
 * @returns An object containing wallet address and related information
 */
export const useWalletAddress = () => {
	const { primaryWallet } = useDynamicContext();
	const { user, isLoggedIn, isWalletConnected } = useDynamicAuth();

	// Get the wallet address from the primary source (Dynamic SDK)
	const walletAddress = primaryWallet?.address || user?.walletAddress;

	// Determine if we have a valid wallet connection
	const hasWallet = isLoggedIn && isWalletConnected && !!walletAddress;

	return {
		/** The current wallet address */
		address: walletAddress,
		/** Whether the user has a connected wallet */
		hasWallet,
		/** Whether the user is logged in */
		isLoggedIn,
		/** Whether a wallet is connected */
		isWalletConnected,
		/** The primary wallet object from Dynamic SDK */
		primaryWallet,
		/** User information from auth context */
		user,
	};
};

export default useWalletAddress;
