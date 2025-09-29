import { AppStateCreator } from "@/store/store";
import { HeroBannerSectionProps } from "@/types/features/hero-banner-section.types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { heroBannerPropsFactory } from "@/components/features/banners/hero/hero-banner.factory";
import { Game } from "@/types/games/gameList.types";

const LAYOUT_STORAGE_KEY = "hero-banner-layout";
type SupportedLayouts =
	| "layout1"
	| "layout2"
	| "layout3"
	| "layout4"
	| "layout6"
	| "layout7"
	| "layout8";

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
		try {
			localStorage.setItem(LAYOUT_STORAGE_KEY, props.layout);
		} catch (error) {
			console.warn("Could not save layout preference:", error);
		}
		set((state) => {
			state.uiDefinition.heroBanner.heroBanner = props;
		});
	},
	// This new action centralizes the initial loading logic.
	initializeHeroBanner: async (deps) => {
		// Prevent re-initialization if already set
		if (get().uiDefinition.heroBanner.heroBanner) return;

		try {
			const savedLayout = localStorage.getItem(
				LAYOUT_STORAGE_KEY
			) as SupportedLayouts | null;
			const layoutToLoad: SupportedLayouts = "layout2";

			const propsBuilder = heroBannerPropsFactory[layoutToLoad];
			if (propsBuilder) {
				const initialProps = await propsBuilder(deps);
				// Call the setter, which will update state AND save to localStorage
				get().uiDefinition.heroBanner.setHeroBanner(initialProps);
			}
		} catch (error) {
			console.error("Failed to initialize hero banner:", error);
		}
	},
});
