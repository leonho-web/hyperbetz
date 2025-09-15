"use client";

import { memo } from "react";
import { AppSidebar } from "./app-sidebar";

/**
 * Wrapper component to isolate AppSidebar from parent layout re-renders
 * This prevents the sidebar from re-rendering when layout state changes
 */
const AppSidebarWrapperComponent = () => {
	// Use the optimized original sidebar with fixes
	return <AppSidebar />;
};

// Export heavily memoized wrapper to prevent unnecessary re-renders
export const AppSidebarWrapper = memo(AppSidebarWrapperComponent);
AppSidebarWrapper.displayName = "AppSidebarWrapper";
