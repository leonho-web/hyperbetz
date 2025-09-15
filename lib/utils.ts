import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
// Helper function to capitalize text
export function capitalize(text: string | undefined): string {
	if (!text) return "";
	return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// Helper function to capitalize each word
export function capitalizeWords(text: string | undefined): string {
	if (!text) return "";
	return text
		.split(" ")
		.map(
			(word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
		)
		.join(" ");
}
export function truncateNumber(number: string, decimals: number) {
	if (number === undefined || number === null) return "0";
	const num = parseFloat(number);
	if (isNaN(num)) return "0";

	const factor = Math.pow(10, decimals);
	const truncated = Math.trunc(num * factor) / factor;

	return truncated.toFixed(decimals);
}

/**
 * Sanitizes a string to allow only valid numeric input for amounts.
 * Handles decimal points, precision, and leading zeros.
 */
export const sanitizeAmountInput = (value: string): string => {
	let sanitized = value.replace(/[^0-9.]/g, "");

	if ((sanitized.match(/\./g) || []).length > 1) {
		sanitized = sanitized.substring(0, sanitized.lastIndexOf("."));
	}

	if (sanitized.includes(".")) {
		const parts = sanitized.split(".");
		sanitized = `${parts[0]}.${parts[1].substring(0, 6)}`;
	}

	if (
		sanitized.startsWith("0") &&
		sanitized !== "0" &&
		!sanitized.startsWith("0.")
	) {
		sanitized = sanitized.replace(/^0+/, "");
	}

	if (sanitized.startsWith(".")) {
		sanitized = `0${sanitized}`;
	}

	return sanitized;
};

/**
 * Formats a full token balance, handling potential scientific notation.
 */
export const formatFullAmount = (amount: string | number): string => {
	const amountStr = String(amount);
	if (amountStr.includes("e")) {
		const parsed = parseFloat(amountStr);
		return parsed.toLocaleString("fullwide", {
			useGrouping: false,
			maximumFractionDigits: 20,
		});
	}
	return amountStr;
};

/**
 * Utility functions for localStorage caching with expiration
 */
export interface CacheData<T> {
	data: T;
	timestamp: number;
}

/**
 * Saves data to localStorage with a timestamp
 */
export const saveToCache = <T>(key: string, data: T): void => {
	try {
		const cacheData: CacheData<T> = {
			data,
			timestamp: Date.now(),
		};
		localStorage.setItem(key, JSON.stringify(cacheData));
	} catch (error) {
		console.error(`Error saving to cache (${key}):`, error);
	}
};

/**
 * Loads data from localStorage and checks if it's still valid based on duration
 * @param key - The localStorage key
 * @param maxAge - Maximum age in milliseconds
 * @returns The cached data if valid, null if expired or not found
 */
export const loadFromCache = <T>(key: string, maxAge: number): T | null => {
	try {
		const cached = localStorage.getItem(key);
		if (cached) {
			const { data, timestamp }: CacheData<T> = JSON.parse(cached);
			const now = Date.now();

			// Check if cache is still valid
			if (now - timestamp < maxAge) {
				return data;
			} else {
				// Cache expired, remove it
				localStorage.removeItem(key);
			}
		}
	} catch (error) {
		console.error(`Error loading from cache (${key}):`, error);
		localStorage.removeItem(key);
	}
	return null;
};

/**
 * Clears expired cache entries
 * @param key - The localStorage key
 * @param maxAge - Maximum age in milliseconds
 */
export const clearExpiredCache = (key: string, maxAge: number): void => {
	try {
		const cached = localStorage.getItem(key);
		if (cached) {
			const { timestamp }: CacheData<unknown> = JSON.parse(cached);
			const now = Date.now();

			if (now - timestamp >= maxAge) {
				localStorage.removeItem(key);
			}
		}
	} catch (error) {
		console.error(`Error clearing expired cache (${key}):`, error);
		localStorage.removeItem(key);
	}
};
