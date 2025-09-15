/**
 * Represents a single category with its icon URL
 */
export interface CategoryIcon {
	category_name: string;
	icon_url: string;
}

/**
 * API Response type for fetching category icons
 */
export interface CategoryIconApiResponse {
	error: boolean;
	data: CategoryIcon[];
}

/**
 * Enhanced category type that includes both count and icon URL
 */
export interface CategoryWithIcon {
	name: string;
	count: number;
	icon_url?: string;
}
