import { AppStateCreator } from "@/store/store";
import { createDownlineSlice, DownlineSlice } from "./downline.slice";
import { createRatesSlice, RatesSlice } from "./rates.slice";
import { createClaimSlice, ClaimSlice } from "./claim.slice";
import { createReferralsSlice, ReferralsSlice } from "./referrals.slice";

export interface AffiliateSliceBranch {
	downline: DownlineSlice;
	rates: RatesSlice;
	claim: ClaimSlice;
	referrals: ReferralsSlice;
	// future: history, stats slices
}

export const createAffiliateSlice: AppStateCreator<AffiliateSliceBranch> = (
	...args
) => ({
	downline: createDownlineSlice(...args),
	rates: createRatesSlice(...args),
	claim: createClaimSlice(...args),
	referrals: createReferralsSlice(...args),
});
