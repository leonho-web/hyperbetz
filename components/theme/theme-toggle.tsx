// theme-toggle.tsx
"use client";

import * as React from "react";
import {
	Check,
	LayoutTemplate,
	Monitor,
	Moon,
	Palette,
	Sun,
	Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme, AVAILABLE_THEME_COLORS } from "@/hooks/use-theme";
import { useRouter } from "next/navigation";
import { useDynamicAuth } from "@/hooks/useDynamicAuth";
import { useAppStore } from "@/store/store";
import { heroBannerPropsFactory } from "../features/banners/hero/hero-banner.factory";
import { cn } from "@/lib/utils";
import { FontChanger } from "@/components/theme/font-changer/font-changer";


export function ThemeToggle({ className }: { className?: string }) {
	const {
		mode,
		setMode,
		color,
		setColor,
		setCustomBackgroundColor,
		clearCustomBackground,
		setCustomVariable,
		clearCustomTheme,
		exportCustomTheme,
		importCustomTheme,
	} = useTheme();

	// --- 1. GATHER ALL DEPENDENCIES ---
	const router = useRouter();
	const { isLoggedIn, login } = useDynamicAuth();
	const allGames = useAppStore((state) => state.game.list.games);
	const { heroBanner, setHeroBanner } = useAppStore(
		(state) => state.uiDefinition.heroBanner
	);
	const currentLayout = heroBanner?.layout;

	// --- 2. THE SIMPLIFIED HANDLER ---
	const handleLayoutChange = (
		layout:
			| "layout1"
			| "layout2"
			| "layout3"
			| "layout4"
			| "layout6"
			| "layout7"
			| "layout8"
	) => {
		if (allGames.length === 0 && layout !== "layout1") {
			// Prevent switching to a layout that needs game data if it's not ready
			return;
		}

		// Get the correct builder function from our factory.
		const propsBuilder = heroBannerPropsFactory[layout];

		// Construct the full props object using the centralized logic.
		const newProps = propsBuilder({ isLoggedIn, login, allGames, router });

		// Dispatch the action to update the global state.
		setHeroBanner(newProps);
	};

	return (
		<div className={cn("flex gap-2", className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="icon">
						<Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
						<Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
						<span className="sr-only">Toggle theme</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-56">
					{/* --- Mode Selector --- */}
					<DropdownMenuLabel>Mode</DropdownMenuLabel>
					<DropdownMenuItem onClick={() => setMode("light")}>
						<Sun className="mr-2 h-4 w-4" />
						<span>Light</span>
						{mode === "light" && (
							<Check className="h-4 w-4 ml-auto" />
						)}
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setMode("dark")}>
						<Moon className="mr-2 h-4 w-4" />
						<span>Dark</span>
						{mode === "dark" && (
							<Check className="h-4 w-4 ml-auto" />
						)}
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setMode("system")}>
						<Monitor className="mr-2 h-4 w-4" />
						<span>System</span>
						{mode === "system" && (
							<Check className="h-4 w-4 ml-auto" />
						)}
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					{/* --- Color Selector --- */}
					<DropdownMenuLabel>Color</DropdownMenuLabel>
					{AVAILABLE_THEME_COLORS.map((themeOption) => (
						<DropdownMenuItem
							key={themeOption.name}
							onClick={() => setColor(themeOption.name)}
						>
							<div
								className="w-4 h-4 rounded-full border border-border mr-2"
								style={{ backgroundColor: themeOption.color }}
							/>
							<span>{themeOption.label}</span>
							{color === themeOption.name && (
								<Check className="h-4 w-4 ml-auto" />
							)}
						</DropdownMenuItem>
					))}

					<DropdownMenuSeparator />

					{/* --- Custom Theme Variables Picker --- */}
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<Palette className="mr-2 h-4 w-4" />
							<span>Custom Theme Variables</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent className="p-3 w-80 max-h-96 overflow-y-auto">
							<div className="flex flex-col gap-3">
								<div className="text-sm font-medium text-foreground">
									Customize Theme Colors
								</div>

								{/* Primary Colors */}
								<div className="space-y-2">
									<div className="text-xs font-medium text-muted-foreground">
										Primary Colors
									</div>
									<div className="grid grid-cols-2 gap-2">
										<div className="space-y-1">
											<label className="text-xs text-muted-foreground">
												Primary
											</label>
											<input
												type="color"
												className="w-full h-8 p-0 border rounded cursor-pointer"
												onChange={(e) =>
													setCustomVariable(
														"--primary",
														e.target.value
													)
												}
											/>
										</div>
										<div className="space-y-1">
											<label className="text-xs text-muted-foreground">
												Primary Foreground
											</label>
											<input
												type="color"
												className="w-full h-8 p-0 border rounded cursor-pointer"
												onChange={(e) =>
													setCustomVariable(
														"--primary-foreground",
														e.target.value
													)
												}
											/>
										</div>
									</div>
								</div>

								{/* Background Colors */}
								<div className="space-y-2">
									<div className="text-xs font-medium text-muted-foreground">
										Background Colors
									</div>
									<div className="grid grid-cols-2 gap-2">
										<div className="space-y-1">
											<label className="text-xs text-muted-foreground">
												Background
											</label>
											<input
												type="color"
												className="w-full h-8 p-0 border rounded cursor-pointer"
												onChange={(e) =>
													setCustomVariable(
														"--background",
														e.target.value
													)
												}
											/>
										</div>
										<div className="space-y-1">
											<label className="text-xs text-muted-foreground">
												Foreground
											</label>
											<input
												type="color"
												className="w-full h-8 p-0 border rounded cursor-pointer"
												onChange={(e) =>
													setCustomVariable(
														"--foreground",
														e.target.value
													)
												}
											/>
										</div>
									</div>
								</div>

								{/* Card Colors */}
								<div className="space-y-2">
									<div className="text-xs font-medium text-muted-foreground">
										Card Colors
									</div>
									<div className="grid grid-cols-2 gap-2">
										<div className="space-y-1">
											<label className="text-xs text-muted-foreground">
												Card
											</label>
											<input
												type="color"
												className="w-full h-8 p-0 border rounded cursor-pointer"
												onChange={(e) =>
													setCustomVariable(
														"--card",
														e.target.value
													)
												}
											/>
										</div>
										<div className="space-y-1">
											<label className="text-xs text-muted-foreground">
												Card Foreground
											</label>
											<input
												type="color"
												className="w-full h-8 p-0 border rounded cursor-pointer"
												onChange={(e) =>
													setCustomVariable(
														"--card-foreground",
														e.target.value
													)
												}
											/>
										</div>
									</div>
								</div>

								{/* Secondary Colors */}
								<div className="space-y-2">
									<div className="text-xs font-medium text-muted-foreground">
										Secondary Colors
									</div>
									<div className="grid grid-cols-2 gap-2">
										<div className="space-y-1">
											<label className="text-xs text-muted-foreground">
												Secondary
											</label>
											<input
												type="color"
												className="w-full h-8 p-0 border rounded cursor-pointer"
												onChange={(e) =>
													setCustomVariable(
														"--secondary",
														e.target.value
													)
												}
											/>
										</div>
										<div className="space-y-1">
											<label className="text-xs text-muted-foreground">
												Secondary Foreground
											</label>
											<input
												type="color"
												className="w-full h-8 p-0 border rounded cursor-pointer"
												onChange={(e) =>
													setCustomVariable(
														"--secondary-foreground",
														e.target.value
													)
												}
											/>
										</div>
									</div>
								</div>

								{/* Muted Colors */}
								<div className="space-y-2">
									<div className="text-xs font-medium text-muted-foreground">
										Muted Colors
									</div>
									<div className="grid grid-cols-2 gap-2">
										<div className="space-y-1">
											<label className="text-xs text-muted-foreground">
												Muted
											</label>
											<input
												type="color"
												className="w-full h-8 p-0 border rounded cursor-pointer"
												onChange={(e) =>
													setCustomVariable(
														"--muted",
														e.target.value
													)
												}
											/>
										</div>
										<div className="space-y-1">
											<label className="text-xs text-muted-foreground">
												Muted Foreground
											</label>
											<input
												type="color"
												className="w-full h-8 p-0 border rounded cursor-pointer"
												onChange={(e) =>
													setCustomVariable(
														"--muted-foreground",
														e.target.value
													)
												}
											/>
										</div>
									</div>
								</div>

								{/* Accent Colors */}
								<div className="space-y-2">
									<div className="text-xs font-medium text-muted-foreground">
										Accent Colors
									</div>
									<div className="grid grid-cols-2 gap-2">
										<div className="space-y-1">
											<label className="text-xs text-muted-foreground">
												Accent
											</label>
											<input
												type="color"
												className="w-full h-8 p-0 border rounded cursor-pointer"
												onChange={(e) =>
													setCustomVariable(
														"--accent",
														e.target.value
													)
												}
											/>
										</div>
										<div className="space-y-1">
											<label className="text-xs text-muted-foreground">
												Accent Foreground
											</label>
											<input
												type="color"
												className="w-full h-8 p-0 border rounded cursor-pointer"
												onChange={(e) =>
													setCustomVariable(
														"--accent-foreground",
														e.target.value
													)
												}
											/>
										</div>
									</div>
								</div>

								{/* Destructive Colors */}
								<div className="space-y-2">
									<div className="text-xs font-medium text-muted-foreground">
										Destructive Colors
									</div>
									<div className="grid grid-cols-2 gap-2">
										<div className="space-y-1">
											<label className="text-xs text-muted-foreground">
												Destructive
											</label>
											<input
												type="color"
												className="w-full h-8 p-0 border rounded cursor-pointer"
												onChange={(e) =>
													setCustomVariable(
														"--destructive",
														e.target.value
													)
												}
											/>
										</div>
										<div className="space-y-1">
											<label className="text-xs text-muted-foreground">
												Destructive Foreground
											</label>
											<input
												type="color"
												className="w-full h-8 p-0 border rounded cursor-pointer"
												onChange={(e) =>
													setCustomVariable(
														"--destructive-foreground",
														e.target.value
													)
												}
											/>
										</div>
									</div>
								</div>

								{/* Border & Input */}
								<div className="space-y-2">
									<div className="text-xs font-medium text-muted-foreground">
										Border & Input
									</div>
									<div className="grid grid-cols-2 gap-2">
										<div className="space-y-1">
											<label className="text-xs text-muted-foreground">
												Border
											</label>
											<input
												type="color"
												className="w-full h-8 p-0 border rounded cursor-pointer"
												onChange={(e) =>
													setCustomVariable(
														"--border",
														e.target.value
													)
												}
											/>
										</div>
										<div className="space-y-1">
											<label className="text-xs text-muted-foreground">
												Input
											</label>
											<input
												type="color"
												className="w-full h-8 p-0 border rounded cursor-pointer"
												onChange={(e) =>
													setCustomVariable(
														"--input",
														e.target.value
													)
												}
											/>
										</div>
									</div>
								</div>

								{/* Ring & Popover */}
								<div className="space-y-2">
									<div className="text-xs font-medium text-muted-foreground">
										Focus & Popover
									</div>
									<div className="grid grid-cols-2 gap-2">
										<div className="space-y-1">
											<label className="text-xs text-muted-foreground">
												Ring
											</label>
											<input
												type="color"
												className="w-full h-8 p-0 border rounded cursor-pointer"
												onChange={(e) =>
													setCustomVariable(
														"--ring",
														e.target.value
													)
												}
											/>
										</div>
										<div className="space-y-1">
											<label className="text-xs text-muted-foreground">
												Popover
											</label>
											<input
												type="color"
												className="w-full h-8 p-0 border rounded cursor-pointer"
												onChange={(e) =>
													setCustomVariable(
														"--popover",
														e.target.value
													)
												}
											/>
										</div>
									</div>
								</div>

								{/* Chart Colors */}
								<div className="space-y-2">
									<div className="text-xs font-medium text-muted-foreground">
										Chart Colors
									</div>
									<div className="grid grid-cols-3 gap-2">
										<div className="space-y-1">
											<label className="text-xs text-muted-foreground">
												Chart 1
											</label>
											<input
												type="color"
												className="w-full h-8 p-0 border rounded cursor-pointer"
												onChange={(e) =>
													setCustomVariable(
														"--chart-1",
														e.target.value
													)
												}
											/>
										</div>
										<div className="space-y-1">
											<label className="text-xs text-muted-foreground">
												Chart 2
											</label>
											<input
												type="color"
												className="w-full h-8 p-0 border rounded cursor-pointer"
												onChange={(e) =>
													setCustomVariable(
														"--chart-2",
														e.target.value
													)
												}
											/>
										</div>
										<div className="space-y-1">
											<label className="text-xs text-muted-foreground">
												Chart 3
											</label>
											<input
												type="color"
												className="w-full h-8 p-0 border rounded cursor-pointer"
												onChange={(e) =>
													setCustomVariable(
														"--chart-3",
														e.target.value
													)
												}
											/>
										</div>
									</div>
									<div className="grid grid-cols-2 gap-2">
										<div className="space-y-1">
											<label className="text-xs text-muted-foreground">
												Chart 4
											</label>
											<input
												type="color"
												className="w-full h-8 p-0 border rounded cursor-pointer"
												onChange={(e) =>
													setCustomVariable(
														"--chart-4",
														e.target.value
													)
												}
											/>
										</div>
										<div className="space-y-1">
											<label className="text-xs text-muted-foreground">
												Chart 5
											</label>
											<input
												type="color"
												className="w-full h-8 p-0 border rounded cursor-pointer"
												onChange={(e) =>
													setCustomVariable(
														"--chart-5",
														e.target.value
													)
												}
											/>
										</div>
									</div>
								</div>

								{/* Actions */}
								<div className="flex gap-2 pt-2">
									<Button
										variant="outline"
										size="sm"
										onClick={clearCustomTheme}
										className="flex-1 flex items-center gap-2"
									>
										<Undo2 className="h-3 w-3" />
										Reset All
									</Button>
									<Button
										variant="default"
										size="sm"
										onClick={exportCustomTheme}
										className="flex-1"
									>
										Export Theme
									</Button>
								</div>

								{/* Import Theme */}
								<div className="space-y-2">
									<div className="text-xs font-medium text-muted-foreground">
										Import Theme
									</div>
									<textarea
										placeholder="Paste exported theme JSON here..."
										className="w-full p-2 text-xs border rounded resize-none"
										rows={3}
										onChange={(e) => {
											try {
												const theme = JSON.parse(
													e.target.value
												);
												importCustomTheme(theme);
												e.target.value = ""; // Clear after import
											} catch (error) {
												console.error(
													"Invalid theme JSON:",
													error
												);
											}
										}}
									/>
								</div>

								{/* Legacy Background Picker */}
								<div className="space-y-2 pt-2 border-t">
									<div className="text-xs font-medium text-muted-foreground">
										Legacy Background
									</div>
									<div className="flex flex-col gap-2">
										<input
											id="bg-picker"
											type="color"
											className="w-full h-8 p-0 border-none rounded cursor-pointer"
											onChange={(e) =>
												setCustomBackgroundColor(
													e.target.value
												)
											}
										/>
										<input
											type="text"
											placeholder="Or enter a hex code"
											className="w-full p-2 border rounded text-xs"
											onChange={(e) =>
												setCustomBackgroundColor(
													e.target.value
												)
											}
										/>
										<Button
											variant="ghost"
											size="sm"
											onClick={clearCustomBackground}
											className="flex items-center gap-2"
										>
											<Undo2 className="h-3 w-3" />
											Reset Background
										</Button>
									</div>
								</div>
							</div>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				</DropdownMenuContent>
			</DropdownMenu>
			{/* --- Banner Layout Selector --- */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="icon">
						<LayoutTemplate className="h-4 w-4" />
						<span className="sr-only">Change Banner Layout</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-56">
					<DropdownMenuLabel>Banner Layout</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={() => handleLayoutChange("layout1")}
					>
						<span>Layout 1</span>
						{currentLayout === "layout1" && (
							<Check className="h-4 w-4 ml-auto" />
						)}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleLayoutChange("layout2")}
						disabled={allGames.length === 0}
					>
						<span>Layout 2</span>
						{currentLayout === "layout2" && (
							<Check className="h-4 w-4 ml-auto" />
						)}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleLayoutChange("layout3")}
						disabled={allGames.length < 5}
					>
						<span>Vertical Showcase</span>
						{currentLayout === "layout3" && (
							<Check className="h-4 w-4 ml-auto" />
						)}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleLayoutChange("layout4")}
					>
						<span>Minimalist Focus</span>
						{currentLayout === "layout4" && (
							<Check className="h-4 w-4 ml-auto" />
						)}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleLayoutChange("layout6")}
					>
						<span>Layout 5</span>
						{currentLayout === "layout6" && (
							<Check className="h-4 w-4 ml-auto" />
						)}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleLayoutChange("layout7")}
					>
						<span>Layout 6</span>
						{currentLayout === "layout7" && (
							<Check className="h-4 w-4 ml-auto" />
						)}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleLayoutChange("layout8")}
					>
						<span>Layout 7</span>
						{currentLayout === "layout8" && (
							<Check className="h-4 w-4 ml-auto" />
						)}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Font Changer */}
			<FontChanger />
		</div>
	);
}
