"use client";

import { Suspense, useEffect } from "react";
import { ProviderPageLayout } from "@/components/features/query-display/provider-page-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/store/store";

const VendorPageSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-20 w-full rounded-lg" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(12)].map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-lg" />
      ))}
    </div>
  </div>
);

function VendorsPageClient() {
  // --- 1. Get the necessary state and actions ---

  const gameStatus = useAppStore(state => state.game.list.status);
  const initializeProviderList = useAppStore(state => state.game.providers.initializeProviderList);

  // Initialize provider icons when component mounts
  useEffect(() => {
    initializeProviderList();
  }, [initializeProviderList]);

  // --- 2. THE CRITICAL GATEKEEPER ---
  // If the data is not yet successfully loaded, we render the skeleton.
  // This prevents `ProviderPageLayout` from ever being rendered with an empty `allGames` array.
  if (gameStatus !== "success") {
    return <VendorPageSkeleton />;
  }

  // Only when the status is 'success' do we render the layout component.
  // At this point, we can guarantee that `selectAllGames` will have data.
  return <ProviderPageLayout />;
}

export default function AllVendorsPage() {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<VendorPageSkeleton />}>
        <VendorsPageClient />
      </Suspense>
    </div>
  );
}
