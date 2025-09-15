"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface BlurOverlayContextType {
  isBlurred: boolean;
  enableBlur: () => void;
  disableBlur: () => void;
}

const BlurOverlayContext = createContext<BlurOverlayContextType | undefined>(
  undefined
);

export const useBlurOverlay = () => {
  const context = useContext(BlurOverlayContext);
  if (context === undefined) {
    throw new Error("useBlurOverlay must be used within a BlurOverlayProvider");
  }
  return context;
};

interface BlurOverlayProviderProps {
  children: ReactNode;
}

export const BlurOverlayProvider = ({ children }: BlurOverlayProviderProps) => {
  const [isBlurred, setIsBlurred] = useState(false);

  const enableBlur = () => setIsBlurred(true);
  const disableBlur = () => setIsBlurred(false);

  const value = {
    isBlurred,
    enableBlur,
    disableBlur,
  };

  return (
    <BlurOverlayContext.Provider value={value}>
      {children}
    </BlurOverlayContext.Provider>
  );
};
