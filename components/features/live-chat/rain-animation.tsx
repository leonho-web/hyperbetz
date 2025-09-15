"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface RainAnimationProps {
  isActive: boolean;
  amount: number;
  currency: string;
  duration?: number; // in milliseconds
  onComplete?: () => void;
}

interface RainDrop {
  id: number;
  left: number;
  delay: number;
  duration: number;
  amount: string;
}

export function RainAnimation({
  isActive,
  amount,
  currency,
  duration = 3000,
  onComplete,
}: RainAnimationProps) {
  const [rainDrops, setRainDrops] = React.useState<RainDrop[]>([]);
  const [showAnimation, setShowAnimation] = React.useState(false);

  React.useEffect(() => {
    if (isActive) {
      setShowAnimation(true);

      // Generate rain drops
      const drops: RainDrop[] = [];
      const numDrops = Math.min(20, Math.max(5, Math.floor(amount / 10))); // Scale with amount

      for (let i = 0; i < numDrops; i++) {
        drops.push({
          id: i,
          left: Math.random() * 100, // Random horizontal position (%)
          delay: Math.random() * 1000, // Random delay up to 1s
          duration: 2000 + Math.random() * 1000, // Random duration 2-3s
          amount: Math.random() > 0.5 ? currency : "💰", // Mix currency symbol with money emoji
        });
      }

      setRainDrops(drops);

      // Clean up animation after duration
      const timer = setTimeout(() => {
        setShowAnimation(false);
        setRainDrops([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, amount, currency, duration, onComplete]);

  if (!showAnimation) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[70] overflow-hidden">
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Rain drops */}
      {rainDrops.map((drop) => (
        <div
          key={drop.id}
          className={cn(
            "absolute text-2xl font-bold animate-bounce-down",
            "drop-shadow-lg text-yellow-400"
          )}
          style={{
            left: `${drop.left}%`,
            top: "-50px",
            animationDelay: `${drop.delay}ms`,
            animationDuration: `${drop.duration}ms`,
            animationFillMode: "forwards",
          }}
        >
          {drop.amount}
        </div>
      ))}

      {/* Central burst effect */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="text-4xl font-bold text-yellow-400 animate-pulse drop-shadow-2xl">
          💸 RAIN! 💸
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes bounce-down {
          0% {
            transform: translateY(-50px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .animate-bounce-down {
          animation: bounce-down linear forwards;
        }
      `}</style>
    </div>
  );
}
