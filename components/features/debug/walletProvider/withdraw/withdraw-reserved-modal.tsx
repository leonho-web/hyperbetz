"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog"; // Assuming you have a base Dialog component
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface WithdrawReservedModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const WithdrawReservedModal = ({
	isOpen,
	onClose,
}: WithdrawReservedModalProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<div className="flex items-center gap-2">
						<AlertTriangle className="h-6 w-6 text-destructive" />
						<DialogTitle>Withdrawal Reserved</DialogTitle>
					</div>
				</DialogHeader>
				<DialogDescription>
					<p>
						Your withdrawal request could not be processed at this
						time due to security checks. This is a temporary measure
						to protect your funds.
					</p>
					<p className="mt-2">
						Please try again in a few minutes. If the issue
						persists, contact support.
					</p>
				</DialogDescription>
				<DialogFooter>
					<Button onClick={onClose} className="w-full">
						I Understand
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
