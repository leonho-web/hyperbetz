import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
export const WalletInfoSkeleton = ({ className }: { className?: string }) => (
	<div
		className={cn(
			"bg-card/95 backdrop-blur-sm rounded-lg border border-border p-6 space-y-6 shadow-lg",
			className
		)}
	>
		{/* User Header Skeleton */}
		<div className="flex items-center gap-4">
			<div className="relative">
				<Skeleton className="h-14 w-14 rounded-full" />
				<div className="absolute -bottom-1 -right-1 h-4 w-4 bg-muted rounded-full border-2 border-background" />
			</div>
			<div className="flex-1 min-w-0 space-y-2">
				<Skeleton className="h-5 w-32" />
				<Skeleton className="h-4 w-20" />
			</div>
			<div className="text-right space-y-1">
				<Skeleton className="h-3 w-24" />
				<Skeleton className="h-6 w-16" />
			</div>
		</div>

		{/* Stats Cards Skeleton */}
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div className="bg-muted/30 border border-border rounded-lg p-4">
				<div className="flex items-center gap-3">
					<Skeleton className="h-8 w-8 rounded-lg" />
					<div className="flex-1 space-y-1">
						<Skeleton className="h-3 w-20" />
						<Skeleton className="h-5 w-12" />
					</div>
				</div>
			</div>
			<div className="bg-muted/30 border border-border rounded-lg p-4">
				<div className="flex items-center gap-3">
					<Skeleton className="h-8 w-8 rounded-lg" />
					<div className="flex-1 space-y-1">
						<Skeleton className="h-3 w-24" />
						<Skeleton className="h-5 w-12" />
					</div>
				</div>
			</div>
		</div>

		{/* Action Buttons Skeleton */}
		<div className="grid md:grid-cols-2 gap-3">
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
		</div>

		{/* Wallet Address Button Skeleton */}
		<Skeleton className="h-12 w-full" />

		{/* Secondary Actions Skeleton */}
		<div className="flex gap-3 pt-4 border-t border-border">
			<Skeleton className="h-12 w-full" />
		</div>
	</div>
);
