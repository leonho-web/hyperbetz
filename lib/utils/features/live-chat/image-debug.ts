/**
 * Browser debugging helper for testing image persistence
 * Add this to any page to test the image system from browser console
 */

// Extend window type for debugging
declare global {
	interface Window {
		ImageDebug: {
			processImageForChat: (file: File) => Promise<string>;
			ChatImageStorage: {
				storeImage: (messageId: string, dataUrl: string) => boolean;
				getImage: (messageId: string) => string | null;
				getStorageInfo: () => { count: number; estimatedSize: string };
				clearAllImages: () => void;
				removeImage: (messageId: string) => boolean;
			};
			createTestImage(): Promise<File>;
			runQuickTest(): Promise<{
				messageId: string;
				dataUrl: string;
				stored: boolean;
				retrieved: string | null;
				info: { count: number; estimatedSize: string };
			}>;
		};
	}
}

// Function to initialize debug tools
export const initializeImageDebug = () => {
	if (typeof window !== "undefined") {
		// Make image persistence functions globally available for debugging
		import("./image-persistence").then((module) => {
			const { processImageForChat, ChatImageStorage } = module;

			// Create global debugging object
			window.ImageDebug = {
				processImageForChat,
				ChatImageStorage,

				// Helper to create test image
				async createTestImage() {
					const canvas = document.createElement("canvas");
					canvas.width = 100;
					canvas.height = 100;
					const ctx = canvas.getContext("2d");

					if (ctx) {
						// Draw a simple test image
						ctx.fillStyle = "#ff6b6b";
						ctx.fillRect(0, 0, 100, 100);
						ctx.fillStyle = "#ffffff";
						ctx.font = "20px Arial";
						ctx.fillText("TEST", 25, 55);
					}

					return new Promise((resolve) => {
						canvas.toBlob((blob) => {
							if (blob) {
								const file = new File(
									[blob],
									"test-image.png",
									{
										type: "image/png",
									}
								);
								resolve(file);
							}
						});
					});
				},

				// Quick test function
				async runQuickTest() {
					console.log("🧪 Running quick image persistence test...");
					const testFile = await this.createTestImage();
					const dataUrl = await processImageForChat(testFile);
					const messageId = "test-" + Date.now();

					const stored = ChatImageStorage.storeImage(
						messageId,
						dataUrl
					);
					const retrieved = ChatImageStorage.getImage(messageId);
					const info = ChatImageStorage.getStorageInfo();

					console.log("✅ Test results:", {
						stored,
						retrieved: !!retrieved,
						matches: retrieved === dataUrl,
						storageInfo: info,
					});

					return { messageId, dataUrl, stored, retrieved, info };
				},
			};

			console.log(
				"🛠️ Image debugging tools loaded! Use window.ImageDebug in console."
			);
			console.log(
				"📝 Available methods: createTestImage(), runQuickTest(), ChatImageStorage, processImageForChat"
			);
		});
	}
};

// Auto-initialize in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
	initializeImageDebug();
}
