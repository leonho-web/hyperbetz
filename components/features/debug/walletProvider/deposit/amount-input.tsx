"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Token } from "@/types/blockchain/swap.types";

interface AmountInputProps {
	selectedToken: Token | null;
	amount: string;
	onAmountChange: (value: string) => void;
	onSetMax: () => void;
	balance: string;
	usdValue: number;
	isInsufficient: boolean;
}

export const AmountInput = ({
	selectedToken,
	amount,
	onAmountChange,
	onSetMax,
	balance,
	usdValue,
	isInsufficient,
}: AmountInputProps) => {
	if (!selectedToken) return null;

	return (
		<div className="space-y-2">
			<p className="font-semibold text-sm">2. Enter Amount</p>
			<div className="relative">
				<Input
					type="number"
					placeholder="0.00"
					value={amount}
					onChange={(e) => onAmountChange(e.target.value)}
					className="pr-20 text-lg"
				/>
				<Button
					variant="ghost"
					size="sm"
					onClick={onSetMax}
					className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
				>
					Max
				</Button>
			</div>
			<div className="flex justify-between text-xs text-muted-foreground">
				<span>
					Balance: {balance} {selectedToken.symbol}
				</span>
				<span>~ ${usdValue.toFixed(2)} USD</span>
			</div>
			{isInsufficient && (
				<p className="text-xs text-destructive">Insufficient balance</p>
			)}
		</div>
	);
};
