// src/hooks/use-theme.tsx
"use client";

import { useTheme as useNextTheme } from "next-themes";
import {
	useThemeColor,
	ThemeColor,
} from "@/components/theme/theme-color-provider";
import {
	applyCustomBackgroundColor,
	clearCustomBackgroundColor,
} from "@/lib/utils/ui/ui.utils";
import { useCallback, useEffect } from "react";

export type ThemeColorOption = {
	name: ThemeColor;
	label: string;
	color: string;
};

const LAYOUT_STORAGE_KEY = "hero-banner-layout";

// This now defines the color palettes
export const AVAILABLE_THEME_COLORS: ThemeColorOption[] = [
	{ name: "casino", label: "Casino", color: "oklch(0.68 0.15 50)" }, // using the ring color as a sample
	{ name: "red", label: "Red", color: "#dc2626" },
	{ name: "rose", label: "Rose", color: "#e11d48" },
	{ name: "orange", label: "Orange", color: "#ea580c" },
	{ name: "green", label: "Green", color: "#16a34a" },
	{ name: "blue", label: "Blue", color: "#2563eb" },
	{ name: "yellow", label: "Yellow", color: "#ca8a04" },
	{ name: "violet", label: "Violet", color: "#7c3aed" },
	{ name: "poker", label: "Poker", color: "#b91c1c" },
	{ name: "poker-vibrant", label: "Poker Vibrant", color: "#ff1744" },
	{ name: "midnight-ocean", label: "Midnight Ocean", color: "#15253DFF" },
];

export function useTheme() {
	const { theme: mode, setTheme: setNextThemeMode } = useNextTheme(); // Manages 'light', 'dark'
	const { theme: color, setTheme: setThemeColor } = useThemeColor(); // Manages 'casino', 'red', etc.

	/**
	 * Clears any custom background color when the primary mode (light/dark) changes.
	 * This is wrapped in useCallback for performance optimization.
	 */
	const setMode = useCallback(
		(newMode: "light" | "dark" | "system") => {
			clearCustomBackgroundColor();

			localStorage.removeItem(LAYOUT_STORAGE_KEY);
			setNextThemeMode(newMode);
		},
		[setNextThemeMode]
	);

	/**
	 * Clears any custom background color when the main color theme changes.
	 * This is wrapped in useCallback for performance optimization.
	 */
	const setColor = useCallback(
		(newColor: ThemeColor) => {
			clearCustomBackgroundColor();

			localStorage.removeItem(LAYOUT_STORAGE_KEY);
			setThemeColor(newColor);
		},
		[setThemeColor]
	);

	/**
	 * Applies a temporary custom background color.
	 * This function directly calls the utility.
	 */
	const setCustomBackgroundColor = (newColor: string) => {
		applyCustomBackgroundColor(newColor);
	};

	/**
	 * Sets a custom CSS variable value
	 */
	const setCustomVariable = (variable: string, value: string) => {
		// Apply the CSS variable to the document root
		document.documentElement.style.setProperty(variable, value);

		// Store in localStorage for persistence
		const customTheme = JSON.parse(
			localStorage.getItem("custom-theme-variables") || "{}"
		);
		customTheme[variable] = value;
		localStorage.setItem(
			"custom-theme-variables",
			JSON.stringify(customTheme)
		);
	};

	/**
	 * Clears all custom theme variables
	 */
	const clearCustomTheme = () => {
		// Remove all custom CSS variables
		const customTheme = JSON.parse(
			localStorage.getItem("custom-theme-variables") || "{}"
		);
		Object.keys(customTheme).forEach((variable) => {
			document.documentElement.style.removeProperty(variable);
		});

		// Clear localStorage
		localStorage.removeItem("custom-theme-variables");
	};

	/**
	 * Exports current custom theme to clipboard
	 */
	const exportCustomTheme = () => {
		const customTheme = JSON.parse(
			localStorage.getItem("custom-theme-variables") || "{}"
		);
		const themeData = {
			name: "Custom Theme",
			timestamp: new Date().toISOString(),
			variables: customTheme,
		};

		// Copy to clipboard
		navigator.clipboard.writeText(JSON.stringify(themeData, null, 2));
		console.log("Theme exported to clipboard");
	};

	/**
	 * Imports a custom theme from theme data
	 */
	const importCustomTheme = (themeData: {
		variables?: Record<string, string>;
	}) => {
		if (themeData && themeData.variables) {
			// Clear existing custom theme
			clearCustomTheme();

			// Apply new theme
			Object.entries(themeData.variables).forEach(([variable, value]) => {
				setCustomVariable(variable, value as string);
			});
		}
	};

	/**
	 * Loads custom theme from localStorage on initialization
	 */
	const loadCustomTheme = useCallback(() => {
		const customTheme = JSON.parse(
			localStorage.getItem("custom-theme-variables") || "{}"
		);
		Object.entries(customTheme).forEach(([variable, value]) => {
			document.documentElement.style.setProperty(
				variable,
				value as string
			);
		});
	}, []);

	// Load custom theme when hook initializes
	useEffect(() => {
		loadCustomTheme();
	}, [loadCustomTheme]);

	return {
		mode,
		setMode,
		color,
		setColor,
		// --- EXPORT THE NEW FUNCTIONS ---
		setCustomBackgroundColor,
		clearCustomBackground: clearCustomBackgroundColor,
		setCustomVariable,
		clearCustomTheme,
		exportCustomTheme,
		importCustomTheme,
	};
}
