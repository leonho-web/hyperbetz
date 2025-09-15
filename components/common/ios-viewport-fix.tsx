"use client";

import { useEffect } from "react";

/**
 * iOS Safari Viewport Height Fix
 * 
 * This component addresses the iOS Safari dynamic viewport issue where the
 * bottom toolbar hiding/showing causes layout shifts in fixed positioned elements.
 * 
 * It sets a CSS custom property --vh that represents 1% of the actual viewport height,
 * which can be used in CSS calc() functions for consistent behavior.
 */
export function IOSViewportFix() {
	useEffect(() => {
		const updateVH = () => {
			// Get the actual viewport height
			const vh = window.innerHeight * 0.01;
			// Set the CSS custom property
			document.documentElement.style.setProperty("--vh", `${vh}px`);
		};

		// Set initial value
		updateVH();

		// Update on resize (handles toolbar show/hide)
		window.addEventListener("resize", updateVH);
		
		// Update on orientation change
		window.addEventListener("orientationchange", () => {
			// Delay to allow for orientation change to complete
			setTimeout(updateVH, 100);
		});

		// iOS specific: handle viewport changes when scrolling
		// This helps with the Safari bottom bar behavior
		if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
			window.addEventListener("scroll", updateVH, { passive: true });
			
			// Also listen for visual viewport changes (modern iOS Safari)
			if (window.visualViewport) {
				window.visualViewport.addEventListener("resize", updateVH);
				window.visualViewport.addEventListener("scroll", updateVH);
			}
		}

		// Cleanup
		return () => {
			window.removeEventListener("resize", updateVH);
			window.removeEventListener("orientationchange", updateVH);
			
			if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
				window.removeEventListener("scroll", updateVH);
				
				if (window.visualViewport) {
					window.visualViewport.removeEventListener("resize", updateVH);
					window.visualViewport.removeEventListener("scroll", updateVH);
				}
			}
		};
	}, []);

	// This component renders nothing
	return null;
}
