"use client";

// import { ArrowUpDown } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsUpDown } from "@fortawesome/pro-light-svg-icons";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "@/lib/locale-provider";

interface QuerySortDropdownProps {
	options: { value: string; label: string }[];
	value: string;
	onValueChange: (sortValue: string) => void;
	className?: string;
}

export const QuerySortDropdown = ({
	options,
	value,
	onValueChange,
	className,
}: QuerySortDropdownProps) => {
	const t = useTranslations("query.sort");
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className={className}>
					<FontAwesomeIcon
						icon={faArrowsUpDown}
						className="mr-2 h-4 w-4"
					/>
					{t("label")}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuRadioGroup
					value={value}
					onValueChange={onValueChange}
				>
					{options.map((option) => (
						<DropdownMenuRadioItem
							key={option.value}
							value={option.value}
						>
							{option.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
