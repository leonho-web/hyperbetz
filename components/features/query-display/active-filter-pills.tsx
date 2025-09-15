"use client";

import { ActiveFilters } from "@/store/slices/query/query.slice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { X } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/pro-light-svg-icons";
import { useTranslations } from "@/lib/locale-provider";

interface ActiveFilterPillsProps {
	activeFilters: ActiveFilters;
	onRemoveFilter: (filterType: string, value: string) => void;
	onClearAll: () => void;
}

export const ActiveFilterPills = ({
	activeFilters,
	onRemoveFilter,
	onClearAll,
}: ActiveFilterPillsProps) => {
	const t = useTranslations("query.filters");
	const allFilters = Object.entries(activeFilters).flatMap(([type, values]) =>
		values.map((value) => ({ type, value }))
	);

	if (allFilters.length === 0) {
		return null; // Don't render anything if no filters are active
	}

	return (
		<div className="flex flex-wrap items-center gap-2">
			<span className="text-sm font-medium text-muted-foreground">
				{t("activeLabel")}
			</span>
			{allFilters.map(({ type, value }) => (
				<Badge
					key={`${type}-${value}`}
					variant="secondary"
					className="border border-primary/50 text-center"
				>
					{value}
					<Button
						variant="ghost"
						size="sm"
						className="h-auto w-auto !p-0 ml-1"
						onClick={() => onRemoveFilter(type, value)}
					>
						<FontAwesomeIcon icon={faX} fontSize={12} />
					</Button>
				</Badge>
			))}
			<Button
				variant="outline"
				size="sm"
				onClick={onClearAll}
				className="h-auto px-2 py-1 text-xs"
			>
				{t("clearAll")}
			</Button>
		</div>
	);
};
