"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * A dedicated, high-fidelity skeleton loader that perfectly mimics the
 * final layout and structure of the main TransactionModal.
 *
 * This is designed to be used as a Suspense fallback to prevent layout
 * shift and provide a smooth loading experience for the user.
 */
export const TransactionModalSkeleton = () => {
	return (
		// We render the Dialog and DialogContent to ensure the modal's
		// overlay and positioning are identical to the real component.
		<Dialog open={true}>
			<DialogContent className="max-w-4xl h-[70vh] p-0 gap-0 flex">
				{/* --- Skeleton for the Left Sidebar --- */}
				<div className="w-1/4 border-r p-4 space-y-2">
					{/* Mimic the four tab buttons */}
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
				</div>

				{/* --- Skeleton for the Right Content Area --- */}
				{/* This mimics the structure of the DepositPanel as a default */}
				<div className="w-3/4 flex flex-col">
					{/* Header Skeleton */}
					<div className="flex items-center justify-between p-4 border-b">
						<Skeleton className="h-8 w-8 rounded-full" />
						<Skeleton className="h-10 w-[180px] rounded-md" />
					</div>

					{/* Body Skeleton */}
					<div className="flex-grow p-6 space-y-6 flex flex-col justify-center">
						<div className="space-y-2">
							<Skeleton className="h-4 w-1/3" />
							<Skeleton className="h-16 w-full rounded-md" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-4 w-1/3" />
							<Skeleton className="h-14 w-full rounded-md" />
						</div>
						<div className="flex justify-between">
							<Skeleton className="h-4 w-2/5" />
							<Skeleton className="h-4 w-1/4" />
						</div>
					</div>

					{/* Footer Skeleton */}
					<div className="p-4 border-t mt-auto">
						<Skeleton className="h-12 w-full rounded-md" />
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
