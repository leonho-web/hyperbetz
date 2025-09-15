"use client";

import React, { useEffect, useState, useRef } from "react";
// import { X, ArrowRight } from "lucide-react";
import { useTranslations } from "@/lib/locale-provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faX } from "@fortawesome/pro-light-svg-icons";

interface SmallBonusModalProps {
	open: boolean;
	onClose: () => void;
	onDeposit?: () => void;
}

export function SmallBonusModal({
	open,
	onClose,
	onDeposit,
}: SmallBonusModalProps) {
	const t = useTranslations("modalsSmall");
	const [countdown, setCountdown] = useState({ minutes: 0, seconds: 0 });
	const [isTimerEnded, setIsTimerEnded] = useState(false);
	const intervalRef = useRef<number | null>(null);
	const onCloseRef = useRef(onClose);

	useEffect(() => {
		onCloseRef.current = onClose;
	}, [onClose]);

	// Start & run the countdown timer when modal is opened
	useEffect(() => {
		if (!open) return;

		setIsTimerEnded(false); // reset flag when opening modal

		const updateTimer = () => {
			let storedTime = localStorage.getItem("smallModalTime");

			// If no stored time exists, create a new 10-minute timer
			if (!storedTime) {
				const now = Date.now();
				const tenMinutesFromNow = now + 10 * 60 * 1000; // 10 minutes = 10 * 60 * 1000 milliseconds
				localStorage.setItem(
					"smallModalTime",
					new Date(tenMinutesFromNow).toISOString()
				);
				storedTime = new Date(tenMinutesFromNow).toISOString();
			}

			const endTime = new Date(storedTime).getTime();
			const now = Date.now();
			const total = endTime - now;

			if (total <= 0) {
				setCountdown({ minutes: 0, seconds: 0 });
				setIsTimerEnded(true);

				// Clear localStorage
				localStorage.removeItem("smallModalTime");
				localStorage.removeItem("smallModalStatus");

				stopTimer();
				onCloseRef.current?.();
				return;
			}

			const minutes = Math.floor((total % 3600000) / 60000);
			const seconds = Math.floor((total % 60000) / 1000);

			setCountdown({ minutes, seconds });
		};

		const stopTimer = () => {
			if (intervalRef.current !== null) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};

		// Start immediately
		updateTimer();
		intervalRef.current = window.setInterval(updateTimer, 1000);

		return () => {
			stopTimer();
		};
	}, [open]);

	if (!open || isTimerEnded) return null;

	return (
		<div className="fixed bottom-4 right-4 z-[9998] animate-in slide-in-from-bottom-4 duration-500">
			<div className="relative bg-primary rounded-xl p-3 shadow-lg backdrop-blur-sm border border-border/10 w-[260px]">
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute cursor-pointer top-1 right-1 text-foreground/80 hover:text-foreground text-center transition-colors z-10 p-1 rounded-md hover:bg-background/10"
					aria-label={t("close")}
				>
					{/* <X className="h-4 w-4" /> */}
					<FontAwesomeIcon icon={faX} fontSize={16} />
				</button>

				{/* Content */}
				<div className="text-foreground">
					{/* Header */}
					<div className="mb-2">
						<div className="text-xs font-medium opacity-90">
							{t("firstDepositBoost")}
						</div>
						<div className="flex items-baseline gap-1 mt-0.5">
							<span className="text-xl font-bold text-foreground">
								🔥 170%
							</span>
							<span className="text-xs opacity-90">
								{t("bonus")}
							</span>
						</div>
					</div>

					{/* Timer and Button Row */}
					<div className="flex items-center justify-between gap-3">
						{/* Timer */}
						<div className="flex items-center gap-2">
							<div className="text-center">
								<div className="text-[10px] opacity-80 leading-none mb-1">
									{t("min")}
								</div>
								<div className="text-lg font-bold leading-none text-foreground bg-background/40 p-2 rounded-sm">
									{countdown.minutes
										.toString()
										.padStart(2, "0")}
								</div>
							</div>
							<div className="text-lg font-bold opacity-60 text-foreground">
								:
							</div>
							<div className="text-center">
								<div className="text-[10px] opacity-80 leading-none mb-1">
									{t("sec")}
								</div>
								<div className="text-lg font-bold leading-none text-foreground bg-background/40 p-2 rounded-sm">
									{countdown.seconds
										.toString()
										.padStart(2, "0")}
								</div>
							</div>
						</div>

						{/* Deposit Button */}
						<button
							onClick={onDeposit}
							className="bg-accent-foreground hover:bg-accent-foreground/90 text-background font-bold py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-1 text-sm"
						>
							{t("deposit")}{" "}
							<FontAwesomeIcon
								icon={faArrowRight}
								fontSize={15}
							/>
						</button>
					</div>
				</div>

				{/* Background Glow Effect */}
				<div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-chart-1/10 rounded-xl blur-sm -z-10" />
			</div>
		</div>
	);
}
