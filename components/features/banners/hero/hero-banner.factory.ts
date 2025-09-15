import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Game } from "@/types/games/gameList.types";
import {
  convertGamesToHeroSlides,
  getNewestGames,
  getPopularGames,
} from "@/lib/utils/games/games.utils";
import { mockHeroSlides, mockInfoCards, guestSlides } from "@/data/mock-data";
import { HeroBannerSectionProps } from "@/types/features/hero-banner-section.types";

/**
 * Defines all the raw data dependencies that our factory functions might need.
 * By passing this single object, we keep our function signatures clean.
 */
interface HeroPropsFactoryDependencies {
  isLoggedIn: boolean;
  login: () => void;
  allGames: Game[];
  router: AppRouterInstance;
}

// A type for the functions that build our props.
type PropBuilder = (
  deps: HeroPropsFactoryDependencies
) => HeroBannerSectionProps;

/**
 * This factory object is the single source of truth for creating the props for each layout.
 * To add a new layout, you only need to add a new entry here.
 */
export const heroBannerPropsFactory: Record<
  "layout1" | "layout2" | "layout3" | "layout4",
  PropBuilder
> = {
  /**
   * Builder for Layout 1.
   * This layout uses static promotional content.
   */

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  layout1: (_deps: HeroPropsFactoryDependencies): HeroBannerSectionProps => {
    // Note: This file is not a React component, so we cannot call hooks here.
    // We keep raw data in mock-data but the actual components will render localized strings.
    return {
      layout: "layout1",
      slides: mockHeroSlides,
      cards: mockInfoCards,
    };
  },

  // eslint-enable-next-line @typescript-eslint/no-unused-vars
  /**
   * Builder for Layout 2.
   * This layout's content changes based on the user's authentication state.
   */
  layout2: (deps: HeroPropsFactoryDependencies): HeroBannerSectionProps => {
    const { isLoggedIn, login, allGames, router } = deps;

    // The logic to build the correct slides based on login state is now centralized here.
    const loggedInSlides = convertGamesToHeroSlides(
      getPopularGames(allGames, 4),
      router
    );
    guestSlides[0].onButtonClick = login; // Dynamically assign the login function

    const dynamicGuestSlides = guestSlides.map((slide, index) => {
      if (index === 0) {
        return {
          ...slide,
          onButtonClick: login,
        };
      }
      return slide;
    });

    return {
      layout: "layout2",
      slides: isLoggedIn ? loggedInSlides : dynamicGuestSlides,
      featuredGame: getPopularGames(allGames, 500)[Math.floor(Math.random() * 500)],
      cards: mockInfoCards.slice(0, 3), // Layout 2 uses 3 info cards
    };
  },

  /**
   * Builder for Layout 3.
   */
  layout3: (deps): HeroBannerSectionProps => {
    const { allGames } = deps;
    return {
      layout: "layout3",
      mainGame: getPopularGames(allGames, 2)[0],
      sideGames: getNewestGames(allGames, 6),
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  layout4: (_deps): HeroBannerSectionProps => {
    return {
      layout: "layout4",
      featuredSlide: mockHeroSlides[1], // Use the "Mega Jackpot" slide for example
      cards: mockInfoCards.slice(0, 4),
    };
  },
};
