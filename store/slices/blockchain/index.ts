import { AppStateCreator } from "@/store/store";
import {
	createNetworkSlice,
	NetworkSliceActions,
	NetworkSliceState,
} from "./network.slice";
import {
	createTokenSlice,
	TokenSliceActions,
	TokenSliceState,
} from "./token.slice";
import {
	createTransactionSlice,
	TransactionSliceActions,
	TransactionSliceState,
} from "./transactions.slice";
import {
	createWebSocketSlice,
	WebSocketSliceActions,
	WebSocketSliceState,
} from "./websocket.slice";

/**
 * The complete type for the entire 'blockchain' Slice.
 * It combines all individual slice types from this domain.
 */
export type BlockchainSlice = {
	network: NetworkSliceState & NetworkSliceActions;
	token: TokenSliceState & TokenSliceActions;
	transaction: TransactionSliceState & TransactionSliceActions;
	websocket: WebSocketSliceState & WebSocketSliceActions;
};

/**
 * The state creator for the 'blockchain' branch.
 * It combines all the individual slice creators into a single slice object,
 * namespacing them for clarity.
 */
export const createBlockchainSlice: AppStateCreator<BlockchainSlice> = (
	...args
) => ({
	network: createNetworkSlice(...args),
	token: createTokenSlice(...args),
	transaction: createTransactionSlice(...args),
	websocket: createWebSocketSlice(...args),
});
