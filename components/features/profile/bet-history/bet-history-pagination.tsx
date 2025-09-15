"use client";

import { useTranslations } from "@/lib/locale-provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronLeft,
	faChevronRight,
	faAngleDoubleLeft,
	faAngleDoubleRight,
} from "@fortawesome/pro-light-svg-icons";

interface BetHistoryPaginationProps {
	currentPage: number;
	totalPages: number;
	totalRecords: number;
	onPageChange: (page: number) => void;
	isLoading: boolean;
	pageSize?: number;
}

export function BetHistoryPagination({
	currentPage,
	totalPages,
	totalRecords,
	onPageChange,
	isLoading,
	pageSize = 20,
}: BetHistoryPaginationProps) {
	const t = useTranslations("profile.betHistory");

	if (totalPages <= 1) return null;

	const getVisiblePages = () => {
		const delta = 2;
		const range = [];
		const rangeWithDots = [];

		for (
			let i = Math.max(2, currentPage - delta);
			i <= Math.min(totalPages - 1, currentPage + delta);
			i++
		) {
			range.push(i);
		}

		if (currentPage - delta > 2) {
			rangeWithDots.push(1, "...");
		} else {
			rangeWithDots.push(1);
		}

		rangeWithDots.push(...range);

		if (currentPage + delta < totalPages - 1) {
			rangeWithDots.push("...", totalPages);
		} else if (totalPages > 1) {
			rangeWithDots.push(totalPages);
		}

		return rangeWithDots;
	};

	const visiblePages = getVisiblePages();

	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border/50 bg-background/20">
			{/* Results info */}
			<div className="text-sm text-muted-foreground">
				{t("showingResults", {
					start: (currentPage - 1) * pageSize + 1,
					end: Math.min(currentPage * pageSize, totalRecords),
					total: totalRecords,
				})}
			</div>

			{/* Pagination controls */}
			<div className="flex items-center gap-1">
				{/* First page */}
				<button
					type="button"
					onClick={() => onPageChange(1)}
					disabled={currentPage === 1 || isLoading}
					className="cursor-pointer h-8 w-8 flex items-center justify-center rounded-lg border border-border/50 bg-background/50 text-muted-foreground hover:bg-background hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					title={t("firstPage")}
				>
					<FontAwesomeIcon
						icon={faAngleDoubleLeft}
						className="h-4 w-4"
					/>
				</button>

				{/* Previous page */}
				<button
					type="button"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1 || isLoading}
					className="cursor-pointer h-8 w-8 flex items-center justify-center rounded-lg border border-border/50 bg-background/50 text-muted-foreground hover:bg-background hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					title={t("previousPage")}
				>
					<FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
				</button>

				{/* Page numbers */}
				<div className="flex items-center gap-1">
					{visiblePages.map((page, index) => {
						if (page === "...") {
							return (
								<span
									key={`dots-${index}`}
									className="h-8 w-8 flex items-center justify-center text-muted-foreground"
								>
									...
								</span>
							);
						}

						const pageNumber = page as number;
						const isCurrentPage = pageNumber === currentPage;

						return (
							<button
								key={pageNumber}
								type="button"
								onClick={() => onPageChange(pageNumber)}
								disabled={isLoading}
								className={`cursor-pointer h-8 w-8 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors disabled:cursor-not-allowed ${
									isCurrentPage
										? "border-primary bg-primary text-foreground shadow-md"
										: "border-border/50 bg-background/50 text-muted-foreground hover:bg-background hover:text-foreground disabled:opacity-50"
								}`}
							>
								{pageNumber}
							</button>
						);
					})}
				</div>

				{/* Next page */}
				<button
					type="button"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages || isLoading}
					className="cursor-pointer h-8 w-8 flex items-center justify-center rounded-lg border border-border/50 bg-background/50 text-muted-foreground hover:bg-background hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					title={t("nextPage")}
				>
					<FontAwesomeIcon
						icon={faChevronRight}
						className="h-4 w-4"
					/>
				</button>

				{/* Last page */}
				<button
					type="button"
					onClick={() => onPageChange(totalPages)}
					disabled={currentPage === totalPages || isLoading}
					className="cursor-pointer h-8 w-8 flex items-center justify-center rounded-lg border border-border/50 bg-background/50 text-muted-foreground hover:bg-background hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					title={t("lastPage")}
				>
					<FontAwesomeIcon
						icon={faAngleDoubleRight}
						className="h-4 w-4"
					/>
				</button>
			</div>
		</div>
	);
}
