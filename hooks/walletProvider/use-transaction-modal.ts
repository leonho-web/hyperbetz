"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TransactionModalTab } from "@/store/slices/ui/walletProvider/modal.slice";

export const useTransactionModal = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const {
		isTransactionModalOpen,
		activeTransactionModalTab,
		openTransactionModal,
		closeTransactionModal,
		setActiveTransactionModalTab,
	} = useAppStore((state) => state.uiDefinition.modal);

	// Effect 1: Sync URL to State on URL parameter changes
	useEffect(() => {
		const tabFromUrl = searchParams.get("tab") as TransactionModalTab;
		if (tabFromUrl) {
			setActiveTransactionModalTab(tabFromUrl);
			openTransactionModal(tabFromUrl);
		}
	}, [searchParams, setActiveTransactionModalTab, openTransactionModal]); // React to URL parameter changes

	// Effect 2: Sync State to URL on tab change
	useEffect(() => {
		const currentParams = new URLSearchParams(searchParams.toString());
		if (isTransactionModalOpen) {
			currentParams.set("tab", activeTransactionModalTab);
		} else {
			currentParams.delete("tab");
		}
		// Use replace to avoid polluting browser history
		router.replace(`${pathname}?${currentParams.toString()}`, {
			scroll: false,
		});
	}, [
		isTransactionModalOpen,
		activeTransactionModalTab,
		pathname,
		router,
		searchParams,
	]);

	return {
		isOpen: isTransactionModalOpen,
		activeTab: activeTransactionModalTab,
		openModal: openTransactionModal,
		closeModal: closeTransactionModal,
		setActiveTab: setActiveTransactionModalTab,
	};
};
