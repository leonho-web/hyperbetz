"use client";

import React, { useState, useRef } from "react";
import { Type, Upload, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { GoogleFontSelector } from "@/components/theme/font-changer/google-font-selector";
import { CustomFontUploader } from "@/components/theme/font-changer/custom-font-uploader";
import { useFontManager } from "@/hooks/font-changer/use-font-manager";
import { useTranslations } from "@/lib/locale-provider";

export function FontChanger() {
	const [showGoogleFonts, setShowGoogleFonts] = useState(false);
	const [showCustomUploader, setShowCustomUploader] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const t = useTranslations("fontChanger");

	const {
		currentFont,
		resetFont,
		setGoogleFont,
		setCustomFont,
		getAppliedFontName,
	} = useFontManager();

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.name.match(/\.(woff|woff2|ttf|otf)$/i)) {
			toast.error(t("messages.invalidFileType"));
			return;
		}

		// Create file reader
		const reader = new FileReader();
		reader.onload = (e) => {
			const fontData = e.target?.result as string;
			const fontName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension

			setCustomFont(fontName, fontData);
			toast.success(t("messages.fontUploadedSuccess", { fontName }));
		};

		reader.onerror = () => {
			toast.error(t("messages.uploadFailed"));
		};

		reader.readAsDataURL(file);

		// Reset input
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleReset = () => {
		resetFont();
		toast.success(t("messages.fontResetSuccess"));
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Type className="h-4 w-4" />
					<span className="sr-only">{t("changeFont")}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-64">
				<DropdownMenuLabel>
					{t("fontSettings")}
					{currentFont && (
						<div className="text-xs text-muted-foreground font-normal mt-1">
							{t("current")}: {getAppliedFontName()}
						</div>
					)}
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				{/* Google Fonts */}
				<DropdownMenuItem onClick={() => setShowGoogleFonts(true)}>
					<Type className="mr-2 h-4 w-4" />
					<span>{t("browseGoogleFonts")}</span>
				</DropdownMenuItem>

				{/* Custom Font Upload */}
				<DropdownMenuItem onClick={() => setShowCustomUploader(true)}>
					<Upload className="mr-2 h-4 w-4" />
					<span>{t("uploadCustomFont")}</span>
				</DropdownMenuItem>

				{/* Quick Upload Button */}
				<DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
					<Upload className="mr-2 h-4 w-4" />
					<span>{t("quickUploadFontFile")}</span>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				{/* Reset */}
				<DropdownMenuItem onClick={handleReset}>
					<RotateCcw className="mr-2 h-4 w-4" />
					<span>{t("resetToDefault")}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>

			{/* Hidden file input */}
			<input
				ref={fileInputRef}
				type="file"
				accept=".woff,.woff2,.ttf,.otf"
				style={{ display: "none" }}
				onChange={handleFileUpload}
			/>

			{/* Google Fonts Modal */}
			{showGoogleFonts && (
				<GoogleFontSelector
					onClose={() => setShowGoogleFonts(false)}
					onSelectFont={(fontFamily: string, fontUrl: string) => {
						setGoogleFont(fontFamily, fontUrl);
						setShowGoogleFonts(false);
						toast.success(
							t("messages.fontAppliedSuccess", {
								fontName: fontFamily,
							})
						);
					}}
				/>
			)}

			{/* Custom Font Uploader Modal */}
			{showCustomUploader && (
				<CustomFontUploader
					onClose={() => setShowCustomUploader(false)}
					onUpload={(fontName: string, fontData: string) => {
						setCustomFont(fontName, fontData);
						setShowCustomUploader(false);
						toast.success(
							t("messages.fontUploadedSuccess", { fontName })
						);
					}}
				/>
			)}
		</DropdownMenu>
	);
}
