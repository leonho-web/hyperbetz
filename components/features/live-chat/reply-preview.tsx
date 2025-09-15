"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/locale-provider";
import { Message } from "@/types/features/live-chat.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faXmark } from "@fortawesome/pro-light-svg-icons";

interface ReplyPreviewProps {
	replyingTo: Message;
	onCancel: () => void;
}

export function ReplyPreview({ replyingTo, onCancel }: ReplyPreviewProps) {
	const t = useTranslations("chat");
	const getPreviewContent = (message: Message) => {
		switch (message.type) {
			case "text":
				return message.content;
			case "win":
				return t("reply.types.win", {
					amount: message.amount,
					currency: message.currency,
				});
			case "emoji":
				return message.emoji;
			case "gif":
				return message.caption || t("reply.types.gif");
			case "image":
				return message.caption || t("reply.types.image");
			case "share":
				return message.content;
			default:
				return t("reply.types.default");
		}
	};

	return (
		<div
			className="mb-2 p-3 bg-primary/10 rounded-lg border-l-4 border-primary
                  backdrop-blur-sm animate-fade-in shadow-inner casino-reply-preview
                  relative overflow-hidden"
		>
			{/* Gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-chart-1/5 pointer-events-none" />

			<div className="flex items-center justify-between mb-2 relative z-10">
				<div className="flex items-center gap-2">
					<div className="p-1 rounded-full bg-primary/20">
						{/* <Reply className="h-3 w-3 text-primary" /> */}
						<FontAwesomeIcon
							icon={faReply}
							className="h-3 w-3 text-primary"
						/>
					</div>
					<span className="text-xs text-sidebar-foreground font-medium">
						{t("reply.replyingTo", {
							username: replyingTo.username,
						})}
					</span>
				</div>
				<Button
					variant="ghost"
					size="sm"
					onClick={onCancel}
					className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive
                   hover:bg-destructive/10 rounded-full transition-all duration-200
                   casino-close-button"
				>
					{/* <X className="h-3 w-3" /> */}
					<FontAwesomeIcon icon={faXmark} className="h-3 w-3" />
				</Button>
			</div>
			<p
				className="text-xs text-muted-foreground truncate leading-relaxed relative z-10 
                  bg-background/20 rounded p-2 border border-border/30"
			>
				{getPreviewContent(replyingTo)}
			</p>
		</div>
	);
}
