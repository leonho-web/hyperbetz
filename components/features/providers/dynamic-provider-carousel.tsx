"use client";

import { useAppStore } from "@/store/store";
import { ProviderCarouselSection } from "./provider-carousel-section";
import { Skeleton } from "@/components/ui/skeleton";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface DynamicProviderCarouselProps {
	title: string;
	Icon: IconDefinition;
	rows: number;
	filter: string;
	maxProviders: number;
}

export const DynamicProviderCarousel = ({
	title,
	Icon,
	rows,
	filter,
	maxProviders = 16, // Default to showing top 16 providers
}: DynamicProviderCarouselProps) => {
	// Check loading status for the store data
	const status = useAppStore((state) => state.game.list.status);

	// Handle loading state (optional, but good practice)
	if (status === "loading" || status === "idle") {
		return (
			<div className="w-full space-y-4">
				<Skeleton className="h-8 w-48" />
				<div className="flex space-x-4">
					{[...Array(6)].map((_, i) => (
						<Skeleton key={i} className="h-24 w-1/6" />
					))}
				</div>
			</div>
		);
	}

	return (
		<ProviderCarouselSection
			title={title}
			viewAllUrl="/providers" // Direct link to your new /providers page
			maxProviders={maxProviders} // Show top 16 providers
			Icon={Icon}
			rows={rows}
			filter={filter}
		/>
	);
};
