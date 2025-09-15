"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/store/store";
import { useDynamicAuth } from "@/hooks/useDynamicAuth";
import TransactionService from "@/services/walletProvider/TransactionService";
import { SearchTokenResult } from "@/types/walletProvider/transaction-service.types";
// import { useDebounce } from "@/hooks/walletProvider/useDebounce";

export const useTokenSearch = (searchQuery: string) => {
	const { chainId } = useAppStore((state) => state.blockchain.network);
	const { user, authToken, isLoggedIn } = useDynamicAuth();

	const [searchResults, setSearchResults] = useState<SearchTokenResult[]>([]);
	const [isSearching, setIsSearching] = useState(false);

	// Debounce the search query to prevent API spam
	// const [debouncedQuery] = useDebounce(searchQuery, 500);

	useEffect(() => {
		let isActive = true;

		const search = async () => {
			if (
				// !debouncedQuery ||
				!searchQuery ||
				!isLoggedIn ||
				!chainId ||
				!user?.username ||
				!authToken
			) {
				setSearchResults([]);
				return;
			}

			setIsSearching(true);
			try {
				const transactionService = TransactionService.getInstance();
				const response = await transactionService.searchToken(
					{
						network: chainId,
						// searchWord: deuboncedQuery,
						searchWord: searchQuery,
						username: user.username,
					},
					authToken
				);

				if (isActive && !response.error && response.data) {
					setSearchResults(response.data);
				}
			} catch (error) {
				console.error("Token search failed:", error);
			} finally {
				if (isActive) setIsSearching(false);
			}
		};

		search();

		return () => {
			isActive = false;
		};
	}, [
		// debouncedQuery,
		searchQuery,
		chainId,
		user?.username,
		authToken,
		isLoggedIn,
	]);

	return { searchResults, isSearching };
};
