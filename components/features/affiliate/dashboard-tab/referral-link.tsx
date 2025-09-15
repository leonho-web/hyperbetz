"use client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
// import { Copy, LinkIcon, Globe, Hash, CheckCircle } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCopy,
	faLink,
	faGlobe,
	faHashtag,
	faCircleCheck,
} from "@fortawesome/pro-light-svg-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LocalStorageService from "@/services/localStorageService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/lib/locale-provider";

export const ReferralLink = () => {
	const user = LocalStorageService.getInstance().getUserData();
	const t = useTranslations("affiliate.dashboard");

	// Local state to avoid accessing window during render prematurely
	const [fullReferralLink, setFullReferralLink] = useState("");
	const plainReferralId = user?.referralId || ""; // "Without decorations" variant
	const [isLoading, setIsLoading] = useState(true);
	const [copiedStates, setCopiedStates] = useState({
		full: false,
		plain: false,
	});

	// referralLink

	useEffect(() => {
		if (user?.referralId) {
			try {
				const origin = window.location.origin;
				setFullReferralLink(`${origin}/?r=${user.referralId}`);
			} catch {
				setFullReferralLink("");
			}
		}
		setIsLoading(false);
	}, [user]);

	const handleCopyFull = () => {
		if (!fullReferralLink) return;
		navigator.clipboard.writeText(fullReferralLink);
		toast.success(t("copyFullSuccess"));
		setCopiedStates((prev) => ({ ...prev, full: true }));
		setTimeout(
			() => setCopiedStates((prev) => ({ ...prev, full: false })),
			2000
		);
	};

	const handleCopyPlain = () => {
		if (!plainReferralId) return;
		navigator.clipboard.writeText(plainReferralId);
		toast.success(t("copyIdSuccess"));
		setCopiedStates((prev) => ({ ...prev, plain: true }));
		setTimeout(
			() => setCopiedStates((prev) => ({ ...prev, plain: false })),
			2000
		);
	};

	return (
		<Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 shadow-lg hover:shadow-xl transition-all duration-300 group">
			<div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
			<div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />

			<CardHeader className="relative">
				<CardTitle className="flex items-center gap-3 text-xl font-bold text-foreground">
					<div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
						<FontAwesomeIcon
							icon={faLink}
							className="h-5 w-5 text-primary"
						/>
					</div>
					{t("yourReferralLinks")}
				</CardTitle>
				{/* <p className="text-muted-foreground text-sm mt-2">
					{t("referralLinksSubtitle")}
				</p> */}
			</CardHeader>

			<CardContent className="relative space-y-6">
				{isLoading ? (
					<div className="space-y-4">
						<div className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<div className="flex w-full items-center space-x-3">
								<Skeleton className="h-12 flex-grow" />
								<Skeleton className="h-12 w-12" />
							</div>
						</div>
						<div className="space-y-2">
							<Skeleton className="h-4 w-20" />
							<div className="flex w-full items-center space-x-3">
								<Skeleton className="h-12 flex-grow" />
								<Skeleton className="h-12 w-12" />
							</div>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Full Link */}
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<FontAwesomeIcon
									icon={faGlobe}
									className="h-4 w-4 text-primary"
								/>
								<label className="text-sm font-semibold text-foreground uppercase tracking-wide">
									{t("completeReferralLink")}
								</label>
							</div>
							<div className="flex w-full items-center space-x-3">
								<div className="relative flex-1">
									<Input
										value={fullReferralLink}
										readOnly
										placeholder={t(
											"fullReferralPlaceholder"
										)}
										className="pr-10 bg-muted/30 border-border/50 text-foreground font-mono text-sm h-12 focus:border-primary focus:ring-2 focus:ring-primary/20"
									/>
									{copiedStates.full && (
										<FontAwesomeIcon
											icon={faCircleCheck}
											className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500"
										/>
									)}
								</div>
								<Button
									variant="outline"
									size="icon"
									onClick={handleCopyFull}
									disabled={!fullReferralLink}
									className="h-12 w-12 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all"
								>
									{copiedStates.full ? (
										<FontAwesomeIcon
											icon={faCircleCheck}
											className="h-4 w-4 text-emerald-500"
										/>
									) : (
										<FontAwesomeIcon
											icon={faCopy}
											className="h-4 w-4 text-primary"
										/>
									)}
								</Button>
							</div>
							{/* <p className="text-xs text-muted-foreground">
								{t("fullReferralHelp")}
							</p> */}
						</div>

						{/* Plain ID */}
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<FontAwesomeIcon
									icon={faHashtag}
									className="h-4 w-4 text-primary"
								/>
								<label className="text-sm font-semibold text-foreground uppercase tracking-wide">
									{t("referralCodeOnly")}
								</label>
							</div>
							<div className="flex w-full items-center space-x-3">
								<div className="relative flex-1">
									<Input
										value={plainReferralId}
										readOnly
										placeholder={t("yourReferralId")}
										className="pr-10 bg-muted/30 border-border/50 text-foreground font-mono text-sm h-12 focus:border-primary focus:ring-2 focus:ring-primary/20"
									/>
									{copiedStates.plain && (
										<FontAwesomeIcon
											icon={faCircleCheck}
											className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500"
										/>
									)}
								</div>
								<Button
									variant="outline"
									size="icon"
									onClick={handleCopyPlain}
									disabled={!plainReferralId}
									className="h-12 w-12 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all"
								>
									{copiedStates.plain ? (
										<FontAwesomeIcon
											icon={faCircleCheck}
											className="h-4 w-4 text-emerald-500"
										/>
									) : (
										<FontAwesomeIcon
											icon={faCopy}
											className="h-4 w-4 text-primary"
										/>
									)}
								</Button>
							</div>
							{/* <p className="text-xs text-muted-foreground">
								{t("referralIdHelp")}
							</p> */}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
