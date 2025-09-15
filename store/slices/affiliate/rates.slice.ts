import { AppStateCreator } from "@/store/store";
import ApiService from "@/services/apiService";
import LocalStorageService from "@/services/localStorageService";
import { AffiliateRate } from "@/types/affiliate/affiliate.types";

export type RatesLoadingStatus = "idle" | "loading" | "success" | "error";

export interface RatesState {
  data: AffiliateRate[];
  status: RatesLoadingStatus;
  error: string | null;
  lastFetched: number | null;
  isInitialized: boolean;
}

export interface RatesActions {
  fetchRates: (force?: boolean) => Promise<void>;
  setRatesData: (rates: AffiliateRate[]) => void;
  clearRates: () => void;
  initializeFromCache: () => void;
  initialize: (force?: boolean) => void;
}

export type RatesSlice = RatesState & RatesActions;

const RATES_KEY = "affiliate_rates_cache_v1";
const RATES_META_KEY = "affiliate_rates_meta_v1";
const STALE_MS = 5 * 60 * 1000; // 5 minutes

// Global variable to prevent multiple simultaneous API calls
let ratesFetchPromise: Promise<void> | null = null;

interface RatesMeta {
  lastFetched: number;
}

const initialState: RatesState = {
  data: [],
  status: "idle",
  error: null,
  lastFetched: null,
  isInitialized: false,
};

export const createRatesSlice: AppStateCreator<RatesSlice> = (set, get) => ({
  ...initialState,

  setRatesData: (rates) => {
    set((state) => {
      state.affiliate.rates.data = rates;
      state.affiliate.rates.status = "success";
      state.affiliate.rates.error = null;
      state.affiliate.rates.lastFetched = Date.now();
    });

    const storage = LocalStorageService.getInstance();
    const meta: RatesMeta = { lastFetched: Date.now() };
    storage.setItem(RATES_KEY, rates);
    storage.setItem(RATES_META_KEY, meta);
  },

  fetchRates: async (force = false) => {
    // Return existing promise if already fetching (deduplication)
    if (ratesFetchPromise && !force) {
      return ratesFetchPromise;
    }

    const slice = get().affiliate.rates;
    if (slice.status === "loading" && !force) return;

    const storage = LocalStorageService.getInstance();
    const api = ApiService.getInstance();
    const user = storage.getUserData();
    const token = storage.getAuthToken();
    const username = user?.username;

    if (!username || !token) return;

    // Check if data is stale
    const meta = storage.getItem<RatesMeta>(RATES_META_KEY);
    const now = Date.now();
    const isStale =
      force || !meta?.lastFetched || now - meta.lastFetched > STALE_MS;

    if (!isStale && slice.data.length > 0) return; // Use existing data

    // Create and store the fetch promise
    ratesFetchPromise = (async () => {
      set((state) => {
        state.affiliate.rates.status = "loading";
        state.affiliate.rates.error = null;
      });

      try {
        const response = await api.getAffiliateRate(
          { username, jwt_type: "dyn", api_key: token },
          token
        );

        if (!response.error) {
          get().affiliate.rates.setRatesData(response.data);
        } else {
          throw new Error(response.message || "Failed to fetch rates");
        }
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "Failed to load affiliate rates";
        set((state) => {
          state.affiliate.rates.status = "error";
          state.affiliate.rates.error = msg;
        });
      } finally {
        // Clear the promise when done
        ratesFetchPromise = null;
      }
    })();

    return ratesFetchPromise;
  },

  initialize: (force = false) => {
    const slice = get().affiliate.rates;

    // Prevent multiple initializations
    if (slice.isInitialized && !force) return;

    set((state) => {
      state.affiliate.rates.isInitialized = true;
    });

    // Load from cache first
    get().affiliate.rates.initializeFromCache();

    // Only fetch if we don't have cached data or if it's stale
    const hasValidCache = slice.data.length > 0;
    if (!hasValidCache || force) {
      get().affiliate.rates.fetchRates(force);
    }
  },

  initializeFromCache: () => {
    const storage = LocalStorageService.getInstance();
    try {
      const cachedData = storage.getItem<AffiliateRate[]>(RATES_KEY);
      const meta = storage.getItem<RatesMeta>(RATES_META_KEY);

      if (cachedData && meta) {
        set((state) => {
          state.affiliate.rates.data = cachedData;
          state.affiliate.rates.status = "success";
          state.affiliate.rates.lastFetched = meta.lastFetched;
        });
      }
    } catch {
      // Silent fail, will fetch fresh data
    }
  },

  clearRates: () => {
    set((state) => {
      state.affiliate.rates.data = initialState.data;
      state.affiliate.rates.status = initialState.status;
      state.affiliate.rates.error = initialState.error;
      state.affiliate.rates.lastFetched = initialState.lastFetched;
      state.affiliate.rates.isInitialized = initialState.isInitialized;
    });

    const storage = LocalStorageService.getInstance();
    storage.setItem(RATES_KEY, null);
    storage.setItem(RATES_META_KEY, null);

    // Also clear the fetch promise
    ratesFetchPromise = null;
  },
});
