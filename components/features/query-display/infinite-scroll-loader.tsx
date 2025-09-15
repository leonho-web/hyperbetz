"use client";

interface InfiniteScrollLoaderProps {
	isVisible: boolean;
	isLoading?: boolean;
}

export const InfiniteScrollLoader = ({
	isVisible
}: InfiniteScrollLoaderProps) => {
	if (!isVisible) {
		return null;
	}

	return (
		<div className="flex justify-center items-center py-8">
			{/* Simple animated dots */}
			<div className="flex gap-1">
				{[0, 1, 2].map((index) => (
					<div
						key={index}
						className="w-2 h-2 bg-primary rounded-full animate-bounce"
						style={{
							animationDelay: `${index * 0.15}s`,
							animationDuration: "0.8s",
						}}
					/>
				))}
			</div>
		</div>
	);
};
