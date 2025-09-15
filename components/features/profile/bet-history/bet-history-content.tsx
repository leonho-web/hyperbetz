"use client";

import { useTranslations } from "@/lib/locale-provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faRotateRight,
	faCalendarAlt,
	faGamepad,
	faEye,
	faEyeSlash,
	faUser,
	faChartLine,
	faClock,
	faBuilding,
	faExclamationCircle,
} from "@fortawesome/pro-light-svg-icons";
import type { BetHistoryItem } from "@/types/games/betHistory.types";

interface BetHistoryContentProps {
	records: BetHistoryItem[];
	isLoading: boolean;
	error: string | null;
	onRefresh: () => void;
	showSensitiveData: boolean;
	toggleSensitiveData: () => void;
}

export function BetHistoryContent({
	records,
	isLoading,
	error,
	onRefresh,
	showSensitiveData,
	toggleSensitiveData,
}: BetHistoryContentProps) {
	const t = useTranslations("profile.betHistory");

	const formatDate = (dateString: string) => {
		try {
			return new Date(dateString).toLocaleString();
		} catch {
			return dateString;
		}
	};

	const formatCurrency = (amount: string) => {
		if (!showSensitiveData) return "••••";
		return `$${parseFloat(amount).toLocaleString()}`;
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Win":
			case "B Win":
				return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/50 dark:border-green-800/50";
			case "Lose":
				return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/50 dark:border-red-800/50";
			case "Outstanding":
				return "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/50 dark:border-amber-800/50";
			case "Draw":
			case "Void":
				return "text-slate-600 bg-slate-50 border-slate-200 dark:text-slate-400 dark:bg-slate-950/50 dark:border-slate-800/50";
			default:
				return "text-muted-foreground bg-muted border-border";
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case "WIN":
				return t("win");
			case "B WIN":
				return t("bonusWin");
			case "LOSE":
				return t("lose");
			case "OUTSTANDING":
				return t("outstanding");
			case "DRAW":
				return t("draw");
			case "VOID":
				return t("void");
			default:
				return status;
		}
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="space-y-6">
				{/* Header skeleton */}
				<div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
					<div className="p-6 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b">
						<div className="flex items-center justify-between">
							<div className="space-y-2">
								<div className="h-6 bg-muted rounded-lg w-40 animate-pulse" />
								<div className="h-4 bg-muted rounded w-32 animate-pulse" />
							</div>
							<div className="h-10 w-10 bg-muted rounded-xl animate-pulse" />
						</div>
					</div>
				</div>

				{/* Table skeleton */}
				<div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
					<div className="divide-y divide-border">
						{Array.from({ length: 5 }).map((_, index) => (
							<div key={index} className="p-6 animate-pulse">
								<div className="grid grid-cols-1 md:grid-cols-8 gap-6">
									<div className="space-y-2">
										<div className="h-4 bg-muted rounded w-3/4" />
										<div className="h-3 bg-muted/70 rounded w-1/2" />
									</div>
									<div className="h-4 bg-muted rounded w-2/3" />
									<div className="h-4 bg-muted rounded w-full" />
									<div className="h-4 bg-muted rounded w-1/2" />
									<div className="h-4 bg-muted rounded w-2/3" />
									<div className="h-4 bg-muted rounded w-1/2" />
									<div className="h-4 bg-muted rounded w-1/3" />
									<div className="h-6 bg-muted rounded-full w-20" />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="rounded-2xl border border-destructive/20 bg-gradient-to-br from-destructive/5 via-destructive/3 to-transparent shadow-sm">
				<div className="p-8 text-center">
					<div className="flex flex-col items-center gap-6">
						<div className="relative">
							<div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20">
								<FontAwesomeIcon
									icon={faExclamationCircle}
									className="h-8 w-8 text-destructive"
								/>
							</div>
							<div className="absolute -top-1 -right-1 h-4 w-4 bg-destructive/20 rounded-full animate-ping" />
						</div>
						<div className="space-y-3 max-w-md">
							<h3 className="text-xl font-semibold text-foreground">
								{t("errorLoading")}
							</h3>
							<p className="text-muted-foreground text-sm leading-relaxed">
								{error}
							</p>
						</div>
						<button
							type="button"
							onClick={onRefresh}
							className="group inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:scale-[1.02]"
						>
							<FontAwesomeIcon
								icon={faRotateRight}
								className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500"
							/>
							{t("tryAgain")}
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Empty state
	if (!records.length) {
		return (
			<div className="rounded-2xl border bg-gradient-to-br from-muted/30 via-background to-muted/20 shadow-sm">
				<div className="p-12 text-center">
					<div className="flex flex-col items-center gap-6">
						<div className="relative">
							<div className="p-6 rounded-3xl bg-muted/50 border-2 border-dashed border-muted-foreground/20">
								<FontAwesomeIcon
									icon={faGamepad}
									className="h-12 w-12 text-muted-foreground/60"
								/>
							</div>
							<div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent" />
						</div>
						<div className="space-y-3 max-w-sm">
							<h3 className="text-xl font-semibold text-foreground">
								{t("noBetsFound")}
							</h3>
							<p className="text-muted-foreground text-sm leading-relaxed">
								{t("noBetsFoundDescription")}
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Data table
	return (
		<div className="space-y-6">
			{/* Enhanced Header */}
			<div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
				<div className="p-4 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b">
					<div className="flex items-center justify-between">
						<div className="flex items-center justify-between gap-2">
							<div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
								<FontAwesomeIcon
									icon={faGamepad}
									className="h-4 w-4 text-primary"
								/>
							</div>
							<div className="flex flex-col items-start">
								<h3 className="text-lg font-semibold leading-tight text-foreground">
									{t("betHistory")}
								</h3>
								<p className="text-sm text-muted-foreground">
									{records.length}{" "}
									{records.length === 1
										? "record"
										: "records"}{" "}
									found
								</p>
							</div>
						</div>
						<button
							type="button"
							onClick={toggleSensitiveData}
							className="group relative h-10 w-10 flex items-center justify-center rounded-xl border bg-background hover:bg-accent transition-all duration-200 hover:scale-105 shadow-sm"
							title={
								showSensitiveData
									? t("hideAmounts")
									: t("showAmounts")
							}
						>
							<div className="relative">
								{showSensitiveData ? (
									<FontAwesomeIcon
										icon={faEyeSlash}
										className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors"
									/>
								) : (
									<FontAwesomeIcon
										icon={faEye}
										className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors"
									/>
								)}
							</div>
						</button>
					</div>
				</div>
			</div>

			{/* Enhanced Table */}
			<div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
				{/* Desktop table header */}
				<div className="hidden md:block">
					<div className="grid grid-cols-8 gap-6 p-4 text-xs font-medium text-muted-foreground bg-muted/30 border-b">
						<div className="flex items-center gap-2">
							<FontAwesomeIcon
								icon={faCalendarAlt}
								className="h-3.5 w-3.5 text-primary/60"
							/>
							{t("date")}
						</div>
						<div className="flex items-center gap-2">
							<FontAwesomeIcon
								icon={faUser}
								className="h-3.5 w-3.5 text-primary/60"
							/>
							{t("player")}
						</div>
						<div className="flex items-center gap-2">
							<FontAwesomeIcon
								icon={faGamepad}
								className="h-3.5 w-3.5 text-primary/60"
							/>
							{t("game")}
						</div>
						<div className="flex items-center gap-2">
							<FontAwesomeIcon
								icon={faClock}
								className="h-3.5 w-3.5 text-primary/60"
							/>
							{t("gameType")}
						</div>
						<div className="flex items-center gap-2">
							<FontAwesomeIcon
								icon={faBuilding}
								className="h-3.5 w-3.5 text-primary/60"
							/>
							{t("provider")}
						</div>
						<div className="flex items-center gap-2">
							<FontAwesomeIcon
								icon={faChartLine}
								className="h-3.5 w-3.5 text-primary/60"
							/>
							{t("amount")}
						</div>
						<div className="flex items-center gap-2">
							<FontAwesomeIcon
								icon={faChartLine}
								className="h-3.5 w-3.5 text-primary/60"
							/>
							{t("payout")}
						</div>
						<div className="flex items-center gap-2">
							{t("status")}
						</div>
					</div>
				</div>

				{/* Table rows */}
				<div className="divide-y divide-border">
					{records.map((record, index) => {
						return (
							<div
								key={record.bet_id}
								className="group hover:bg-accent/30 transition-all duration-200 relative overflow-hidden"
								style={{
									animationDelay: `${index * 50}ms`,
									animation: `fadeInUp 0.5s ease-out forwards ${
										index * 50
									}ms`,
								}}
							>
								{/* Hover accent line */}
								<div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary/60 to-primary/20 transform -translate-x-1 group-hover:translate-x-0 transition-transform duration-300" />

								{/* Main row */}
								<div className="p-3">
									{/* Desktop layout */}
									<div className="hidden md:grid md:grid-cols-8 gap-6 items-center">
										<div className="space-y-1">
											<div className="text-sm font-medium text-foreground">
												{
													formatDate(
														record.bet_date
													).split(",")[0]
												}
											</div>
											<div className="text-xs text-muted-foreground">
												{
													formatDate(
														record.bet_date
													).split(",")[1]
												}
											</div>
										</div>
										<div className="text-sm text-foreground truncate font-medium">
											{record.nickname}
										</div>
										<div className="space-y-1">
											<div className="text-sm text-foreground font-medium truncate">
												{record.game_name}
											</div>
										</div>
										<div className="text-sm text-muted-foreground">
											{record.game_type}
										</div>
										<div className="text-sm text-muted-foreground">
											{record.provider_name}
										</div>
										<div className="text-sm font-semibold text-foreground">
											{formatCurrency(record.bet_amount)}
										</div>
										<div className="text-sm font-semibold text-foreground">
											{formatCurrency(record.win_amount)}
										</div>
										<div>
											<span
												className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 hover:shadow-sm ${getStatusColor(
													record.status
												)}`}
											>
												{getStatusText(record.status)}
											</span>
										</div>
									</div>

									{/* Mobile layout */}
									<div className="md:hidden space-y-4">
										{/* Game info and status */}
										<div className="flex items-start justify-between gap-3">
											<div className="flex-1 min-w-0">
												<div className="text-base font-semibold text-foreground truncate">
													{record.game_name}
												</div>
												<div className="text-sm text-muted-foreground mt-1">
													{record.provider_name} •{" "}
													{record.game_type}
												</div>
											</div>
											<span
												className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(
													record.status
												)}`}
											>
												{getStatusText(record.status)}
											</span>
										</div>

										{/* Player and amounts */}
										<div className="grid grid-cols-2 gap-4">
											<div className="space-y-3">
												<div className="flex items-center justify-between">
													<span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
														{t("player")}
													</span>
													<span className="text-sm font-medium text-foreground">
														{record.nickname}
													</span>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
														{t("amount")}
													</span>
													<span className="text-sm font-semibold text-foreground">
														{formatCurrency(
															record.bet_amount
														)}
													</span>
												</div>
											</div>
											<div className="space-y-3">
												<div className="flex items-center justify-between">
													<span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
														{t("payout")}
													</span>
													<span className="text-sm font-semibold text-foreground">
														{formatCurrency(
															record.win_amount
														)}
													</span>
												</div>
											</div>
										</div>

										{/* Date */}
										<div className="pt-2 border-t border-border/50">
											<div className="flex items-center gap-2 text-xs text-muted-foreground">
												<FontAwesomeIcon
													icon={faCalendarAlt}
													className="h-3 w-3"
												/>
												{formatDate(record.bet_date)}
											</div>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

// Add these keyframes to your global CSS file
// const styles = `
// @keyframes fadeInUp {
//   from {
//     opacity: 0;
//     transform: translateY(20px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }
// `;
