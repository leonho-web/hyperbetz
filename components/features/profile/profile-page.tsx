"use client";

import { useDynamicAuth } from "@/hooks/useDynamicAuth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Wallet, LogOut, Trophy, Activity } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "@/lib/locale-provider";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

export function ProfilePage() {
	const { user, isLoading, logout, accountStatus } = useDynamicAuth();
	const [copiedAddress, setCopiedAddress] = useState(false);
	const t = useTranslations("profile");

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

	if (isLoading) {
		// The loading skeleton can remain largely the same, but we remove the right column skeleton
		return (
			<div>
				<div className="space-y-6">
					<div className="h-8 w-32 bg-muted rounded-lg animate-pulse" />
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{/* We can repeat the card skeletons to fill the space */}
						<Card className="relative overflow-hidden border-0 shadow-lg">
							<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10" />
							<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-2xl" />
							<div className="absolute bottom-0 left-0 w-24 h-24  bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-xl" />

							<CardContent className="relative p-6">
								<div className="flex flex-col items-center gap-4">
									<div className="relative">
										<div className="h-20 w-20 bg-muted rounded-full animate-pulse" />
										<div className="absolute -bottom-1 -right-1 w-6 h-6 bg-muted rounded-full animate-pulse" />
									</div>
									<div className="text-center space-y-2">
										<div className="h-6 w-48 bg-muted rounded animate-pulse" />
										<div className="h-4 w-32 bg-muted rounded animate-pulse" />
										<div className="h-4 w-64 bg-muted rounded animate-pulse" />
									</div>
								</div>
								<div className="mt-4 p-3 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-xl border border-primary/10">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="h-8 w-8 bg-muted rounded-lg animate-pulse" />
											<div className="space-y-2">
												<div className="h-3 w-24 bg-muted rounded animate-pulse" />
												<div className="h-5 w-40 bg-muted rounded animate-pulse" />
											</div>
										</div>
										<div className="h-8 w-8 bg-muted rounded animate-pulse" />
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<div className="h-6 w-32 bg-muted rounded animate-pulse" />
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="h-20 bg-muted rounded-lg animate-pulse" />
								<div className="grid grid-cols-2 gap-4">
									<div className="h-16 bg-muted rounded-lg animate-pulse" />
									<div className="h-16 bg-muted rounded-lg animate-pulse" />
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<div className="h-6 w-32 bg-muted rounded animate-pulse" />
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="h-12 bg-muted rounded-lg animate-pulse" />
								<div className="h-12 bg-muted rounded-lg animate-pulse" />
								<div className="h-12 bg-muted rounded-lg animate-pulse" />
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="container mx-auto p-4 max-w-4xl">
				<div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
					<div className="text-center space-y-2">
						<h1 className="text-2xl font-semibold text-muted-foreground">
							{t("loggedOutTitle")}
						</h1>
						<p className="text-muted-foreground">
							{t("loggedOutSubtitle")}
						</p>
					</div>
					<div className="flex items-center">
						<Button
							variant="default"
							onClick={() => (window.location.href = "/")}
							className="bg-primary mr-2"
						>
							{t("goHome")}
						</Button>
						<DynamicWidget />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-semibold">{t("myProfile")}</h1>
					<Button
						onClick={logout}
						variant="outline"
						size="sm"
						className="gap-2"
					>
						<LogOut className="h-4 w-4" />
						{t("logout")}
					</Button>
				</div>

				{/* Changed grid layout to be responsive and fill the page */}
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
					{/* Profile Info Card */}
					<Card className="relative overflow-hidden border-0 shadow-lg md:col-span-2 xl:col-span-1">
						{/* ... (rest of the Profile Info Card JSX is identical) */}
						<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10" />
						<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-2xl" />
						<div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-xl" />
						<CardContent className="relative">
							<div className="flex items-start gap-6">
								<div className="relative">
									<div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-75"></div>
									<Avatar className="relative h-20 w-20 border-2">
										<AvatarImage
											src={user.avatar}
											alt={user.username}
										/>
										<AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-primary to-secondary text-foreground">
											{getInitials(user.nickname)}
										</AvatarFallback>
									</Avatar>
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-3 mb-2">
										<h2 className="text-3xl font-semibold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
											{user.nickname}
										</h2>
										<Badge
											variant="secondary"
											className="text-xs px-3 py-1 bg-success/10 text-success border-success/20"
										>
											{accountStatus === "authenticated"
												? `${user.status}`
												: t("pendingRegistration")}
										</Badge>
									</div>
									<p className="text-sm text-muted-foreground">
										{user.email == "-"
											? t("noEmailProvided")
											: user.email}
									</p>
								</div>
							</div>
							<div className="mt-6 p-2 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl border border-primary/10 hover:border-primary/20 transition-colors">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4">
										<div className="p-3 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl">
											<Wallet className="h-5 w-5 text-primary" />
										</div>
										<div>
											<p className="text-sm font-semibold text-foreground mb-1">
												{t("walletAddress")}
											</p>
											<code className="text-xs rounded-lg border border-border/50">
												{user.walletAddress
													? `${user.walletAddress.slice(
															0,
															8
													  )}...${user.walletAddress.slice(
															-8
													  )}`
													: t("notConnected")}
											</code>
										</div>
									</div>
									{user.walletAddress && (
										<Button
											variant="ghost"
											size="sm"
											onClick={handleCopyAddress}
											className="h-10 w-10 p-0 hover:bg-primary/10 hover:scale-105 transition-all"
										>
											<Copy
												className={`h-4 w-4 ${
													copiedAddress
														? "text-success"
														: "text-muted-foreground"
												}`}
											/>
										</Button>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Balance Overview */}
					<Card>
						{/* ... (JSX for Balance Overview is identical) */}
						<CardHeader>
							<h3 className="text-lg font-semibold">
								<Wallet className="h-5 w-5 inline-block mr-2" />
								{t("balanceOverview")}
							</h3>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="text-center p-2 bg-success/10 rounded-lg">
								<p className="text-sm text-foreground mb-1">
									{t("currentBalance")}
								</p>
								<p className="text-2xl font-semibold text-primary">
									${user.balance?.toFixed(2) || "0.00"}
								</p>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="text-center p-3 bg-muted/50 rounded-lg">
									<p className="text-xs text-muted-foreground mb-1">
										{t("totalDeposits")}
									</p>
									<p className="text-lg font-semibold text-foreground">
										{user.depositTotal || "0"}
									</p>
								</div>
								<div className="text-center p-3 bg-muted/50 rounded-lg">
									<p className="text-xs text-muted-foreground mb-1">
										{t("totalWithdrawals")}
									</p>
									<p className="text-lg font-semibold text-foreground">
										{user.withdrawTotal || "0"}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Getting Started */}

					{/* Recent Activity */}
					<Card className="md:col-span-2 xl:col-span-3">
						{/* ... (JSX for Recent Activity is identical) */}
						<CardHeader>
							<h3 className="text-lg font-semibold flex items-center gap-2">
								<Activity className="h-5 w-5" />
								{t("recentActivity")}
							</h3>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
								<div className="p-2 bg-success/20 rounded-full">
									<Trophy className="h-4 w-4 text-success" />
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium">
										{t("activityGameWinDiceRoll")}
									</p>
									<p className="text-xs text-muted-foreground">
										{t("twoHoursAgo")}
									</p>
								</div>
								<Badge
									variant="outline"
									className="text-success border-success text-xs"
								>
									+$50.00
								</Badge>
							</div>
							<div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
								<div className="p-2 bg-primary/20 rounded-full">
									<Wallet className="h-4 w-4 text-primary" />
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium">
										{t("deposit")}
									</p>
									<p className="text-xs text-muted-foreground">
										{t("oneDayAgo")}
									</p>
								</div>
								<Badge
									variant="outline"
									className="text-primary border-primary text-xs"
								>
									+$100.00
								</Badge>
							</div>
							<div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
								<div className="p-2 bg-destructive/20 rounded-full">
									<Activity className="h-4 w-4 text-destructive" />
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium">
										{t("activityGameLossBlackjack")}
									</p>
									<p className="text-xs text-muted-foreground">
										{t("twoDaysAgo")}
									</p>
								</div>
								<Badge
									variant="outline"
									className="text-destructive border-destructive text-xs"
								>
									-$25.00
								</Badge>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
