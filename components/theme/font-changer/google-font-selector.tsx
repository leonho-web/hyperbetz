"use client";

import React, { useState, useMemo } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { useTranslations } from "@/lib/locale-provider";
import { POPULAR_GOOGLE_FONTS } from "@/constants/features/font-changer/font-changer.constant";

interface GoogleFontSelectorProps {
	onClose: () => void;
	onSelectFont: (fontFamily: string, fontUrl: string) => void;
}

export function GoogleFontSelector({
	onClose,
	onSelectFont,
}: GoogleFontSelectorProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedFont, setSelectedFont] = useState<string | null>(null);
	const t = useTranslations("fontChanger.googleFonts");

	const filteredFonts = useMemo(() => {
		return POPULAR_GOOGLE_FONTS.filter((font) =>
			font.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [searchTerm]);

	const generateGoogleFontUrl = (fontFamily: string) => {
		const encodedFont = fontFamily.replace(/ /g, "+");
		return `https://fonts.googleapis.com/css2?family=${encodedFont}:wght@400;500;600;700&display=swap`;
	};

	const handleSelectFont = (fontFamily: string) => {
		const fontUrl = generateGoogleFontUrl(fontFamily);
		onSelectFont(fontFamily, fontUrl);
	};

	const previewFont = (fontFamily: string) => {
		// Temporarily load font for preview
		const fontUrl = generateGoogleFontUrl(fontFamily);
		const link = document.createElement("link");
		link.href = fontUrl;
		link.rel = "stylesheet";
		link.id = `preview-font-${fontFamily.replace(/ /g, "-")}`;
		document.head.appendChild(link);
		setSelectedFont(fontFamily);
	};

	const clearPreview = () => {
		// Remove preview font links
		const previewLinks = document.querySelectorAll('[id^="preview-font-"]');
		previewLinks.forEach((link) => link.remove());
		setSelectedFont(null);
	};

	React.useEffect(() => {
		return () => {
			clearPreview();
		};
	}, []);

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl max-h-[80vh]">
				<DialogHeader>
					<DialogTitle className="flex items-center justify-between">
						{t("title")}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					{/* Search */}
					<div className="relative">
						<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder={t("searchFonts")}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>

					{/* Preview Area */}
					{selectedFont && (
						<div className="p-4 border rounded-lg bg-muted/30">
							<div className="text-sm text-muted-foreground mb-2">
								{t("preview")}: {selectedFont}
							</div>
							<div
								className="text-2xl mb-2"
								style={{ fontFamily: selectedFont }}
							>
								{t("previewText")}
							</div>
							<div
								className="text-base"
								style={{ fontFamily: selectedFont }}
							>
								{t("alphabetPreview")}
							</div>
							<div className="flex gap-2 mt-3">
								<Button
									onClick={() =>
										handleSelectFont(selectedFont)
									}
								>
									{t("applyFont")}
								</Button>
								<Button
									variant="outline"
									onClick={clearPreview}
								>
									{t("clearPreview")}
								</Button>
							</div>
						</div>
					)}

					{/* Font List */}
					<ScrollArea className="h-[400px]">
						<div className="grid gap-2">
							{filteredFonts.map((font) => (
								<div
									key={font}
									className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
									onClick={() => previewFont(font)}
								>
									<div className="font-medium">{font}</div>
									<div
										className="text-sm text-muted-foreground mt-1"
										style={{ fontFamily: font }}
									>
										{t("previewWith", { font })}
									</div>
								</div>
							))}
						</div>

						{filteredFonts.length === 0 && (
							<div className="text-center py-8 text-muted-foreground">
								{t("noFontsFound", { searchTerm })}
							</div>
						)}
					</ScrollArea>
				</div>
			</DialogContent>
		</Dialog>
	);
}
