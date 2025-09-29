"use client";

import { useState, useCallback } from "react";
import { Token } from "@/types/blockchain/swap.types";
import { toast } from "sonner";
import { SearchTokenResult } from "@/types/walletProvider/transaction-service.types";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export const useTokenActions = () => {
	const { primaryWallet } = useDynamicContext();
	const [isAddingToWallet, setIsAddingToWallet] = useState(false);

	const addTokenToMetamask = useCallback(
		async (token: Token | SearchTokenResult) => {
			// For email authenticated users, show a different message
			if (primaryWallet?.connector.isEmbeddedWallet) {
				toast.info(
					"Token bookmarking is not available for email authentication. Use wallet connection for this feature."
				);
				return;
			}

			if (!window.ethereum) {
				toast.error("MetaMask is not installed.");
				return;
			}

			setIsAddingToWallet(true);
			try {
				await window.ethereum.request({
					method: "wallet_watchAsset",
					params: {
						type: "ERC20",
						options: {
							address: token.address,
							symbol: token.symbol,
							decimals: token.decimals,
							image:
								"logoURI" in token ? token.logoURI : token.icon,
						},
					},
				});
				toast.success(`${token.symbol} added to your wallet!`);
			} catch (error) {
				console.error("Failed to add token to MetaMask:", error);
				toast.error("Failed to add token.");
			} finally {
				setIsAddingToWallet(false);
			}
		},
		[primaryWallet]
	);

	// Future logic for bookmarking would go here
	const handleBookmark = useCallback((token: Token) => {
		// ... logic to call Zustand action to update bookmarks ...
		console.log("Bookmarking:", token.symbol);
	}, []);

	return { isAddingToWallet, addTokenToMetamask, handleBookmark };
};
