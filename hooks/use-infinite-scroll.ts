"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface UseInfiniteScrollOptions {
	/** Callback function to trigger when reaching the bottom */
	onLoadMore: () => void;
	/** Whether there are more items to load */
	hasNextPage: boolean;
	/** Whether loading is currently in progress */
	isLoading?: boolean;
	/** Distance from bottom in pixels to trigger load more (default: 100) */
	threshold?: number;
	/** Root element for intersection observer (default: null for viewport) */
	root?: Element | null;
	/** Throttle delay in milliseconds to prevent rapid firing (default: 500) */
	throttleDelay?: number;
}

/**
 * Custom hook for infinite scrolling functionality
 * Automatically triggers load more when user scrolls near the bottom
 */
export const useInfiniteScroll = ({
	onLoadMore,
	hasNextPage,
	isLoading = false,
	threshold = 100,
	root = null,
	throttleDelay = 500,
}: UseInfiniteScrollOptions) => {
	const sentinelRef = useRef<HTMLDivElement>(null);
	const [isTriggered, setIsTriggered] = useState(false);
	const lastTriggerTime = useRef(0);

	const handleIntersection = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const [entry] = entries;
			const now = Date.now();

			// Trigger load more when sentinel becomes visible
			// and we have more pages and are not currently loading
			// and throttle delay has passed
			if (
				entry.isIntersecting &&
				hasNextPage &&
				!isLoading &&
				!isTriggered &&
				now - lastTriggerTime.current > throttleDelay
			) {
				setIsTriggered(true);
				lastTriggerTime.current = now;
				onLoadMore();
			}
		},
		[onLoadMore, hasNextPage, isLoading, isTriggered, throttleDelay]
	);

	// Reset triggered state when loading completes or when items change
	useEffect(() => {
		if (!isLoading && isTriggered) {
			// Add a small delay before resetting to ensure smooth UX
			const timer = setTimeout(() => {
				setIsTriggered(false);
			}, 100); // Reduced delay for faster response

			return () => clearTimeout(timer);
		}
	}, [isLoading, isTriggered]);

	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel) return;

		// Create intersection observer with threshold
		const observer = new IntersectionObserver(handleIntersection, {
			root,
			rootMargin: `${threshold}px`,
			threshold: 0.1,
		});

		observer.observe(sentinel);

		// Cleanup observer on unmount
		return () => {
			observer.unobserve(sentinel);
			observer.disconnect();
		};
	}, [handleIntersection, threshold, root]);

	return { sentinelRef, isTriggered };
};
