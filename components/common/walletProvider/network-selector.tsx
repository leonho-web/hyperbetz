"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/store";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { EvmNetwork, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { toast } from "sonner";
// import { Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/locale-provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faSpinner } from "@fortawesome/pro-light-svg-icons";

// Helper type to safely access evmNetworks from the generic connector
interface EvmWalletConnector {
	evmNetworks?: EvmNetwork[];
	[key: string]: unknown;
}

interface NetworkSelectorProps {
	className?: string;
	/** A callback that reports the network switching status to the parent. */
	onSwitchingChange?: (isSwitching: boolean) => void;
}

export const NetworkSelector = ({
	className,
	onSwitchingChange,
}: NetworkSelectorProps) => {
	const t = useTranslations("walletProvider.networkSelector");
	// --- 1. Get Global State and Context ---
	const { chainId, chainLogo, setChainLogo } = useAppStore(
		(state) => state.blockchain.network
	);
	const { primaryWallet } = useDynamicContext();

	// --- 2. Manage Local UI State for the Switching Process ---
	const [isSwitching, setIsSwitching] = useState(false);
	const [switchSuccess, setSwitchSuccess] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [switchingOnChain, setSwitchingOnChain] = useState<number | null>(
		null
	);
	const [currentNetwork, setCurrentNetwork] = useState<EvmNetwork | null>(
		null
	);

	// Find the currently selected network object - moved before early return
	useEffect(() => {
		if (primaryWallet?.connector) {
			const connector =
				primaryWallet.connector as unknown as EvmWalletConnector;
			const currentNet = connector.evmNetworks?.find(
				(net: EvmNetwork) => net.chainId === chainId
			);
			setCurrentNetwork(currentNet || null);
		}
	}, [chainId, primaryWallet?.connector]);

	// --- THE CRITICAL FIX: The `useEffect` to report status changes ---
	useEffect(() => {
		// Whenever our internal `isSwitching` state changes, we call the prop
		// to inform the parent component.
		onSwitchingChange?.(isSwitching);
	}, [isSwitching, onSwitchingChange]);

	const handleNetworkChange = async (newChainIdStr: string) => {
		if (!primaryWallet) {
			toast.error(t("walletNotConnected"));
			return;
		}
		const newChainId = parseInt(newChainIdStr);
		// Prevent action if already on the selected network
		if (chainId === newChainId) return;

		// get data for new chain and instantly update it
		const newNetwork = supportedNetworks.find(
			(net) => net.chainId === newChainId
		);

		setCurrentNetwork(newNetwork || null);
		setChainLogo(newNetwork?.iconUrls?.[0] || "");

		setIsSwitching(true);
		setSwitchSuccess(false);
		setSwitchingOnChain(newChainId);

		try {
			await primaryWallet.connector.switchNetwork({
				networkChainId: newChainId,
			});

			// If switchNetwork resolves without error, the switch was successful.
			setSwitchSuccess(true);
			setIsSwitching(false);
		} catch (error) {
			console.error("Failed to switch network:", error);
			toast.error(t("failedToSwitch"));
		} finally {
			// Reset state after a delay, regardless of outcome.
			setTimeout(() => {
				// setIsSwitching(false);
				setSwitchSuccess(false);
			}, 1000);
		}
	};

	if (!primaryWallet?.connector) {
		return null;
	}
	const connector = primaryWallet.connector as unknown as EvmWalletConnector;
	const supportedNetworks = connector.evmNetworks || [];

	return (
		<Select
			value={String(chainId)}
			onValueChange={handleNetworkChange}
			open={isSwitching || isDropdownOpen}
			onOpenChange={setIsDropdownOpen}
			disabled={isSwitching} // Disable the trigger while a switch is in progress
		>
			<SelectTrigger className={cn("w-[180px]", className)}>
				<SelectValue placeholder={t("placeholder")}>
					<div className="flex items-center gap-2">
						{chainLogo && (
							<img
								src={chainLogo}
								alt={t("altLogo")}
								width={20}
								height={20}
							/>
						)}
						<span className="flex-grow truncate">
							{currentNetwork?.vanityName ||
								currentNetwork?.name ||
								t("switching")}
						</span>
						{/* --- 3. The Visual Feedback --- */}
						{switchSuccess && (
							// <CheckCircle className="h-4 w-4 text-green-500" />
							<FontAwesomeIcon
								icon={faCircleCheck}
								fontSize={16}
								className="text-green-500"
							/>
						)}
					</div>
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{supportedNetworks.map((net) => (
					<SelectItem
						key={net.chainId}
						value={String(net.chainId)}
						disabled={isSwitching}
						className="!w-full !block"
					>
						<div className="flex items-center w-full gap-2">
							{net.iconUrls?.[0] && (
								<img
									src={net.iconUrls[0]}
									alt={net.name}
									width={20}
									height={20}
								/>
							)}
							<p>{net.vanityName || net.name}</p>
						</div>
						{isSwitching &&
							!switchSuccess &&
							net.chainId === switchingOnChain && (
								// <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
								<FontAwesomeIcon
									icon={faSpinner}
									fontSize={16}
									className="animate-spin text-muted-foreground"
								/>
							)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
