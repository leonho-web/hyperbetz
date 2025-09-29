"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowRight,
	faChevronRight,
	IconDefinition,
} from "@fortawesome/pro-light-svg-icons";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Game, GameType } from "@/types/games/gameList.types";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getProvidersForCategory } from "@/lib/utils/games/games.utils";
import { getShuffledTopProviders } from "@/lib/utils/top-providers.utils";
import { saveToCache, loadFromCache, cn } from "@/lib/utils";
import { useTranslations } from "@/lib/locale-provider";
import { useDynamicAuth } from "@/hooks/useDynamicAuth";
import { useTransactionModal } from "@/hooks/walletProvider/use-transaction-modal";
import { Separator } from "@/components/ui/separator";

// Types
export type NavItem = {
	title: string;
	url: string;
	icon?: IconDefinition;
	isActive: boolean;
	badge?: string;
	badgeVariant?: "default" | "secondary" | "destructive" | "outline";
	items?: { title: string; url: string; players?: string }[];
};
export type GameCategory = {
	title: string;
	url: string;
	icon?: IconDefinition;
	count?: number;
	badge?: string;
	badgeVariant?: "default" | "secondary" | "destructive" | "outline";
};
export type Provider = { title: string; url: string; count?: number };
interface NavMainProps {
	items: NavItem[];
	gameCategories?: GameCategory[];
	staticGameCategories?: GameCategory[];
	providers?: Provider[];
	allGames?: Game[];
}

const PROVIDERS_CACHE_KEY = "nav-main-shuffled-providers";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24h

export function NavMain({
	items,
	gameCategories = [],
	staticGameCategories = [],
	providers = [],
	allGames = [],
}: NavMainProps) {
	const tSidebar = useTranslations("sidebar");
	const tNav = useTranslations("navigation");
	const tGames = useTranslations("games");
	const router = useRouter();
	const { isLoggedIn, login } = useDynamicAuth();
	const { openModal } = useTransactionModal();

	const getShuffledProvidersWithCache = useCallback(() => {
		const cached = loadFromCache<{
			providers: Provider[];
			remaining: number;
		}>(PROVIDERS_CACHE_KEY, CACHE_DURATION);
		if (cached) {
			return {
				providers: cached.providers.map((p) => ({
					...p,
					count:
						providers.find(
							(c) =>
								c.title.toLowerCase() === p.title.toLowerCase()
						)?.count ?? p.count,
				})),
				remaining: cached.remaining,
			};
		}
		const shuffled = getShuffledTopProviders(providers);
		const data = {
			providers: shuffled.providers.map((p) => ({
				title: p.name,
				url: p.url,
				count: p.count,
			})),
			remaining: shuffled.remaining,
		};
		saveToCache(PROVIDERS_CACHE_KEY, data);
		return data;
	}, [providers]);

	const { providers: limitedProviders, remaining: remainingProvidersCount } =
		useMemo(
			() =>
				providers.length
					? getShuffledProvidersWithCache()
					: { providers: [], remaining: 0 },
			[providers.length, getShuffledProvidersWithCache]
		);

	const launchSpecificGame = (name: string) => {
		const game = allGames.find(
			(g) => g.game_name.toLowerCase() === name.toLowerCase()
		);
		if (!game) {
			router.push(
				`/games?q=${encodeURIComponent(
					name.toLowerCase().replace(/\s+/g, "")
				)}`
			);
			return;
		}
		if (!isLoggedIn) {
			login();
			return;
		}
		const qp = new URLSearchParams({
			vendor: game.vendor_name,
			gameType: game.category,
			gpId: String(game.gp_id),
		}).toString();
		router.push(`/play/${game.game_id}?${qp}`);
	};

	const handleStaticCategoryClick = (
		c: GameCategory,
		e: React.MouseEvent
	) => {
		e.preventDefault();
		const k = c.title.toLowerCase();
		if (k === "swap") {
			if (isLoggedIn) {
				openModal("swap");
			} else {
				login();
			}
		} else if (k === "vr") launchSpecificGame("Gonzo's Quest Megaways");
		else if (k === "futures") launchSpecificGame("Stock Market");
		else if (k === "poker") router.push("/games?q=poker");
		else if (k === "lottery") router.push("/games?q=lottery");
		else router.push(c.url);
	};

	const getProvidersForCategoryHelper = (title: string) =>
		getProvidersForCategory(
			allGames,
			title.toUpperCase().trim() as GameType
		);

	// Suppress hover cards from auto-opening until the user moves the mouse (used after launching a game)
	const [suppressHoverCards, setSuppressHoverCards] = useState(false);
	const lastSuppressPositionRef = useRef<{ x: number; y: number } | null>(
		null
	);
	useEffect(() => {
		if (!suppressHoverCards) return;
		const handlePointerMove = (e: PointerEvent) => {
			const last = lastSuppressPositionRef.current;
			if (!last) {
				setSuppressHoverCards(false);
				return;
			}
			const dx = Math.abs(e.clientX - last.x);
			const dy = Math.abs(e.clientY - last.y);
			if (dx + dy > 3) {
				setSuppressHoverCards(false);
				lastSuppressPositionRef.current = null;
			}
		};
		document.addEventListener("pointermove", handlePointerMove);
		return () =>
			document.removeEventListener("pointermove", handlePointerMove);
	}, [suppressHoverCards]);

	const CategoryProvidersList = ({
		providers,
		categoryTitle,
		onClose,
		onGameTrigger,
	}: {
		providers: Array<{ provider_name: string; count: number }>;
		categoryTitle: string;
		onClose?: () => void;
		onGameTrigger?: (e: React.MouseEvent) => void;
	}) => {
		const handleProviderClick = (
			providerName: string,
			e: React.MouseEvent
		) => {
			e.preventDefault();
			onGameTrigger?.(e);
			if (categoryTitle.toUpperCase() === "LIVE CASINO") {
				if (!isLoggedIn) {
					onClose?.();
					login();
					return;
				}
				router.replace(`/getLobby/${decodeURIComponent(providerName)}`);
			} else {
				router.push(
					`/games?provider_name=${encodeURIComponent(
						providerName
					)}&category=${encodeURIComponent(categoryTitle)}`
				);
			}
		};
		return (
			<div
				className={cn(
					"h-[90dvh] flex flex-col w-72 mb-2 bg-sidebar border border-border/60 rounded-xl shadow-sm"
				)}
			>
				<div className="px-4 py-1 border-b border-border/60 bg-muted/20 rounded-t-xl flex-shrink-0">
					<h4 className="font-semibold text-foreground text-sm uppercase">
						{categoryTitle} Providers
					</h4>
					<div className="flex justify-between items-center mb-1">
						<p className="text-xs text-muted-foreground mt-1">
							{providers.length} provider
							{providers.length !== 1 ? "s" : ""} available
						</p>
						<Link
							href={
								gameCategories.find(
									(c) =>
										c.title.toUpperCase() ===
										categoryTitle.toUpperCase()
								)?.url || "/"
							}
						>
							<span className="border rounded-2xl text-[11px] px-2 py-1 hover:bg-muted/40 hover:text-foreground">
								View all
							</span>
						</Link>
						{/* <button className="text-xs">View all</button> */}
					</div>
				</div>
				<div className="flex-1 overflow-hidden">
					{providers.length ? (
						<ScrollArea className="flex-1 h-full">
							<div className="space-y-1.5 p-2 pr-2 pb-6">
								{providers.map((p) => (
									<div
										key={p.provider_name}
										onClick={(e) =>
											handleProviderClick(
												p.provider_name,
												e
											)
										}
										className="group rounded-lg bg-muted/10 hover:bg-muted/20 border border-border hover:border-primary/50 cursor-pointer py-2 px-2 flex items-center justify-between"
									>
										<div className="flex items-center gap-3 min-w-0">
											<span className="w-1.5 h-1.5 rounded-full bg-primary/70" />
											<span className="text-sm font-medium text-foreground truncate">
												{p.provider_name}
											</span>
										</div>
										<div className="flex items-center gap-2 ml-2 flex-shrink-0">
											{p.count && (
												<span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">
													{p.count}
												</span>
											)}
											<svg
												className="w-4 h-4 text-foreground/60"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
										</div>
									</div>
								))}
							</div>
						</ScrollArea>
					) : (
						<div className="flex-1 flex items-center justify-center">
							<p className="text-sm text-muted-foreground">
								No providers
							</p>
						</div>
					)}
				</div>
			</div>
		);
	};

	const resolveTitle = (title: string) => {
		if (title.includes(".")) {
			const [ns, ...rest] = title.split(".");
			const key = rest.join(".");
			if (ns === "navigation") return tNav(key);
			if (ns === "sidebar") return tSidebar(key);
		}
		return title;
	};

	const renderLink = (item: NavItem) => (
		<SidebarMenuItem key={item.title}>
			<SidebarMenuButton asChild isActive={item.isActive}>
				<Link
					href={item.url}
					className="flex items-center justify-between w-full font-semibold lg:px-4 lg:py-2 tracking-wide"
					prefetch
				>
					<div className="flex items-center gap-5">
						{item.icon && (
							<FontAwesomeIcon
								icon={item.icon}
								className=" text-primary"
							/>
						)}
						<span className="tracking-wide leading-snug">
							{resolveTitle(item.title)}
						</span>
					</div>
					{item.badge && (
						<Badge
							variant={item.badgeVariant || "default"}
							className="ml-auto text-xs"
						>
							{resolveTitle(item.badge)}
						</Badge>
					)}
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);

	const renderCollapsible = (item: NavItem) => (
		<Collapsible
			asChild
			defaultOpen={item.isActive}
			className="group/collapsible"
			key={item.title}
		>
			<SidebarMenuItem>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton tooltip={resolveTitle(item.title)}>
						{item.icon && <FontAwesomeIcon icon={item.icon} />}
						<span>{resolveTitle(item.title)}</span>
						<FontAwesomeIcon
							icon={faChevronRight}
							className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
						/>
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub>
						{item.items?.map((sub) => (
							<SidebarMenuSubItem key={sub.title}>
								<SidebarMenuSubButton asChild>
									<Link
										href={sub.url}
										className="flex justify-between items-center w-full"
										prefetch
									>
										<span>{sub.title}</span>
										{sub.players && (
											<span className="text-xs text-primary font-mono">
												{sub.players}
											</span>
										)}
									</Link>
								</SidebarMenuSubButton>
							</SidebarMenuSubItem>
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	);

	const StaticCategoryItem = ({ category }: { category: GameCategory }) => {
		const displayTitle = (() => {
			if (category.title.includes(".")) {
				const [ns, ...rest] = category.title.split(".");
				const key = rest.join(".");
				if (ns === "games") return tGames(key);
			}
			const k = category.title.toUpperCase();
			if (k === "POKER") return tGames("poker");
			if (k === "LOTTERY") return tGames("lottery");
			if (k === "FUTURES") return tGames("futures");
			if (k === "SWAP") return tGames("swap");
			if (k === "VR") return tGames("vr");
			return category.title;
		})();
		const isAction = ["swap", "vr", "futures"].includes(
			category.title.toLowerCase()
		);
		return (
			<SidebarMenuItem key={category.title}>
				<SidebarMenuButton
					asChild={!isAction}
					onClick={
						isAction
							? (e) => handleStaticCategoryClick(category, e)
							: undefined
					}
					className="lg:px-4 lg:py-1 tracking-wide font-semibold cursor-pointer"
				>
					{isAction ? (
						<div className="flex items-center tracking-wide justify-between w-full">
							<div className="flex items-center gap-5">
								{category.icon && (
									<FontAwesomeIcon
										icon={category.icon}
										className=" text-primary"
									/>
								)}
								<span className="leading-0">
									{displayTitle}
								</span>
							</div>
							{category.count && (
								<span className="text-xs text-muted-foreground count-badge">
									{category.count === 696969 ? (
										<FontAwesomeIcon icon={faArrowRight} />
									) : (
										category.count
									)}
								</span>
							)}
						</div>
					) : (
						<Link
							href={category.url}
							className="flex items-center tracking-wide justify-between w-full"
							prefetch
						>
							<div className="flex items-center gap-5">
								{category.icon && (
									<FontAwesomeIcon
										icon={category.icon}
										className=" text-primary"
									/>
								)}
								<span className="leading-0">
									{displayTitle}
								</span>
							</div>
							{category.count && (
								<span className="text-xs text-muted-foreground count-badge">
									{category.count === 696969 ? (
										<FontAwesomeIcon icon={faArrowRight} />
									) : (
										category.count
									)}
								</span>
							)}
						</Link>
					)}
				</SidebarMenuButton>
			</SidebarMenuItem>
		);
	};

	const GameCategoryItem = ({ category }: { category: GameCategory }) => {
		const providersForCategory = getProvidersForCategoryHelper(
			category.title
		);
		// Controlled open state so clicking inside does NOT instantly close
		const [open, setOpen] = useState(false);
		const triggerRef = useRef<HTMLDivElement | null>(null);
		const contentRef = useRef<HTMLDivElement | null>(null);
		const ignoreNextCloseRef = useRef(false);

		// Radix will attempt to close on pointer leave; we selectively accept open=true only.
		const handleRadixOpenChange = (next: boolean) => {
			if (next) {
				setOpen(true);
				return;
			}
			// We ignore close requests; real close handled by global pointer tracking below
			if (!ignoreNextCloseRef.current) return;
			ignoreNextCloseRef.current = false;
		};

		// Pointer tracking: close only when pointer is outside BOTH trigger and content
		useEffect(() => {
			if (!open) return;
			const handlePointerMove = (e: PointerEvent) => {
				const x = e.clientX;
				const y = e.clientY;
				const tRect = triggerRef.current?.getBoundingClientRect();
				const cRect = contentRef.current?.getBoundingClientRect();
				const insideTrigger =
					tRect &&
					x >= tRect.left &&
					x <= tRect.right &&
					y >= tRect.top &&
					y <= tRect.bottom;
				const insideContent =
					cRect &&
					x >= cRect.left &&
					x <= cRect.right &&
					y >= cRect.top &&
					y <= cRect.bottom;
				if (!insideTrigger && !insideContent) {
					setOpen(false);
				}
			};
			document.addEventListener("pointermove", handlePointerMove);
			return () =>
				document.removeEventListener("pointermove", handlePointerMove);
		}, [open]);

		// Open on keyboard focus of trigger for accessibility
		const handleTriggerFocus = () => setOpen(true);
		const handleTriggerBlur = () => {
			// Close only if focus moved completely outside trigger + content
			requestAnimationFrame(() => {
				const active = document.activeElement;
				if (
					contentRef.current &&
					(active === contentRef.current ||
						contentRef.current.contains(active))
				) {
					return;
				}
				if (triggerRef.current?.contains(active)) return;
				setOpen(false);
			});
		};

		// Ensure clicks inside content don't immediately trigger close attempts
		const preventCloseOnMouseDown = (e: React.MouseEvent) => {
			ignoreNextCloseRef.current = true;
			// Stop propagation so Radix doesn't think we've left hoverable area prematurely
			e.stopPropagation();
		};
		const displayTitle = (() => {
			const k = category.title.toUpperCase();
			if (k === "SLOT") return tGames("slots");
			if (k === "SPORT BOOK" || k === "SPORTSBOOK")
				return tGames("sports");
			if (k === "LIVE CASINO") return tGames("liveCasino");
			return category.title;
		})();
		return (
			<SidebarMenuItem key={category.title}>
				<div className="flex items-center w-full">
					<HoverCard
						// openDelay={2000}
						// closeDelay={1000}
						open={open}
						onOpenChange={handleRadixOpenChange}
					>
						<HoverCardTrigger asChild>
							<div
								className="flex-1"
								ref={triggerRef}
								onMouseEnter={() => {
									if (suppressHoverCards) return; // wait for pointer move first
									setOpen(true);
								}}
							>
								<SidebarMenuButton asChild>
									<Link
										href={category.url}
										className="flex items-center lg:px-4 lg:py-2 tracking-wide font-semibold justify-between w-full hover:bg-muted/30 transition-all duration-200 rounded-lg"
										prefetch
										onFocus={handleTriggerFocus}
										onBlur={handleTriggerBlur}
									>
										<div className="flex items-center gap-5">
											{category.icon && (
												<FontAwesomeIcon
													icon={category.icon}
													className="text-primary"
												/>
											)}
											<span className="leading-0">
												{displayTitle}
											</span>
										</div>
										<div className="flex items-center gap-3">
											{category.badge && (
												<Badge
													variant={
														category.badgeVariant ||
														"secondary"
													}
													className="text-xs bg-primary text-foreground"
												>
													{category.badge}
												</Badge>
											)}
											{category.count && (
												<span className="text-xs text-muted-foreground count-badge">
													{category.count}
												</span>
											)}
										</div>
									</Link>
								</SidebarMenuButton>
							</div>
						</HoverCardTrigger>
						<HoverCardContent
							side="right"
							align="start"
							className="w-auto p-0 bg-transparent border-none shadow-none"
							sideOffset={0}
							// alignOffset={0}
							ref={contentRef}
							onMouseDown={preventCloseOnMouseDown}
							onMouseEnter={() => setOpen(true)}
						>
							<CategoryProvidersList
								providers={providersForCategory}
								categoryTitle={category.title}
								onClose={() => setOpen(false)}
								onGameTrigger={(e) => {
									// When a game/provider is triggered, suppress auto-open until movement
									lastSuppressPositionRef.current = {
										x: e.clientX,
										y: e.clientY,
									};
									setSuppressHoverCards(true);
								}}
							/>
						</HoverCardContent>
					</HoverCard>
				</div>
			</SidebarMenuItem>
		);
	};

	return (
		<div className="-space-y-1">
			{items.length > 0 && (
				<SidebarGroup>
					<SidebarGroupLabel className="text-primary font-semibold">
						{tSidebar("navigation")}
					</SidebarGroupLabel>
					<SidebarMenu>
						{items.map((item) =>
							item.items?.length
								? renderCollapsible(item)
								: renderLink(item)
						)}
					</SidebarMenu>
				</SidebarGroup>
			)}
			<Separator className="!w-[90%] mx-auto my-1" />
			{(gameCategories.length > 0 || staticGameCategories.length > 0) && (
				<SidebarGroup>
					<SidebarGroupLabel className="text-primary">
						{tSidebar("games")}
					</SidebarGroupLabel>
					<SidebarMenu>
						{gameCategories.map((c) => (
							<GameCategoryItem key={c.title} category={c} />
						))}
						{staticGameCategories.map((c) => (
							<StaticCategoryItem key={c.title} category={c} />
						))}
					</SidebarMenu>
				</SidebarGroup>
			)}
			<Separator className="!w-[90%] mx-auto my-1" />
			{providers.length > 0 && (
				<SidebarGroup>
					<Collapsible
						asChild
						defaultOpen
						className="group/collapsible"
					>
						<SidebarMenuItem className="list-none">
							<CollapsibleTrigger asChild>
								<SidebarMenuButton tooltip="Providers">
									<span className="text-primary text-xs font-semibold">
										{tSidebar("trendingNow")}
									</span>
									<FontAwesomeIcon
										icon={faChevronRight}
										className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
									/>
								</SidebarMenuButton>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<SidebarMenuSub className="border-none mx-0 px-0">
									<div className="space-y-1.5 w-full overflow-y-auto">
										{limitedProviders.map(
											(p) =>
												p.url && ( // This check ensures the Link is only rendered if p.url is not undefined or an empty string
													<SidebarMenuSubItem
														key={p.title}
														className="list-none"
													>
														<div className="w-full">
															<SidebarMenuSubButton
																asChild
																className="h-auto py-1.5"
															>
																<Link
																	href={p.url}
																	className="flex font-medium tracking-wider items-center justify-between w-full hover:bg-muted/30 transition-all duration-300"
																	prefetch
																>
																	<span className="text-sm text-foreground">
																		{
																			p.title
																		}
																	</span>
																	{p.count && (
																		<span className="text-xs text-foreground/80 bg-primary/20 px-2 py-0.5 rounded-full">
																			{
																				p.count
																			}
																		</span>
																	)}
																</Link>
															</SidebarMenuSubButton>
														</div>
													</SidebarMenuSubItem>
												)
										)}
										{remainingProvidersCount > 0 && (
											<SidebarMenuSubItem className="list-none">
												<div className="w-full">
													<SidebarMenuSubButton
														asChild
														size="sm"
														className="!h-auto !min-h-[1.75rem] !items-start !py-1"
													>
														<Link
															href="/providers?filter=top"
															className="flex items-center justify-between w-full hover:bg-primary/20 transition-all duration-300 border-t border-border/50 py-2 mt-4 gap-2"
															prefetch
														>
															<span className="text-sm text-foreground font-medium leading-tight flex-1 break-words">
																{tSidebar(
																	"allTopProviders"
																)}
															</span>
															<div className="flex items-center gap-2 flex-shrink-0">
																<span className="text-xs text-foreground/80 bg-primary/20 px-2 py-0.5 rounded-full whitespace-nowrap">
																	+
																	{
																		remainingProvidersCount
																	}
																</span>
																<FontAwesomeIcon
																	icon={
																		faChevronRight
																	}
																	fontSize={
																		12
																	}
																	className="text-foreground"
																/>
															</div>
														</Link>
													</SidebarMenuSubButton>
												</div>
											</SidebarMenuSubItem>
										)}
									</div>
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</Collapsible>
				</SidebarGroup>
			)}
		</div>
	);
}
