"use client";

import * as React from "react";
import { AtSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/locale-provider";

interface TagSuggestionsProps {
	suggestions: string[];
	query: string;
	selectedIndex: number;
	onSelect: (username: string) => void;
	visible: boolean;
}

export function TagSuggestions({
	suggestions,
	query,
	selectedIndex,
	onSelect,
	visible,
}: TagSuggestionsProps) {
	const t = useTranslations("chat");
	const scrollContainerRef = React.useRef<HTMLDivElement>(null);
	const selectedItemRef = React.useRef<HTMLButtonElement>(null);
	const isManualScrollingRef = React.useRef(false);

	// Track manual scrolling to avoid conflicts with auto-scroll
	const handleScroll = React.useCallback(() => {
		isManualScrollingRef.current = true;
		// Clear the manual scrolling flag after a short delay
		setTimeout(() => {
			isManualScrollingRef.current = false;
		}, 150);
	}, []);

	// Auto-scroll to selected item when selectedIndex changes
	React.useEffect(() => {
		// Don't auto-scroll if user is manually scrolling
		if (isManualScrollingRef.current) return;

		if (
			selectedItemRef.current &&
			scrollContainerRef.current &&
			selectedIndex >= 0
		) {
			const container = scrollContainerRef.current;
			const selectedElement = selectedItemRef.current;

			// Get container and element dimensions
			const containerHeight = container.clientHeight;
			const containerScrollTop = container.scrollTop;
			const elementTop = selectedElement.offsetTop;
			const elementHeight = selectedElement.clientHeight;

			// Calculate if element is outside visible area
			const elementBottom = elementTop + elementHeight;
			const visibleTop = containerScrollTop;
			const visibleBottom = containerScrollTop + containerHeight;

			// Scroll if element is not fully visible
			if (elementTop < visibleTop) {
				// Element is above visible area - scroll up
				container.scrollTo({
					top: elementTop,
					behavior: "smooth",
				});
			} else if (elementBottom > visibleBottom) {
				// Element is below visible area - scroll down
				container.scrollTo({
					top: elementBottom - containerHeight,
					behavior: "smooth",
				});
			}
		}
	}, [selectedIndex]);

	if (!visible) return null;

	return (
		<div
			className="absolute bottom-full  left-0 right-0 mb-2 bg-card/95 border-primary/20 
                  shadow-2xl backdrop-blur-xl max-h-48
                  animate-in slide-in-from-bottom-2 duration-200 z-[100]
                  casino-dropdown"
		>
			{/* Enhanced background with animated gradient */}
			<div
				className="absolute inset-0 bg-gradient-to-br from-background via-primary/10 to-primary/30 
                    pointer-events-none"
			/>

			{/* Glowing border effect */}
			{/* <div
				className="absolute inset-0 rounded-xl bg-gradient-to-r from-background via-primary/30  
                    opacity-50 blur-sm "
			/> */}

			{/* Header with enhanced styling */}
			<div className="relative z-10 p-3 border-b border-primary/20 bg-background/60 backdrop-blur-md ">
				<div className="flex items-center gap-3">
					<div className="p-1.5 rounded-full bg-gradient-to-r from-primary  shadow-lg">
						<AtSign className="h-3 w-3 text-foreground" />
					</div>
					<span className="text-xs font-medium text-foreground casino-text-glow">
						{query
							? t("picker.searchResults")
							: t("picker.availableToTag", {
									defaultValue: "Available users to tag 🎯",
							  })}
					</span>
				</div>
			</div>

			{/* Enhanced suggestions list */}
			<div
				ref={scrollContainerRef}
				className="relative z-10 max-h-32 overflow-y-auto overflow-x-hidden  casino-scrollbar tag-suggestions-scrollable"
				style={{ scrollBehavior: "smooth" }}
				onScroll={handleScroll}
				onWheel={(e) => {
					// Prevent event from bubbling up to parent scroll handlers
					e.stopPropagation();
				}}
			>
				{suggestions.map((username, index) => (
					<button
						key={username}
						ref={selectedIndex === index ? selectedItemRef : null}
						onClick={() => onSelect(username)}
						className={cn(
							"w-full px-4 py-3 text-left text-sm transition-all duration-300 flex items-center gap-3 group",
							"hover:bg-gradient-to-r hover:from-primary/15 hover:to-primary/15",
							"border-b border-border/10 last:border-none hover:shadow-lg",
							"hover:translate-x-1 hover:scale-[1.02]",
							selectedIndex === index &&
								"bg-gradient-to-r from-primary/20  shadow-inner text-primary scale-[1.01]"
						)}
					>
						<div
							className={cn(
								"w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-md",
								"bg-gradient-to-br from-primary/20 to-primary/20 group-hover:from-primary/30 group-hover:to-primary/30",
								"group-hover:scale-110 group-hover:shadow-lg",
								selectedIndex === index &&
									"from-primary/40 to-primary/40 ring-2 ring-primary/50"
							)}
						>
							<AtSign className="h-3.5 w-3.5 text-primary group-hover:text-foreground transition-colors duration-200" />
						</div>

						<div className="flex-1">
							<span className="font-semibold text-foreground group-hover:text-foreground transition-colors duration-200 casino-text-glow">
								{username}
							</span>
							<div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-200">
								{t("picker.clickOrTab", {
									defaultValue: "Click or Tab to select",
								})}
							</div>
						</div>

						{query && (
							<div
								className="px-2 py-1 rounded-md bg-background/60 backdrop-blur-sm 
                           opacity-50 group-hover:opacity-100 transition-all duration-300
                           border border-primary/20 shadow-sm"
							>
								<span className="text-xs text-primary font-medium">
									↹ Tab
								</span>
							</div>
						)}
					</button>
				))}

				{/* Enhanced empty states */}
				{suggestions.length === 0 && query && (
					<div className="px-4 py-6 text-center relative">
						<div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-destructive/10 " />
						<div className="relative z-10">
							<div
								className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-destructive/20 to-destructive/30 
                           flex items-center justify-center shadow-lg"
							>
								<AtSign className="h-5 w-5 text-destructive animate-pulse" />
							</div>
							<p className="text-sm text-muted-foreground mb-1">
								{t("picker.noUsers", {
									defaultValue: "No users found",
								})}
							</p>
							<p className="text-xs text-muted-foreground">
								{t("picker.noUsersMatching", {
									defaultValue: "No users matching",
								})}{" "}
								&quot;
								<span className="text-primary font-medium casino-text-glow">
									{query}
								</span>
								&quot;
							</p>
						</div>
					</div>
				)}

				{suggestions.length === 0 && !query && (
					<div className="px-4 py-6 text-center relative">
						<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 " />
						<div className="relative z-10">
							<div
								className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 
                           flex items-center justify-center shadow-lg animate-pulse"
							>
								<AtSign className="h-5 w-5 text-primary" />
							</div>
							<p className="text-sm text-muted-foreground mb-1">
								{t("picker.startTyping", {
									defaultValue: "Start typing to search",
								})}
							</p>
							<p className="text-xs text-muted-foreground">
								{t("picker.typeAt", { defaultValue: "Type" })}{" "}
								<span className="text-primary font-medium">
									@username
								</span>{" "}
								{t("picker.toSeeSuggestions", {
									defaultValue: "to see suggestions 🎰",
								})}
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
