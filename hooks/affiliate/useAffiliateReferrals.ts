"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/store";
import { ReferralsSortOrder } from "@/store/slices/affiliate/referrals.slice";
import {
	GetDownlineResponse,
	DownlineEntry,
} from "@/types/affiliate/affiliate.types";

// Export the sort order type for backward compatibility
export type { ReferralsSortOrder } from "@/store/slices/affiliate/referrals.slice";

export interface UseAffiliateReferralsResult {
	data: GetDownlineResponse | null;
	isLoading: boolean;
	currentPage: number;
	sortOrder: ReferralsSortOrder;
	setPage: (page: number) => void;
	setSortOrder: (order: ReferralsSortOrder) => void;
	sortedData: DownlineEntry[];
}

export const useAffiliateReferrals = (): UseAffiliateReferralsResult => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const referralsSlice = useAppStore((state) => state.affiliate.referrals);

	// Select actions once
	const setPage = useAppStore((state) => state.affiliate.referrals.setPage);
	const setSortOrder = useAppStore(
		(state) => state.affiliate.referrals.setSortOrder
	);
	const initialize = useAppStore(
		(state) => state.affiliate.referrals.initialize
	);

	// Initialize from URL parameters
	useEffect(() => {
		const urlPage = Number(searchParams.get("page")) || 1;
		const urlSort = searchParams.get("sort");

		let sortOrder: ReferralsSortOrder = "last_login";

		// Map URL parameters back to sort order
		if (urlSort === "Z-A") {
			sortOrder = "nickname_desc";
		} else if (
			urlSort &&
			["last_login", "unclaimed_amount", "nickname_asc"].includes(urlSort)
		) {
			sortOrder = urlSort as ReferralsSortOrder;
		}

		// Update store if URL params differ from current state
		if (urlPage !== referralsSlice.currentPage) {
			setPage(urlPage);
		}
		if (sortOrder !== referralsSlice.sortOrder) {
			setSortOrder(sortOrder);
		}

		// Initialize the slice if not already done
		if (!referralsSlice.isInitialized) {
			initialize(false);
		}
	}, [
		searchParams,
		referralsSlice.currentPage,
		referralsSlice.sortOrder,
		referralsSlice.isInitialized,
		setPage,
		setSortOrder,
		initialize,
	]);

	// URL synchronization when state changes
	useEffect(() => {
		const params = new URLSearchParams();

		if (referralsSlice.currentPage > 1) {
			params.set("page", String(referralsSlice.currentPage));
		}

		// Map sort order to URL parameter
		if (referralsSlice.sortOrder === "nickname_desc") {
			params.set("sort", "Z-A");
		} else if (
			referralsSlice.sortOrder !== "last_login" &&
			referralsSlice.sortOrder !== "nickname_asc"
		) {
			params.set("sort", referralsSlice.sortOrder);
		}

		router.replace(`${pathname}?${params.toString()}`);
	}, [
		referralsSlice.currentPage,
		referralsSlice.sortOrder,
		pathname,
		router,
	]);

	// Get sorted data using the slice's method
	const sortedData = referralsSlice.getSortedData() as DownlineEntry[];

	// Create wrapped data object with sorted data
	const dataWithSortedResults = referralsSlice.data
		? {
				...referralsSlice.data,
				data: sortedData,
		  }
		: null;

	return {
		data: dataWithSortedResults,
		isLoading: referralsSlice.status === "loading",
		currentPage: referralsSlice.currentPage,
		sortOrder: referralsSlice.sortOrder,
		setPage: referralsSlice.setPage,
		setSortOrder: referralsSlice.setSortOrder,
		sortedData,
	};
};
