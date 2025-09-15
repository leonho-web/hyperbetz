"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDeposit } from "@/hooks/walletProvider/deposit/useDeposit";
import { useTokens } from "@/hooks/walletProvider/useTokens";
import { AmountInput } from "./amount-input";
import { DepositFeedback } from "./deposti-feedback";
import { TokenSelector } from "./token-selector";
import { TransactionPending } from "./transactions-pending";

export const DepositPanel = () => {
	// --- CONNECT TO THE MASTER HOOK ---
	const {
		selectedToken,
		depositAmount,
		isPending,
		isBalanceInsufficient,
		formattedBalance,
		usdtConversionAmount,
		transactionHash,
		timeLeft,
		minRequiredAmount,
		tooltipMessage,
		showTooltip,
		selectToken,
		handleAmountChange,
		setMaxAmount,
		executeDeposit,
		resetPage,
		getButtonText,
		isDepositDisabled,
	} = useDeposit();

	const { tokens, isTokensLoading } = useTokens();

	// --- RENDER THE UI ---
	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle>Deposit</CardTitle>
				<CardDescription>
					Select a token and amount to deposit to your account.
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-6">
				{/* --- STATE 1: Transaction is Pending --- */}
				{isPending && transactionHash ? (
					<TransactionPending
						transactionHash={transactionHash}
						timeLeft={timeLeft}
						onNewDeposit={resetPage}
					/>
				) : (
					// --- STATE 2: Standard Deposit Form ---
					<>
						<TokenSelector
							tokens={tokens}
							isLoading={isTokensLoading}
							selectedToken={selectedToken}
							onSelectToken={selectToken}
						/>
						<AmountInput
							selectedToken={selectedToken}
							amount={depositAmount}
							onAmountChange={handleAmountChange}
							onSetMax={setMaxAmount}
							balance={formattedBalance}
							usdValue={usdtConversionAmount}
							isInsufficient={isBalanceInsufficient}
						/>
					</>
				)}
			</CardContent>

			<CardFooter className="flex flex-col gap-4">
				{/* The feedback component is only shown when a transaction is NOT pending */}
				{!isPending && (
					<DepositFeedback
						tooltipMessage={tooltipMessage}
						showTooltip={showTooltip}
						minRequiredAmount={minRequiredAmount}
						selectedTokenSymbol={selectedToken?.symbol}
					/>
				)}

				{/* The main action button is also hidden when a tx is pending */}
				{!isPending && (
					<Button
						onClick={executeDeposit}
						disabled={isDepositDisabled()}
						className="w-full"
					>
						{getButtonText()}
					</Button>
				)}
			</CardFooter>
		</Card>
	);
};
