"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/store";
import { useDynamicAuth } from "@/hooks/useDynamicAuth";
import { useRouter } from "next/navigation";

// Import the UI Sections
import { HeroBannerSection } from "@/components/features/banners/hero/hero-banner-section";
import { DynamicGameCarouselList } from "@/components/features/games/games-by-category-section";
import { DynamicProviderCarousel } from "@/components/features/providers/dynamic-provider-carousel";
import { LiveBettingTable } from "@/components/features/betting/live-betting-table";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useT } from "@/hooks/useI18n";
import { faTrophy } from "@fortawesome/pro-light-svg-icons";

export default function HomePage() {
	const t = useT();
	const router = useRouter();

	// --- 1. Get Authentication and UI State ---
	const { isLoggedIn, login } = useDynamicAuth();
	const { heroBanner, initializeHeroBanner } = useAppStore(
		(state) => state.uiDefinition.heroBanner
	);

	// Get game data and status. It's already being loaded by the RootLayout.
	const allGames = useAppStore((state) => state.game.list.games);
	const gameStatus = useAppStore((state) => state.game.list.status);

	// --- 2. Logic to Set the Default Hero Banner ---
	// This effect runs when data is ready and sets the hero banner state if it's not already set.
	useEffect(() => {
		const isDataReady = gameStatus === "success" && allGames.length > 0;

		// Only initialize if data is ready AND if the banner state hasn't been set by user interaction yet.
		if (isDataReady && !heroBanner) {
			initializeHeroBanner({ isLoggedIn, login, allGames, router });
		}
	}, [
		gameStatus,
		allGames,
		isLoggedIn,
		login,
		router,
		initializeHeroBanner,
		heroBanner,
	]);

	const { primaryWallet } = useDynamicContext();
	const setDynamicLoaded = useAppStore((state) => state.setDynamicLoaded);

	useEffect(() => {
		if (primaryWallet !== null) {
			setDynamicLoaded(true);
		}
	}, [primaryWallet, setDynamicLoaded]);

	// --- 3. Assemble the Page ---
	const isLoading = gameStatus !== "success";

	if (typeof window === "undefined") return;
	const params = new URLSearchParams(window.location.search);
	const found =
		params.get("r") || params.get("referrer") || params.get("referralId");
	if (isLoggedIn) {
		if (found) localStorage.setItem("referralId", found);
		router.replace("/lobby");
	}

	return (
		<>
			{/* 
        The HeroBannerSection renders based on the global state from the uiDefinition slice.
        The spread operator `{...heroBanner}` cleanly passes all the correct, pre-built props.
      */}
			{heroBanner && (
				<HeroBannerSection {...heroBanner} isLoading={isLoading} />
			)}

			<div className="container mx-auto flex flex-1 flex-col gap-8 py-8">
				{/* These components are now self-sufficient and can be dropped in. */}
				<DynamicGameCarouselList />
				<DynamicProviderCarousel
					title={t("home.topProviders")}
					Icon={faTrophy}
					rows={2}
					filter="all"
					maxProviders={16}
				/>{" "}
				{/* Live Betting Activity Table */}
				<section className="w-full">
					<LiveBettingTable />
				</section>
			</div>
		</>
	);
}
