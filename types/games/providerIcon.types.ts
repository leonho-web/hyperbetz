/**
 * Represents a single provider with its icon URL
 */
export interface ProviderIcon {
  provider_name: string;
  icon_url: string;
}

/**
 * API Response type for fetching provider icons
 */
export interface ProviderIconApiResponse {
  error: boolean;
  data: ProviderIcon[];
}

/**
 * Enhanced provider type that includes both count and icon URL
 */
export interface ProviderWithIcon {
  name: string;
  count: number;
  icon_url?: string;
}
