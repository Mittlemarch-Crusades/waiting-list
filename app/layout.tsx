import type { Metadata } from "next";
import { Cinzel_Decorative, Cormorant_Garamond, Manrope } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";

import "./globals.css";

const headingFont = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-heading"
});

const serifFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif"
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Mittlemarch | Coming Soon",
  description: "A cinematic teaser landing page for the upcoming MMORPG set in the world of Mittlemarch.",
  icons: {
    icon: "/images/mittlemarch-logo-removebg.png",
    shortcut: "/images/mittlemarch-logo-removebg.png",
    apple: "/images/mittlemarch-logo-removebg.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${headingFont.variable} ${serifFont.variable} ${bodyFont.variable}`}>
      <body className="bg-night font-[family-name:var(--font-body)] text-stone-100 antialiased">
        {children}
      </body>
      <Script
        src="https://analytics.ahrefs.com/analytics.js"
        data-key="I0txFnASheV5k2uLlMG46g"
        strategy="afterInteractive"
      />
    </html>
  );
}
