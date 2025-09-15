"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const ProfileInfoCardSkeleton = () => {
	return (
		<div className="bg-card/95 backdrop-blur-sm rounded-lg border border-border p-6 space-y-6 shadow-lg">
			{/* User Header */}
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

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{[...Array(2)].map((_, i) => (
					<div key={i} className="bg-muted/30 border border-border rounded-lg p-4 w-full">
						<div className="flex items-center gap-3">
							<Skeleton className="h-8 w-8 rounded-lg" />
							<div className="flex-1 space-y-2">
								<Skeleton className="h-3" />
								<Skeleton className="h-3" />
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Action Buttons */}
			<div className="grid grid-cols-2 gap-3">
				<Skeleton className="h-10 w-full rounded-md" />
				<Skeleton className="h-10 w-full rounded-md" />
			</div>

			<div className="flex gap-3 pt-4">
				<Skeleton className="flex-1 h-12 rounded-md w-full" />
				</div>

			{/* Secondary Actions */}
			<div className="flex gap-3 pt-4 border-t border-border">
				<Skeleton className="flex-1 h-12 rounded-md w-full" />
			</div>
		</div>
	);
};
