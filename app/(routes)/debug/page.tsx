// import { TokenStatusDisplay } from "@/components/features/debug/token-status-debugger";
// import { BlockchainControlPanel } from "@/components/features/debug/block-chain-control-panel";
// import { NetworkStatusDisplay } from "@/components/features/debug/network-slice-debugger";
"use client";

import { useState } from "react";
import { DepositPanel } from "@/components/features/debug/walletProvider/deposit/deposit-panel";
import { WithdrawPanel } from "@/components/features/debug/walletProvider/withdraw/withdraw-panel";
import { WithdrawalSuccessModal } from "@/components/features/walletProvider/withdraw/withdrawal-success-modal";
import { Button } from "@/components/ui/button";
// import { LiveChatSidebar } from "@/components/features/live-chat/live-chat-sidebar";
import { useT } from "@/hooks/useI18n";

export default function Page() {
	const t = useT();
	const [showTestModal, setShowTestModal] = useState(false);

	return (
		<div>
			<h1>{t("debug.title")}</h1>

			{/* Test Success Modal Button */}
			<div className="mb-6 p-4 border rounded-lg bg-yellow-50">
				<h2 className="font-bold mb-2">
					Test Withdrawal Success Modal
				</h2>
				<Button onClick={() => setShowTestModal(true)}>
					Open Success Modal (Test)
				</Button>
			</div>

			<div className="flex items-center justify-between w-full">
				<DepositPanel />
				<WithdrawPanel />
			</div>

			{/* Test Modal */}
			<WithdrawalSuccessModal
				isOpen={showTestModal}
				onClose={() => setShowTestModal(false)}
				withdrawAmount="0.058"
				tokenSymbol="USDT"
				transactionHash="0x1234567890abcdef1234567890abcdef12345678"
			/>

			{/* <TokenStatusDisplay /> */}
			{/* <NetworkStatusDisplay /> */}
			{/* <BlockchainControlPanel /> */}
		</div>
	);
}
