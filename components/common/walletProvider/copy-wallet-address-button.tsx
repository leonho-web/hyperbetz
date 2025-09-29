"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CopyWalletAddressButtonProps {
	/** The wallet address to copy */
	address?: string;
	/** Optional custom className for styling */
	className?: string;
	/** Button variant */
	variant?: "default" | "outline" | "ghost" | "secondary";
	/** Button size */
	size?: "default" | "sm" | "lg" | "icon";
	/** Whether to show the address text alongside the copy button */
	showAddress?: boolean;
	/** How many characters to show from start and end when showAddress is true */
	addressTruncateLength?: number;
	/** Custom label for the button */
	label?: string;
	/** Whether to show only the icon */
	iconOnly?: boolean;
	/** Custom success message */
	successMessage?: string;
	/** Custom error message */
	errorMessage?: string;
}

/**
 * A reusable button component for copying wallet addresses to clipboard.
 *
 * Features:
 * - Copies wallet address to clipboard
 * - Shows visual feedback with check icon
 * - Displays toast notification
 * - Configurable appearance and behavior
 * - Handles edge cases (no address, clipboard API not available)
 *
 * @example
 * ```tsx
 * // Basic usage
 * <CopyWalletAddressButton address="0x1234...5678" />
 *
 * // With address display
 * <CopyWalletAddressButton
 *   address="0x1234...5678"
 *   showAddress
 *   variant="outline"
 * />
 *
 * // Icon only
 * <CopyWalletAddressButton
 *   address="0x1234...5678"
 *   iconOnly
 *   size="icon"
 * />
 * ```
 */
export const CopyWalletAddressButton = ({
	address,
	className,
	variant = "ghost",
	size = "sm",
	showAddress = false,
	addressTruncateLength = 6,
	label = "Copy Address",
	iconOnly = false,
	successMessage = "Address copied to clipboard!",
	errorMessage = "Failed to copy address",
}: CopyWalletAddressButtonProps) => {
	const [isCopied, setIsCopied] = useState(false);

	/**
	 * Handles copying the wallet address to clipboard
	 */
	const handleCopy = async () => {
		if (!address) {
			toast.error("No wallet address available");
			return;
		}

		try {
			// Check if clipboard API is available
			if (navigator.clipboard && window.isSecureContext) {
				await navigator.clipboard.writeText(address);
			} else {
				// Fallback for older browsers or non-secure contexts
				const textArea = document.createElement("textarea");
				textArea.value = address;
				textArea.style.position = "absolute";
				textArea.style.left = "-999999px";
				document.body.prepend(textArea);
				textArea.select();
				document.execCommand("copy");
				textArea.remove();
			}

			// Show success state
			setIsCopied(true);
			toast.success(successMessage);

			// Reset the copied state after 2 seconds
			setTimeout(() => {
				setIsCopied(false);
			}, 2000);
		} catch (error) {
			console.error("Failed to copy address:", error);
			toast.error(errorMessage);
		}
	};

	/**
	 * Formats the address for display with truncation
	 */
	const formatAddress = (addr: string): string => {
		if (!addr || addr.length <= addressTruncateLength * 2 + 3) {
			return addr;
		}
		return `${addr.slice(0, addressTruncateLength)}...${addr.slice(
			-addressTruncateLength
		)}`;
	};

	// Don't render if no address is provided
	if (!address) {
		return null;
	}

	return (
		<Button
			variant={variant}
			size={size}
			onClick={handleCopy}
			className={cn(
				"transition-all duration-200",
				isCopied && "text-green-600 dark:text-green-400",
				className
			)}
			disabled={isCopied}
		>
			{/* Icon */}
			{isCopied ? (
				<Check className="h-4 w-4" />
			) : (
				<Copy className="h-4 w-4" />
			)}

			{/* Text content */}
			{!iconOnly && (
				<span className="ml-2">
					{showAddress ? formatAddress(address) : label}
				</span>
			)}
		</Button>
	);
};

export default CopyWalletAddressButton;
