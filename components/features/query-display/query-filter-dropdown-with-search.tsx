// "use client";

// import { useState } from "react";
// import { Check, ChevronsUpDown } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
// import { Badge } from "@/components/ui/badge";
// import { FilterOption } from "@/types/features/query-display.types";

// interface QueryFilterDropdownWithSearchProps {
//   options: FilterOption[];
//   activeValues: string[];
//   onToggle: (value: string) => void;
//   onClear: () => void;
// }

// export const QueryFilterDropdownWithSearch = ({ options, activeValues, onToggle, onClear }: QueryFilterDropdownWithSearchProps) => {
//   const [open, setOpen] = useState(false);

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button variant="outline" role="combobox" aria-expanded={open} className="w-[250px] justify-between">
//           Providers
//           {activeValues.length > 0 && (
//             <Badge variant="default" className="ml-2">
//               {activeValues.length} selected
//             </Badge>
//           )}
//           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-[250px] p-0">
//         <Command>
//           <CommandInput placeholder="Search providers..." />
//           <CommandList>
//             <CommandEmpty>No provider found.</CommandEmpty>
//             <CommandGroup>
//               {options.map(option => (
//                 <CommandItem
//                   key={option.value}
//                   value={option.label} // Command uses value for searching
//                   onSelect={() => {
//                     onToggle(option.value);
//                   }}>
//                   <Check className={`mr-2 h-4 w-4 ${activeValues.includes(option.value) ? "opacity-100" : "opacity-0"}`} />
//                   <span>{option.label}</span>
//                   {option.count != null && <span className="ml-auto text-xs text-muted-foreground">{option.count}</span>}
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           </CommandList>
//           {activeValues.length > 0 && (
//             <div className="p-2 border-t">
//               <Button variant="ghost" size="sm" onClick={onClear} className="w-full justify-center">
//                 Clear Provider Filters
//               </Button>
//             </div>
//           )}
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// };

"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { FilterOption } from "@/types/features/query-display.types";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/locale-provider";

interface QueryFilterDropdownWithSearchProps {
	options: FilterOption[];
	activeValues: string[];
	onToggle: (value: string) => void;
	onClear: () => void;
	className?: string;
}

export const QueryFilterDropdownWithSearch = ({
	options,
	activeValues,
	onToggle,
	onClear,
	className,
}: QueryFilterDropdownWithSearchProps) => {
	const [open, setOpen] = useState(false);
	const t = useTranslations("query.providersDropdown");

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn(
						"w-full sm:w-[250px] justify-between min-w-0",
						className
					)}
				>
					<span className="truncate">{t("title")}</span>
					<div className="flex items-center gap-2 ml-2 flex-shrink-0">
						{activeValues.length > 0 && (
							<Badge variant="default" className="text-xs">
								{t("selected", { count: activeValues.length })}
							</Badge>
						)}
						<ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="z-[60] w-[var(--radix-popover-trigger-width)] sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[800px] 3xl:w-full mt-8 p-0 max-w-[95vw]"
				align="end"
				side="bottom"
				sideOffset={0}
			>
				<Command>
					<CommandInput
						placeholder={t("searchPlaceholder")}
						className="h-9"
					/>
					<CommandList className="max-h-[60vh] sm:max-h-[70vh] 3xl:max-h-[75vh] overflow-y-auto scrollbar-thin">
						<CommandEmpty>{t("empty")}</CommandEmpty>
						<CommandGroup>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-6 gap-1 sm:gap-2 p-2">
								{options.map((option) => (
									<CommandItem
										key={option.value}
										value={option.label}
										onSelect={() => {
											onToggle(option.value);
										}}
										className={`flex items-center p-2 sm:p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md border border-border/50 transition-colors ${
											activeValues.includes(option.value)
												? "border-primary/50"
												: "bg-background/50"
										}`}
									>
										<Check
											className={`mr-2 h-4 w-4 flex-shrink-0 ${
												activeValues.includes(
													option.value
												)
													? "opacity-100 text-primary"
													: "opacity-0"
											}`}
										/>
										<div className="flex-1 min-w-0">
											<span className="block truncate text-sm">
												{option.label}
											</span>
										</div>
										{option.count != null && (
											<span className="ml-2 text-xs text-accent-foreground flex-shrink-0 bg-muted px-1.5 py-0.5 rounded">
												{option.count}
											</span>
										)}
									</CommandItem>
								))}
							</div>
						</CommandGroup>
					</CommandList>
					{activeValues.length > 0 && (
						<div className="p-2 sm:p-3 border-t border-border bg-muted/20">
							<Button
								variant="ghost"
								size="sm"
								onClick={onClear}
								className="w-full justify-center text-sm hover:bg-muted hover:text-muted-foreground"
							>
								{t("clear")}
							</Button>
						</div>
					)}
				</Command>
			</PopoverContent>
		</Popover>
	);
};
