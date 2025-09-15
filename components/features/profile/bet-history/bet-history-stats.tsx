"use client";

import { useTranslations } from "@/lib/locale-provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar, faChartLine } from "@fortawesome/pro-light-svg-icons";

interface BetHistoryStatsProps {
	grandTotalBet?: number;
	grandTotalWinLose?: number;
	isLoading: boolean;
}

export function BetHistoryStats({
	grandTotalBet = 0,
	grandTotalWinLose = 0,
	isLoading,
}: BetHistoryStatsProps) {
	const t = useTranslations("profile.betHistory");

	if (isLoading) {
		return (
			<div className="grid grid-cols-2 gap-3">
				{Array.from({ length: 2 }).map((_, index) => (
					<div
						key={index}
						className="p-3 rounded-lg border border-border/50 bg-background/30 backdrop-blur-sm"
					>
						<div className="animate-pulse">
							<div className="h-4 bg-muted rounded w-3/4 mb-2" />
							<div className="h-6 bg-muted rounded w-1/2" />
						</div>
					</div>
				))}
			</div>
		);
	}

	const items = [
		{
			label: t("totalBets"),
			value: `$${grandTotalBet.toLocaleString()}`,
			icon: faChartBar,
			color: "text-blue-500",
			bg: "bg-blue-500/10",
		},
		{
			label: t("totalProfitLoss"),
			value: `$${grandTotalWinLose.toLocaleString()}`,
			icon: faChartLine,
			color: grandTotalWinLose >= 0 ? "text-green-500" : "text-red-500",
			bg: grandTotalWinLose >= 0 ? "bg-green-500/10" : "bg-red-500/10",
		},
	];

	return (
		<div className="grid grid-cols-2 gap-3">
			{items.map((it) => (
				<div
					key={it.label}
					className="p-3 rounded-lg border border-border/50 bg-background/30 backdrop-blur-sm hover:bg-background/50 transition-colors"
				>
					<div className="flex items-center gap-2 mb-1">
						<div className={`p-1.5 rounded-md ${it.bg}`}>
							<FontAwesomeIcon
								icon={it.icon}
								className={`h-3 w-3 ${it.color}`}
							/>
						</div>
						<span className="text-xs font-medium text-muted-foreground">
							{it.label}
						</span>
					</div>
					<div className={`text-lg font-bold ${it.color}`}>
						{it.value}
					</div>
				</div>
			))}
		</div>
	);
}
