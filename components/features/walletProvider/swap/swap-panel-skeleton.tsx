import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const SwapPanelSkeleton = ({ className }: { className?: string }) => (
	<div
		className={cn(
			"bg-card border border-border rounded-2xl shadow-lg",
			className
		)}
	>
		{/* Network Header Skeleton */}
		<div className="flex items-center justify-between p-3 border-b border-border">
			<div className="flex items-center gap-1">
				<Skeleton className="h-8 w-8 rounded-md" />
				<Skeleton className="h-8 w-8 rounded-md" />
			</div>
			<Skeleton className="h-8 w-24 rounded-full" />
		</div>

		<div className="p-4 space-y-1">
			{/* You Pay Card Skeleton */}
			<div className="bg-input/30 border border-border rounded-xl p-3 space-y-2.5">
				<div className="flex items-center justify-between">
					<Skeleton className="h-4 w-16" />
					<div className="flex items-center gap-2">
						<Skeleton className="h-3 w-20" />
						<Skeleton className="h-3 w-8" />
					</div>
				</div>

				<div className="flex items-center justify-between gap-3">
					<Skeleton className="h-8 flex-1" />
					<div className="flex items-center gap-2 bg-muted/30 hover:bg-muted/50 rounded-full px-2.5 py-1.5">
						<Skeleton className="w-5 h-5 rounded-full" />
						<Skeleton className="h-4 w-12" />
						<Skeleton className="h-3 w-3" />
					</div>
				</div>

				<Skeleton className="h-3 w-16" />
			</div>

			{/* Swap Button Skeleton */}
			<div className="flex justify-center relative -my-4 z-10">
				<div className="bg-card border-border p-1 rounded-lg">
					<Skeleton className="w-8 h-8 rounded-lg" />
				</div>
			</div>

			{/* You Receive Card Skeleton */}
			<div className="bg-input/30 border border-border rounded-xl p-3 space-y-2.5">
				<div className="flex items-center justify-between">
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-3 w-16" />
				</div>

				<div className="flex items-center justify-between gap-3">
					<Skeleton className="h-8 flex-1" />
					<div className="flex items-center gap-2 bg-muted/30 hover:bg-muted/50 rounded-full px-3 py-1.5">
						<Skeleton className="w-5 h-5 rounded-full" />
						<Skeleton className="h-4 w-12" />
						<Skeleton className="h-3 w-3" />
					</div>
				</div>

				<Skeleton className="h-3 w-16" />
			</div>

			{/* Quote Loading Skeleton */}
			<div className="flex items-center justify-center gap-2 py-4">
				<Skeleton className="h-4 w-4 rounded-full" />
				<Skeleton className="h-4 w-32" />
			</div>

			{/* Conversion Details Skeleton */}
			<div className="mt-4">
				<div className="bg-muted/10 rounded-lg border border-border/30">
					<div className="p-3">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<Skeleton className="h-4 w-4" />
									<Skeleton className="h-4 w-32" />
								</div>
								<div className="flex items-center gap-2">
									<Skeleton className="h-3 w-3" />
									<Skeleton className="h-3 w-20" />
								</div>
							</div>
							<Skeleton className="h-4 w-4" />
						</div>
					</div>
				</div>
			</div>

			{/* Price Impact Warning Skeleton */}
			<div className="flex items-center gap-2 mt-3">
				<Skeleton className="h-3 w-3" />
				<Skeleton className="h-3 w-40" />
			</div>

			{/* Wallet Address Section Skeleton */}
			<div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border mt-4">
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-4 w-20" />
				</div>
				<Skeleton className="h-8 w-8 rounded-md" />
			</div>

			{/* Main Action Button Skeleton */}
			<div className="pt-4">
				<Skeleton className="w-full h-12 rounded-lg" />
			</div>
		</div>
	</div>
);
