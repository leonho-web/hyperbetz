import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import ApiService from "@/services/apiService";
import {
	TransactionRecord,
	DepoWdHistoryRequest,
	DepoWdHistoryResponse,
} from "@/types/transactions/transaction.types";
type LoadingStatus = "idle" | "loading" | "success" | "error";

interface TransactionHistoryStore {
	transactions: TransactionRecord[];
	status: LoadingStatus;
	error: string | null;
	totalData: number;
	page: string;
	currentPage: number;
	pageSize: number;
	totalPages: number;

	// Actions
	setTransactions: (data: DepoWdHistoryResponse) => void;
	fetchTransactionHistory: (
		params: DepoWdHistoryRequest,
		jwtToken?: string
	) => Promise<void>;
	clearTransactions: () => void;
	setPage: (page: number) => void;
	setPageSize: (size: number) => void;
}

const TRANSACTION_HISTORY_LOCAL_STORAGE_KEY = "transaction-history-cache";

export const useTransactionStore = create<TransactionHistoryStore>()(
	devtools(
		immer((set, get) => ({
			// Initial state
			transactions: [],
			status: "idle",
			error: null,
			totalData: 0,
			page: "1",
			currentPage: 1,
			pageSize: 10,
			totalPages: 0,

			// Actions
			setTransactions: (responce: DepoWdHistoryResponse) => {
				set((state) => {
					// Handle both cases: DepoWdHistoryResponse or direct array
					if (Array.isArray(responce)) {
						// Direct array of transactions
						state.transactions = responce;
						state.status = "success";
						state.error = null;
						state.totalData = responce.length;
						state.page = "1";
						state.totalPages = 1;
					} else if (
						responce &&
						responce.data &&
						Array.isArray(responce.data)
					) {
						// DepoWdHistoryResponse structure
						state.transactions = responce.data;
						state.status = "success";
						state.error = null;
						state.totalData = responce.total_data;
						state.page = responce.page;
						state.totalPages = Math.ceil(
							responce.total_data / state.pageSize
						);
					} else {
						console.error(
							"setTransactions received invalid data:",
							responce
						);
						return;
					}
				});

				const newCacheData = {
					data: responce,
					timestamp: Date.now(),
				};
				localStorage.setItem(
					TRANSACTION_HISTORY_LOCAL_STORAGE_KEY,
					JSON.stringify(newCacheData)
				);
			},

			fetchTransactionHistory: async (
				params: DepoWdHistoryRequest,
				jwtToken?: string
			) => {
				const currentState = get();
				if (currentState.status === "loading") return;

				set((state) => {
					state.status = "loading";
					state.error = null;
				});

				try {
					const api = ApiService.getInstance();
					const response = await api.getDepoWdHistory(
						params,
						jwtToken
					);

					const currentGet = get();

					currentGet.setTransactions(
						response as unknown as DepoWdHistoryResponse
					);
				} catch (err) {
					const errorMessage =
						err instanceof Error
							? err.message
							: "An unknown error occurred";
					set((state) => {
						state.status = "error";
						state.error = errorMessage;
					});
				}
			},

			clearTransactions: () => {
				set((state) => {
					state.transactions = [];
					state.status = "idle";
					state.error = null;
					state.totalData = 0;
					state.page = "1";
					state.currentPage = 1;
					state.totalPages = 0;
				});
				localStorage.removeItem(TRANSACTION_HISTORY_LOCAL_STORAGE_KEY);
			},

			setPage: (page: number) => {
				set((state) => {
					state.currentPage = page;
				});
			},

			setPageSize: (size: number) => {
				set((state) => {
					state.pageSize = size;
					state.currentPage = 1; // Reset to first page when changing page size
					state.totalPages = Math.ceil(state.totalData / size);
				});
			},
		}))
	)
);

export type { TransactionHistoryStore, TransactionRecord };
