"use client";

import { useCallback, useEffect, useState } from "react";

interface FontConfig {
	type: "google" | "custom" | "default";
	fontFamily: string;
	fontUrl?: string; // For Google Fonts or custom font data URL
	originalName?: string; // For display purposes
}

const FONT_STORAGE_KEY = "app-font-config";
const DEFAULT_FONT = "Inter, system-ui, sans-serif";

export function useFontManager() {
	const [currentFont, setCurrentFont] = useState<FontConfig | null>(null);

	/**
	 * Load Google Font dynamically
	 */
	const loadGoogleFont = useCallback((fontUrl: string) => {
		// Remove existing Google Font links
		const existingLinks = document.querySelectorAll(
			'link[data-font-type="google"]'
		);
		existingLinks.forEach((link) => link.remove());

		// Add new Google Font link
		const link = document.createElement("link");
		link.href = fontUrl;
		link.rel = "stylesheet";
		link.setAttribute("data-font-type", "google");
		document.head.appendChild(link);
	}, []);

	/**
	 * Load custom font from data URL
	 */
	const loadCustomFontData = useCallback(
		(fontFamily: string, fontData: string) => {
			// Remove existing custom font styles
			const existingStyles = document.querySelectorAll(
				'style[data-font-type="custom"]'
			);
			existingStyles.forEach((style) => style.remove());

			// Create font-face rule
			const style = document.createElement("style");
			style.setAttribute("data-font-type", "custom");
			style.textContent = `
			@font-face {
				font-family: '${fontFamily}';
				src: url('${fontData}');
				font-weight: normal;
				font-style: normal;
				font-display: swap;
			}
		`;
			document.head.appendChild(style);
		},
		[]
	);

	/**
	 * Apply font to the document
	 */
	const applyFont = useCallback(
		(config: FontConfig) => {
			const root = document.documentElement;

			if (config.type === "google" && config.fontUrl) {
				// Load Google Font
				loadGoogleFont(config.fontUrl);
				root.style.setProperty("--font-family", config.fontFamily);
			} else if (config.type === "custom" && config.fontUrl) {
				// Load custom font
				loadCustomFontData(config.fontFamily, config.fontUrl);
				root.style.setProperty("--font-family", config.fontFamily);
			} else {
				// Default font
				root.style.setProperty("--font-family", DEFAULT_FONT);
			}
		},
		[loadGoogleFont, loadCustomFontData]
	);

	/**
	 * Save font configuration to localStorage
	 */
	const saveFontConfig = useCallback((config: FontConfig | null) => {
		try {
			if (config) {
				localStorage.setItem(FONT_STORAGE_KEY, JSON.stringify(config));
			} else {
				localStorage.removeItem(FONT_STORAGE_KEY);
			}
		} catch (error) {
			console.error("Failed to save font config:", error);
		}
	}, []);

	/**
	 * Load font configuration from localStorage
	 */
	const loadFontConfig = useCallback(() => {
		try {
			const saved = localStorage.getItem(FONT_STORAGE_KEY);
			if (saved) {
				const config: FontConfig = JSON.parse(saved);
				setCurrentFont(config);
				applyFont(config);
			}
		} catch (error) {
			console.error("Failed to load font config:", error);
		}
	}, [applyFont]);

	/**
	 * Set Google Font
	 */
	const setGoogleFont = useCallback(
		(fontFamily: string, fontUrl: string) => {
			const config: FontConfig = {
				type: "google",
				fontFamily,
				fontUrl,
				originalName: fontFamily,
			};

			setCurrentFont(config);
			applyFont(config);
			saveFontConfig(config);
		},
		[applyFont, saveFontConfig]
	);

	/**
	 * Set custom font
	 */
	const setCustomFont = useCallback(
		(fontName: string, fontData: string) => {
			const fontFamily = `CustomFont_${fontName.replace(
				/[^a-zA-Z0-9]/g,
				"_"
			)}`;
			const config: FontConfig = {
				type: "custom",
				fontFamily,
				fontUrl: fontData,
				originalName: fontName,
			};

			setCurrentFont(config);
			applyFont(config);
			saveFontConfig(config);
		},
		[applyFont, saveFontConfig]
	);

	/**
	 * Reset to default font
	 */
	const resetFont = useCallback(() => {
		// Remove custom CSS variables
		document.documentElement.style.removeProperty("--font-family");

		// Remove all custom font elements
		const customElements = document.querySelectorAll("[data-font-type]");
		customElements.forEach((element) => element.remove());

		// Clear state and storage
		setCurrentFont(null);
		saveFontConfig(null);
	}, [saveFontConfig]);

	/**
	 * Get the display name of the currently applied font
	 */
	const getAppliedFontName = useCallback(() => {
		if (!currentFont) return "Default (Inter)";
		return currentFont.originalName || currentFont.fontFamily;
	}, [currentFont]);

	// Load font config on mount
	useEffect(() => {
		loadFontConfig();
	}, [loadFontConfig]);

	// Apply CSS variable to body for global font changes
	//TODO : Problem Fixed! The Real Issue: Your font manager was using a very aggressive CSS rule This rule with the * selector and !important was overriding ALL font styling on the page every time any component re-rendered (like when you clicked the button).The Solution: I changed the font manager to be more specific and less aggress Why This Works Removed the * selector that was affecting every elemen Removed the !important flag that was forcefully overriding all font style Now it only targets the body element and elements with a specific class No longer conflicts with Next.js's Poppins font or other component-specific font styling
	useEffect(() => {
		const style = document.createElement("style");
		style.textContent = `
			body, .font-custom-override {
				font-family: var(--font-family, ${DEFAULT_FONT}) ;
			}
		`;
		style.id = "global-font-override";

		// Remove existing global font override
		const existing = document.getElementById("global-font-override");
		if (existing) {
			existing.remove();
		}

		document.head.appendChild(style);

		return () => {
			const globalStyle = document.getElementById("global-font-override");
			if (globalStyle) {
				globalStyle.remove();
			}
		};
	}, []);

	return {
		currentFont,
		setGoogleFont,
		setCustomFont,
		resetFont,
		getAppliedFontName,
		loadFontConfig,
	};
}
