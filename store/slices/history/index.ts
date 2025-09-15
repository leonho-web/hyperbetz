import { AppStateCreator } from "@/store/store";
import {
	createBetHistorySlice,
	BetHistorySliceState,
	BetHistorySliceActions,
} from "./betHistory.slice";

export type HistorySlice = {
	betHistory: BetHistorySliceState & BetHistorySliceActions;
};

export const createHistoryBranch: AppStateCreator<HistorySlice> = (
	...args
) => ({
	betHistory: createBetHistorySlice(...args),
});
