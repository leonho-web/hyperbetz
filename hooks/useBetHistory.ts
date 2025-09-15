import { useAppStore } from "@/store/store";
import { BetHistoryItem } from "@/types/games/betHistory.types";
import { useMemo } from "react";

export const useBetHistory = () => {
	// Store state
	const allBets = useAppStore((state) => state.history.betHistory.allBets);
	const totalCount = useAppStore(
		(state) => state.history.betHistory.totalCount
	);
	const filters = useAppStore((state) => state.history.betHistory.filters);
	const status = useAppStore((state) => state.history.betHistory.status);
	const lastFetched = useAppStore(
		(state) => state.history.betHistory.lastFetched
	);
	const page = useAppStore((state) => state.history.betHistory.page);
	const pageSize = useAppStore((state) => state.history.betHistory.pageSize);
	const grandTotalBet = useAppStore(
		(state) => state.history.betHistory.grandTotalBet
	);
	const grandTotalWinLose = useAppStore(
		(state) => state.history.betHistory.grandTotalWinLose
	);

	// Store actions
	const setFilters = useAppStore(
		(state) => state.history.betHistory.setFilters
	);
	const fetchHistory = useAppStore(
		(state) => state.history.betHistory.fetchHistory
	);
	const clearBetHistoryCache = useAppStore(
		(state) => state.history.betHistory.clearBetHistoryCache
	);
	const setPage = useAppStore((state) => state.history.betHistory.setPage);
	const setPageSize = useAppStore(
		(state) => state.history.betHistory.setPageSize
	);

	// Since we're doing server-side filtering, we don't need client-side filtering
	// The allBets already contains the filtered results from the API
	const filteredBets = useMemo(() => {
		console.log("Filtered bets from store:", allBets);
		return allBets; // API already returns filtered data
	}, [allBets]);

	// For server-side pagination, return all bets (API handles pagination)
	const getPaginatedBets = (page: number, pageSize: number) => {
		console.log(
			"Getting paginated bets - page:",
			page,
			"pageSize:",
			pageSize,
			"allBets:",
			allBets,
			"totalCount:",
			totalCount
		);
		return allBets; // Return all bets since API handles pagination
	};

	// Stats
	const stats = useMemo(() => {
		const totalBets = filteredBets.length;
		const totalBetAmount = filteredBets.reduce(
			(sum: number, bet: BetHistoryItem) =>
				sum + parseFloat(bet.bet_amount || "0"),
			0
		);
		const totalWinAmount = filteredBets.reduce(
			(sum: number, bet: BetHistoryItem) =>
				sum + parseFloat(bet.win_amount || "0"),
			0
		);
		const netProfit = totalWinAmount - totalBetAmount;

		return {
			totalBets,
			totalBetAmount,
			totalWinAmount,
			netProfit,
		};
	}, [filteredBets]);

	// Get unique providers for filter dropdown from localStorage cache first, then from bets
	const uniqueProviders = useMemo(() => {
		try {
			// First try to get providers from localStorage cache
			const providersCache = localStorage.getItem("providers-list-cache");
			if (providersCache) {
				const cachedData = JSON.parse(providersCache);
				console.log("This is parsed cached data:", cachedData);
				if (cachedData && Array.isArray(cachedData.providers)) {
					// Extract provider names from cached provider objects
					const providerNames = cachedData.providers
						.map(
							(provider: {
								provider_name?: string;
								name?: string;
							}) => provider.provider_name || provider.name
						)
						.filter(Boolean)
						.sort();
					console.log("Loaded providers from cache:", providerNames);
					return providerNames;
				}
			}
		} catch (error) {
			console.error("Failed to load providers from cache:", error);
		}

		// Fallback to extracting providers from bet history data
		const providers = new Set(
			allBets
				.map((bet: BetHistoryItem) => bet.vendor_name)
				.filter(Boolean)
		);
		const fallbackProviders = Array.from(providers).sort();
		// console.log("Using providers from bet data:", fallbackProviders);
		return fallbackProviders;
	}, [allBets]);

	return {
		// Data
		allBets,
		filteredBets,
		filters,
		status,
		lastFetched,
		stats,
		uniqueProviders,
		page,
		pageSize,
		totalCount,
		grandTotalBet,
		grandTotalWinLose,

		// Actions
		setFilters,
		fetchHistory,
		getPaginatedBets,
		clearBetHistoryCache,
		setPage,
		setPageSize,

		// Computed
		isLoading: status === "loading",
		hasError: status === "error",
		isEmpty: filteredBets.length === 0,
		totalPages: (customSize?: number) =>
			Math.ceil(totalCount / (customSize || pageSize || 1)),
	};
};
