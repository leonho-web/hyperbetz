"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoCard } from "@/components/common/banners/hero/info-card";
import { HeroSlideData, InfoCardData } from "@/types/features/hero-banner-section.types";

import HeroSlider from "@/components/common/banners/hero/hero-banner-slider";

// --- Enhanced Skeleton Component ---
const Layout1Skeleton = () => (
  <div className="space-y-6">
    <div className="relative">
      <Skeleton className="w-full h-64 md:h-80 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30" />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 animate-pulse" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Skeleton className="w-full h-48 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20" />
      <Skeleton className="w-full h-48 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20" />
      <Skeleton className="w-full h-40 rounded-2xl md:col-span-2 bg-gradient-to-br from-muted/40 to-muted/20" />
    </div>
  </div>
);

// --- Main Layout1 Component ---
interface Layout1Props {
  slides: HeroSlideData[];
  cards: InfoCardData[];
  isLoading?: boolean;
}

export const Layout1 = ({ slides, cards, isLoading = false }: Layout1Props) => {
  if (isLoading) {
    return <Layout1Skeleton />;
  }

  if (!slides?.length || !cards?.length || cards.length < 3) {
    console.warn("Layout1 received insufficient data.");
    return null;
  }

  const [card1, card2, card3] = cards;

  return (
    <div className="space-y-6">
      <HeroSlider slides={slides} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard data={card1} />
        <InfoCard data={card2} />
        <InfoCard data={card3} className="md:col-span-2" />
      </div>
    </div>
  );
};
