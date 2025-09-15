"use client";

import { useAppStore } from "@/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * The primary controller hook for managing the query state.
 * It provides actions that update both the Zustand store and the URL
 * query parameters in a single, synchronous operation, ensuring instant UI feedback.
 */
export const useQueryManager = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { activeFilters, searchQuery, sortBy, toggleFilter, setSearchQuery, setSortBy, clearAllFilters } = useAppStore(state => state.query);

  const updateUrl = useCallback(
    (newParams: URLSearchParams) => {
      // Use router.replace to update the URL without adding to the browser's history stack.
      router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    },
    [pathname, router]
  );

  const handleToggleFilter = (filterType: string, value: string) => {
    // 1. Immediately update the Zustand store.
    toggleFilter(filterType, value);

    // 2. Construct the new URLSearchParams based on the *next* state.
    const newActiveFilters = { ...activeFilters };
    const currentValues = newActiveFilters[filterType] || [];
    if (currentValues.includes(value)) {
      newActiveFilters[filterType] = currentValues.filter(v => v !== value);
    } else {
      newActiveFilters[filterType] = [...currentValues, value];
    }

    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (sortBy !== "a-z") params.set("sort", sortBy);
    Object.entries(newActiveFilters).forEach(([key, values]) => {
      values.forEach(v => params.append(key, v));
    });

    // 3. Instantly update the URL.
    updateUrl(params);
  };

  // --- THE FIX IS HERE: FULLY IMPLEMENTED handleSort ---
  const handleSort = (newSortValue: string) => {
    setSortBy(newSortValue);

    const params = new URLSearchParams();
    // Reconstruct params from current state, but use the NEW sort value
    if (searchQuery) params.set("q", searchQuery);
    if (newSortValue && newSortValue !== "a-z") {
      // 'a-z' is default, no need to add to URL
      params.set("sort", newSortValue);
    }
    // Object.entries(activeFilters).forEach(([key, values]) => {
    //   values.forEach(v => params.append(key, v));
    // });
    updateUrl(params);
  };

  // --- Also implementing the other handlers for completeness ---
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (sortBy !== "a-z") params.set("sort", sortBy);
    Object.entries(activeFilters).forEach(([key, values]) => {
      values.forEach(v => params.append(key, v));
    });
    updateUrl(params);
  };

  const handleClearFilters = () => {
    clearAllFilters();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (sortBy !== "a-z") params.set("sort", sortBy);
    updateUrl(params);
  };

  // Return only the handlers the UI needs.
  return {
    handleToggleFilter,
    handleClearFilters,
    handleSort,
    handleSearch,
    // ... add handlers for search and sort as needed
  };
};
