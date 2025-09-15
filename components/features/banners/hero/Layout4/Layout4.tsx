"use client";

import {
  HeroSlideData,
  InfoCardData,
} from "@/types/features/hero-banner-section.types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"; // <-- Import Carousel components
import Autoplay from "embla-carousel-autoplay"; // <-- Import Autoplay for dynamic feel
import { InfoCard } from "@/components/common/banners/hero/info-card";
import { useTranslations } from "@/lib/locale-provider";

// --- NEW: A dedicated InfoCard Carousel sub-component for clarity ---
const InfoCardCarousel = ({ cards }: { cards: InfoCardData[] }) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          // Make it feel alive
          delay: 2500,
          //   stopOnInteraction: true,
          //   stopOnMouseEnter: true,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {cards.map((card, index) => (
          <CarouselItem
            key={index}
            // This is the core of the responsive behavior
            className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
          >
            <InfoCard data={card} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

// --- Encapsulated Skeleton State (Updated) ---
const Layout4Skeleton = () => (
  <div className="space-y-6">
    <Skeleton className="w-full h-80 rounded-xl" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Skeleton className="h-40 rounded-xl" />
      <Skeleton className="h-40 rounded-xl hidden sm:block" />
      <Skeleton className="h-40 rounded-xl hidden lg:block" />
    </div>
  </div>
);

interface Layout4Props {
  featuredSlide: HeroSlideData;
  cards: InfoCardData[];
  isLoading?: boolean;
}

export const Layout4 = ({
  featuredSlide,
  cards,
  isLoading = false,
}: Layout4Props) => {
  const tHero = useTranslations("hero");
  if (isLoading) return <Layout4Skeleton />;
  if (!featuredSlide || !cards?.length) return null;

  return (
    <div className="space-y-8">
      {/* The main hero banner section remains unchanged */}
      <div
        className="relative w-full h-80 rounded-xl bg-cover bg-center bg-no-repeat p-8 flex flex-col justify-center items-center text-center"
        style={{ backgroundImage: `url(${featuredSlide.backgroundImageUrl})` }}
      >
        <div className="absolute inset-0 bg-black/50 rounded-xl" />
        <div className="relative z-10 max-w-2xl text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tighter text-shadow-lg">
            {featuredSlide.i18nKey === "welcome" && (
              <>
                <span className="text-destructive">
                  {tHero("welcome.title1")}
                </span>
                <br />
                {tHero("welcome.title2")}
              </>
            )}
            {featuredSlide.i18nKey === "jackpot" && (
              <>
                <span className="text-primary">{tHero("jackpot.title1")}</span>
                <br />
                {tHero("jackpot.title2")}
              </>
            )}
            {featuredSlide.i18nKey === "guest" && (
              <span className="text-destructive">{tHero("guest.title")}</span>
            )}
            {!featuredSlide.i18nKey && featuredSlide.title}
          </h1>
          <p className="mt-4 text-lg opacity-80 text-shadow">
            {featuredSlide.i18nKey
              ? tHero(`${featuredSlide.i18nKey}.subtitle`)
              : featuredSlide.subtitle}
          </p>
          <Button
            size="lg"
            className="mt-8 shadow-lg"
            onClick={featuredSlide.onButtonClick}
          >
            {featuredSlide.i18nKey
              ? tHero(`${featuredSlide.i18nKey}.cta`)
              : featuredSlide.buttonText}
          </Button>
        </div>
      </div>

      {/* The static links are now replaced with our dynamic, responsive InfoCard carousel */}
      <div>
        <InfoCardCarousel cards={cards} />
      </div>
    </div>
  );
};
