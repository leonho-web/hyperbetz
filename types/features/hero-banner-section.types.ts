import { ReactNode } from "react";
import { Game } from "@/types/games/gameList.types"; // Assuming you might need this for other layouts

// --- Data Shape Definitions (No Changes Here) ---
export interface HeroSlideData {
	backgroundImageUrl: string;
	title: ReactNode;
	subtitle: string;
	buttonText: string;
	onButtonClick: () => void;
	game?: Game;
	/** Optional key to render localized content for known slides */
	i18nKey?: "guest" | "welcome" | "jackpot";
}

export interface InfoCardData {
	icon: ReactNode;
	title: string;
	badgeText: string;
	//   backgroundImageLink?: string;
	badgeColor?: "primary" | "secondary" | "destructive";
	description: string;
	linkText: string;
	href: string;
	/** Optional key to render localized content for known cards */
	i18nKey?: "casino" | "slots" | "sports" | "crypto";
	backgroundImage?: string;
}

// --- Discriminated Union for Component Props ---

/**
 * Defines the props required specifically for Layout1.
 * The `layout` property is the discriminant.
 */
interface Layout1Props {
	layout: "layout1";
	slides: HeroSlideData[];
	cards: InfoCardData[];
}

/**
 * Defines the props required specifically for Layout2.
 */
interface Layout2Props {
	layout: "layout2";
	slides: HeroSlideData[];
	featuredGame: Game;
	cards: InfoCardData[];
}

/**
 * Defines the props required specifically for Layout3.
 */
interface Layout3Props {
	layout: "layout3";
	mainGame: Game;
	sideGames: Game[];
}

/**
 * Defines the props required specifically for Layout3.
 */
interface Layout4Props {
	layout: "layout4";
	featuredSlide: HeroSlideData;
	cards: InfoCardData[]; // <-- Changed from `links` to `cards`
}

/**
 * This is the main, public-facing props type for the HeroBannerSection component.
 * It is a union of all possible layout props. TypeScript will enforce that
 * if `layout` is "layout1", then `slides` and `cards` must be provided.
 */
export type HeroBannerSectionProps = (
	| Layout1Props
	| Layout2Props
	| Layout3Props
	| Layout4Props
) & {
	isLoading?: boolean;
};
