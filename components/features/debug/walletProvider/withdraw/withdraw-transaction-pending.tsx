"use client";

import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { useBlockExplorerUrl } from "@/hooks/walletProvider/useBlockExplorerUrl";

interface WithdrawTransactionPendingProps {
	transactionHash: string | null;
	timeLeft: number;
	isSuccessful: boolean;
	onNewWithdrawal: () => void;
	setShowingConfetti: (value: boolean) => void;
}

export const WithdrawTransactionPending = ({
	transactionHash,
	timeLeft,
	isSuccessful,
	onNewWithdrawal,
	setShowingConfetti,
}: WithdrawTransactionPendingProps) => {
	const { getTransactionUrl } = useBlockExplorerUrl();

	// This useEffect faithfully triggers the confetti effect on success.
	useEffect(() => {
		if (isSuccessful) {
			setShowingConfetti(true);
			const defaults = {
				spread: 360,
				ticks: 70,
				gravity: 0,
				decay: 0.94,
				startVelocity: 30,
			};
			confetti({
				...defaults,
				particleCount: 50,
				scalar: 1.2,
				shapes: ["star"],
			});
			setTimeout(
				() =>
					confetti({
						...defaults,
						particleCount: 70,
						scalar: 2,
						shapes: ["circle"],
					}),
				200
			);

			const confettiTimeout = setTimeout(
				() => setShowingConfetti(false),
				4000
			);
			return () => clearTimeout(confettiTimeout);
		}
	}, [isSuccessful, setShowingConfetti]);

	return (
		<div className="text-center space-y-4 py-8">
			{isSuccessful ? (
				<CheckCircle className="mx-auto h-12 w-12 text-green-500" />
			) : (
				<Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
			)}
			<h4 className="font-semibold text-lg">
				{isSuccessful
					? "Withdrawal Confirmed!"
					: "Transaction Submitted"}
			</h4>
			<p className="text-sm text-muted-foreground">
				{isSuccessful
					? "Your funds are on the way."
					: "Waiting for blockchain confirmation..."}
			</p>
			{!isSuccessful && transactionHash !== "manual_approval_pending" && (
				<p className="text-2xl font-semibold">{timeLeft}s</p>
			)}
			{transactionHash &&
				transactionHash !== "manual_approval_pending" &&
				getTransactionUrl(transactionHash) && (
					<a
						href={getTransactionUrl(transactionHash) || "#"}
						target="_blank"
						rel="noopener noreferrer"
						className="text-xs text-primary underline break-all block"
					>
						View on Explorer
					</a>
				)}
			{transactionHash === "manual_approval_pending" && (
				<p className="text-xs text-muted-foreground">
					This withdrawal requires manual approval.
				</p>
			)}
			<Button
				onClick={onNewWithdrawal}
				variant="link"
				size="sm"
				className="mt-4"
			>
				{isSuccessful
					? "Make Another Withdrawal"
					: "Start a New Withdrawal"}
			</Button>
		</div>
	);
};
