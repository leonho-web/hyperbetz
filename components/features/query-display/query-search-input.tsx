"use client";

import { useState, useEffect } from "react";
// import { Search } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/pro-light-svg-icons";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/locale-provider";

interface QuerySearchInputProps {
	/** The current value of the search input, controlled by the parent. */
	value: string;
	/** Callback fired with the debounced search term. */
	onSearch: (searchTerm: string) => void;
	/** Debounce delay in milliseconds. */
	debounceMs?: number;
	/** Placeholder text for the search input. */
	placeholder?: string;
	className?: string;
}

export const QuerySearchInput = ({
	value,
	onSearch,
	debounceMs = 400,
	placeholder = "Search for items...",
	className,
}: QuerySearchInputProps) => {
	const t = useTranslations("query");
	// This component now has its own *internal* value state for immediate user feedback.
	const [internalValue, setInternalValue] = useState(value);

	// This effect listens for changes in the debounced internal value and calls the parent.
	useEffect(() => {
		const handler = setTimeout(() => {
			// Only call the parent's onSearch if the value has actually changed from what the parent knows.
			if (internalValue !== value) {
				onSearch(internalValue);
			}
		}, debounceMs);

		return () => clearTimeout(handler);
	}, [internalValue, onSearch, debounceMs, value]);

	// If the parent component's value changes (e.g., a filter is cleared),
	// we must sync our internal state to it.
	useEffect(() => {
		setInternalValue(value);
	}, [value]);

	return (
		<div className={cn("relative flex items-center", className)}>
			<FontAwesomeIcon
				icon={faMagnifyingGlass}
				className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
			/>
			<Input
				type="text"
				placeholder={placeholder || t("searchPlaceholderGeneric")}
				value={internalValue}
				onChange={(e) => setInternalValue(e.target.value)}
				className="pl-10"
			/>
		</div>
	);
};
