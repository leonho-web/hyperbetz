import { AppStore } from "@/store/store";
import { createSelector } from "reselect";

// Base selectors
const selectAllBets = (state: AppStore) => state.history.betHistory.allBets;
const selectStatusFilter = (state: AppStore) =>
	state.history.betHistory.filters.status;

/**
 * A memoized selector that returns the final, filtered list of bets to be displayed in the UI.
 * It handles the "ALL" status filter on the client-side.
 */
export const selectFilteredBetHistory = createSelector(
	[selectAllBets, selectStatusFilter],
	(allBets, statusFilter) => {
		if (statusFilter === "ALL") {
			return allBets;
		}
		return allBets.filter((bet) => bet.status === statusFilter);
	}
);
