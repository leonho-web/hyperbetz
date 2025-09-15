"use client";

import React, { useState, useRef, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "@/lib/locale-provider";

interface CustomFontUploaderProps {
	onClose: () => void;
	onUpload: (fontName: string, fontData: string) => void;
}

export function CustomFontUploader({
	onClose,
	onUpload,
}: CustomFontUploaderProps) {
	const [fontFile, setFontFile] = useState<File | null>(null);
	const [fontName, setFontName] = useState("");
	const [preview, setPreview] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const t = useTranslations("fontChanger.customUpload");
	const tGoogle = useTranslations("fontChanger.googleFonts");

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.name.match(/\.(woff|woff2|ttf|otf)$/i)) {
			toast.error(t("errors.invalidFileType"));
			return;
		}

		// Check file size (10MB limit)
		if (file.size > 10 * 1024 * 1024) {
			toast.error(t("errors.fileTooLarge"));
			return;
		}

		// Auto-fill font name from file name
		const baseName = file.name.replace(/\.[^/.]+$/, "");
		setFontName(baseName);
		setFontFile(file);

		// Create preview
		const reader = new FileReader();
		reader.onload = (e) => {
			const fontData = e.target?.result as string;
			setPreview(fontData);

			// Load font for preview
			const tempFontFamily = `TempFont_${Date.now()}`;
			const style = document.createElement("style");
			style.id = "temp-font-preview";
			style.textContent = `
				@font-face {
					font-family: '${tempFontFamily}';
					src: url('${fontData}');
					font-weight: normal;
					font-style: normal;
				}
				.font-preview {
					font-family: '${tempFontFamily}', Arial, sans-serif !important;
				}
			`;

			// Remove existing preview
			const existing = document.getElementById("temp-font-preview");
			if (existing) existing.remove();

			document.head.appendChild(style);
		};

		reader.onerror = () => {
			toast.error(t("errors.readFileFailed"));
		};

		reader.readAsDataURL(file);
	};

	const handleUpload = async () => {
		if (!fontFile || !fontName.trim()) {
			toast.error(t("errors.enterFontName"));
			return;
		}

		if (!preview) {
			toast.error(t("errors.uploadFailed"));
			return;
		}

		setIsUploading(true);

		try {
			// Simulate a brief loading time for better UX
			await new Promise((resolve) => setTimeout(resolve, 500));

			onUpload(fontName.trim(), preview);
		} catch (error) {
			toast.error(t("errors.uploadFailed"));
			console.error("Font upload error:", error);
		} finally {
			setIsUploading(false);
		}
	};

	const clearSelection = () => {
		setFontFile(null);
		setFontName("");
		setPreview(null);

		// Remove preview style
		const existing = document.getElementById("temp-font-preview");
		if (existing) existing.remove();

		// Reset file input
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	useEffect(() => {
		return () => {
			// Cleanup on unmount
			const existing = document.getElementById("temp-font-preview");
			if (existing) existing.remove();
		};
	}, []);

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle className="flex items-center justify-between">
						{t("title")}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<p className="text-sm text-muted-foreground">
						{t("description")}
					</p>

					{/* File Upload */}
					<div className="space-y-2">
						<Label htmlFor="font-file">{t("fontFile")}</Label>
						<div className="flex gap-2">
							<Input
								ref={fileInputRef}
								id="font-file"
								type="file"
								accept=".woff,.woff2,.ttf,.otf"
								onChange={handleFileSelect}
								className="flex-1"
							/>
							{fontFile && (
								<Button
									variant="outline"
									size="icon"
									onClick={clearSelection}
									title="Clear selection"
								>
									<X className="h-4 w-4" />
								</Button>
							)}
						</div>
						<p className="text-xs text-muted-foreground">
							{t("supportedFormats")}
						</p>
						<p className="text-xs text-muted-foreground">
							{t("maxFileSize")}
						</p>
					</div>

					{/* Font Name */}
					<div className="space-y-2">
						<Label htmlFor="font-name">{t("fontName")}</Label>
						<Input
							id="font-name"
							value={fontName}
							onChange={(e) => setFontName(e.target.value)}
							placeholder={t("fontNamePlaceholder")}
						/>
					</div>

					{/* Preview */}
					{preview && (
						<div className="space-y-2">
							<Label>{t("previewYourFont")}</Label>
							<div className="p-4 border rounded-lg bg-muted/30">
								<div className="text-sm text-muted-foreground mb-2">
									{t("fontName")}:{" "}
									{fontName || "Unnamed Font"}
								</div>
								<div className="font-preview text-xl mb-2">
									{tGoogle("previewText")}
								</div>
								<div className="font-preview text-base">
									{tGoogle("alphabetPreview")}
								</div>
							</div>
						</div>
					)}

					{/* File Info */}
					{fontFile && (
						<div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
							<FileText className="h-4 w-4 text-muted-foreground" />
							<div className="flex-1 min-w-0">
								<div className="text-sm font-medium truncate">
									{fontFile.name}
								</div>
								<div className="text-xs text-muted-foreground">
									{(fontFile.size / 1024).toFixed(1)} KB
								</div>
							</div>
						</div>
					)}

					{/* Actions */}
					<div className="flex gap-2 pt-2">
						<Button
							variant="outline"
							onClick={onClose}
							className="flex-1"
						>
							{t("cancel")}
						</Button>
						<Button
							onClick={handleUpload}
							disabled={
								!fontFile || !fontName.trim() || isUploading
							}
							className="flex-1 flex items-center gap-2"
						>
							<Upload className="h-4 w-4" />
							{isUploading ? t("uploading") : t("uploadAndApply")}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
