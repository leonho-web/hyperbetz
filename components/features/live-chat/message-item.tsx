"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Message,
	ReplyMessage,
	userBadges,
} from "@/types/features/live-chat.types";
import {
	formatTime,
	processMessageContent,
	// getCountryFlagStyles, // Commented out - no longer using country flags
} from "@/lib/utils/features/live-chat/live-chat.utils";
import { generateUserAvatarAsync } from "@/lib/utils/features/live-chat/avatar-generator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronRight,
	faCloudShowersHeavy,
	faCoin,
	faCrown,
	faMessage,
	faReply,
} from "@fortawesome/pro-light-svg-icons";

interface MessageItemProps {
	message: Message;
	onReply: (message: Message) => void;
	onTip?: (message: Message) => void;
	currentUsername?: string;
	isFocused?: boolean;
}

export function MessageItem({
	message,
	onReply,
	onTip,
	currentUsername,
	isFocused = false,
}: MessageItemProps) {
	const [isAnimating, setIsAnimating] = React.useState(false);
	const [avatarUrl, setAvatarUrl] = React.useState<string>("");
	const [replyAvatarUrl, setReplyAvatarUrl] = React.useState<string>("");

	// Generate avatar on client side only
	React.useEffect(() => {
		if (typeof window !== "undefined") {
			generateUserAvatarAsync(message.username, 40)
				.then((url) => {
					// console.log(
					// 	`Avatar generated for ${message.username}:`,
					// 	url ? "Success" : "Failed"
					// );
					setAvatarUrl(url);
				})
				.catch(() => {
					// console.error(
					// 	`Avatar generation failed for ${message.username}:`,
					// 	error
					// );
					setAvatarUrl("");
				});
		}
	}, [message.username]);

	// Generate reply avatar if needed
	React.useEffect(() => {
		if (typeof window !== "undefined" && message.type === "reply") {
			const replyMessage = message as ReplyMessage;
			generateUserAvatarAsync(replyMessage.referencedMessage.username, 16)
				.then((url) => {
					// console.log(
					// 	`Reply avatar generated for ${replyMessage.referencedMessage.username}:`,
					// 	url ? "Success" : "Failed"
					// );
					setReplyAvatarUrl(url);
				})
				.catch((error) => {
					console.error(
						`Reply avatar generation failed for ${replyMessage.referencedMessage.username}:`,
						error
					);
					setReplyAvatarUrl("");
				});
		}
	}, [message.type, message]);

	// Get dynamic styles for country flag based on ring color
	// const countryFlagStyles = getCountryFlagStyles(message.ringColor); // Commented out - no longer using country flags

	React.useEffect(() => {
		setIsAnimating(true);
		const timer = setTimeout(() => setIsAnimating(false), 300);
		return () => clearTimeout(timer);
	}, []);

	const renderReferencedPreview = (
		ref: ReplyMessage["referencedMessage"]
	) => {
		switch (ref.type) {
			case "win":
				return (
					<div className="flex items-center gap-2">
						{/* <Crown className="h-3 w-3 text-yellow-400" /> */}
						<FontAwesomeIcon
							icon={faCrown}
							className="h-3 w-3 text-yellow-400"
						/>
						<span className="text-xs text-green-400">
							Won {ref.amount?.toFixed(2)} {ref.currency} in{" "}
							{ref.game}
						</span>
					</div>
				);
			case "gif":
				return (
					<div className="flex items-center gap-2">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={ref.gifUrl || "/placeholder.svg"}
							alt="GIF preview"
							className="w-8 h-6 rounded object-cover"
						/>
						<span className="text-xs">{ref.content}</span>
					</div>
				);
			case "image":
				return (
					<div className="flex items-center gap-2">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={ref.imageUrl || "/placeholder.svg"}
							alt="Image preview"
							className="w-8 h-6 rounded object-cover"
						/>
						<span className="text-xs">
							{ref.content || "Image"}
						</span>
					</div>
				);
			case "emoji":
				return (
					<div className="flex items-center gap-2">
						<span className="text-lg">{ref.emoji}</span>
						<span className="text-xs">Emoji message</span>
					</div>
				);
			case "share":
				return (
					<div className="flex items-center gap-2">
						{/* <Coins className="h-3 w-3 text-yellow-400" /> */}
						<FontAwesomeIcon
							icon={faCoin}
							className="h-3 w-3 text-yellow-400"
						/>
						<span className="text-xs">{ref.content}</span>
					</div>
				);
			case "rain":
				return (
					<div className="flex items-center gap-2">
						{/* <CloudRain className="h-3 w-3 text-blue-400" /> */}
						<FontAwesomeIcon
							icon={faCloudShowersHeavy}
							className="h-3 w-3 text-blue-400"
						/>
						<span className="text-xs">
							Rain: {ref.amount} {ref.currency}
						</span>
					</div>
				);
			case "system":
				return (
					<div className="flex items-center gap-2">
						<span className="text-xs">System: {ref.content}</span>
					</div>
				);
			default:
				return (
					<p className="text-xs text-[hsl(var(--muted-foreground))]/80 leading-relaxed line-clamp-2">
						{ref.content}
					</p>
				);
		}
	};

	const handleTip = () => {
		if (onTip && !message.isCurrentUser) {
			onTip(message);
		}
	};

	return (
		<div
			className={cn(
				"relative px-4 py-2 transition-colors duration-150",
				isAnimating && "animate-message-slide-in",
				message.isCurrentUser && "",
				isFocused && "bg-accent/30"
			)}
		>
			<div className="flex items-start gap-4">
				{/* Modern Avatar with Badge Integration */}
				<div className="relative flex-shrink-0 mt-1">
					<Avatar className="h-10 w-10">
						<AvatarImage
							src={avatarUrl}
							alt={`${message.username}'s avatar`}
							onError={(e) => {
								console.log(
									"Avatar failed to load for user:",
									message.username
								);
								console.error("Avatar error:", e);
							}}
						/>
						<AvatarFallback
							className={cn(
								"text-sm font-semibold text-white",
								message.ringColor ||
									"bg-gradient-to-br from-blue-500 to-purple-600"
							)}
						>
							{typeof message.avatar === "string" &&
							message.avatar.length <= 2
								? message.avatar
								: message.username.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>

					{/* Level Badge positioned on avatar */}
					{message.badge && (
						<div
							className={cn(
								"absolute -bottom-1 -right-1 text-xs font-semibold px-1.5 py-0.5 rounded-full border-2 border-background",
								userBadges[message.badge].color
							)}
						>
							{userBadges[message.badge].label}
						</div>
					)}
				</div>

				{/* Message Content Container */}
				<div className="flex-1 min-w-0 group">
					{/* Header with username and timestamp */}
					<div className="flex items-center justify-between gap-2 mb-1">
						<div className="flex gap-3 items-center">
							<span className="font-semibold text-xs text-foreground hover:underline cursor-pointer">
								{message.isCurrentUser
									? "You"
									: message.username}
							</span>

							<span className="text-xs text-muted-foreground">
								{formatTime(message.timestamp)}
							</span>
						</div>
						<div className="flex items-center justify-between gap-0.5">
							<Button
								variant="ghost"
								size="sm"
								className="lg:opacity-0 text-primary group-hover:bg-secondary lg:group-hover:opacity-100 transition-opacity duration-300 px-2 text-xs"
								onClick={() => onReply(message)}
							>
								{/* <Reply className="h-3 w-3 mr-1" /> */}
								<FontAwesomeIcon
									icon={faReply}
									className="h-3 w-3 mr-1"
								/>
							</Button>
							{!message.isCurrentUser && onTip && (
								<Button
									variant="ghost"
									size="sm"
									className="h-7text-xs lg:opacity-0 lg:group-hover:opacity-100 duration-300 transition-opacity text-primary lg:group-hover:bg-secondary  "
									onClick={handleTip}
								>
									{/* <Coins className="h-3 w-3 mr-1" /> */}
									<FontAwesomeIcon
										icon={faCoin}
										className="h-3 w-3 mr-1"
									/>
								</Button>
							)}
						</div>
					</div>

					{/* Message Content */}
					<div className="space-y-2">
						{message.type === "reply" && (
							<>
								{/* Reply Reference Bar */}
								<div className="flex items-start gap-2 p-2 rounded-md bg-muted/40 border-l-4 border-primary">
									<Avatar className="h-4 w-4 mt-0.5">
										<AvatarImage
											src={replyAvatarUrl}
											alt={`${message.referencedMessage.username}'s avatar`}
										/>
										<AvatarFallback className="text-xs bg-muted-foreground/20">
											{typeof message.referencedMessage
												.avatar === "string" &&
											message.referencedMessage.avatar
												.length <= 2
												? message.referencedMessage
														.avatar
												: message.referencedMessage.username
														.slice(0, 2)
														.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 min-w-0">
										<span className="text-xs font-medium text-muted-foreground">
											{message.referencedMessage.username}
										</span>
										<div className="text-xs text-muted-foreground/80 text-wrap">
											{renderReferencedPreview(
												message.referencedMessage
											)}
										</div>
									</div>
								</div>
								{/* Reply Message */}
								<div
									className="text-sm text-foreground leading-relaxed p-3 rounded-lg bg-muted/30 border border-border/20"
									dangerouslySetInnerHTML={{
										__html: processMessageContent(
											message.content,
											currentUsername
										),
									}}
								/>
							</>
						)}

						{message.type === "text" && message.content && (
							<div
								className="text-sm text-foreground leading-relaxed p-3 rounded-lg bg-muted/30 border border-border/20"
								dangerouslySetInnerHTML={{
									__html: processMessageContent(
										message.content,
										currentUsername
									),
								}}
							/>
						)}

						{message.type === "gif" && (
							<div className="space-y-1">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={message.gifUrl || "/placeholder.svg"}
									alt="GIF"
									className="rounded-lg max-w-sm h-auto"
								/>
								{message.caption && (
									<div
										className="text-sm text-foreground"
										dangerouslySetInnerHTML={{
											__html: processMessageContent(
												message.caption,
												currentUsername
											),
										}}
									/>
								)}
							</div>
						)}

						{message.type === "image" && (
							<div className="space-y-1">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={message.imageUrl || "/placeholder.svg"}
									alt="Uploaded image"
									className="rounded-lg max-w-sm h-auto cursor-pointer hover:opacity-90 transition-opacity"
								/>
								{message.caption && (
									<div
										className="text-sm text-foreground"
										dangerouslySetInnerHTML={{
											__html: processMessageContent(
												message.caption,
												currentUsername
											),
										}}
									/>
								)}
							</div>
						)}

						{message.type === "win" && (
							<div className="bg-gradient-to-r from-green-500/10 to-yellow-500/10 border border-green-500/20 rounded-lg p-3">
								<div className="flex items-center gap-2 mb-2">
									<div className="p-1.5 bg-yellow-500 rounded-full">
										{/* <Crown className="h-3 w-3 text-white" /> */}
										<FontAwesomeIcon
											icon={faCrown}
											className="h-3 w-3 text-white"
										/>
									</div>
									<span className="text-sm font-semibold text-green-600 dark:text-green-400">
										🎰 Big Win in &quot;{message.game}
										&quot;!
									</span>
								</div>
								<div className="flex items-center gap-2">
									{/* <Coins className="h-4 w-4 text-yellow-500" /> */}
									<FontAwesomeIcon
										icon={faCoin}
										className="h-4 w-4 text-yellow-500"
									/>
									<span className="font-semibold text-lg text-foreground">
										{message.amount.toFixed(7)}{" "}
										{message.currency}
									</span>
									{message.multiplier && (
										<Badge className="bg-red-500 text-white text-xs">
											{message.multiplier}x
										</Badge>
									)}
								</div>
							</div>
						)}

						{message.type === "share" && (
							<div className="space-y-1">
								<p className="text-sm text-foreground">
									{message.content}
								</p>
								<div className="flex items-center gap-1">
									{/* <Coins className="h-4 w-4 text-yellow-500" /> */}
									<FontAwesomeIcon
										icon={faCoin}
										className="h-4 w-4 text-yellow-500"
									/>
									<span className="text-sm font-semibold text-primary">
										{message.sharedAmount}{" "}
										{message.sharedCurrency}
									</span>
								</div>
							</div>
						)}

						{message.type === "emoji" && (
							<div className="text-3xl leading-none">
								{message.emoji}
							</div>
						)}

						{message.type === "rain" && (
							<div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-3">
								<div className="flex items-center gap-2 mb-2">
									{/* <CloudRain className="h-4 w-4 text-blue-500" /> */}
									<FontAwesomeIcon
										icon={faCloudShowersHeavy}
										className="h-4 w-4 text-blue-500"
									/>
									<span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
										🌧️ Money Rain!
									</span>
								</div>
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										{/* <Coins className="h-4 w-4 text-yellow-500" /> */}
										<FontAwesomeIcon
											icon={faCoin}
											className="h-4 w-4 text-yellow-500"
										/>
										<span className="font-semibold text-foreground">
											{message.amount} {message.currency}
										</span>
										<span className="text-xs text-muted-foreground">
											→ {message.recipients.length}{" "}
											recipient
											{message.recipients.length !== 1
												? "s"
												: ""}
										</span>
									</div>
									<div className="text-xs text-muted-foreground">
										{message.distributedAmount.toFixed(2)}{" "}
										{message.currency} each:{" "}
										{message.recipients.join(", ")}
									</div>
								</div>
							</div>
						)}

						{message.type === "system" && (
							<div
								className={cn(
									"rounded-lg p-2 text-center text-sm italic",
									message.systemType === "error" &&
										"bg-red-500/10 text-red-600 dark:text-red-400",
									message.systemType === "rain" &&
										"bg-green-500/10 text-green-600 dark:text-green-400",
									!message.systemType &&
										"bg-blue-500/10 text-blue-600 dark:text-blue-400"
								)}
							>
								{message.content}
							</div>
						)}
					</div>

					{/* Thread Indicator */}
					{message.replyCount && message.replyCount > 0 && (
						<div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">
							{/* <MessageSquare className="h-3 w-3" /> */}
							<FontAwesomeIcon
								icon={faMessage}
								className="h-3 w-3"
							/>
							<span>
								{message.replyCount}{" "}
								{message.replyCount === 1 ? "reply" : "replies"}
							</span>
							{/* <ChevronRight className="h-3 w-3" /> */}
							<FontAwesomeIcon
								icon={faChevronRight}
								className="h-3 w-3"
							/>
						</div>
					)}

					{/* Reply Button - Always Visible */}
					<div className="mt-2">
						{/* <Button
							variant="ghost"
							size="sm"
							className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
							onClick={() => onReply(message)}
						>
							<Reply className="h-3 w-3 mr-1" />
							Reply
						</Button> */}
						{/* {!message.isCurrentUser && onTip && (
							<Button
								variant="ghost"
								size="sm"
								className="h-7 px-2 text-xs text-muted-foreground hover:text-yellow-600 hover:bg-yellow-500/10 ml-1"
								onClick={handleTip}
							>
								<Coins className="h-3 w-3 mr-1" />
								Tip
							</Button>
						)} */}
					</div>
				</div>
			</div>
		</div>
	);
}
