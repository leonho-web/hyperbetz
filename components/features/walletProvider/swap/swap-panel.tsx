"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
	ArrowDownUp,
	Settings,
	Zap,
	RefreshCw,
	ChevronDown,
	Loader2,
	AlertTriangle,
	Info,
	TrendingUp,
} from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Token } from "@/types/blockchain/swap.types";
import useSwap from "@/hooks/walletProvider/swap/useSwapNew";
import { TokenListModal } from "@/components/common/walletProvider/token-list-modal";
import { NetworkSelector } from "@/components/common/walletProvider/network-selector";
import { CopyWalletAddressButton } from "@/components/common/walletProvider/copy-wallet-address-button";
import { useWalletAddress } from "@/hooks/walletProvider/useWalletAddress";
import { useTranslations } from "@/lib/locale-provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/pro-light-svg-icons";
import { cn } from "@/lib/utils";
import { useBlockExplorerUrl } from "@/hooks/walletProvider/useBlockExplorerUrl";
import {
	formatAmount,
	formatUSD,
} from "@/lib/utils/wallet-provider/wallet-provider.utils";

// Slippage presets
const slippagePresets = ["0.1", "0.5", "1.0", "2.0"];

export const SwapPanel = ({
	isLobbyPage = false,
	isEmbeddedWallet,
}: {
	isLobbyPage?: boolean;
	isEmbeddedWallet?: boolean;
}) => {
	const t = useTranslations("walletProvider.swapPanel");
	const { address: walletAddress } = useWalletAddress();
	const { getTransactionUrl } = useBlockExplorerUrl();

	// Destructure all swap hook properties
	const {
		// Token state
		fromToken,
		toToken,
		setFromToken,
		setToToken,
		switchTokens,

		// Amount state
		exchangeAmount,
		receivedAmount,
		handleExchangeAmountChange,
		handleReceivedAmountChange,
		resetAmounts,

		// Quote and conversion
		conversion,
		isFetching,
		getExchangeRate,
		estimatedGas,

		// Transaction state
		slippage,
		setSlippage,
		isLoading,
		isApproveLoading,
		isTokenAllowed,
		executeSwap,
		approveToken,

		// Gas and balance
		isLowBalance,
		toolTipMessage,
		showToolTip,

		// UI state
		transactionSuccess,
		txHash,
		completedExchangeAmount,
		completedReceivedAmount,
		resetSwapState,

		// Price information
		fromTokenUsdPrice,
		toTokenUsdPrice,

		// Validation
		validateSwap,
	} = useSwap();

	// Local UI state
	const [fromTokenModalOpen, setFromTokenModalOpen] = useState(false);
	const [toTokenModalOpen, setToTokenModalOpen] = useState(false);
	const [showTransactionDetails, setShowTransactionDetails] = useState(false);
	const [customSlippage, setCustomSlippage] = useState("1.0");
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	// Effect to handle confetti and toast on transaction success
	useEffect(() => {
		if (
			transactionSuccess &&
			txHash &&
			completedExchangeAmount &&
			completedReceivedAmount
		) {
			// Trigger confetti
			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
				colors: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"],
			});

			// Show success toast
			toast.success(`Swap successful! `, {
				description:
					"Your transaction has been confirmed on the blockchain",
				duration: 5000,
			});
			// toast.success(
			// 	`Swap successful! ${formatAmount(
			// 		completedExchangeAmount
			// 	)} ${fromToken?.symbol} → ${formatAmount(
			// 		completedReceivedAmount
			// 	)} ${toToken?.symbol}`,
			// 	{
			// 		description:
			// 			"Your transaction has been confirmed on the blockchain",
			// 		duration: 5000,
			// 	}
			// );
		}
	}, [
		transactionSuccess,
		txHash,
		completedExchangeAmount,
		completedReceivedAmount,
		fromToken?.symbol,
		toToken?.symbol,
	]);

	const getSwapButtonText = () => {
		if (!fromToken || !toToken) return t("selectTokens");
		if (!exchangeAmount && !receivedAmount) return t("enterAmount");
		if (isFetching) return t("gettingQuote");
		if (isLoading) return t("confirming");
		if (isApproveLoading) return t("approving");
		if (!isTokenAllowed) return t("approveAndSwap");
		if (validateSwap()) return t("swap");
		if (parseFloat(exchangeAmount) > parseFloat(fromToken.balance))
			return t("insufficientBalance");
		if (fromToken.address === toToken.address) return t("sameToken");
		return t("enterAmount");
	};

	const isSwapDisabled = () => {
		return (
			!fromToken ||
			!toToken ||
			(!exchangeAmount && !receivedAmount) ||
			isFetching ||
			isLoading ||
			isApproveLoading ||
			!validateSwap()
		);
	};

	const handleSwapExecution = async () => {
		if (!isTokenAllowed) {
			await approveToken();
		} else {
			await executeSwap();
		}
	};

	const dynamicExchangeFontClass = useMemo(() => {
		const textLength = exchangeAmount.length;

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
	}, [exchangeAmount]);

	const dynamicReceiveFontClass = useMemo(() => {
		const textLength = receivedAmount.length;

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
	}, [receivedAmount]);

	return (
		<div className="bg-card border border-border rounded-2xl shadow-lg">
			{/* Network Header */}
			<div className="flex items-center justify-between p-3 border-b border-border">
				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => {
							resetAmounts();
							resetSwapState();
						}}
						className="h-8 w-8 hover:bg-muted"
					>
						<RefreshCw className="h-4 w-4" />
					</Button>

					<Popover
						open={isSettingsOpen}
						onOpenChange={setIsSettingsOpen}
					>
						<PopoverTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 hover:bg-muted/50"
							>
								<Settings className="h-4 w-4" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-80" align="end">
							<div className="space-y-4">
								<div>
									<Label className="text-[11px] md:text-xs font-medium">
										{t("slippageTolerance")}
									</Label>
									<div className="flex gap-2 mt-2">
										{slippagePresets.map((preset) => (
											<Button
												key={preset}
												variant={
													slippage === preset
														? "default"
														: "outline"
												}
												size="sm"
												onClick={() =>
													setSlippage(preset)
												}
											>
												{preset}%
											</Button>
										))}
									</div>
									<div className="flex gap-2 mt-2">
										<Input
											type="number"
											placeholder={t("custom")}
											value={customSlippage}
											onChange={(e) =>
												setCustomSlippage(
													e.target.value
												)
											}
											className="flex-1"
										/>
										<Button
											size="sm"
											onClick={() =>
												setSlippage(customSlippage)
											}
										>
											{t("set")}
										</Button>
									</div>
								</div>
								<div className="text-sm text-muted-foreground">
									{t("currentSlippage")}: {slippage}%
								</div>
							</div>
						</PopoverContent>
					</Popover>
				</div>
				<NetworkSelector />
			</div>

			{/* Transaction Success State */}
			{transactionSuccess && txHash ? (
				<div className="p-6 text-center space-y-3">
					<div className="text-green-500 text-4xl">✓</div>
					<div>
						<h3 className="text-lg font-semibold">
							{t("swapSuccessful")}
						</h3>
						<p className="text-sm text-muted-foreground mt-1">
							{t("transactionConfirmed")}
						</p>
					</div>
					<div className="space-y-2">
						{/* <div className="flex items-center justify-center gap-2 text-sm">
								<span>
									{formatAmount(
										completedExchangeAmount ||
											exchangeAmount
									)}{" "}
									{fromToken?.symbol}
								</span>
								<ArrowDownUp className="h-4 w-4" />
								<span>
									{formatAmount(
										completedReceivedAmount ||
											receivedAmount
									)}{" "}
									{toToken?.symbol}
								</span>
							</div> */}
						<Badge variant="outline">
							{t("hash")}:
							{getTransactionUrl(txHash) && (
								<a
									href={getTransactionUrl(txHash) || "#"}
									target="_blank"
									rel="noopener noreferrer"
									className="underline text-blue-600 hover:text-blue-800"
								>
									{txHash.slice(0, 6)}...{txHash.slice(-4)}
								</a>
							)}
						</Badge>
					</div>
					<Button onClick={resetSwapState} className="w-full">
						{t("newSwap")}
					</Button>
				</div>
			) : (
				<div className="p-4 space-y-1">
					{/* You Pay Card */}
					<div className="bg-input/30 border border-border rounded-xl p-3 space-y-2.5">
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">
								{t("youPay")}
							</span>
							{fromToken && (
								<div className="text-xs text-muted-foreground flex items-center gap-1">
									<span>
										{formatAmount(fromToken.balance)}{" "}
										{fromToken.symbol}
									</span>
									<span className="text-primary cursor-pointer hover:underline">
										{t("max")}
									</span>
									{isLowBalance && (
										<Badge
											variant="destructive"
											className="text-xs"
										>
											{t("low")}
										</Badge>
									)}
								</div>
							)}
						</div>

						<div className="flex items-center justify-between gap-3">
							<input
								type="text"
								inputMode="decimal"
								placeholder={t("amountPlaceholder")}
								value={exchangeAmount}
								onChange={(e) =>
									handleExchangeAmountChange(e.target.value)
								}
								className={cn(
									"bg-transparent  font-semibold text-foreground placeholder:text-muted-foreground/50 border-none outline-none flex-1 min-w-0",
									dynamicExchangeFontClass
								)}
								disabled={!fromToken}
							/>
							<Button
								variant="ghost"
								onClick={() => setFromTokenModalOpen(true)}
								className="h-auto px-2.5 gap-2 bg-muted/30 hover:bg-muted/50 rounded-full"
							>
								{fromToken ? (
									<>
										<div className="w-5 h-5 rounded-full overflow-hidden">
											<Image
												src={fromToken.icon}
												alt={fromToken.symbol}
												width={20}
												height={20}
												className="w-5 h-5 rounded-full object-cover"
											/>
										</div>
										<span className="font-medium flex items-center gap-2 text-sm">
											{fromToken.symbol}
											{!isTokenAllowed && (
												<FontAwesomeIcon
													icon={faLock}
													className="text-yellow-500 font-semibold"
												/>
											)}
										</span>
										<ChevronDown className="h-3 w-3" />
									</>
								) : (
									<>
										<span className="text-[11px] md:text-xs font-medium">
											{t("selectToken")}
										</span>
										<ChevronDown className="h-3 w-3" />
									</>
								)}
							</Button>
						</div>

						{fromToken && exchangeAmount && (
							<div className="text-xs text-muted-foreground">
								{formatUSD(exchangeAmount, fromTokenUsdPrice)}
							</div>
						)}
					</div>

					{/* Swap Button with Cutout Effect */}
					<div className="flex justify-center relative -my-4 z-10">
						<div className="bg-card border-border p-1 rounded-lg">
							<Button
								variant="ghost"
								size="icon"
								onClick={switchTokens}
								className="rounded-lg bg-card/20 hover:bg-muted/40 w-8 h-8 border border-border/20"
								disabled={!fromToken || !toToken}
							>
								<ArrowDownUp className="h-4 w-4" />
							</Button>
						</div>
					</div>

					{/* You Receive Card */}
					<div className="bg-input/30 border border-border rounded-xl p-3 space-y-2.5">
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">
								{t("youReceive")}
							</span>
							{toToken && (
								<div className="text-xs text-muted-foreground">
									{formatAmount(toToken.balance)}{" "}
									{toToken.symbol}
								</div>
							)}
						</div>

						<div className="flex items-center justify-between gap-3">
							<input
								type="text"
								inputMode="decimal"
								placeholder={t("amountPlaceholder")}
								value={receivedAmount}
								onChange={(e) =>
									handleReceivedAmountChange(e.target.value)
								}
								className={cn(
									"bg-transparent  font-semibold text-foreground placeholder:text-muted-foreground/50 border-none outline-none flex-1 min-w-0",
									dynamicReceiveFontClass
								)}
								disabled={!toToken}
							/>
							<Button
								variant="ghost"
								onClick={() => setToTokenModalOpen(true)}
								className="h-auto px-3 gap-2 bg-muted/30 hover:bg-muted/50 rounded-full"
							>
								{toToken ? (
									<>
										<div className="w-5 h-5 rounded-full overflow-hidden">
											<Image
												src={toToken.icon}
												alt={toToken.symbol}
												width={20}
												height={20}
												className="w-5 h-5 rounded-full object-cover"
											/>
										</div>
										<span className="font-medium flex items-center gap-2 text-sm">
											{toToken.symbol}
											{!isTokenAllowed && (
												<FontAwesomeIcon
													icon={faLock}
													className="text-yellow-500 font-semibold"
												/>
											)}
										</span>
										<ChevronDown className="h-3 w-3" />
									</>
								) : (
									<>
										<span className="text-[11px] md:text-xs font-medium">
											{t("selectToken")}
										</span>
										<ChevronDown className="h-3 w-3" />
									</>
								)}
							</Button>
						</div>

						{toToken && receivedAmount && (
							<div className="text-xs text-muted-foreground">
								{formatUSD(receivedAmount, toTokenUsdPrice)}
							</div>
						)}
					</div>

					{/* Quote Loading */}
					{isFetching && (
						<div className="flex items-center justify-center gap-2 py-4">
							<Loader2 className="h-4 w-4 animate-spin" />
							<span className="text-sm text-muted-foreground">
								{t("gettingBestQuote")}
							</span>
						</div>
					)}

					{/* Conversion Details */}
					{conversion && !isFetching && fromToken && toToken && (
						<div className="mt-4">
							<Collapsible
								open={showTransactionDetails}
								onOpenChange={setShowTransactionDetails}
							>
								<div className="bg-muted/10 rounded-lg border border-border/30">
									<CollapsibleTrigger asChild>
										<div className="p-3 cursor-pointer hover:bg-card/20 transition-colors rounded-lg">
											<div className="flex items-center justify-between">
												<div className="space-y-1">
													<div className="flex items-center gap-2">
														<TrendingUp className="h-4 w-4 text-primary" />
														<span className="text-[11px] md:text-xs font-medium">
															1 {fromToken.symbol}{" "}
															={" "}
															{getExchangeRate().toFixed(
																6
															)}{" "}
															{toToken.symbol}
														</span>
													</div>
													<div className="flex items-center gap-2 text-xs text-muted-foreground">
														<Zap className="h-3 w-3" />
														<span>
															{t("gas")}:{" "}
															{parseFloat(
																estimatedGas
															) < 0.01
																? "< $0.01"
																: `$${parseFloat(
																		estimatedGas
																  ).toFixed(
																		2
																  )}`}
														</span>
													</div>
												</div>
												<ChevronDown className="h-4 w-4 transition-transform duration-200" />
											</div>
										</div>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<div className="px-3 pb-3">
											<Separator className="mb-3" />
											<div className="space-y-2 text-sm">
												<div className="flex justify-between">
													<span className="text-muted-foreground">
														{t("minimumReceived")}
													</span>
													<span>
														{formatAmount(
															receivedAmount
														)}{" "}
														{toToken.symbol}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-muted-foreground">
														{t(
															"slippageToleranceLabel"
														)}
													</span>
													<span>{slippage}%</span>
												</div>
												<div className="flex justify-between">
													<span className="text-muted-foreground">
														{t("gasFee")}
													</span>
													<span>
														{parseFloat(
															estimatedGas
														) < 0.01
															? "< $0.01"
															: `$${parseFloat(
																	estimatedGas
															  ).toFixed(2)}`}
													</span>
												</div>
											</div>
										</div>
									</CollapsibleContent>
								</div>
							</Collapsible>
						</div>
					)}

					{/* Warnings */}
					{isLowBalance && showToolTip && (
						<Alert className="border-destructive/20 bg-destructive/10 mt-4">
							<AlertTriangle className="h-4 w-4" />
							<AlertDescription className="text-sm">
								{toolTipMessage}
							</AlertDescription>
						</Alert>
					)}

					{/* Price Impact Warning */}
					{conversion && fromToken && toToken && (
						<div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
							<Info className="h-3 w-3" />
							<span>{t("priceWarning")}</span>
						</div>
					)}

					{/* Wallet Address Copy Section */}
					{!isLobbyPage && isEmbeddedWallet && walletAddress && (
						<div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border mt-4">
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

					{/* Main Action Button */}
					<div className="pt-4">
						{!fromToken || !toToken ? (
							<Button
								onClick={() => {
									if (!fromToken) {
										setFromTokenModalOpen(true);
									} else {
										setToTokenModalOpen(true);
									}
								}}
								size="lg"
								className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90"
								variant="default"
							>
								{t("selectToken")}
							</Button>
						) : (
							<Button
								onClick={handleSwapExecution}
								disabled={isSwapDisabled()}
								size="lg"
								className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 disabled:opacity-50"
							>
								{isLoading || isApproveLoading ? (
									<Loader2 className="h-4 w-4 animate-spin mr-2" />
								) : null}
								{getSwapButtonText()}
							</Button>
						)}
					</div>
				</div>
			)}

			{/* Token Selection Modals */}
			<TokenListModal
				isOpen={fromTokenModalOpen}
				onClose={() => setFromTokenModalOpen(false)}
				// isTokenAllowed={isTokenAllowed}
				showAllTokens
				onSelectToken={(token) => {
					setFromToken(token as Token);
					setFromTokenModalOpen(false);
				}}
			/>

			<TokenListModal
				isOpen={toTokenModalOpen}
				onClose={() => setToTokenModalOpen(false)}
				// isTokenAllowed={isTokenAllowed}
				showAllTokens
				onSelectToken={(token) => {
					setToToken(token as Token);
					setToTokenModalOpen(false);
				}}
			/>
		</div>
	);
};
