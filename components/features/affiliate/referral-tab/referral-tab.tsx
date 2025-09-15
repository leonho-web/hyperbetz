"use client";

import { useAffiliateReferrals } from "@/hooks/affiliate/useAffiliateReferrals";
import ReferralsTable from "./referrals-table";
// import { Users, UserCheck } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faUserCheck } from "@fortawesome/pro-light-svg-icons";
import { useTranslations } from "@/lib/locale-provider";

export const ReferralsTab = () => {
	// Call the "brain" to get all state and actions
	const { data, isLoading, currentPage, sortOrder, setPage, setSortOrder } =
		useAffiliateReferrals();
	const t = useTranslations("affiliate.referrals");

	return (
		<div className="space-y-8">
			{/* Header Section */}
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
						<FontAwesomeIcon
							icon={faUsers}
							className="h-6 w-6 text-primary"
						/>
					</div>
					<div>
						<h1 className="text-3xl font-bold text-foreground tracking-tight">
							{t("title")}
						</h1>
						<p className="text-muted-foreground text-base mt-1">
							{t("subtitle")}
						</p>
					</div>
				</div>

				<div className="bg-gradient-to-r from-green-500/10 via-green-500/5 to-transparent border border-green-500/20 rounded-xl p-4">
					<div className="flex items-center gap-3">
						<FontAwesomeIcon
							icon={faUserCheck}
							className="h-5 w-5 text-green-600 dark:text-green-400"
						/>
						<div>
							<p className="text-sm font-medium text-green-800 dark:text-green-200">
								{data?.total_data || 0} {t("totalReferrals")}
							</p>
							<p className="text-sm text-green-700 dark:text-green-300">
								{t("monitorHelp")}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Referrals Table */}
			<ReferralsTable
				data={data?.data || []}
				totalRecords={data?.total_data || 0}
				isLoading={isLoading}
				currentPage={currentPage}
				sortOrder={sortOrder}
				onPageChange={setPage}
				onSortChange={setSortOrder}
			/>
		</div>
	);
};
