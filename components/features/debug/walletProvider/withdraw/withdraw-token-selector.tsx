"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { WithdrawToken } from "@/types/walletProvider/transaction-service.types";

interface WithdrawTokenSelectorProps {
	tokens: WithdrawToken[];
	isLoading: boolean;
	selectedToken: WithdrawToken | null;
	onSelectToken: (token: WithdrawToken) => void;
}

export const WithdrawTokenSelector = ({
	tokens,
	isLoading,
	selectedToken,
	onSelectToken,
}: WithdrawTokenSelectorProps) => {
	if (isLoading) {
		return <Skeleton className="h-10 w-full rounded-md" />;
	}

	const handleValueChange = (tokenSymbol: string) => {
		const token = tokens.find((t) => t.token_symbol === tokenSymbol);
		if (token) {
			onSelectToken(token);
		}
	};
	// console.log("Selected Token:", selectedToken);
	return (
		<div className="space-y-2">
			<label className="text-sm font-medium">Select Token</label>
			<Select
				value={selectedToken?.token_symbol}
				onValueChange={handleValueChange}
			>
				<SelectTrigger>
					<SelectValue placeholder="Select a token...">
						{selectedToken && (
							<div className="flex items-center gap-2">
								<Image
									src={selectedToken.token_icon}
									alt={selectedToken.token_name}
									width={20}
									height={20}
								/>
								<span>{selectedToken.token_symbol}</span>
							</div>
						)}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{tokens.map((token) => (
						<SelectItem
							key={token.token_address}
							value={token.token_symbol}
						>
							<div className="flex items-center gap-2">
								<Image
									src={token.token_icon}
									alt={token.token_name}
									width={20}
									height={20}
								/>
								<span>
									{token.token_name} ({token.token_symbol})
								</span>
							</div>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};
