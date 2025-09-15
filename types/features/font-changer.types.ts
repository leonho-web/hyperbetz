// Font management types

export interface FontConfig {
	type: "google" | "custom" | "default";
	fontFamily: string;
	fontUrl?: string; // For Google Fonts or custom font data URL
	originalName?: string; // For display purposes
}

export interface GoogleFont {
	family: string;
	category: string;
	variants: string[];
	subsets: string[];
}

export interface FontManagerHook {
	currentFont: FontConfig | null;
	setGoogleFont: (fontFamily: string, fontUrl: string) => void;
	setCustomFont: (fontName: string, fontData: string) => void;
	resetFont: () => void;
	getAppliedFontName: () => string;
	loadFontConfig: () => void;
}

export interface GoogleFontSelectorProps {
	onClose: () => void;
	onSelectFont: (fontFamily: string, fontUrl: string) => void;
}

export interface CustomFontUploaderProps {
	onClose: () => void;
	onUpload: (fontName: string, fontData: string) => void;
}

export interface FontChangerProps {
	className?: string;
}
