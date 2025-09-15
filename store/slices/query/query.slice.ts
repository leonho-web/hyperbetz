import { AppStateCreator } from "@/store/store";
import { SearchParams } from "next/dist/server/request/search-params";

// --- STATE DEFINITION ---

/**
 * Defines the shape of the active filters.
 * The key is the filter type (e.g., "category", "provider"), and the value is an array of selected filter options.
 */
export type ActiveFilters = Record<string, string[]>;

/**
 * Defines all the state properties for the query slice.
 */
export interface QuerySliceState {
	searchQuery: string;
	activeFilters: ActiveFilters;
	sortBy: string; // e.g., "a-z", "z-a", "popularity"
	itemsToShow: number;
	isInitialized: boolean;
}

// --- ACTIONS DEFINITION ---

/**
 * Defines all the actions (functions) that can be called to modify the query state.
 */
export interface QuerySliceActions {
	setSearchQuery: (query: string) => void;
	toggleFilter: (filterType: string, value: string) => void;
	clearFiltersByType: (filterType: string) => void;
	clearAllFilters: () => void;
	setSortBy: (sortValue: string) => void;
	showMoreItems: () => void;
	syncStateFromUrl: (searchParams: URLSearchParams) => void;
	initializeQueryState: (searchParams: URLSearchParams) => void;
}

/**
 * The complete type for the entire query slice, combining state and actions.
 */
export type QuerySlice = QuerySliceState & QuerySliceActions;

// --- INITIAL STATE AND CONSTANTS ---

const VALID_FILTER_KEYS = new Set([
	"category", // The key for game categories
	"provider_name", // The key for game providers
	// Add any other valid game filter keys here in the future (e.g., 'volatility', 'features')
]);

const ITEMS_PER_PAGE = 50; // The number of items to load each time "Load More" is clicked

const initialState: QuerySliceState = {
	searchQuery: "",
	activeFilters: {},
	sortBy: "a-z", // Default sort order
	itemsToShow: ITEMS_PER_PAGE,
	isInitialized: false,
};

// --- SLICE CREATOR IMPLEMENTATION ---

/**
 * Creates the state slice for managing all user-driven query and display states,
 * such as searching, filtering, sorting, and pagination.
 */
export const createQuerySlice: AppStateCreator<QuerySlice> = (set, get) => ({
	...initialState,
	isInitialized: false,

	/** Sets the search query and resets pagination to show results from the start. */
	setSearchQuery: (query) => {
		set((state) => {
			state.query.searchQuery = query;
			state.query.itemsToShow = ITEMS_PER_PAGE; // Reset pagination on new search
		});
	},

	/** Toggles a filter value on or off for a given filter type. */
	toggleFilter: (filterType, value) => {
		set((state) => {
			const currentFilters = state.query.activeFilters[filterType] || [];
			const newFilters = currentFilters.includes(value)
				? currentFilters.filter((v) => v !== value) // Remove filter if it exists
				: [...currentFilters, value]; // Add filter if it doesn't exist

			if (newFilters.length > 0) {
				state.query.activeFilters[filterType] = newFilters;
			} else {
				delete state.query.activeFilters[filterType]; // Clean up empty filter types
			}

			state.query.itemsToShow = ITEMS_PER_PAGE; // Reset pagination on filter change
		});
	},

	/** Resets only the filterType provided to it's initial state.*/
	clearFiltersByType: (filterType) => {
		set((state) => {
			delete state.query.activeFilters[filterType];
			state.query.itemsToShow = ITEMS_PER_PAGE;
		});
	},

	/** Resets all filters and the search query to their initial state. */
	clearAllFilters: () => {
		set((state) => {
			Object.assign(state.query, initialState);
		});
	},
	// clearAllFilters: () => {
	//   set(state => {
	//     state.query.activeFilters = {};
	//     state.query.searchQuery = "";
	//     state.query.itemsToShow = ITEMS_PER_PAGE; // Reset pagination
	//   });
	// },

	/** Sets the sorting preference. */
	setSortBy: (sortValue) => {
		set((state) => {
			state.query.sortBy = sortValue;
			// Note: We don't reset pagination on sort change, as users expect to see the same items, just re-ordered.
		});
	},

	/** Increases the number of items to be displayed. */
	showMoreItems: () => {
		set((state) => {
			state.query.itemsToShow += ITEMS_PER_PAGE;
		});
	},

	/**
	 * Initializes or resets the query state. This is the primary action used by pages
	 * to set up the initial context (e.g., pre-selecting a category filter).
	 */
	initializeQueryState: (searchParams) => {
		if (get().query.isInitialized) return;

		const query: Partial<QuerySliceState> = {};
		const filters: ActiveFilters = {};

		// 1. Read all params from the URL
		searchParams.forEach((value, key) => {
			if (key === "q") {
				query.searchQuery = value;
			} else if (key === "sort") {
				query.sortBy = value;
			} else {
				// Handle filter params (can have multiple values for the same key)
				if (!filters[key]) {
					filters[key] = [];
				}
				filters[key].push(value);
			}
		});

		query.activeFilters = filters;
		set((state) => {
			state.query.searchQuery =
				query.searchQuery || initialState.searchQuery;
			state.query.activeFilters =
				query.activeFilters || initialState.activeFilters;
			state.query.sortBy = query.sortBy || initialState.sortBy;
			state.query.itemsToShow = initialState.itemsToShow;
			state.query.isInitialized = true; // <-- Mark as initialized!
		});
	},
	/**
	 * THE DEFINITIVE FIX.
	 * This action does not merge state. It completely rebuilds the query state
	 * from the provided URLSearchParams, ensuring the URL is the single source of truth.
	 */
	syncStateFromUrl: (searchParams: URLSearchParams) => {
		set((state) => {
			// 1. Create a fresh, default state object.
			const newState: QuerySliceState = {
				...initialState,
				isInitialized: true,
				activeFilters: {}, // Ensure filters start empty before populating
			};

			// 2. Populate the fresh state ONLY with data from the current URL.
			searchParams.forEach((value, key) => {
				if (key === "q") {
					newState.searchQuery = value;
				} else if (key === "sort") {
					newState.sortBy = value;
				} else if (VALID_FILTER_KEYS.has(key)) {
					// This correctly handles multiple values for the same filter key.
					if (!newState.activeFilters[key]) {
						newState.activeFilters[key] = [];
					}
					newState.activeFilters[key].push(value);
				}
			});

			// 3. Update individual properties instead of replacing the entire state.query
			state.query.searchQuery = newState.searchQuery;
			state.query.activeFilters = newState.activeFilters;
			state.query.sortBy = newState.sortBy;
			state.query.itemsToShow = newState.itemsToShow;
			state.query.isInitialized = newState.isInitialized;
		});
	},
});
