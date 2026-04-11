"use client";

import { useEffect, useRef, useState } from "react";

interface AdUnitProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle";
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Performance-Optimized Google AdSense Unit Component
 * 
 * Features:
 * - Lazy Loading: Only initializes when about to enter the viewport (IntersectionObserver).
 * - CLS Prevention: Pre-allocated height placeholder.
 * - Policy Compliance: Added subtle 'Advertisement' label.
 * - Theme Integration: Glassmorphism container.
 */
export const AdUnit = ({ slot, format = "auto", style, className }: AdUnitProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Start loading 200px before it enters view
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && !isLoaded) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setIsLoaded(true);
      } catch (err) {
        console.error("AdSense error:", err);
      }
    }
  }, [isInView, isLoaded]);

  return (
    <div 
      ref={containerRef}
      className={`ad-container my-8 mx-auto flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.02] shadow-inner ${className || ""}`}
      style={{ 
        minHeight: "120px", 
        width: "100%",
        maxWidth: "1000px",
        ...style 
      }}
    >
      <div style={{ 
        width: "100%", 
        padding: "8px 12px", 
        borderBottom: "1px solid rgba(255,255,255,0.03)", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center" 
      }}>
        <span style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Advertisement
        </span>
        <div style={{ display: "flex", gap: "4px" }}>
          <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
          <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        </div>
      </div>
      
      <div style={{ width: "100%", position: "relative", minHeight: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {!isLoaded && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.05)", borderTopColor: "rgba(236,72,153,0.2)", animation: "spin 1s linear infinite" }} />
          </div>
        )}
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client="ca-pub-8203084339795682"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
