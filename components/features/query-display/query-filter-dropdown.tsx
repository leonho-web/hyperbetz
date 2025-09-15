"use client";
import { useState } from "react";
// import { Filter } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/pro-light-svg-icons";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { ActiveFilters } from "@/store/slices/query/query.slice";
import { FilterSection } from "@/types/features/query-display.types";
import { useTranslations } from "@/lib/locale-provider";

interface QueryFilterDropdownProps {
	sections: FilterSection[];
	activeFilters: ActiveFilters;
	onFilterChange: (filterType: string, value: string) => void;
}

export default function QueryFilterDropdown({
	sections,
	activeFilters,
	onFilterChange,
}: QueryFilterDropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const t = useTranslations("query.filters");

	// Calculate total active filters count
	const activeFilterCount = Object.values(activeFilters).reduce(
		(total, filters) => total + filters.length,
		0
	);

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" className="relative">
					<FontAwesomeIcon icon={faFilter} className="mr-2 h-4 w-4" />
					{t("filter")}
					{activeFilterCount > 0 && (
						<span className="ml-2 bg-primary text-foreground rounded-full text-xs px-2 py-0.5 min-w-5 h-5 flex items-center justify-center">
							{activeFilterCount}
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80 p-0" align="end">
				<div className="p-4 border-b">
					<h3 className="font-semibold text-sm">
						{t("optionsTitle")}
					</h3>
				</div>
				<div className="max-h-96 overflow-y-auto">
					<Accordion type="multiple" className="w-full">
						{sections.map((section) => (
							<AccordionItem
								key={section.id}
								value={section.id}
								className="border-b-0"
							>
								<AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
									<div className="flex items-center justify-between w-full">
										<span>{section.label}</span>
										{activeFilters[section.id]?.length >
											0 && (
											<span className="bg-primary text-foreground rounded-full text-xs px-2 py-0.5 min-w-5 h-5 flex items-center justify-center mr-2">
												{
													activeFilters[section.id]
														.length
												}
											</span>
										)}
									</div>
								</AccordionTrigger>
								<AccordionContent className="px-4 pb-3">
									<div className="space-y-2">
										{section.options.map((option) => (
											<div
												key={option.value}
												className="flex items-center space-x-2"
											>
												<Checkbox
													id={`${section.id}-${option.value}`}
													checked={
														activeFilters[
															section.id
														]?.includes(
															option.value
														) || false
													}
													onCheckedChange={() =>
														onFilterChange(
															section.id,
															option.value
														)
													}
												/>
												<Label
													htmlFor={`${section.id}-${option.value}`}
													className="flex-1 cursor-pointer text-sm"
												>
													{option.label}
													{option.count != null && (
														<span className="ml-2 text-xs text-muted-foreground">
															({option.count})
														</span>
													)}
												</Label>
											</div>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
				{activeFilterCount > 0 && (
					<div className="p-4 border-t">
						<Button
							variant="outline"
							size="sm"
							className="w-full"
							onClick={() => {
								// Clear all filters
								sections.forEach((section) => {
									activeFilters[section.id]?.forEach(
										(value) => {
											onFilterChange(section.id, value);
										}
									);
								});
							}}
						>
							{t("clearAll")}
						</Button>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
