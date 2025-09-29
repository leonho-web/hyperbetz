"use client";
import { useDynamicAuth } from "@/hooks/useDynamicAuth";
import {
	DynamicEmbeddedWidget,
	useDynamicContext,
} from "@dynamic-labs/sdk-react-core";
import { ProfileInfoCard } from "../../profile/profile-info-card";
import { WalletInfoSkeleton } from "./wallet-info-skeleton";

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
	if (isLoading || !user) return <WalletInfoSkeleton />;

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
