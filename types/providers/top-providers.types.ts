export type TopProvider = string;

export type TopProvidersList = TopProvider[];

export interface ProviderInfo {
	name: TopProvider;
	count?: number;
	url?: string;
}

export interface ShuffledProvidersResult {
	providers: ProviderInfo[];
	remaining: number;
}
