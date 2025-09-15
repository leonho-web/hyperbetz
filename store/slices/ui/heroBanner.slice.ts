import { AppStateCreator } from "@/store/store";
import { HeroBannerSectionProps } from "@/types/features/hero-banner-section.types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { heroBannerPropsFactory } from "@/components/features/banners/hero/hero-banner.factory";
import { Game } from "@/types/games/gameList.types";

// const LAYOUT_STORAGE_KEY = "hero-banner-layout"; // Commented out since we force layout2
type SupportedLayouts = "layout1" | "layout2" | "layout3" | "layout4";

/**
 * Defines the state structure for UI-related HeroBanner configurations.
 */
export interface HeroBannerSliceState {
	/**
	 * Holds the complete, type-safe props object for the currently active HeroBannerSection.
	 * Starts as `null` and is populated by a page or control component.
	 */
	heroBanner: HeroBannerSectionProps | null;
}

/**
 * Defines the actions available to manipulate the HeroBanner state.
 */
export interface HeroBannerSliceActions {
	/**
	 * Sets the entire props object for the HeroBannerSection, triggering a re-render
	 * with the new layout and data.
	 * @param props - A complete and valid HeroBannerSectionProps object.
	 */
	setHeroBanner: (props: HeroBannerSectionProps) => void;

	initializeHeroBanner: (deps: {
		isLoggedIn: boolean;
		login: () => void;
		allGames: Game[]; // Adjust type as needed
		router: AppRouterInstance;
	}) => void;
}

/**
 * The state creator function for the HeroBanner slice.
 * Uses Immer for clean, mutation-style state updates.
 */
export const createHeroBannerSlice: AppStateCreator<
	HeroBannerSliceState & HeroBannerSliceActions
> = (set, get) => ({
	heroBanner: null,
	setHeroBanner: (props) => {
		// Persisting layout to localStorage is disabled as we only use layout2 now.
		// try {
		// 	localStorage.setItem(LAYOUT_STORAGE_KEY, props.layout);
		// } catch (error) {
		// 	console.warn("Could not save layout preference:", error);
		// }
		set((state) => {
			state.uiDefinition.heroBanner.heroBanner = props;
		});
	},
	// This new action centralizes the initial loading logic.
	initializeHeroBanner: async (deps) => {
		// Prevent re-initialization if already set
		if (get().uiDefinition.heroBanner.heroBanner) return;

		try {
			// Force layout2 as the only layout for HeroBannerSection.
			const layoutToLoad: SupportedLayouts = "layout2";

			const propsBuilder = heroBannerPropsFactory[layoutToLoad];
			if (propsBuilder) {
				const initialProps = await propsBuilder(deps);
				get().uiDefinition.heroBanner.setHeroBanner(initialProps);
			}

			// Previous logic retained for reference:
			// const savedLayout = localStorage.getItem(LAYOUT_STORAGE_KEY) as SupportedLayouts | null;
			// const layoutToLoad: SupportedLayouts =
			// 	savedLayout && deps.allGames.length >= 5 ? savedLayout : "layout2";
			// const propsBuilder = heroBannerPropsFactory[layoutToLoad];
			// if (propsBuilder) {
			// 	const initialProps = await propsBuilder(deps);
			// 	get().uiDefinition.heroBanner.setHeroBanner(initialProps);
			// }
		} catch (error) {
			console.error("Failed to initialize hero banner:", error);
		}
	},
});
