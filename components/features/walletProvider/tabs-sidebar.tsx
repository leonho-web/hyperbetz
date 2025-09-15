"use client";

import { Button } from "@/components/ui/button";
import { ArrowDownUp, ArrowLeftRight, CreditCard, Wallet } from "lucide-react";
import { TransactionModalTab } from "@/store/slices/ui/walletProvider/modal.slice";
import { useTranslations } from "@/lib/locale-provider";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

interface TabsSidebarProps {
	activeTab: TransactionModalTab;
	setActiveTab: (tab: TransactionModalTab) => void;
}

const TABS = [
	{ id: "walletInfo", label: "walletInfo", icon: Wallet },
	{ id: "deposit", label: "deposit", icon: CreditCard },
	{ id: "withdraw", label: "withdraw", icon: ArrowDownUp },
	{ id: "swap", label: "swap", icon: ArrowLeftRight },
] as const;

export const TabsSidebar = ({ activeTab, setActiveTab }: TabsSidebarProps) => {
	const t = useTranslations("walletProvider.tabsSidebar");
	const { primaryWallet } = useDynamicContext();
	return (
		<div className="p-3 space-y-2">
			{TABS.map((tab) => (
				<Button
					key={tab.id}
					variant={activeTab === tab.id ? "default2" : "ghost"}
					onClick={() => setActiveTab(tab.id as TransactionModalTab)}
					className="w-full justify-start gap-2 py-6 px-8"
				>
					<tab.icon className="h-4 w-4" />
					{tab.id === "walletInfo"
						? primaryWallet?.connector?.isEmbeddedWallet
							? t("emailWallet")
							: t("walletInfo")
						: t(tab.label)}
				</Button>
			))}
		</div>
	);
};
