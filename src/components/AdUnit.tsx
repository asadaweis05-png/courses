"use client";

import { useEffect } from "react";

interface AdUnitProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle";
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Optimized Google AdSense Unit Component
 * 
 * Features:
 * - Prevents layout shifts (CLS) with placeholder styling.
 * - Safe initialization for Next.js client-side navigation.
 * - Premium dark-theme integration.
 */
export const AdUnit = ({ slot, format = "auto", style, className }: AdUnitProps) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div 
      className={`ad-container my-8 mx-auto overflow-hidden rounded-xl border border-white/[0.04] bg-white/[0.02] ${className || ""}`}
      style={{ 
        minHeight: "100px", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        ...style 
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client="ca-pub-8203084339795682"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};
