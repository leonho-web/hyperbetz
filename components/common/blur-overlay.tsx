"use client";

import { useBlurOverlay } from "@/context/blur-overlay-context";
import { cn } from "@/lib/utils";

export const BlurOverlay = () => {
  const { isBlurred } = useBlurOverlay();

  return (
    <div
      className={cn(
        "fixed inset-0 z-40 transition-all duration-500 ease-out pointer-events-none",
        isBlurred
          ? "backdrop-blur-lg bg-black/5 dark:bg-black/15 opacity-100"
          : "opacity-0"
      )}
      style={{
        backdropFilter: isBlurred
          ? "blur(12px) saturate(180%) brightness(1.05) contrast(1.1)"
          : "none",
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    />
  );
};
