import { AppStateCreator } from "@/store/store";
import ApiService from "@/services/apiService";
import LocalStorageService from "@/services/localStorageService";
import { GetDownlineResponse } from "@/types/affiliate/affiliate.types";

export type DownlineLoadingStatus = "idle" | "loading" | "success" | "error";

export interface DownlineState {
  data: GetDownlineResponse | null;
  status: DownlineLoadingStatus;
  error: string | null;
  lastFetched: number | null;
  isInitialized: boolean;
}

export interface DownlineActions {
  fetchDownline: (force?: boolean) => Promise<void>;
  setDownlineData: (data: GetDownlineResponse) => void;
  clearDownline: () => void;
  initializeFromCache: () => void;
  initialize: (force?: boolean) => void;
}

export type DownlineSlice = DownlineState & DownlineActions;

const DOWNLINE_KEY = "affiliate_downline_cache_v1";
const DOWNLINE_META_KEY = "affiliate_downline_meta_v1";
const STALE_MS = 5 * 60 * 1000; // 5 minutes

// Global variable to prevent multiple simultaneous API calls
let downlineFetchPromise: Promise<void> | null = null;

interface DownlineMeta {
  lastFetched: number;
}

const initialState: DownlineState = {
  data: null,
  status: "idle",
  error: null,
  lastFetched: null,
  isInitialized: false,
};

export const createDownlineSlice: AppStateCreator<DownlineSlice> = (
  set,
  get
) => ({
  ...initialState,

  setDownlineData: (data) => {
    set((state) => {
      state.affiliate.downline.data = data;
      state.affiliate.downline.status = "success";
      state.affiliate.downline.error = null;
      state.affiliate.downline.lastFetched = Date.now();
    });

    const storage = LocalStorageService.getInstance();
    const meta: DownlineMeta = { lastFetched: Date.now() };
    storage.setItem(DOWNLINE_KEY, data);
    storage.setItem(DOWNLINE_META_KEY, meta);
  },

  fetchDownline: async (force = false) => {
    // Return existing promise if already fetching (deduplication)
    if (downlineFetchPromise && !force) {
      return downlineFetchPromise;
    }

    const slice = get().affiliate.downline;
    if (slice.status === "loading" && !force) return;

    const storage = LocalStorageService.getInstance();
    const api = ApiService.getInstance();
    const user = storage.getUserData();
    const token = storage.getAuthToken();
    const username = user?.username;

    if (!username || !token) return;

    // Check if data is stale
    const meta = storage.getItem<DownlineMeta>(DOWNLINE_META_KEY);
    const now = Date.now();
    const isStale =
      force || !meta?.lastFetched || now - meta.lastFetched > STALE_MS;

    if (!isStale && slice.data) return; // Use existing data

    // Create and store the fetch promise
    downlineFetchPromise = (async () => {
      set((state) => {
        state.affiliate.downline.status = "loading";
        state.affiliate.downline.error = null;
      });

      try {
        const response = await api.getDownline(
          {
            username,
            page_number: 1,
            limit: 10,
            order: "unclaimed_amount",
          },
          token
        );

        if (!response.error) {
          get().affiliate.downline.setDownlineData(response);
        } else {
          throw new Error(response.message);
        }
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "Failed to load downline data";
        set((state) => {
          state.affiliate.downline.status = "error";
          state.affiliate.downline.error = msg;
        });
      } finally {
        // Clear the promise when done
        downlineFetchPromise = null;
      }
    })();

    return downlineFetchPromise;
  },

  initialize: (force = false) => {
    const slice = get().affiliate.downline;

    // Prevent multiple initializations
    if (slice.isInitialized && !force) return;

    set((state) => {
      state.affiliate.downline.isInitialized = true;
    });

    // Load from cache first
    get().affiliate.downline.initializeFromCache();

    // Only fetch if we don't have cached data or if it's stale
    const hasValidCache = slice.data !== null;
    if (!hasValidCache || force) {
      get().affiliate.downline.fetchDownline(force);
    }
  },

  initializeFromCache: () => {
    const storage = LocalStorageService.getInstance();
    try {
      const cachedData = storage.getItem<GetDownlineResponse>(DOWNLINE_KEY);
      const meta = storage.getItem<DownlineMeta>(DOWNLINE_META_KEY);

      if (cachedData && meta) {
        set((state) => {
          state.affiliate.downline.data = cachedData;
          state.affiliate.downline.status = "success";
          state.affiliate.downline.lastFetched = meta.lastFetched;
        });
      }
    } catch {
      // Silent fail, will fetch fresh data
    }
  },

  clearDownline: () => {
    set((state) => {
      state.affiliate.downline.data = initialState.data;
      state.affiliate.downline.status = initialState.status;
      state.affiliate.downline.error = initialState.error;
      state.affiliate.downline.lastFetched = initialState.lastFetched;
      state.affiliate.downline.isInitialized = initialState.isInitialized;
    });

    const storage = LocalStorageService.getInstance();
    storage.setItem(DOWNLINE_KEY, null);
    storage.setItem(DOWNLINE_META_KEY, null);

    // Also clear the fetch promise
    downlineFetchPromise = null;
  },
});
