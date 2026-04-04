import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import Script from "next/script";

const outfit = Outfit({ subsets: ["latin"], weight: ["300","400","500","600","700","800"], variable: "--font-outfit" });
const inter = Inter({ subsets: ["latin"], weight: ["400","500","600","700"], variable: "--font-inter" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#050816",
};

export const metadata: Metadata = {
  title: "THEQNEW Learning — Barashada Tooska ah",
  description: "Ku baro xirfadaha mustaqbalka — Free AI & Tech courses in Somali & English. Learn the skills of the future.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="so" className={`${outfit.variable} ${inter.variable}`}>
      <body className="min-h-screen" style={{ fontFamily: "var(--font-outfit), var(--font-inter), system-ui, sans-serif" }}>
        <div className="mesh-bg" />
        <div className="grid-pattern" />
        <Navbar />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8203084339795682"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <main>{children}</main>
      </body>
    </html>
  );
}
