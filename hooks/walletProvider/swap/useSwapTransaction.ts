/**
 * useSwapTransaction.ts
 * Manages the swap transaction execution and state
 */

import { useState, useCallback } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import TransactionService, {
	PrimaryWalletWithClient,
} from "@/services/walletProvider/TransactionService";
import { useDynamicAuth } from "@/hooks/useDynamicAuth";
import { useAppStore } from "@/store/store";
import { TransactionType } from "@/types/blockchain/transactions.types";
import {
	UseSwapTransactionParams,
	UseSwapTransactionReturn,
	SwapTransactionResult,
} from "@/types/walletProvider/swap-hooks.types";

export const useSwapTransaction = ({
	fromToken,
	toToken,
	exchangeAmount,
	receivedAmount,
	slippage,
	onTransactionComplete,
}: UseSwapTransactionParams): UseSwapTransactionReturn => {
	// --- STATE ---
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [checkSuccess, setCheckSuccess] = useState<boolean>(false);
	const [transactionSuccess, setTransactionSuccess] =
		useState<boolean>(false);
	const [successPop, setSuccessPop] = useState<boolean>(false);
	const [txHash, setTxHash] = useState<string>("");
	// Store transaction amounts before they get reset
	const [completedExchangeAmount, setCompletedExchangeAmount] =
		useState<string>("");
	const [completedReceivedAmount, setCompletedReceivedAmount] =
		useState<string>("");

	// --- DEPENDENCIES ---
	const { user, authToken } = useDynamicAuth();
	const { primaryWallet } = useDynamicContext();
	const network = useAppStore((state) => state.blockchain.network);
	const { addTransaction } = useAppStore(
		(state) => state.blockchain.transaction
	);
	const fetchTokens = useAppStore(
		(state) => state.blockchain.token.fetchTokens
	);

	/**
	 * Validate swap parameters
	 */
	const validateSwap = useCallback((): boolean => {
		if (!fromToken || !toToken) return false;
		if (!exchangeAmount || parseFloat(exchangeAmount) <= 0) return false;
		if (parseFloat(exchangeAmount) > parseFloat(fromToken.balance))
			return false;
		if (fromToken.address === toToken.address) return false;
		return true;
	}, [fromToken, toToken, exchangeAmount]);
	/**
	 * Execute the swap transaction
	 */
	const executeSwap =
		useCallback(async (): Promise<SwapTransactionResult> => {
			if (!validateSwap()) {
				return { success: false, error: "Invalid swap parameters" };
			}

			setIsLoading(true);
			setCheckSuccess(false);
			setTransactionSuccess(false);

			try {
				const userWalletAddress = primaryWallet?.address || "";

				if (!userWalletAddress) {
					throw new Error("Wallet address not found");
				}

				const swapParams = {
					network: network?.chainId?.toString() || "1",
					fromToken: fromToken!.address,
					toToken: toToken!.address,
					amount: exchangeAmount,
					walletAddress: userWalletAddress,
					slippage: slippage === "Auto" ? "1" : slippage,
					username: user?.username as string,
					primaryWallet: primaryWallet as PrimaryWalletWithClient,
				};

				const transactionService = TransactionService.getInstance();
				const result = await transactionService.executeSwap(swapParams);

				if (result.success && result.txHash) {
					// Store transaction amounts before they get reset
					setCompletedExchangeAmount(exchangeAmount);
					setCompletedReceivedAmount(receivedAmount);

					setTxHash(result.txHash);
					setCheckSuccess(true);
					setTransactionSuccess(true);
					setSuccessPop(true);

					// Add transaction notification (matching original format)
					const networkName = network?.network?.name;
					addTransaction({
						hash: result.txHash,
						type: TransactionType.SWAP,
						amount: exchangeAmount,
						tokenSymbol: fromToken!.symbol,
						network: networkName as string,
						// Optional swap-specific fields (as strings)
						fromToken: fromToken!.symbol,
						toToken: toToken!.symbol,
					});

					// Refresh token list after successful swap
					try {
						await fetchTokens(true, { user, authToken });
					} catch (error) {
						console.warn(
							"Failed to refresh tokens after swap:",
							error
						);
					}

					// Call completion callback
					if (onTransactionComplete) {
						onTransactionComplete();
					}
					return { success: true, txHash: result.txHash };
				} else {
					throw new Error(
						result.error?.message || "Swap transaction failed"
					);
				}
			} catch (error) {
				console.error("Swap execution failed:", error);
				setCheckSuccess(false);
				setTransactionSuccess(false);
				return { success: false, error: (error as Error).message };
			} finally {
				setIsLoading(false);
			}
		}, [
			validateSwap,
			fromToken,
			toToken,
			exchangeAmount,
			receivedAmount,
			slippage,
			primaryWallet,
			network,
			addTransaction,
			onTransactionComplete,
			user?.username,
			fetchTokens,
		]);

	/**
	 * Reset the swap state after a successful transaction
	 */
	const resetSwapState = useCallback(() => {
		setCheckSuccess(false);
		setTransactionSuccess(false);
		setSuccessPop(false);
		setTxHash("");
		setCompletedExchangeAmount("");
		setCompletedReceivedAmount("");
		setIsLoading(false);
	}, []);

	return {
		// State
		isLoading,
		checkSuccess,
		transactionSuccess,
		successPop,
		txHash,
		completedExchangeAmount,
		completedReceivedAmount,

		// Actions
		executeSwap,
		validateSwap,
		resetSwapState,
		setSuccessPop,
	};
};
