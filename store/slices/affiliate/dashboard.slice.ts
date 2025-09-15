import { AppStateCreator } from "@/store/store";
import ApiService from "@/services/apiService";
import LocalStorageService from "@/services/localStorageService";
import {
  AffiliateRate,
  GetDownlineResponse,
} from "@/types/affiliate/affiliate.types";

export type AffiliateLoadingStatus = "idle" | "loading" | "success" | "error";

export interface AffiliateDashboardState {
  downline: GetDownlineResponse | null;
  rates: AffiliateRate[];
  status: AffiliateLoadingStatus;
  error: string | null;
  lastFetched: number | null;
  isClaiming: boolean;
  isInitialized: boolean;
}

export interface AffiliateDashboardActions {
  initialize: (force?: boolean) => void;
  fetchData: (force?: boolean) => Promise<void>;
  claim: () => Promise<void>;
  setDownline: (data: GetDownlineResponse) => void;
  setRates: (rates: AffiliateRate[]) => void;
  clear: () => void;
}

export type AffiliateDashboardSlice = AffiliateDashboardState &
  AffiliateDashboardActions;

const STALE_MS = 5 * 60 * 1000;
const DOWNLINE_KEY = "affiliate_downline_cache_v1";
const RATES_KEY = "affiliate_rates_cache_v1";
const META_KEY = "affiliate_meta_cache_v1";

// Global variable to prevent multiple simultaneous API calls
let fetchPromise: Promise<void> | null = null;

interface CachedMeta {
  downlineFetched?: number;
  ratesFetched?: number;
}

const initialState: AffiliateDashboardState = {
  downline: null,
  rates: [],
  status: "idle",
  error: null,
  lastFetched: null,
  isClaiming: false,
  isInitialized: false,
};

export const createAffiliateDashboardSlice: AppStateCreator<
  AffiliateDashboardSlice
> = (set, get) => {
  const slice = {
    ...initialState,

    setDownline: (data: GetDownlineResponse) => {
      set((state: any) => {
        // This slice would be mounted as state.affiliate.dashboard if used
        state.downline = data;
        state.status = "success";
        state.error = null;
      });
      const storage = LocalStorageService.getInstance();
      const meta: CachedMeta = storage.getItem<CachedMeta>(META_KEY) || {};
      meta.downlineFetched = Date.now();
      storage.setItem(DOWNLINE_KEY, data);
      storage.setItem(META_KEY, meta);
    },

    setRates: (rates: AffiliateRate[]) => {
      set((state: any) => {
        state.rates = rates;
      });
      const storage = LocalStorageService.getInstance();
      const meta: CachedMeta = storage.getItem<CachedMeta>(META_KEY) || {};
      meta.ratesFetched = Date.now();
      storage.setItem(RATES_KEY, rates);
      storage.setItem(META_KEY, meta);
    },

    fetchData: async (force = false) => {
      // Return existing promise if already fetching (deduplication)
      if (fetchPromise && !force) {
        return fetchPromise;
      }

      const currentSlice = get() as any;
      if (currentSlice.status === "loading" && !force) return;

      const storage = LocalStorageService.getInstance();
      const api = ApiService.getInstance();
      const user = storage.getUserData();
      const token = storage.getAuthToken();
      const username = user?.username;

      if (!username || !token) return;

      const meta = storage.getItem<CachedMeta>(META_KEY) || {};
      const now = Date.now();
      const stale =
        force ||
        !meta.downlineFetched ||
        !meta.ratesFetched ||
        now - (meta.downlineFetched || 0) > STALE_MS ||
        now - (meta.ratesFetched || 0) > STALE_MS;

      if (!stale) return;

      // Create and store the fetch promise
      fetchPromise = (async () => {
        set((state: any) => {
          state.status = "loading";
          state.error = null;
        });

        try {
          const [downlineResponse, ratesResponse] = await Promise.all([
            api.getDownline(
              {
                username,
                page_number: 1,
                limit: 10,
                order: "unclaimed_amount",
              },
              token
            ),
            api.getAffiliateRate(
              { username, jwt_type: "dyn", api_key: token },
              token
            ),
          ]);

          if (!downlineResponse.error) slice.setDownline(downlineResponse);
          if (!ratesResponse.error) slice.setRates(ratesResponse.data);

          set((state: any) => {
            state.lastFetched = Date.now();
          });
        } catch (e) {
          const msg =
            e instanceof Error ? e.message : "Failed to load affiliate data";
          set((state: any) => {
            state.status = "error";
            state.error = msg;
          });
        } finally {
          // Clear the promise when done
          fetchPromise = null;
        }
      })();

      return fetchPromise;
    },

    initialize: (force = false) => {
      const currentSlice = get() as any;

      // Prevent multiple initializations
      if (currentSlice.isInitialized && !force) return;

      set((state: any) => {
        state.isInitialized = true;
      });

      const storage = LocalStorageService.getInstance();
      try {
        const cachedDownline =
          storage.getItem<GetDownlineResponse>(DOWNLINE_KEY);
        const cachedRates = storage.getItem<AffiliateRate[]>(RATES_KEY) || [];
        const meta = storage.getItem<CachedMeta>(META_KEY);

        if (cachedDownline) slice.setDownline(cachedDownline);
        if (cachedRates.length) slice.setRates(cachedRates);

        if (meta?.downlineFetched || meta?.ratesFetched) {
          set((state: any) => {
            state.lastFetched = Math.min(
              meta.downlineFetched || Date.now(),
              meta.ratesFetched || Date.now()
            );
          });
        }
      } catch {
        /* ignore */
      }

      // Only fetch if we don't have cached data or if it's stale
      const hasValidCache =
        currentSlice.downline && currentSlice.rates?.length > 0;
      if (!hasValidCache || force) {
        slice.fetchData(force);
      }
    },

    claim: async () => {
      const storage = LocalStorageService.getInstance();
      const api = ApiService.getInstance();
      const user = storage.getUserData();
      const token = storage.getAuthToken();
      const username = user?.username;
      const currentSlice = get() as any;
      const { downline, isClaiming } = currentSlice;
      if (
        !username ||
        !token ||
        isClaiming ||
        !downline ||
        downline.total_unclaim <= 0
      )
        return;
      set((state: any) => {
        state.isClaiming = true;
      });
      try {
        const res = await api.claimAffiliateBonus({ username }, token);
        if (!res.error) await slice.fetchData(true);
      } catch {
        /* swallow */
      } finally {
        set((state: any) => {
          state.isClaiming = false;
        });
      }
    },

    clear: () => {
      set((state: any) => {
        state.downline = initialState.downline;
        state.rates = initialState.rates;
        state.status = initialState.status;
        state.error = initialState.error;
        state.lastFetched = initialState.lastFetched;
        state.isClaiming = initialState.isClaiming;
        state.isInitialized = initialState.isInitialized;
      });
      // Also clear the fetch promise
      fetchPromise = null;
    },
  };

  return slice;
};
