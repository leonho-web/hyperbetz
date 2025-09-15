"use client";

import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import { useAppStore } from "@/store/store";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";

interface TransactionPendingProps {
	transactionHash: string | null;
	timeLeft: number;
	onNewDeposit: () => void;
}

export const TransactionPending = ({
	transactionHash,
	timeLeft,
	onNewDeposit,
}: TransactionPendingProps) => {
	// We can get the real-time status directly from the transaction slice
	const tx = useAppStore((state) =>
		state.blockchain.transaction.transactions.find(
			(t) => t.hash === transactionHash
		)
	);

	const [blockExplorerUrl, setBlockExplorerUrl] = useState<string | null>(
		null
	);

	const { primaryWallet } = useDynamicContext();
	const isConfirmed = tx?.status === "confirmed";

	useEffect(() => {
		primaryWallet?.connector
			.getBlockExplorerUrlsForCurrentNetwork()
			.then((urls) => {
				if (urls && urls.length > 0) {
					setBlockExplorerUrl(urls[0]);
				}
			});
	}, [primaryWallet]);

	console.log("Block Explorer URL:", blockExplorerUrl);

	return (
		<div className="text-center space-y-4">
			{isConfirmed ? (
				<CheckCircle className="mx-auto h-12 w-12 text-green-500" />
			) : (
				<Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
			)}

			<h4 className="font-semibold text-lg">
				{isConfirmed ? "Deposit Confirmed!" : "Transaction Submitted"}
			</h4>
			<p className="text-sm text-muted-foreground">
				{isConfirmed
					? "Your balance has been updated."
					: "Waiting for blockchain confirmation. This can take a few minutes."}
			</p>

			{/* Countdown timer is only shown while pending */}
			{!isConfirmed && <p className="text-2xl font-bold">{timeLeft}s</p>}

			{transactionHash && (
				<a
					href={`${blockExplorerUrl}/tx/${transactionHash}`} // This should be dynamic based on network
					target="_blank"
					rel="noopener noreferrer"
					className="text-xs text-primary underline break-all block"
				>
					View on Explorer
				</a>
			)}

			<Button
				onClick={onNewDeposit}
				variant="link"
				size="sm"
				className="mt-4"
			>
				{isConfirmed ? "Make Another Deposit" : "Start a new deposit"}
			</Button>
		</div>
	);
};
