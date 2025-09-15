"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/store";
import WebSocketService from "@/services/webSocketService";
import { WsConnectionStatus } from "@/store/slices/blockchain/websocket.slice";

export const WebSocketStateSynchronizer = () => {
	const setConnectionStatus = useAppStore(
		(state) => state.blockchain.websocket.setConnectionStatus
	);

	useEffect(() => {
		// The service's onStatusChange property is a simple callback.
		// We assign our Zustand action to it.
		WebSocketService.onStatusChange = (status: string) => {
			setConnectionStatus(status as WsConnectionStatus);
		};
	}, [setConnectionStatus]);

	return null;
};
