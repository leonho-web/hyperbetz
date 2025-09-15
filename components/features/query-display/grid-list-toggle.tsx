"use client";

// import { Grid, List } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrid, faList } from "@fortawesome/pro-light-svg-icons";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/locale-provider";

export type ViewMode = "grid" | "list";

interface GridListToggleProps {
	/** The currently selected view mode, controlled by the parent. */
	value: ViewMode;
	/** Callback fired when the view mode changes. */
	onValueChange: (view: ViewMode) => void;
	className?: string;
}

export const GridListToggle = ({
	value,
	onValueChange,
	className,
}: GridListToggleProps) => {
	const t = useTranslations("query.view");
	// Use ShadCN's ToggleGroup for a more robust and accessible implementation.
	return (
		<ToggleGroup
			type="single"
			value={value}
			onValueChange={(newView: ViewMode) => {
				// Prevent un-toggling; a view must always be selected.
				if (newView) {
					onValueChange(newView);
				}
			}}
			className={cn("border rounded-md", className)}
			aria-label={t("toggleAria")}
		>
			<ToggleGroupItem
				value="grid"
				aria-label={t("gridAria")}
				className="rounded-r-none border-r"
			>
				<FontAwesomeIcon icon={faGrid} className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem
				value="list"
				aria-label={t("listAria")}
				className="rounded-l-none"
			>
				<FontAwesomeIcon icon={faList} className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	);
};
