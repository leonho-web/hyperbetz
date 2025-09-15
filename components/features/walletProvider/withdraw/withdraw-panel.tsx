"use client";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	//  Wallet,
	RotateCcw,
	AlertTriangle,
} from "lucide-react";
import { CopyWalletAddressButton } from "@/components/common/walletProvider/copy-wallet-address-button";
import { useWalletAddress } from "@/hooks/walletProvider/useWalletAddress";
import { Label } from "@/components/ui/label";
import { NetworkSelector } from "@/components/common/walletProvider/network-selector";
import { useWithdraw } from "@/hooks/walletProvider/withdrawal/useWithdraw";
// import { WithdrawSummary } from "@/components/features/walletProvider/withdraw/withdraw-summary";
import { WithdrawTransactionPending } from "@/components/features/walletProvider/withdraw/withdraw-transaction-pending";
import { WithdrawalSuccessModal } from "@/components/features/walletProvider/withdraw/withdrawal-success-modal";
import { useTranslations } from "@/lib/locale-provider";
import { cn } from "@/lib/utils";

export const WithdrawPanel = ({
	isLobbyPage = false,
	isEmbeddedWallet = false,
}: {
	isLobbyPage?: boolean;
	isEmbeddedWallet?: boolean;
}) => {
	const t = useTranslations("walletProvider.withdrawPanel");
	const { address: walletAddress } = useWalletAddress();

	// --- 1. CONNECT TO THE MASTER LOGIC HOOK ---
	const {
		// State
		withdrawAmount,
		selectedToken,
		// fee,
		// totalPayout,
		maxWithdrawAmount,
		pendingStatus,
		timeLeft,
		isWithdrawalSuccessful,
		withdrawTxHash,
		// withdrawAddress,
		isBalanceInsufficient,
		isBelowMinimum,
		isNetworkSupported,
		MINIMUM_WITHDRAWAL_AMOUNT,
		showSuccessModal,
		// Actions
		handleAmountChange,
		setMaxAmount,
		executeWithdraw,
		resetPage,
		setShowingConfetti,
		setShowSuccessModal,
		// UI Helpers
		getButtonText,
		isWithdrawDisabled,
	} = useWithdraw();
	// --- 2. ADDITIONAL STATE FOR UI ---
	const [isMaxed, setIsMaxed] = useState(false);
	// Local state to store withdraw amount for success modal
	const [successWithdrawAmount, setSuccessWithdrawAmount] = useState("");

	// --- 3. AUTO-RESET FUNCTIONALITY REMOVED ---
	// Let users manually close the success modal instead of auto-resetting

	// Capture withdraw amount when withdrawal becomes successful
	useEffect(() => {
		if (isWithdrawalSuccessful && withdrawAmount) {
			setSuccessWithdrawAmount(withdrawAmount);
		}
	}, [isWithdrawalSuccessful, withdrawAmount]);

	// Dynamic font size based on character length (not words since this is numeric input)
	// const dynamicFontClass = useMemo(() => {
	// 	const textLength = withdrawAmount.length;
	// 	console.log(textLength);
	// 	if (textLength >= 18) {
	// 		// console.log("text-sm");
	// 		return "text-sm";
	// 	}
	// 	if (textLength >= 16 && textLength < 18) {
	// 		// console.log("text-base");
	// 		return "text-base";
	// 	}
	// 	if (textLength >= 12 && textLength < 16) {
	// 		// console.log("text-lg");
	// 		return "text-lg";
	// 	}
	// 	// console.log("text-xl md:text-2xl");
	// 	return "text-xl md:text-2xl";
	// }, [withdrawAmount]);

	const dynamicFontClass = useMemo(() => {
		const textLength = withdrawAmount.length;

		if (textLength > 20) {
			return "!text-sm";
		}
		if (textLength > 16) {
			// If length is 18 or more
			// console.log("Applying text-sm for length:", textLength);
			return "!text-base";
		}
		// Smaller font for long inputs
		if (textLength > 13) {
			// If length is 17 (because >=18 would be caught above)
			// console.log("Applying text-base for length:", textLength);
			return "!text-lg";
		}
		// Medium font for moderately long inputs
		if (textLength > 12) {
			// If length is 13, 14, 15, 16
			// console.log("Applying !text-lg for length:", textLength);
			return "!text-xl";
		}
		if (textLength > 8) {
			// If length is 9, 10, 11, 12
			// console.log("Applying !text-xl for length:", textLength);
			return "!text-2xl";
		}
		return "!text-xl md:!text-2xl";
	}, [withdrawAmount]);

	const handleSetMaxAmount = () => {
		if (selectedToken) {
			setMaxAmount();
			setIsMaxed(true);
		}
	};

	const handleAmountChangeWrapper = (value: string) => {
		handleAmountChange(value, MINIMUM_WITHDRAWAL_AMOUNT);
		setIsMaxed(false); // Reset if user changes amount manually
	};

	return (
		<>
			{/* Main container with dark background and rounded corners matching the image */}
			<div className="bg-card border border-border rounded-2xl shadow-lg">
				{/* --- HEADER --- */}
				<div className="flex items-center justify-between p-4 border-b border-border">
					<Button
						variant="ghost"
						size="icon"
						onClick={resetPage}
						aria-label={t("resetForm")}
						className="hover:bg-muted"
					>
						<RotateCcw className="h-4 w-4" />
					</Button>

					<NetworkSelector />
				</div>

				{/* --- CONDITIONAL CONTENT --- */}
				{pendingStatus || isWithdrawalSuccessful ? (
					/* Show transaction pending component */
					<div className="p-6 pb-12 flex items-center justify-center min-h-[400px]">
						<WithdrawTransactionPending
							transactionHash={withdrawTxHash}
							timeLeft={timeLeft}
							isSuccessful={isWithdrawalSuccessful}
							onNewWithdrawal={resetPage}
							setShowingConfetti={setShowingConfetti}
						/>
					</div>
				) : (
					<>
						{/* --- MAIN CONTENT --- */}
						<div className="p-6 space-y-6">
							{/* Network Not Supported Alert */}
							{!isNetworkSupported && (
								<Alert variant="warning" className="space-y-2">
									<AlertTitle>
										<AlertTriangle className="mx-auto" />
									</AlertTitle>
									<AlertDescription className="mx-auto">
										{t("networkNotSupported")}
									</AlertDescription>
								</Alert>
							)}

							{/* "You Withdraw" Label */}
							<div className="text-left">
								<Label className="text-muted-foreground text-sm font-normal">
									{t("youWithdraw")}
								</Label>
							</div>

							{/* Amount Input with Token Display - Main Section */}
							<div className="space-y-4">
								{/* Large Amount Input with Token Display Overlay */}
								<div
									className={cn(
										"placeholder:text-muted-foreground dark:bg-input/30 flex h-full w-full rounded-md bg-transparent",
										"px-5 py-2.5 shadow-xs outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
										"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
										"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
									)}
								>
									<Input
										type="text"
										inputMode="decimal"
										placeholder="0"
										value={withdrawAmount}
										onChange={(e) =>
											handleAmountChangeWrapper(
												e.target.value
											)
										}
										className={cn(
											"!p-0  font-light !bg-transparent !border-none !pr-2 !shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/40",
											isBalanceInsufficient ||
												isBelowMinimum
												? "text-destructive"
												: "",
											dynamicFontClass
										)}
										disabled={!isNetworkSupported}
									/>

									{/* Token Display - Positioned absolutely on the right */}
									<div className="flex items-center gap-2 !py-1 px-2 rounded-full">
										{selectedToken && (
											<Image
												src={selectedToken.token_icon}
												alt={selectedToken.token_name}
												width={24}
												height={24}
												className="rounded-full"
											/>
										)}
										<span className="font-semibold text-[11px] md:text-xs">
											{selectedToken?.token_symbol ||
												t("loading")}
										</span>
									</div>
								</div>

								{/* Minimum amount indicator & Balance and Max Button */}
								<div className="flex items-center w-full justify-between gap-2">
									{/* Minimum amount indicator */}
									<span className="text-muted-foreground text-left text-xs">
										{t("minLabel")}{" "}
										{MINIMUM_WITHDRAWAL_AMOUNT}{" "}
										{selectedToken?.token_symbol}
									</span>
									<div className="flex gap-2 items-center ">
										<span className="text-muted-foreground text-sm">
											{t("balance")}{" "}
											{maxWithdrawAmount.toFixed(2)}
										</span>
										<Button
											variant="link"
											onClick={handleSetMaxAmount}
											disabled={!isNetworkSupported}
											className={`text-primary hover:text-primary/80 p-0 h-auto font-medium ${
												isMaxed ? "underline" : ""
											}`}
											size="sm"
										>
											{t("max")}
										</Button>
									</div>
								</div>

								{/* Error Messages */}
								{/* {(isBalanceInsufficient || isBelowMinimum) && (
									<div className="text-left">
										{isBalanceInsufficient && (
											<span className="text-destructive text-sm">
												{t("insufficientBalance")}
											</span>
										)}
										{isBelowMinimum && (
											<span className="text-destructive text-sm">
												{t("minimumIs", {
													min: MINIMUM_WITHDRAWAL_AMOUNT,
												})}
											</span>
										)}
									</div>
								)} */}

								{/* Total Payout Display (equivalent to USD conversion in deposit) */}
								{/* {selectedToken &&
									withdrawAmount &&
									totalPayout > 0 && (
										<div className="text-left">
											<span className="text-muted-foreground text-sm">
												Total Payout:{" "}
												{totalPayout.toFixed(2)}{" "}
												{selectedToken?.token_symbol}
											</span>
										</div>
									)} */}
							</div>

							{/* Withdraw Summary (equivalent to additional info in deposit) */}
							{/* <WithdrawSummary
								totalPayout={totalPayout}
								tokenSymbol={selectedToken?.token_symbol}
							/> */}

							{/* Wallet Address Copy Section */}
							{!isLobbyPage &&
								isEmbeddedWallet &&
								walletAddress && (
									<div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border">
										<div className="flex items-center gap-2">
											<span className="text-sm text-muted-foreground">
												{isEmbeddedWallet
													? t("emailWalletAddress")
													: t("walletAddress")}
											</span>
											<code className="text-sm font-mono">
												{walletAddress.slice(0, 6)}...
												{walletAddress.slice(-4)}
											</code>
										</div>
										<CopyWalletAddressButton
											address={walletAddress}
											variant="outline"
											size="sm"
											iconOnly
										/>
									</div>
								)}

							{/* Additional Information */}
							{/* {selectedToken && (
								<div className="text-center">
									<span className="text-muted-foreground/60 text-xs italic">
										Rates may vary
									</span>
								</div>
							)} */}
						</div>

						{/* --- FOOTER --- */}
						<div className="p-6 pt-0">
							<Button
								onClick={executeWithdraw}
								disabled={isWithdrawDisabled()}
								size="lg"
								className="w-full h-12 text-lg font-semibold rounded-xl"
							>
								{getButtonText()}
							</Button>
						</div>
					</>
				)}
			</div>

			{/* Withdrawal Success Modal */}
			<WithdrawalSuccessModal
				isOpen={showSuccessModal}
				onClose={() => {
					// console.log(successWithdrawAmount);
					setShowSuccessModal(false);
					setSuccessWithdrawAmount(""); // Reset local state
					resetPage(); // Reset the form when modal is closed
				}}
				withdrawAmount={successWithdrawAmount}
				tokenSymbol={selectedToken?.token_symbol || ""}
				transactionHash={withdrawTxHash || undefined}
			/>
		</>
	);
};
