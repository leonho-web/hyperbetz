"use client";

import { useDynamicAuth } from "@/hooks/useDynamicAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, User, History, Receipt } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useTranslations } from "@/lib/locale-provider";
import { ProfileInfoCardSkeleton } from "./profile-info-card-skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faMoneyBills,
	faMoneyFromBracket,
} from "@fortawesome/pro-light-svg-icons";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function ProfileInfoCard({ onNavigate }: { onNavigate?: () => void }) {
	const { user, accountStatus } = useDynamicAuth();
	const [copiedAddress, setCopiedAddress] = useState(false);
	const t = useTranslations("profile");
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Track a pending navigation target so we can invoke onNavigate only after it resolves
	const [pendingTarget, setPendingTarget] = useState<string | null>(null);
	const hasCalledCallbackRef = useRef(false);

	// Do not return early before hooks (to keep hook order stable). Render skeleton conditionally below.

	const handleCopyAddress = async () => {
		if (user?.walletAddress) {
			try {
				await navigator.clipboard.writeText(user.walletAddress);
				setCopiedAddress(true);
				toast.success(t("copySuccess"));
				setTimeout(() => setCopiedAddress(false), 2000);
			} catch {
				toast.error(t("copyFailed"));
			}
		}
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((word) => word.charAt(0))
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const handleRouteChange = (url: string) => {
		// Reset callback guard for each new navigation intent
		hasCalledCallbackRef.current = false;
		setPendingTarget(url);
		router.push(url);
	};

	// Effect: when the actual router location matches the pending target (path + query), fire onNavigate once
	useEffect(() => {
		if (!pendingTarget || !onNavigate || hasCalledCallbackRef.current)
			return;
		const [targetPath, targetQuery = ""] = pendingTarget.split("?");
		const currentQuery = searchParams.toString();
		const queriesMatch = targetQuery === "" || targetQuery === currentQuery;
		if (pathname === targetPath && queriesMatch) {
			onNavigate();
			hasCalledCallbackRef.current = true;
			setPendingTarget(null); // cleanup
		}
	}, [pathname, searchParams, pendingTarget, onNavigate]);

	return !user ? (
		<ProfileInfoCardSkeleton />
	) : (
		<div className="bg-card/95 backdrop-blur-sm rounded-lg border border-border p-6 space-y-6 shadow-lg hover:shadow-xl transition-all duration-300">
			{/* User Header */}
			<div className="flex items-center gap-4">
				<div className="relative">
					<Avatar className="h-14 w-14 border-2 border-primary/20 ring-2 ring-primary/10">
						<AvatarImage src={user.avatar} alt={user.username} />
						<AvatarFallback className="text-base font-semibold bg-primary/10 text-primary">
							{getInitials(user.nickname)}
						</AvatarFallback>
					</Avatar>
					<div className="absolute -bottom-1 -right-1 h-4 w-4 bg-primary rounded-full border-2 border-background" />
				</div>
				<div className="flex-1 min-w-0">
					<h2 className="text-lg font-semibold text-foreground truncate">
						{user.nickname}
					</h2>
					<Badge
						variant="secondary"
						className="mt-1 bg-primary/15 text-primary border-primary/25"
					>
						{accountStatus === "authenticated"
							? user.status
							: t("settingUp")}
					</Badge>
				</div>
				<div className="text-right">
					<p className="text-xs text-muted-foreground uppercase tracking-wide">
						{t("currentBalance")}
					</p>
					<p className="text-2xl font-semibold text-primary">
						${user.balance?.toFixed(2) || "0.00"}
					</p>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="bg-muted/30 border border-border rounded-lg p-4">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-primary/10 rounded-lg">
							<FontAwesomeIcon icon={faMoneyFromBracket} />
						</div>
						<div className="flex-1">
							<p className="text-xs text-muted-foreground uppercase tracking-wide">
								{t("totalDeposits")}
							</p>
							<p className="text-lg font-semibold text-foreground">
								{user.depositTotal || "0"}
							</p>
						</div>
					</div>
				</div>
				<div className="bg-muted/30 border border-border rounded-lg p-4">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-primary/10 rounded-lg">
							<FontAwesomeIcon icon={faMoneyBills} />
						</div>
						<div className="flex-1">
							<p className="text-xs text-muted-foreground uppercase tracking-wide">
								{t("totalWithdrawals")}
							</p>
							<p className="text-lg font-semibold text-foreground">
								{user.withdrawTotal || "0"}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="grid md:grid-cols-2 gap-3">
				<Button
					variant="outline"
					size="sm"
					onClick={() => handleRouteChange("/history?section=bet")}
					className="w-full h-10 border-border bg-background/50 hover:bg-accent hover:text-accent-foreground"
				>
					<History className="h-4 w-4 mr-2" />
					{t("betHistory.title")}
				</Button>

				<Button
					variant="outline"
					size="sm"
					onClick={() =>
						handleRouteChange("/history?section=transaction")
					}
					className="w-full h-10 border-border bg-background/50 hover:bg-accent hover:text-accent-foreground"
				>
					<Receipt className="h-4 w-4 mr-2" />
					{t("transactionHistory")}
				</Button>
			</div>

			{user.walletAddress && (
				<Button
					variant="outline"
					size="sm"
					onClick={handleCopyAddress}
					className="h-12 text-muted-foreground hover:text-foreground hover:bg-muted px-3 w-full"
				>
					<Copy
						className={`h-3 w-3 mr-2 ${
							copiedAddress ? "text-primary" : ""
						}`}
					/>
					<span
						className={`font-mono text-sm ${
							copiedAddress ? "text-primary" : ""
						}`}
					>
						{user.walletAddress.slice(0, 8)}...
						{user.walletAddress.slice(-8)}
					</span>
				</Button>
			)}

			{/* Secondary Actions */}
			<div className="flex gap-3 pt-4 border-t border-border">
				<Button
					variant="outline"
					size="sm"
					onClick={() => handleRouteChange("/profile")}
					className="w-full h-12 text-muted-foreground hover:text-foreground hover:bg-muted"
				>
					<User className="h-3 w-3 mr-2" />
					{t("profileBtn")}
				</Button>
			</div>
		</div>
	);
}
