import { AppStateCreator } from "@/store/store";
import ApiService from "@/services/apiService";
import { GetTokenListRequest, Token } from "@/types/blockchain/swap.types";
import { User } from "@/types/auth/auth.types";

// --- STATE AND ACTION TYPES ---

type TokenFetchStatus = "idle" | "loading" | "success" | "error";

export interface TokenSliceState {
  tokens: Token[];
  // We will use selectors for specific tokens, keeping the state minimal.
  tokenFetchStatus: TokenFetchStatus;
}

/**
 * Actions for managing token state in the blockchain slice.
 */
export interface TokenSliceActions {
  /**
   * Fetches the list of tokens for the current network and user.
   * Handles polling, retry logic, and guards against missing dependencies.
   *
   * @param force - If true, forces a refetch even if tokens are already loaded.
   * @param deps - Dependencies required for fetching (user, authToken, etc).
   * @returns A promise that resolves when the fetch is complete.
   */
  fetchTokens: (
    force?: boolean,
    deps?: { user: User | null; authToken: string | null }
  ) => Promise<void>;

  /**
   * Clears the token state, resetting to initial values.
   * Used internally for cleanup or when dependencies are missing.
   */
  _clearTokens: () => void;
}

// --- INITIAL STATE ---

const initialState: TokenSliceState = {
  tokens: [],
  tokenFetchStatus: "idle",
};

// --- SLICE CREATOR ---

export const createTokenSlice: AppStateCreator<
  TokenSliceState & TokenSliceActions
> = (set, get) => ({
  ...initialState,

  _clearTokens: () => {
    set((state) => {
      state.blockchain.token = {
        ...state.blockchain.token,
        ...initialState,
      };
    });
  },

  fetchTokens: async (
    force = false,
    deps?: { user: User | null; authToken: string | null }
  ) => {
    // --- 1. Get Dependencies from the Global Store ---
    const { chainId } = get().blockchain.network;
    if (!deps) return;
    const { user, authToken } = deps;
    const { tokenFetchStatus, tokens } = get().blockchain.token;

    // console.log("==============================================");

    // --- 2. GUARDS ---
    if (!user?.username || !user.walletAddress || !chainId || !authToken) {
      // If essential data is missing, reset to idle and abort.
      get().blockchain.token._clearTokens();
      return;
    }
    // Prevent re-fetching if already loading or if data is present and not forced
    if (
      tokenFetchStatus === "loading" ||
      (tokenFetchStatus === "success" && tokens.length > 0 && !force)
    ) {
      return;
    }
    // console.log("+++++++++++++++++++++++++++++++++++++++++++");

    set((state) => {
      state.blockchain.token.tokenFetchStatus = "loading";
    });

    // --- 3. API CALL WITH RETRY LOGIC ---
    let retryCount = 0;
    const maxRetries = 5;

    const executeFetch = async () => {
      try {
        const api = ApiService.getInstance();
        const requestBody: GetTokenListRequest = {
          network: String(chainId),
          walletAddress: user.walletAddress!,
          username: user.username,
        };

        const response = await api.getTokenList(requestBody, authToken);

        if (response.error) {
          throw new Error(response.message);
        }

        const data = response.data || [];

        // --- 4. POLLING LOGIC ---
        // As per the reference code, if a specific condition is met, retry.
        if (data.length === 3 && retryCount < maxRetries) {
          retryCount++;
          setTimeout(executeFetch, 500); // Poll after 500ms
          return;
        }

        // --- 5. DATA AUGMENTATION ---
        const augmentedData = [
          ...data,
          // Add your custom token here if it's not in the API response
        ];

        set((state) => {
          state.blockchain.token.tokens = augmentedData;
          state.blockchain.token.tokenFetchStatus = "success";
        });
      } catch (error) {
        console.error(
          `Failed to fetch tokens (attempt ${retryCount + 1}):`,
          error
        );
        if (retryCount < maxRetries) {
          // Implement retry logic for specific errors if needed
          retryCount++;
          setTimeout(executeFetch, 1000 * retryCount); // Simple exponential backoff
        } else {
          set((state) => {
            state.blockchain.token.tokenFetchStatus = "error";
            state.blockchain.token.tokens = [];
          });
        }
      }
    };

    await executeFetch();
  },
});
