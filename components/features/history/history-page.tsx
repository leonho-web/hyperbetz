"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "@/lib/locale-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionHistorySection } from "../profile/transaction-history-section";
import BetHistorySection from "../profile/bet-history/bet-history-section";
import { Wallet, Trophy } from "lucide-react";

export function HistoryPage() {
	const t = useTranslations("profile"); // Assumes translations are still in 'profile' namespace

	// This logic is moved from the old ProfilePage to manage the tabs here
	const getInitialSection = () => {
		if (typeof window !== "undefined") {
			const urlParams = new URLSearchParams(window.location.search);
			const sectionParam = urlParams.get("section");
			if (sectionParam === "bet") return "bets";
			if (sectionParam === "transaction") return "transactions";
			return "transactions"; // default
		}
		return "transactions";
	};

	const [activeTab, setActiveTab] = useState(getInitialSection);

	const updateUrlSection = (tabValue: string) => {
		if (typeof window !== "undefined") {
			const currentUrl = new URL(window.location.href);
			const sectionParam = tabValue === "bets" ? "bet" : "transaction";
			currentUrl.searchParams.set("section", sectionParam);
			window.history.pushState(
				{ section: sectionParam },
				"",
				currentUrl.toString()
			);
		}
	};

	const handleTabChange = (value: string) => {
		setActiveTab(value);
		updateUrlSection(value);
	};

	useEffect(() => {
		const handlePopState = () => {
			const newSection = getInitialSection();
			setActiveTab(newSection);
		};
		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, []);

	useEffect(() => {
		const initialSection = getInitialSection();
		setActiveTab(initialSection);
	}, []);

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-semibold">{t("history.title")}</h1>
			<Tabs
				value={activeTab}
				onValueChange={handleTabChange}
				className="w-full"
			>
				{/* Enhanced TabsList */}
				<div className="relative mb-8">
					<TabsList className="relative flex items-center justify-between gap-2 w-full grid-cols-2 h-14 p-1 bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 border border-border/50 rounded-xl shadow-sm backdrop-blur-sm overflow-hidden">
						<TabsTrigger
							value="transactions"
							className="group relative flex items-center justify-center gap-3 h-12 px-6 rounded-lg font-medium text-sm transition-all duration-300 hover:scale-[1.02] data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-accent/50 overflow-hidden"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300" />
							<div className="relative z-10 p-1.5 rounded-md bg-white/10 group-data-[state=active]:bg-white/20 group-data-[state=inactive]:bg-muted/20 transition-all duration-300">
								<Wallet className="h-4 w-4 transition-transform duration-300 group-data-[state=active]:scale-110" />
							</div>
							<span className="relative z-10 font-semibold text-wrap text-left tracking-wide">
								{t("transactionHistory")}
							</span>
							<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000 ease-out" />
						</TabsTrigger>
						<TabsTrigger
							value="bets"
							className="group relative flex items-center justify-center gap-3 h-12 px-6 rounded-lg font-medium text-sm transition-all duration-300 hover:scale-[1.02] data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-accent/50 overflow-hidden"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300" />
							<div className="relative z-10 p-1.5 rounded-md bg-white/10 group-data-[state=active]:bg-white/20 group-data-[state=inactive]:bg-muted/20 transition-all duration-300">
								<Trophy className="h-4 w-4 transition-transform duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:rotate-12" />
							</div>
							<span className="relative z-10 text-wrap font-semibold tracking-wide">
								{t("betHistory.title")}
							</span>
							<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000 ease-out" />
						</TabsTrigger>
					</TabsList>
				</div>
				<div className="relative">
					<TabsContent
						value="transactions"
						className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-2 duration-300"
					>
						<div className="rounded-xl border bg-gradient-to-br from-card via-card to-muted/20 shadow-sm">
							<TransactionHistorySection />
						</div>
					</TabsContent>
					<TabsContent
						value="bets"
						className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-2 duration-300"
					>
						<div className="rounded-xl border bg-gradient-to-br from-card via-card to-muted/20 shadow-sm">
							<BetHistorySection />
						</div>
					</TabsContent>
				</div>
			</Tabs>
		</div>
	);
}
