"use client";

import useAffiliateDashboard from "@/hooks/affiliate/useAffiliateDashboard";
import { useAffiliateReferrals } from "@/hooks/affiliate/useAffiliateReferrals";
import ReferralsTable from "../referral-tab/referrals-table";
import { ClaimBonus } from "./claim-bonus";
import { CommissionTiers } from "./commission-tiers";
import { ReferralLink } from "./referral-link";
import { TotalReferrals } from "./total-referral";
import { TotalReferralIncome } from "./total-referral-income";
// import { LayoutDashboard, Users, TrendingUp, Shield } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faGripHorizontal,
	faUsers,
	faArrowTrendUp,
	faShield,
} from "@fortawesome/pro-light-svg-icons";
import { useTranslations } from "@/lib/locale-provider";

/**
 * The orchestrator for the affiliate dashboard. It calls the master hook
 * and passes the correct state down to the dumb presentational components.
 */
export const DashboardTab = () => {
	const t = useTranslations("affiliate.dashboard");
	const {
		downlineData,
		isLoading,
		isClaiming,
		handleClaim,
		isClaimDisabled,
		affiliateRates,
	} = useAffiliateDashboard();
	const {
		data,
		isLoading: isReferralLoading,
		currentPage,
		sortOrder,
		setPage,
		setSortOrder,
	} = useAffiliateReferrals();

	console.log("Downline Data:", downlineData);
	return (
		<div className="space-y-8">
			{/* Header Section */}
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
						<FontAwesomeIcon
							icon={faGripHorizontal}
							className="h-6 w-6 text-primary"
						/>
					</div>
					<div>
						<h1 className="text-3xl font-semibold text-foreground tracking-tight">
							{t("title")}
						</h1>
						{/* <p className="text-muted-foreground text-base mt-1">
							{t("subtitle")}
						</p> */}
					</div>
				</div>
			</div>

			{/* Statistics Overview */}
			<div className="space-y-4">
				<div className="flex items-center gap-2 mb-2">
					<FontAwesomeIcon
						icon={faArrowTrendUp}
						className="h-5 w-5 text-primary"
					/>
					<h2 className="text-xl font-semibold text-foreground">
						{t("performanceOverview")}
					</h2>
				</div>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					<TotalReferralIncome
						isLoading={isLoading}
						totalBonus={
							(downlineData?.total_unclaim || 0) +
							(downlineData?.total_wager_last_month || 0)
						}
						token="USD"
					/>
					<TotalReferrals
						isLoading={isLoading}
						totalReferrals={downlineData?.total_data}
					/>
					<div className="md:col-span-2">
						<ClaimBonus
							isLoading={isLoading}
							isClaiming={isClaiming}
							unclaimedAmount={downlineData?.total_unclaim}
							onClaim={handleClaim}
							token="USD"
							isClaimDisabled={isClaimDisabled}
						/>
					</div>
				</div>
			</div>

			{/* Referral Management */}
			<div className="space-y-4">
				<div className="flex items-center gap-2 mb-2">
					<FontAwesomeIcon
						icon={faUsers}
						className="h-5 w-5 text-primary"
					/>
					<h2 className="text-xl font-semibold text-foreground">
						{t("referralManagement")}
					</h2>
				</div>
				<ReferralLink />
			</div>

			{/* Referrals Table */}
			<div className="space-y-4">
				<ReferralsTable
					data={data?.data || []}
					totalRecords={data?.total_data || 0}
					isLoading={isReferralLoading}
					currentPage={currentPage}
					sortOrder={sortOrder}
					onPageChange={setPage}
					onSortChange={setSortOrder}
				/>
			</div>

			{/* Commission Tiers */}
			<div className="space-y-4">
				<div className="flex items-center gap-2 mb-2">
					<FontAwesomeIcon
						icon={faShield}
						className="h-5 w-5 text-primary"
					/>
					<h2 className="text-xl font-semibold text-foreground">
						{t("termsAndCommission")}
					</h2>
				</div>
				<CommissionTiers
					affiliateRates={affiliateRates}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);
};
