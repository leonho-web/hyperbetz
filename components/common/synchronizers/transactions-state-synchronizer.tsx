// v1
// "use client";

// import { useEffect, useRef } from "react";
// import { useAppStore } from "@/store/store";
// import { useDynamicAuth } from "@/hooks/useDynamicAuth";
// import WebSocketService from "@/services/webSocketService";

// export const TransactionStateSynchronizer = () => {
// 	const { user, isLoggedIn } = useDynamicAuth();
// 	const { processWebSocketUpdate, _monitorPendingTransactions } = useAppStore(
// 		(state) => state.blockchain.transaction
// 	);

// 	// A ref to ensure we only start monitoring once per mount
// 	const didMount = useRef(false);

// 	useEffect(() => {
// 		if (isLoggedIn && user?.username) {
// 			WebSocketService.connect(user.username);

// 			const unsubscribeDeposits = WebSocketService.subscribeToDeposits(
// 				processWebSocketUpdate
// 			);
// 			const unsubscribeWithdraws = WebSocketService.subscribeToWithdraws(
// 				processWebSocketUpdate
// 			);
// 			// On initial mount for a logged-in user, check if we need to resume monitoring
// 			if (!didMount.current) {
// 				_monitorPendingTransactions();
// 				didMount.current = true;
// 			}

// 			return () => {
// 				unsubscribeDeposits();
// 				unsubscribeWithdraws();
// 				// We don't necessarily want to disconnect on every re-render,
// 				// only when the user logs out.
// 			};
// 		} else {
// 			// If user logs out, disconnect the socket.
// 			WebSocketService.disconnect();
// 			didMount.current = false; // Reset for next login
// 		}
// 	}, [
// 		isLoggedIn,
// 		user?.username,
// 		processWebSocketUpdate,
// 		_monitorPendingTransactions,
// 	]);

// 	return null;
// };

"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/store";
import { useDynamicAuth } from "@/hooks/useDynamicAuth";
import WebSocketService from "@/services/webSocketService";

/**
 * An invisible "bridge" component with two primary responsibilities:
 * 1. To initialize the transaction monitoring system on application startup.
 * 2. To manage the WebSocket connection based on the user's authentication state.
 */
export const TransactionStateSynchronizer = () => {
	const { user, isLoggedIn } = useDynamicAuth();

	// Get all necessary actions from the transaction slice.
	const { processWebSocketUpdate, initializeTransactions } = useAppStore(
		(state) => state.blockchain.transaction
	);

	// A ref to ensure initialization only ever runs once for the entire application lifecycle.
	const didInitialize = useRef(false);

	// --- EFFECT 1: Initialization ---
	// This effect runs only ONCE when the component first mounts.
	useEffect(() => {
		// The ref guard prevents this logic from ever running a second time.
		if (!didInitialize.current) {
			// This single action handles both loading from localStorage and resuming monitoring.
			initializeTransactions();
			didInitialize.current = true;
		}
	}, [initializeTransactions]); // `initializeTransactions` is a stable function, so this effectively runs once.

	// --- EFFECT 2: WebSocket Connection Management ---
	// This effect is responsible for reacting to changes in the user's login status.
	useEffect(() => {
		if (isLoggedIn && user?.username) {
			// If the user is logged in, connect the WebSocket and subscribe to events.
			WebSocketService.connect(user.username);

			const unsubscribeDeposits = WebSocketService.subscribeToDeposits(
				processWebSocketUpdate
			);
			const unsubscribeWithdraws = WebSocketService.subscribeToWithdraws(
				processWebSocketUpdate
			);
			// Add other subscriptions (like auto-status) here in the future.

			// The cleanup function for this effect will run when the user logs out.
			return () => {
				unsubscribeDeposits();
				unsubscribeWithdraws();
			};
		} else {
			// If the user is not logged in, ensure the WebSocket is disconnected.
			WebSocketService.disconnect();
		}
	}, [isLoggedIn, user?.username, processWebSocketUpdate]);

	return null;
};
