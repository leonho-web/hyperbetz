"use client";

import CountUp from "react-countup";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Gift, Loader2 } from "lucide-react";
import { useTranslations } from "@/lib/locale-provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift, faSpinner } from "@fortawesome/pro-light-svg-icons";

interface Props {
	token: string;
	isLoading: boolean;
	isClaiming: boolean;
	unclaimedAmount: number | undefined;
	onClaim: () => void;
	isClaimDisabled: boolean;
}

export const ClaimBonus = ({
	isLoading,
	isClaiming,
	unclaimedAmount = 0,
	onClaim,
	token,
	isClaimDisabled = false,
}: Props) => {
	const t = useTranslations("affiliate.dashboard");
	return (
		<Card className="border-primary/70 bg-gradient-to-br from-background to-muted/15 hover:shadow-lg hover:border-primary/30 hover:bg-gradient-to-br hover:from-background hover:to-muted/25 transition-all duration-300 group">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
				<CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
					{t("unclaimedEarnings")}
				</CardTitle>
				<div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
					{/* <Gift className="h-4 w-4 text-primary group-hover:text-primary/90 transition-colors" /> */}
					<FontAwesomeIcon
						icon={faGift}
						fontSize={20}
						className="text-primary group-hover:text-primary/90 transition-colors"
					/>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between gap-4">
					{isLoading ? (
						<Skeleton className="h-8 w-28 rounded-md" />
					) : (
						<div className="text-2xl font-semibold text-foreground">
							<span className="text-primary">$</span>
							<CountUp
								end={unclaimedAmount}
								decimals={2}
								duration={1.5}
								separator=","
							/>{" "}
							<span className="text-sm font-medium text-muted-foreground/80">
								{token}
							</span>
						</div>
					)}
					<Button
						onClick={onClaim}
						disabled={isClaimDisabled || isLoading}
						className="px-6 hover:scale-[1.02] transition-transform duration-200"
						size="sm"
					>
						{isClaiming ? (
							<>
								{/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
								<FontAwesomeIcon
									icon={faSpinner}
									fontSize={20}
									className="mr-2 animate-spin"
								/>
								{t("claiming")}
							</>
						) : (
							<>
								{/* <Gift className="mr-2 h-4 w-4" /> */}
								<FontAwesomeIcon
									icon={faGift}
									fontSize={16}
									className="mr-2"
								/>
								{t("claim")}
							</>
						)}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};
