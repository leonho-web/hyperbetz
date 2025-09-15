"use client";

import { Input } from "@/components/ui/input";

interface WithdrawAddressInputProps {
	address: string;
	onAddressChange: (value: string) => void;
	isAddressValid: boolean;
}

export const WithdrawAddressInput = ({
	address,
	onAddressChange,
	isAddressValid,
}: WithdrawAddressInputProps) => (
	<div className="space-y-2">
		<label className="text-sm font-medium">Destination Address</label>
		<Input
			type="text"
			placeholder="0x..."
			value={address}
			onChange={(e) => onAddressChange(e.target.value)}
			className={
				!isAddressValid
					? "border-destructive focus-visible:ring-destructive"
					: ""
			}
		/>
		{!isAddressValid && address && (
			<p className="text-xs text-destructive">
				Please enter a valid wallet address.
			</p>
		)}
	</div>
);
