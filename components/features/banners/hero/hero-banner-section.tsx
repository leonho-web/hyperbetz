import { HeroBannerSectionProps } from "@/types/features/hero-banner-section.types";
import { Layout1 } from "./Layout1/Layout1";
import { Layout2 } from "./Layout2/Layout2";
import { Layout3 } from "./Layout3/Layout3";
import { Layout4 } from "./Layout4/Layout4";

/**
 * The main HeroBannerSection component.
 * Its props are a discriminated union, making it fully type-safe and scalable.
 */
export const HeroBannerSection = (props: HeroBannerSectionProps) => {
  // Pass down the `isLoading` prop to all layouts.
  const { isLoading = false } = props;

  switch (props.layout) {
    case "layout1":
      // Inside this case, TypeScript KNOWS that `props` has `slides` and `cards`.
      // No optional chaining or type assertions are needed. It's perfectly safe.
      return <Layout1 slides={props.slides} cards={props.cards} isLoading={isLoading} />;

    case "layout2":
      return <Layout2 slides={props.slides} featuredGame={props.featuredGame} cards={props.cards} isLoading={isLoading} />;

    case "layout3": // <-- NEW CASE
      return <Layout3 mainGame={props.mainGame} sideGames={props.sideGames} isLoading={isLoading} />;
    case "layout4": // <-- NEW CASE
      return <Layout4 featuredSlide={props.featuredSlide} cards={props.cards} isLoading={isLoading} />;

    default:
      return null;
  }
};
