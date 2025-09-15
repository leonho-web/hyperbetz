"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Token } from "@/types/blockchain/swap.types";

interface TokenSelectorProps {
	tokens: Token[];
	isLoading: boolean;
	selectedToken: Token | null;
	onSelectToken: (token: Token) => void;
}

export const TokenSelector = ({
	tokens,
	isLoading,
	selectedToken,
	onSelectToken,
}: TokenSelectorProps) => {
	return (
		<div className="space-y-2">
			<p className="font-semibold text-sm">1. Select a Token</p>
			{isLoading ? (
				<div className="flex gap-2">
					<Skeleton className="h-9 w-20 rounded-md" />
					<Skeleton className="h-9 w-20 rounded-md" />
					<Skeleton className="h-9 w-20 rounded-md" />
				</div>
			) : (
				<div className="flex flex-wrap gap-2">
					{tokens.map((token) => (
						<Button
							key={token.address}
							variant={
								selectedToken?.address === token.address
									? "default"
									: "outline"
							}
							onClick={() => onSelectToken(token)}
						>
							{token.symbol}
						</Button>
					))}
				</div>
			)}
		</div>
	);
};
