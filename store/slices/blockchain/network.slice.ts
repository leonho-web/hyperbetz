import { AppStateCreator } from "@/store/store";

// --- TYPE DEFINITIONS ---
interface EvmNetwork {
	name: string;
	vanityName?: string;
}
export interface NetworkSliceState {
	network: EvmNetwork | null;
	chainId: number | null;
	chainLogo: string | null;
}
export interface NetworkSliceActions {
	setNetworkData: (data: NetworkSliceState) => void;
	clearNetworkData: () => void;
	setChainLogo: (logo: string) => void;
}

// --- HYDRATION LOGIC ---
const NETWORK_KEY = "app_network";
const CHAIN_ID_KEY = "app_chainId";
const CHAIN_LOGO_KEY = "app_chainLogo";

/**
 * A helper function that runs ONCE to get the initial state.
 * It safely reads from localStorage, handling SSR and potential errors.
 */
const getInitialState = (): NetworkSliceState => {
	// On the server, there's no localStorage. Return a clean state.
	if (typeof window === "undefined") {
		return { network: null, chainId: null, chainLogo: null };
	}
	try {
		const storedNetwork = localStorage.getItem(NETWORK_KEY);
		const storedChainId = localStorage.getItem(CHAIN_ID_KEY);
		const storedChainLogo = localStorage.getItem(CHAIN_LOGO_KEY);

		return {
			network: storedNetwork ? JSON.parse(storedNetwork) : null,
			chainId: storedChainId ? parseInt(storedChainId, 10) : null,
			chainLogo: storedChainLogo || null,
		};
	} catch (error) {
		console.error(
			"Failed to hydrate network state from localStorage:",
			error
		);
		return { network: null, chainId: null, chainLogo: null };
	}
};

// --- SLICE CREATOR ---
export const createNetworkSlice: AppStateCreator<
	NetworkSliceState & NetworkSliceActions
> = (set) => ({
	...getInitialState(), // The slice is now initialized with data from localStorage!

	setNetworkData: (data) => {
		// This action now handles BOTH setting state and persisting to localStorage.
		try {
			if (!(data.network && data.chainId && data.chainLogo)) {
				localStorage.removeItem(NETWORK_KEY);
				localStorage.removeItem(CHAIN_ID_KEY);
				localStorage.removeItem(CHAIN_LOGO_KEY);
				return;
			}
			localStorage.setItem(NETWORK_KEY, JSON.stringify(data.network));
			localStorage.setItem(CHAIN_ID_KEY, String(data.chainId));
			localStorage.setItem(CHAIN_LOGO_KEY, data.chainLogo);
		} catch (error) {
			console.error(
				"Failed to persist network data to localStorage:",
				error
			);
		}

		// Update the Zustand state.
		set((state) => {
			state.blockchain.network.network = data.network;
			state.blockchain.network.chainId = data.chainId;
			state.blockchain.network.chainLogo = data.chainLogo;
		});
	},

	clearNetworkData: () => {
		// This action clears both the state and the localStorage.
		localStorage.removeItem(NETWORK_KEY);
		localStorage.removeItem(CHAIN_ID_KEY);
		localStorage.removeItem(CHAIN_LOGO_KEY);
		set((state) => {
			state.blockchain.network.network = null;
			state.blockchain.network.chainId = null;
			state.blockchain.network.chainLogo = null;
		});
	},

	setChainLogo: (logo) => {
		localStorage.setItem(CHAIN_LOGO_KEY, logo);
		set((state) => {
			state.blockchain.network.chainLogo = logo;
		});
	},
});
