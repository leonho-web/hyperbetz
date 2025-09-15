import { AppStateCreator } from "@/store/store";
import { QuerySlice, createQuerySlice } from "./query.slice";

// --- THE FIX IS HERE ---
// Add the 'export' keyword to make this type available for import in other files.
export type { QuerySlice };

/**
 * This is the "branch" for the query domain. For now, it just exports the query slice.
 * If you ever needed another slice related to this domain, you would add it here.
 */
export const createQueryControlSlice: AppStateCreator<QuerySlice> = (...args) => ({
  ...createQuerySlice(...args),
});
