/**
 * Defines the shape of a single selectable option within a filter section.
 */
export interface FilterOption {
  value: string; // The actual value to be used in filtering logic (e.g., "slots", "netent")
  label: string; // The user-friendly text to be displayed (e.g., "Slots", "NetEnt")
  /** Optional: The number of items matching this filter, often shown in parentheses. */
  count?: number;
}

/**
 * Defines a complete filter section, such as "Game Category" or "Volatility".
 * This structure allows for creating complex, nested filter panels from a simple data array.
 */
export interface FilterSection {
  /** A unique identifier for this filter type (e.g., "category", "provider"). */
  id: string;
  /** The user-friendly title of the filter section (e.g., "Game Category"). */
  label: string;
  /** The array of selectable options within this section. */
  options: FilterOption[];
  /** Optional: An array of nested sub-sections for creating hierarchical filters. */
  subSections?: FilterSection[];
}
