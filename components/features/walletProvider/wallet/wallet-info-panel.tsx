"use client";
import { useDynamicAuth } from "@/hooks/useDynamicAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	DynamicEmbeddedWidget,
	useDynamicContext,
} from "@dynamic-labs/sdk-react-core";
import { ProfileInfoCard } from "../../profile/profile-info-card";

/**
 * A beautifully redesigned, feature-rich UI Panel that provides a comprehensive
 * and visually appealing overview of the user's profile information.
 *
 * This component is built exclusively with shadcn/ui components and CSS variables.
 */
export const WalletInfoPanel = ({
	onNavigate,
}: {
	onNavigate?: () => void;
}) => {
	// --- 1. Get Dependencies from Global Context ---
	const { user, isLoading } = useDynamicAuth();
	const { primaryWallet } = useDynamicContext();

	// --- 3. Loading State ---
	if (isLoading || !user) {
		return (
			<div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
				<Card className="border-none bg-transparent shadow-none">
					<CardContent className="p-3 sm:p-4 md:p-6">
						<div className="flex items-center gap-3 sm:gap-4">
							<Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-full" />
							<div className="space-y-2 flex-grow">
								<Skeleton className="h-5 sm:h-6 w-3/4" />
								<Skeleton className="h-3 sm:h-4 w-1/2" />
							</div>
						</div>
						<Skeleton className="h-8 sm:h-10 w-full mt-4 sm:mt-6" />
					</CardContent>
				</Card>
				<Card className="border-none bg-transparent shadow-none">
					<CardContent className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
						<Skeleton className="h-20 sm:h-24 w-full" />
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
							<Skeleton className="h-14 sm:h-16 w-full" />
							<Skeleton className="h-14 sm:h-16 w-full" />
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// --- 4. Render the UI ---
	return (
		<>
			{primaryWallet?.connector?.isEmbeddedWallet ? (
				<DynamicEmbeddedWidget background="with-border" />
			) : (
				<ProfileInfoCard onNavigate={onNavigate} />
			)}
		</>
	);
};
