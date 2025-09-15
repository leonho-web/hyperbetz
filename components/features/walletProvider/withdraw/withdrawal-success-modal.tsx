"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import domtoimage from "dom-to-image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Download, RotateCw, Share2 } from "lucide-react";
import { useQRCode } from "next-qrcode";
import {
	FacebookShareButton,
	TwitterShareButton,
	WhatsappShareButton,
	TelegramShareButton,
	RedditShareButton,
	FacebookIcon,
	XIcon,
	WhatsappIcon,
	TelegramIcon,
	RedditIcon,
} from "react-share";
import { toast } from "sonner";

interface WithdrawalSuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
	withdrawAmount: string;
	tokenSymbol: string;
	transactionHash?: string;
}

export const WithdrawalSuccessModal = (props: WithdrawalSuccessModalProps) => {
	const { isOpen, onClose, withdrawAmount, tokenSymbol } = props;
	const t = useTranslations("walletProvider.withdrawSuccess");
	const screenshotRef = useRef<HTMLDivElement>(null);
	const [image, setImage] = useState<Blob | null>(null);
	const [isGeneratingScreenshot, setIsGeneratingScreenshot] = useState(false);
	console.log(Number(withdrawAmount).toFixed(3));
	const { Image } = useQRCode();
	const shareUrl = "https://memewin.bet";
	const shareText = t("successMessage", {
		withdrawAmount: Number(withdrawAmount).toFixed(3),
		tokenSymbol,
		shareUrl,
	});

	// Reset state when modal opens/closes
	const handleClose = () => {
		setImage(null);
		onClose();
	};

	const handleTakeScreenshot = async () => {
		if (screenshotRef.current) {
			setIsGeneratingScreenshot(true);
			try {
				const imageData = await domtoimage.toBlob(
					screenshotRef.current,
					{
						quality: 1.0,
					}
				);
				setImage(imageData);
				const link = document.createElement("a");
				link.download = `meme-win-success-${Date.now()}.png`;
				link.href = URL.createObjectURL(imageData);
				link.click();
			} catch (error) {
				console.error("Screenshot failed:", error);
				toast.error(
					t("screenshotFailed", {
						defaultValue:
							"Screenshot failed. Please try again or use a different browser.",
					})
				);
			} finally {
				setIsGeneratingScreenshot(false);
			}
		}
	};

	const handleNativeShare = async () => {
		// Check if navigator.share is available and supported
		if (typeof navigator !== "undefined" && navigator.share) {
			try {
				await navigator.share({
					title: shareText,
					url: shareUrl,
					...(image && { files: [image as File] }),
				});
			} catch (error) {
				console.error("Native share failed:", error);
				// Fallback to copying to clipboard
				handleFallbackShare();
			}
		} else {
			// Fallback for browsers that don't support navigator.share
			handleFallbackShare();
		}
	};

	const handleFallbackShare = async () => {
		try {
			if (typeof navigator !== "undefined" && navigator.clipboard) {
				await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
				toast.success(
					t("copiedToClipboard", {
						defaultValue: "Share text copied to clipboard!",
					})
				);
			} else {
				// Fallback for older browsers
				const textArea = document.createElement("textarea");
				textArea.value = `${shareText} ${shareUrl}`;
				document.body.appendChild(textArea);
				textArea.select();
				document.execCommand("copy");
				document.body.removeChild(textArea);
				toast.success(
					t("copiedToClipboard", {
						defaultValue: "Share text copied to clipboard!",
					})
				);
			}
		} catch (error) {
			console.error("Clipboard copy failed:", error);
			toast.error(
				t("shareFailed", {
					defaultValue: "Share failed. Please try again.",
				})
			);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent
				className="mx-auto gap-0 max-w-[90dvw] sm:!max-w-[80dvw] lg:!max-w-0 lg:min-w-[50dvw] p-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-none overflow-hidden"
				onPointerDownOutside={(e) => {
					e.preventDefault();
					return false;
				}}
			>
				{/* Screenshot Content */}
				<div
					ref={screenshotRef}
					className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white"
				>
					{/* Custom Background Image Overlay */}
					<div className="relative h-90 w-full">
						<img
							// ref={screenshotRef}
							src="/assets/banners/withdraw/share.png"
							alt="Success Background"
							className="absolute inset-0 h-90 aspect-video bg-top w-full opacity-60 select-none"
						/>

						<div className="absolute bottom-12 right-5 gap-8 flex flex-col md:flex-row items-end md:items-start justify-between">
							<div className="flex flex-col gap-2 justify-stretch ">
								{/* Center Column - Main Content */}
								<div className="space-y-1 text-center">
									<h2 className="lg:text-xl 2xl:text-3xl font-black text-white drop-shadow-lg">
										{t("title")}
									</h2>
									<p className="text-[10px] max-w-3xs font-bold text-primary drop-shadow-lg text-shadow-gray-700 text-shadow-sm">
										{t("successMessage", {
											withdrawAmount:
												Number(withdrawAmount).toFixed(
													3
												),
											tokenSymbol,
											shareUrl,
										})}
									</p>
								</div>
								{/* withdraw amount */}
								<div className="bg-black/30 basis-1/2 backdrop-blur-xl rounded-xl p-3 ">
									<div className="text-center space-y-1">
										<div className="text-2xl font-black text-green-400 drop-shadow-lg">
											{Number(withdrawAmount).toFixed(3)}{" "}
											<span className="text-sm font-bold text-white">
												{tokenSymbol}
											</span>
										</div>
									</div>
								</div>
							</div>
							{/* qr-code box */}
							<div
								className="bg-white p-1 w-fit rounded-lg shadow-lg"
								role="img"
								aria-label="QR Code for sharing"
							>
								<Image
									text={shareUrl}
									options={{
										type: "canvas",
										width: 120,
										margin: 1,
										color: {
											dark: "#4267b2",
											light: "#ffffff",
										},
										quality: 1,
									}}
								/>
							</div>
						</div>

						{/* Bottom Banner */}
						<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 h-8 flex items-center justify-center">
							<p className="text-black font-black text-sm animate-pulse">
								{t("subText")}
							</p>
						</div>
					</div>
				</div>

				{/* Action Panel */}
				{/* Screenshot Button */}
				<Button
					onClick={handleTakeScreenshot}
					disabled={isGeneratingScreenshot}
					className="mt-4 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-bold"
					size="sm"
				>
					{isGeneratingScreenshot ? (
						<>
							<RotateCw className="w-4 h-4 animate-spin mr-2" />
							{t("generating")}
						</>
					) : (
						<>
							<Download className="w-4 h-4 mr-2" />
							{t("download")}
						</>
					)}
				</Button>

				{/* Social Share Buttons */}
				<div className="space-y-3 p-4">
					<div className="flex items-center justify-center space-x-2">
						<Share2 className="w-4 h-4 text-white/60" />
						<span className="text-sm text-white/80 font-medium">
							{t("shareText")}
						</span>
					</div>

					{/* Share Buttons  */}
					<div className="grid grid-rows-2 grid-cols-2 md:grid-cols-3 gap-4">
						<TwitterShareButton
							url={shareUrl}
							title={shareText}
							className="w-full"
						>
							<div className="flex flex-col items-center p-2 bg-black/20 rounded-lg hover:bg-black/40 transition-all">
								<XIcon size={24} round />
								<span className="text-xs text-white/80 mt-1">
									X
								</span>
							</div>
						</TwitterShareButton>

						<FacebookShareButton
							url={shareUrl}
							hashtag="#MemeWin"
							className="w-full"
						>
							<div className="flex flex-col items-center p-2 bg-black/20 rounded-lg hover:bg-black/40 transition-all">
								<FacebookIcon size={24} round />
								<span className="text-xs text-white/80 mt-1">
									Facebook
								</span>
							</div>
						</FacebookShareButton>

						<WhatsappShareButton
							url={shareUrl}
							title={shareText}
							className="w-full"
						>
							<div className="flex flex-col items-center p-2 bg-black/20 rounded-lg hover:bg-black/40 transition-all">
								<WhatsappIcon size={24} round />
								<span className="text-xs text-white/80 mt-1">
									WhatsApp
								</span>
							</div>
						</WhatsappShareButton>

						<TelegramShareButton
							url={shareUrl}
							title={shareText}
							className="w-full"
						>
							<div className="flex flex-col items-center p-2 bg-black/20 rounded-lg hover:bg-black/40 transition-all">
								<TelegramIcon size={24} round />
								<span className="text-xs text-white/80 mt-1">
									Telegram
								</span>
							</div>
						</TelegramShareButton>

						<RedditShareButton
							url={shareUrl}
							title={shareText}
							className="w-full"
						>
							<div className="flex flex-col items-center p-2 bg-black/20 rounded-lg hover:bg-black/40 transition-all">
								<RedditIcon size={24} round />
								<span className="text-xs text-white/80 mt-1">
									Reddit
								</span>
							</div>
						</RedditShareButton>

						<Button
							onClick={handleNativeShare}
							className=" h-full p-2 bg-black/20 rounded-lg hover:bg-black/40 transition-all"
						>
							<Share2 className="w-4 h-4 mr-2" />
							{t("shareText")}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
