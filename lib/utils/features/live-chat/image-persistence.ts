/**
 * Image persistence utilities for live chat
 * Handles converting files to base64 for localStorage persistence
 */

// Maximum image size for base64 conversion (2MB)
const MAX_IMAGE_SIZE_FOR_BASE64 = 2 * 1024 * 1024; // 2MB

// Image compression quality
const COMPRESSION_QUALITY = 0.8;

/**
 * Convert file to base64 string for persistence
 */
export const convertFileToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		// Check file size
		if (file.size > MAX_IMAGE_SIZE_FOR_BASE64) {
			reject(
				new Error(
					"Image too large for persistence. Please choose a smaller image."
				)
			);
			return;
		}

		const reader = new FileReader();

		reader.onload = () => {
			const result = reader.result as string;
			resolve(result);
		};

		reader.onerror = () => {
			reject(new Error("Failed to read image file"));
		};

		reader.readAsDataURL(file);
	});
};

/**
 * Compress image using canvas before converting to base64
 */
export const compressImage = (
	file: File,
	maxWidth: number = 800,
	maxHeight: number = 600
): Promise<string> => {
	return new Promise((resolve, reject) => {
		// Check if it's an image
		if (!file.type.startsWith("image/")) {
			reject(new Error("File is not an image"));
			return;
		}

		const img = new Image();
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		if (!ctx) {
			reject(new Error("Canvas not supported"));
			return;
		}

		img.onload = () => {
			// Calculate new dimensions
			let { width, height } = img;

			if (width > height) {
				if (width > maxWidth) {
					height = (height * maxWidth) / width;
					width = maxWidth;
				}
			} else {
				if (height > maxHeight) {
					width = (width * maxHeight) / height;
					height = maxHeight;
				}
			}

			// Set canvas dimensions
			canvas.width = width;
			canvas.height = height;

			// Draw and compress image
			ctx.drawImage(img, 0, 0, width, height);

			// Convert to base64 with compression
			const compressedDataUrl = canvas.toDataURL(
				"image/jpeg",
				COMPRESSION_QUALITY
			);

			// Check final size
			const sizeInBytes = Math.round((compressedDataUrl.length * 3) / 4);
			if (sizeInBytes > MAX_IMAGE_SIZE_FOR_BASE64) {
				reject(
					new Error(
						"Compressed image still too large. Please choose a smaller image."
					)
				);
				return;
			}

			resolve(compressedDataUrl);
		};

		img.onerror = () => {
			reject(new Error("Failed to load image"));
		};

		// Create object URL to load the image
		const objectUrl = URL.createObjectURL(file);
		img.src = objectUrl;

		// Clean up object URL after image loads
		const originalOnLoad = img.onload;
		const originalOnError = img.onerror;

		img.onload = (event) => {
			URL.revokeObjectURL(objectUrl);
			if (originalOnLoad) originalOnLoad.call(img, event);
		};

		img.onerror = (event) => {
			URL.revokeObjectURL(objectUrl);
			if (originalOnError) originalOnError.call(img, event);
		};
	});
};

/**
 * Process uploaded image for chat persistence
 */
export const processImageForChat = async (file: File): Promise<string> => {
	try {
		// Try compression first for better storage efficiency
		if (file.size > 500 * 1024) {
			// If larger than 500KB, compress
			return await compressImage(file);
		} else {
			// For smaller images, just convert to base64
			return await convertFileToBase64(file);
		}
	} catch (error) {
		console.error("Error processing image:", error);
		throw error;
	}
};

/**
 * Validate base64 image data
 */
export const isValidBase64Image = (base64String: string): boolean => {
	if (!base64String || typeof base64String !== "string") {
		return false;
	}

	// Check if it's a valid data URL format
	const dataUrlPattern = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;
	return dataUrlPattern.test(base64String);
};

/**
 * Get image dimensions from base64 string
 */
export const getImageDimensionsFromBase64 = (
	base64String: string
): Promise<{ width: number; height: number }> => {
	return new Promise((resolve, reject) => {
		if (!isValidBase64Image(base64String)) {
			reject(new Error("Invalid base64 image"));
			return;
		}

		const img = new Image();

		img.onload = () => {
			resolve({ width: img.width, height: img.height });
		};

		img.onerror = () => {
			reject(new Error("Failed to load image from base64"));
		};

		img.src = base64String;
	});
};

/**
 * Storage management for chat images
 */
export class ChatImageStorage {
	private static readonly STORAGE_KEY = "liveChatImages";
	private static readonly MAX_IMAGES = 50; // Limit number of stored images

	/**
	 * Store image with automatic cleanup of old images
	 */
	static storeImage(messageId: string, base64Data: string): boolean {
		if (typeof window === "undefined") return false;

		try {
			const stored = this.getStoredImages();

			// Add new image
			stored[messageId] = {
				data: base64Data,
				timestamp: Date.now(),
			};

			// Cleanup old images if we exceed the limit
			const entries = Object.entries(stored);
			if (entries.length > this.MAX_IMAGES) {
				// Sort by timestamp and keep only the newest
				entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
				const keepEntries = entries.slice(0, this.MAX_IMAGES);

				// Create new object with only the entries to keep
				const cleanedStorage: Record<
					string,
					{ data: string; timestamp: number }
				> = {};
				keepEntries.forEach(([id, data]) => {
					cleanedStorage[id] = data;
				});

				localStorage.setItem(
					this.STORAGE_KEY,
					JSON.stringify(cleanedStorage)
				);
			} else {
				localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
			}

			return true;
		} catch (error) {
			console.error("Failed to store image:", error);
			return false;
		}
	}

	/**
	 * Retrieve image by message ID
	 */
	static getImage(messageId: string): string | null {
		if (typeof window === "undefined") return null;

		try {
			const stored = this.getStoredImages();
			return stored[messageId]?.data || null;
		} catch (error) {
			console.error("Failed to retrieve image:", error);
			return null;
		}
	}

	/**
	 * Get all stored images
	 */
	private static getStoredImages(): Record<
		string,
		{ data: string; timestamp: number }
	> {
		try {
			const stored = localStorage.getItem(this.STORAGE_KEY);
			return stored ? JSON.parse(stored) : {};
		} catch (error) {
			console.error("Failed to parse stored images:", error);
			return {};
		}
	}

	/**
	 * Clear all stored images
	 */
	static clearAllImages(): void {
		if (typeof window === "undefined") return;

		try {
			localStorage.removeItem(this.STORAGE_KEY);
		} catch (error) {
			console.error("Failed to clear stored images:", error);
		}
	}

	/**
	 * Remove a specific image by message ID
	 */
	static removeImage(messageId: string): boolean {
		if (typeof window === "undefined") return false;

		try {
			const stored = this.getStoredImages();
			if (stored[messageId]) {
				delete stored[messageId];
				localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
				return true;
			}
			return false;
		} catch (error) {
			console.error("Failed to remove image:", error);
			return false;
		}
	}

	/**
	 * Get storage usage information
	 */
	static getStorageInfo(): { count: number; estimatedSize: string } {
		if (typeof window === "undefined") {
			return { count: 0, estimatedSize: "0 KB" };
		}

		try {
			const stored = this.getStoredImages();
			const count = Object.keys(stored).length;

			// Estimate size
			const dataString = localStorage.getItem(this.STORAGE_KEY) || "";
			const sizeInBytes = new Blob([dataString]).size;
			const sizeInKB = Math.round(sizeInBytes / 1024);
			const sizeInMB =
				sizeInKB > 1024
					? (sizeInKB / 1024).toFixed(1) + " MB"
					: sizeInKB + " KB";

			return { count, estimatedSize: sizeInMB };
		} catch (error) {
			console.error("Failed to get storage info:", error);
			return { count: 0, estimatedSize: "0 KB" };
		}
	}
}
