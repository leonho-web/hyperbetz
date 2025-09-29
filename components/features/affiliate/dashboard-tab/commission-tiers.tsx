"use client";

import { AffiliateRate } from "@/types/affiliate/affiliate.types";
import {
	Card,
	CardContent,
	// CardDescription,
	// CardHeader,
	// CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faQuestionCircle,
	faDollarSign,
	faArrowTrendUp,
	faClock,
	faShield,
} from "@fortawesome/pro-light-svg-icons";

interface CommissionTiersProps {
	affiliateRates: AffiliateRate[];
	isLoading: boolean;
}

const TierSkeleton = () => (
	<div className="space-y-6">
		{[...Array(4)].map((_, i) => (
			<div key={i} className="flex flex-col space-y-2">
				<Skeleton className="h-6 w-1/4" />
				<Skeleton className="h-5 w-1/2" />
			</div>
		))}
	</div>
);

/**
 * A comprehensive component that displays the full Affiliate Terms and Conditions,
 * including a dynamically generated Commission Tiers section.
 * This is a FAITHFUL implementation of the content from your reference image.
 */
export const CommissionTiers = ({
	affiliateRates,
	isLoading,
}: CommissionTiersProps) => {
	const tRates = useTranslations("affiliate.rates");
	// Strictly typed keys to avoid using `any` for translation keys
	const claimPointKeys = [
		"claim.points.0",
		"claim.points.1",
		"claim.points.2",
	] as const;

	const examples = [
		{
			tier: 1,
			amount: "$250",
			gameKey: "table.slots",
			commission: "$0.25",
		},
		{
			tier: 2,
			amount: "$500",
			gameKey: "table.liveCasino",
			commission: "$0.75",
		},
		{
			tier: 3,
			amount: "$1,000",
			gameKey: "table.sports",
			commission: "$1.40",
		},
		{
			tier: 4,
			amount: "$5,000",
			gameKey: "table.slots",
			commission: "$9.00",
		},
		{
			tier: 5,
			amount: "$10,000",
			gameKey: "table.liveCasino",
			commission: "$24.00",
		},
		{
			tier: 6,
			amount: "$20,000",
			gameKey: "table.sports",
			commission: "$36.00",
		},
		{
			tier: 7,
			amount: "$60,000",
			gameKey: "table.liveCasino",
			commission: "$180.00",
		},
	] as const;
	const formatTurnover = (min: string, max: string) => {
		const minNum = parseInt(min);
		const maxNum = parseInt(max);
		if (maxNum > 1_000_000_000) return `> $${minNum.toLocaleString()}`;
		return `$${minNum.toLocaleString()} - $${maxNum.toLocaleString()}`;
	};

	return (
		<div className="mx-auto">
			<Card className="bg-gradient-to-br pt-0 from-background via-background to-muted/20  shadow-2xl shadow-muted/20">
				{/* <CardHeader className="relative pt-6 overflow-hidden border-b border-border/50">
					<div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
					<CardTitle className="relative flex items-center gap-3 text-4xl font-semibold tracking-tight text-foreground">
						<div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
							<Shield className="h-8 w-8 text-primary" />
						</div>
						Affiliate Terms and Conditions
					</CardTitle>
					<CardDescription className="relative text-base text-muted-foreground mt-2">
						Complete guide to our affiliate program structure and
						benefits
					</CardDescription>
				</CardHeader> */}

				<CardContent className="space-y-12 p-8 text-foreground">
					{/* --- Overview Section --- */}
					<section className="space-y-4">
						<div className="flex items-center gap-3 mb-4">
							<div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
								<FontAwesomeIcon
									icon={faQuestionCircle}
									className="h-6 w-6 text-blue-600 dark:text-blue-400"
								/>
							</div>
							<h3 className="text-2xl font-semibold text-foreground">
								{tRates("howItWorks.title")}
							</h3>
						</div>
						<div className="bg-muted/30 border border-border/50 rounded-xl p-6">
							<p className="text-muted-foreground leading-relaxed text-base">
								{tRates("howItWorks.body")}
							</p>
						</div>
					</section>

					{/* --- Commission Tiers and Rates Section (Dynamic) --- */}
					<section className="space-y-6">
						<div className="flex items-center gap-3 mb-6">
							<div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
								<FontAwesomeIcon
									icon={faArrowTrendUp}
									className="h-6 w-6 text-emerald-600 dark:text-emerald-400"
								/>
							</div>
							<h3 className="text-2xl font-semibold text-foreground">
								{tRates("title")}
							</h3>
						</div>
						<div className="bg-muted/30 border border-border/50 rounded-xl p-6">
							<p className="text-muted-foreground leading-relaxed text-base mb-6">
								{tRates("subtitle")}
							</p>
							{isLoading ? (
								<TierSkeleton />
							) : (
								<div className="grid gap-4">
									{affiliateRates.map((tier) => (
										<div
											key={tier.level}
											className="group relative bg-card border border-border/50 rounded-xl p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
										>
											<div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
											<div className="relative">
												<div className="flex items-center gap-3 mb-3">
													<div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-foreground text-sm font-semibold">
														{tier.level}
													</div>
													<h4 className="text-lg font-semibold text-foreground">
														{tRates(
															"table.tierPrefix"
														)}{" "}
														{tier.level}
													</h4>
													<div className="px-3 py-1 bg-muted rounded-full">
														<span className="text-sm font-medium text-muted-foreground">
															{tRates(
																"table.wagerRange"
															)}{" "}
															{formatTurnover(
																tier.min_to,
																tier.max_to
															)}
														</span>
													</div>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
													<div className="flex items-center gap-2 px-4 py-2 bg-background/50 rounded-lg border border-border/30">
														<div className="w-3 h-3 rounded-full bg-amber-500" />
														<span className="text-sm text-muted-foreground">
															{tRates(
																"table.slots"
															)}
															:
														</span>
														<span className="font-semibold text-foreground ml-auto">
															{tier.slot_percent}%
														</span>
													</div>
													<div className="flex items-center gap-2 px-4 py-2 bg-background/50 rounded-lg border border-border/30">
														<div className="w-3 h-3 rounded-full bg-red-500" />
														<span className="text-sm text-muted-foreground">
															{tRates(
																"table.liveCasino"
															)}
															:
														</span>
														<span className="font-semibold text-foreground ml-auto">
															{tier.lc_percent}%
														</span>
													</div>
													<div className="flex items-center gap-2 px-4 py-2 bg-background/50 rounded-lg border border-border/30">
														<div className="w-3 h-3 rounded-full bg-blue-500" />
														<span className="text-sm text-muted-foreground">
															{tRates(
																"table.sports"
															)}
															:
														</span>
														<span className="font-semibold text-foreground ml-auto">
															{tier.sport_percent}
															%
														</span>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</section>

					{/* --- How Commissions Are Calculated Section --- */}
					<section className="space-y-6">
						<div className="flex items-center gap-3 mb-6">
							<div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
								<FontAwesomeIcon
									icon={faDollarSign}
									className="h-6 w-6 text-purple-600 dark:text-purple-400"
								/>
							</div>
							<h3 className="text-2xl font-semibold text-foreground">
								{tRates("calculation.title")}
							</h3>
						</div>
						<div className="bg-muted/30 border border-border/50 rounded-xl p-6">
							<p className="text-muted-foreground leading-relaxed text-base mb-6">
								{tRates("calculation.desc")}
							</p>
							<div className="grid gap-3">
								{examples.map((example) => (
									<div
										key={example.tier}
										className="flex items-center justify-between p-4 bg-card border border-border/30 rounded-lg hover:border-primary/30 transition-colors"
									>
										<div className="flex items-center gap-3">
											<div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-semibold">
												{example.tier}
											</div>
											<span className="text-foreground">
												<span className="font-semibold">
													{tRates(
														"calculation.exampleTitle",
														{
															tier: example.tier,
														}
													)}
												</span>{" "}
												{tRates("calculation.wagerIn", {
													amount: example.amount,
													gameType: tRates(
														example.gameKey
													),
												})}
											</span>
										</div>
										<div className="font-semibold text-lg text-primary">
											{example.commission}
										</div>
									</div>
								))}
							</div>
						</div>
					</section>

					{/* --- Claiming and Withdrawing Section --- */}
					<section className="space-y-6">
						<div className="flex items-center gap-3 mb-6">
							<div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
								<FontAwesomeIcon
									icon={faDollarSign}
									className="h-6 w-6 text-green-600 dark:text-green-400"
								/>
							</div>
							<h3 className="text-2xl font-semibold text-foreground">
								{tRates("claim.title")}
							</h3>
						</div>
						<div className="bg-muted/30 border border-border/50 rounded-xl p-6">
							<div className="space-y-4">
								{claimPointKeys.map((key) => (
									<div
										key={key}
										className="flex items-start gap-3 p-3 bg-card border border-border/30 rounded-lg"
									>
										<div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
										<span className="text-muted-foreground leading-relaxed">
											{tRates(key)}
										</span>
									</div>
								))}
							</div>
						</div>
					</section>

					{/* --- System Time and Operations Section --- */}
					<section className="space-y-6">
						<div className="flex items-center gap-3 mb-6">
							<div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
								<FontAwesomeIcon
									icon={faClock}
									className="h-6 w-6 text-orange-600 dark:text-orange-400"
								/>
							</div>
							<h3 className="text-2xl font-semibold text-foreground">
								{tRates("system.title")}
							</h3>
						</div>
						<div className="bg-muted/30 border border-border/50 rounded-xl p-6">
							<div className="grid gap-4 mb-6">
								<div className="flex items-start gap-3 p-4 bg-card border border-border/30 rounded-lg">
									<div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
									<div>
										<span className="font-semibold text-foreground">
											{tRates(
												"system.dailyTimeframeLabel"
											)}
										</span>
										<span className="text-muted-foreground ml-2">
											{tRates(
												"system.dailyTimeframeValue"
											)}
										</span>
									</div>
								</div>
								<div className="flex items-start gap-3 p-4 bg-card border border-border/30 rounded-lg">
									<div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
									<div>
										<span className="font-semibold text-foreground">
											{tRates("system.claimDailyLabel")}
										</span>
										<span className="text-muted-foreground ml-2">
											{tRates("system.claimDailyValue", {
												local: "19:30",
											})}
										</span>
									</div>
								</div>
							</div>
							<div className="p-4 bg-card/50 border border-border/30 rounded-lg border-l-4 border-l-primary">
								<p className="text-sm italic text-muted-foreground">
									{tRates("system.note")}
								</p>
							</div>
						</div>
					</section>

					{/* --- Amendments Section --- */}
					<section className="space-y-6">
						<div className="flex items-center gap-3 mb-6">
							<div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
								<FontAwesomeIcon
									icon={faShield}
									className="h-6 w-6 text-red-600 dark:text-red-400"
								/>
							</div>
							<h3 className="text-2xl font-semibold text-foreground">
								{tRates("amendments.title")}
							</h3>
						</div>
						<div className="bg-muted/30 border border-border/50 rounded-xl p-6">
							<div className="p-4 bg-card border border-border/30 rounded-lg border-l-4 border-l-amber-500">
								<p className="text-muted-foreground leading-relaxed">
									{tRates("amendments.body")}
								</p>
							</div>
						</div>
					</section>
				</CardContent>
			</Card>
		</div>
	);
};
