"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface DepositFeedbackProps {
	tooltipMessage: string;
	showTooltip: boolean;
	minRequiredAmount: number;
	selectedTokenSymbol?: string;
}

export const DepositFeedback = ({
	tooltipMessage,
	showTooltip,
	minRequiredAmount,
	selectedTokenSymbol,
}: DepositFeedbackProps) => {
	return (
		<div className="space-y-2">
			{showTooltip && (
				<Alert variant="default" className="text-xs">
					<Info className="h-4 w-4" />
					<AlertDescription>{tooltipMessage}</AlertDescription>
				</Alert>
			)}
			{selectedTokenSymbol && (
				<p className="text-xs text-muted-foreground text-center">
					Minimum deposit: {minRequiredAmount.toFixed(4)}{" "}
					{selectedTokenSymbol}
				</p>
			)}
		</div>
	);
};
