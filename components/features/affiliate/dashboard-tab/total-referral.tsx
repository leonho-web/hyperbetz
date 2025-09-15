"use client";

import CountUp from "react-countup";
// import { Users } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/pro-light-svg-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/lib/locale-provider";

interface Props {
	isLoading: boolean;
	totalReferrals: number | undefined;
}

export const TotalReferrals = ({ isLoading, totalReferrals = 0 }: Props) => {
	const t = useTranslations("affiliate.dashboard");
	return (
		<Card className="border-primary/70 bg-gradient-to-br from-background to-muted/15 hover:shadow-lg hover:border-primary/30 hover:bg-gradient-to-br hover:from-background hover:to-muted/25 transition-all duration-300 group">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
				<CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
					{t("totalReferrals")}
				</CardTitle>
				<div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
					<FontAwesomeIcon
						icon={faUsers}
						className="h-4 w-4 text-primary group-hover:text-primary/90 transition-colors"
					/>
				</div>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<Skeleton className="h-8 w-20 rounded-md" />
				) : (
					<div className="text-2xl font-bold text-foreground">
						<CountUp end={totalReferrals} duration={1.5} />
						<span className="text-sm font-medium text-muted-foreground/80 ml-1">
							{t("usersUnit")}
						</span>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
