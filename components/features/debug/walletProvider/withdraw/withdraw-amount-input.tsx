"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WithdrawAmountInputProps {
	amount: string;
	onAmountChange: (value: string) => void;
	onSetMax: () => void;
	maxAmount: number;
	tokenSymbol?: string;
	isInsufficient: boolean;
	isBelowMinimum: boolean;
	minAmount: number;
}

export const WithdrawAmountInput = ({
	amount,
	onAmountChange,
	onSetMax,
	maxAmount,
	tokenSymbol,
	isInsufficient,
	isBelowMinimum,
	minAmount,
}: WithdrawAmountInputProps) => {
	return (
		<div className="space-y-2">
			<label className="text-sm font-medium">Amount</label>
			<div className="relative">
				<Input
					type="number"
					placeholder="0.00"
					value={amount}
					onChange={(e) => onAmountChange(e.target.value)}
					className={`pr-20 text-lg ${
						isInsufficient || isBelowMinimum
							? "border-destructive focus-visible:ring-destructive"
							: ""
					}`}
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
					Balance: {maxAmount.toFixed(4)} {tokenSymbol}
				</span>
				{isInsufficient && (
					<span className="text-destructive">
						Insufficient balance
					</span>
				)}
				{isBelowMinimum && (
					<span className="text-destructive">
						Minimum is {minAmount}
					</span>
				)}
			</div>
		</div>
	);
};
