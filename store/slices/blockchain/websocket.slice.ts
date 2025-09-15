import { AppStateCreator } from "@/store/store";

export type WsConnectionStatus =
	| "disconnected"
	| "connecting"
	| "connected"
	| "reconnecting"
	| "error";

export interface WebSocketSliceState {
	connectionStatus: WsConnectionStatus;
}
export interface WebSocketSliceActions {
	setConnectionStatus: (status: WsConnectionStatus) => void;
}

const initialState: WebSocketSliceState = { connectionStatus: "disconnected" };

export const createWebSocketSlice: AppStateCreator<
	WebSocketSliceState & WebSocketSliceActions
> = (set) => ({
	...initialState,
	setConnectionStatus: (status) => {
		set((state) => {
			state.blockchain.websocket.connectionStatus = status;
		});
	},
});
