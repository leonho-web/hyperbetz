"use client";

import React, { useEffect, useRef, useState } from "react";
// import { X, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "@/lib/locale-provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faX } from "@fortawesome/pro-light-svg-icons";

interface ModalProps {
	open: boolean;
	onClose: (reason?: "button" | "external") => void;
	banner?: React.ReactNode;
	children?: React.ReactNode;
	okText?: string;
	displayMode?: "promotional" | "banner";
	onDepositCallback?: () => void;
}

export function IdleModal({
	open,
	onClose,
	okText = "Connect Wallet & Start Betting",
	displayMode = "promotional",
	onDepositCallback,
}: ModalProps) {
	const t = useTranslations("modalsIdle");
	const dialogRef = useRef<HTMLDivElement>(null);
	const okBtnRef = useRef<HTMLButtonElement>(null);
	const previousFocusRef = useRef<HTMLElement | null>(null);
	const [countdown, setCountdown] = useState("23:45:12");
	const [endTime, setEndTime] = useState<Date | null>(null);
	const [shouldShowModal, setShouldShowModal] = useState(false);

	// Handle button click based on login status
	const handleMainButtonClick = () => {
		onDepositCallback?.();
	};

	// Function to check if any other modals are currently open
	const checkForOtherModals = () => {
		// Check for various modal indicators in the DOM
		const modalSelectors = [
			'[role="dialog"]:not([data-idle-modal])', // Generic modal dialogs (excluding this one)
			'[aria-modal="true"]:not([data-idle-modal])', // ARIA modals (excluding this one)
			".modal", // Common modal class
			'[data-state="open"]', // Radix UI modals
			'[data-testid*="modal"]', // Test ID modals
			// Specific modal classes/selectors for known modals
			"[data-nickname-modal]",
			"[data-transaction-modal]",
			"[data-token-modal]",
			"[data-email-verification-modal]",
			"[data-small-bonus-modal]",
		];

		for (const selector of modalSelectors) {
			const elements = document.querySelectorAll(selector);
			if (elements.length > 0) {
				return true;
			}
		}

		return false;
	};

	// Check for other modals when the open prop changes
	useEffect(() => {
		if (open) {
			const hasOtherModals = checkForOtherModals();
			setShouldShowModal(!hasOtherModals);

			// If there are other modals, set up a periodic check
			if (hasOtherModals) {
				const checkInterval = setInterval(() => {
					const stillHasOtherModals = checkForOtherModals();
					if (!stillHasOtherModals) {
						setShouldShowModal(true);
						clearInterval(checkInterval);
					}
				}, 500); // Check every 500ms

				return () => clearInterval(checkInterval);
			}
		} else {
			setShouldShowModal(false);
		}
	}, [open]);

	// Dynamic countdown timer
	useEffect(() => {
		if (!shouldShowModal) return;

		// Set the end time only once when modal opens (23 hours 45 minutes 12 seconds from now)
		if (!endTime) {
			const now = new Date();
			const newEndTime = new Date(
				now.getTime() + 23 * 60 * 60 * 1000 + 45 * 60 * 1000 + 12 * 1000
			);
			setEndTime(newEndTime);
		}

		const interval = setInterval(() => {
			if (!endTime) return;

			const now = new Date();
			const diff = endTime.getTime() - now.getTime();

			if (diff <= 0) {
				setCountdown("00:00:00");
				clearInterval(interval);
				return;
			}

			const hours = Math.floor(diff / (1000 * 60 * 60));
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((diff % (1000 * 60)) / 1000);

			setCountdown(
				`${hours.toString().padStart(2, "0")}:${minutes
					.toString()
					.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
			);
		}, 1000);

		return () => clearInterval(interval);
	}, [shouldShowModal, endTime]);

	// Focus management and focus trap
	useEffect(() => {
		if (!shouldShowModal) return;

		// Store previous focus
		previousFocusRef.current = document.activeElement as HTMLElement;

		// Get all focusable elements
		const focusableElements =
			dialogRef.current?.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);

		const firstFocusable = focusableElements?.[0];
		const lastFocusable = focusableElements?.[focusableElements.length - 1];

		// Focus trap handler
		const handleTabKey = (e: KeyboardEvent) => {
			if (e.key !== "Tab") return;
			if (!focusableElements || focusableElements.length === 0) return;

			if (e.shiftKey) {
				// Shift + Tab
				if (document.activeElement === firstFocusable) {
					e.preventDefault();
					lastFocusable?.focus();
				}
			} else {
				// Tab
				if (document.activeElement === lastFocusable) {
					e.preventDefault();
					firstFocusable?.focus();
				}
			}
		};

		// Escape key handler
		const handleEscapeKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose("external"); // Pass 'external' for escape key
			}
		};

		// Add event listeners
		document.addEventListener("keydown", handleTabKey);
		document.addEventListener("keydown", handleEscapeKey);

		// Focus the first focusable element (OK button)
		setTimeout(() => {
			okBtnRef.current?.focus();
		}, 100);

		// Cleanup
		return () => {
			document.removeEventListener("keydown", handleTabKey);
			document.removeEventListener("keydown", handleEscapeKey);
		};
	}, [shouldShowModal, onClose]);

	// Return focus when modal closes
	useEffect(() => {
		if (!shouldShowModal && previousFocusRef.current) {
			previousFocusRef.current.focus();
			previousFocusRef.current = null;
		}
		// Reset countdown when modal closes
		if (!shouldShowModal) {
			setEndTime(null);
			setCountdown("23:45:12");
		}
	}, [shouldShowModal]);

	// Prevent body scroll when modal is open
	useEffect(() => {
		if (shouldShowModal) {
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = "unset";
			};
		}
	}, [shouldShowModal]);

	if (!shouldShowModal) return null;

	// Promotional Layout (current layout)
	const renderPromotionalLayout = () => (
		<div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-4 sm:gap-8 lg:gap-12 p-3 sm:p-4 md:p-6 lg:p-8 pt-8 sm:pt-10 md:pt-12 lg:pt-16">
			{/* Left Side - Offer Content */}
			<div className="flex-1 text-center lg:text-left space-y-3 sm:space-y-4 lg:space-y-6 flex flex-col justify-center">
				{/* Offer Badge */}
				<div className="flex justify-center lg:justify-start">
					<div className="bg-gradient-to-r from-primary to-destructive text-foreground px-3 py-1 rounded-full text-xs sm:text-sm font-bold animate-pulse">
						LIMITED TIME OFFER
					</div>
				</div>

				{/* Main Offer Headline */}
				<div className="space-y-1 sm:space-y-2 lg:space-y-3">
					<h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-primary to-background bg-clip-text text-transparent leading-tight">
						Get 200% Welcome Bonus!
					</h1>
					<p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">
						Connect your crypto wallet now and receive up to{" "}
						<span className="text-primary font-bold">$5,000</span>{" "}
						bonus on your first deposit!
					</p>
				</div>

				{/* Offer Features */}
				<div className="bg-gradient-to-r from-primary/10 to-chart-2/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-primary/20">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
						<div className="flex items-center gap-2">
							<div className="w-4 sm:w-5 h-4 sm:h-5 bg-primary rounded-full flex items-center justify-center">
								<span className="text-foreground text-xs"></span>
							</div>
							<span className="text-foreground">
								200% Deposit Match
							</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 sm:w-5 h-4 sm:h-5 bg-primary rounded-full flex items-center justify-center">
								<span className="text-foreground text-xs"></span>
							</div>
							<span className="text-foreground">
								Zero Transaction Fees
							</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 sm:w-5 h-4 sm:h-5 bg-primary rounded-full flex items-center justify-center">
								<span className="text-foreground text-xs"></span>
							</div>
							<span className="text-foreground">
								Instant Withdrawals
							</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 sm:w-5 h-4 sm:h-5 bg-primary rounded-full flex items-center justify-center">
								<span className="text-foreground text-xs"></span>
							</div>
							<span className="text-foreground">
								No KYC Required
							</span>
						</div>
					</div>
				</div>

				{/* Combined CTA Button and Countdown Timer */}
				<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
					<button
						ref={okBtnRef}
						className="flex-1 w-full sm:w-1/2 px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 bg-primary
                       text-foreground font-bold rounded-lg sm:rounded-xl md:rounded-2xl 
                       text-sm sm:text-base md:text-xl shadow-2xl
                       hover:scale-105 transition-all duration-300
                       focus:outline-none focus:ring-4 focus:ring-ring
                       relative overflow-hidden group animate-pulse"
						onClick={handleMainButtonClick}
					>
						<span className="relative z-10">{t("ctaClaim")}</span>
					</button>

					<div className="flex-1 w-full sm:w-1/2 bg-destructive/10 border border-destructive/30 rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col justify-center text-center">
						<div className="text-destructive text-xs sm:text-sm font-medium mb-1">
							{t("offerExpires")}
						</div>
						<div className="text-foreground font-bold text-base sm:text-lg">
							{countdown}
						</div>
					</div>
				</div>

				{/* Disclaimer */}
				<p className="text-[8px] sm:text-[10px] text-muted-foreground italic text-center lg:text-left">
					{t("disclaimer")}
				</p>
			</div>

			{/* Right Side - Phone Mockup - Hidden on mobile */}
			<div className="hidden lg:flex flex-shrink-0 relative items-center justify-center">
				<div className="relative transform rotate-12 hover:rotate-6 transition-transform duration-500">
					{/* Phone Frame */}
					<div className="w-40 h-64 bg-gradient-to-b from-muted to-secondary rounded-[2rem] p-2 shadow-2xl">
						<div className="w-full h-full bg-gradient-to-b from-background to-muted/50 rounded-[1.5rem] relative overflow-hidden">
							{/* Screen Content - Wallet Interface */}
							<div className="relative inset-0 bg-background rounded-[1.8rem] p-3 text-foreground h-full flex flex-col">
								{/* Top Bar with Back Arrow, Ethereum and Close */}
								<div className="flex justify-between items-center mb-4">
									<div className="flex items-center gap-3">
										<button className="text-muted-foreground">
											<svg
												className="w-3 h-3"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M10 19l-7-7m0 0l7-7m-7 7h18"
												/>
											</svg>
										</button>
										<div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg">
											<div className="w-4 h-4 bg-chart-2 rounded-full flex items-center justify-center">
												<span className="text-[6px] text-foreground font-bold">
													E
												</span>
											</div>
											<span className="text-foreground font-medium text-[6px]">
												{t("ethereum")}
											</span>
											<span className="text-muted-foreground text-[6px]">
												▼
											</span>
										</div>
									</div>
								</div>

								{/* Enter Amount Section */}
								<div className="mb-2">
									<label className="block text-muted-foreground text-sm mb-2 font-medium">
										{t("enterAmount")}
									</label>
									<div className="flex items-center justify-between bg-muted rounded-lg px-2 py-1 border border-border">
										<span className="text-muted-foreground text-base">
											0.00
										</span>
										<button className="text-primary font-bold text-[8px] px-2 py-1 rounded bg-primary/10">
											{t("max")}
										</button>
									</div>
								</div>

								{/* Select Token Section */}
								<div className="mb-2">
									<div className="flex items-center justify-between bg-muted rounded-lg px-2 py-2 border border-border">
										<div className="flex items-center gap-2">
											<div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
												<span className="text-foreground text-[10px] font-bold">
													T
												</span>
											</div>
											<div>
												<div className="text-foreground font-medium text-sm">
													USDT
												</div>
											</div>
										</div>
										<span className="text-muted-foreground text-[6px]">
											▼
										</span>
									</div>
								</div>

								{/* Balance Info */}
								<div className="mb-1 ">
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground text-[8px]">
											{t("balance")}: 0 USDT
										</span>
										<span className="text-muted-foreground text-[6px]">
											~ $0.00 USD
										</span>
									</div>
								</div>

								{/* Action Button */}
								<div className="mt-2">
									<button
										className="w-full bg-primary hover:bg-primary/90 rounded-lg py-1 text-foreground font-bold text-sm transition-colors shadow-lg flex items-center justify-center gap-2"
										onClick={handleMainButtonClick}
									>
										{t("deposit")}{" "}
										<FontAwesomeIcon
											icon={faArrowRight}
											fontSize={15}
										/>
									</button>
								</div>
							</div>
						</div>
					</div>

					{/* Glow Effect */}
					<div
						className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background/10 to-chart-2/10 
                          rounded-[2rem] blur-xl -z-10"
					></div>
				</div>
			</div>
		</div>
	);

	// Banner Layout
	const renderBannerLayout = () => (
		<div className="relative w-full h-full">
			{/* Banner Image */}
			<div className="w-full h-full min-h-[400px] md:min-h-[500px] flex items-center justify-center bg-gradient-to-br from-primary/20 to-destructive/20 rounded-2xl md:rounded-3xl overflow-hidden">
				<Image
					src="/mex-avatar.png"
					alt={t("bannerAlt")}
					width={800}
					height={500}
					className="w-full h-full object-cover rounded-2xl md:rounded-3xl"
				/>
				{/* Action Button Overlay */}
				<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
					<button
						ref={okBtnRef}
						className="px-6 py-3 bg-primary/90 backdrop-blur-sm text-foreground font-bold rounded-lg hover:bg-primary transition-colors shadow-lg"
						onClick={handleMainButtonClick}
					>
						{okText || t("ctaOk")}
					</button>
				</div>
			</div>
		</div>
	);

	return (
		<div
			className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			data-idle-modal="true"
			onClick={(e) => {
				if (e.target === e.currentTarget) {
					onClose("external"); // Pass 'external' for backdrop click
				}
			}}
		>
			{/* Animated Background Elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{/* Floating Crypto Coins */}
				<div className="absolute top-20 left-10 w-6 h-6 bg-gradient-to-r from-chart-2 to-chart-3 rounded-full opacity-20 animate-pulse"></div>
				<div className="absolute top-32 right-16 w-4 h-4 bg-gradient-to-r from-primary to-chart-5 rounded-full opacity-30 animate-bounce"></div>
				<div className="absolute bottom-32 left-20 w-8 h-8 bg-gradient-to-r from-destructive to-primary rounded-full opacity-25 animate-ping"></div>
				<div className="absolute bottom-20 right-12 w-5 h-5 bg-gradient-to-r from-chart-5 to-primary rounded-full opacity-20 animate-pulse"></div>

				{/* Blockchain Network Pattern */}
				<div className="absolute top-16 right-24 w-px h-20 bg-gradient-to-b from-transparent via-chart-2/30 to-transparent"></div>
				<div className="absolute bottom-24 left-16 w-20 h-px bg-gradient-to-r from-transparent via-destructive/30 to-transparent"></div>
			</div>

			<div
				ref={dialogRef}
				className="relative bg-gradient-to-br from-background/95 via-card/95 to-background/95 
                   border border-border/50 rounded-2xl md:rounded-3xl shadow-2xl backdrop-blur-xl
                   w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl 
                   max-h-[95vh] overflow-hidden
                   animate-in zoom-in-95 duration-500"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Gradient Border Effect */}
				<div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background/10 to-chart-2/10 rounded-2xl md:rounded-3xl blur-xl"></div>

				{/* Main Content Container */}
				<div className="relative bg-gradient-to-br from-background/98 via-card/98 to-background/98 rounded-2xl md:rounded-3xl overflow-hidden max-h-[95vh]">
					{/* Close Button */}
					<button
						aria-label={t("closeAria")}
						className="absolute top-3 right-3 md:top-6 md:right-6 z-10 text-muted-foreground hover:text-foreground transition-all duration-200 
                       p-1.5 md:p-2 rounded-full hover:bg-muted/50 group"
						onClick={() => onClose("external")}
					>
						{/* <X className="h-4 w-4 md:h-5 md:w-5 group-hover:rotate-90 transition-transform duration-200" /> */}
						<FontAwesomeIcon
							icon={faX}
							fontSize={16}
							className="group-hover:rotate-90 transition-transform duration-200"
						/>
					</button>

					{/* Conditional Layout Rendering */}
					{displayMode === "banner"
						? renderBannerLayout()
						: renderPromotionalLayout()}
				</div>
			</div>
		</div>
	);
}
