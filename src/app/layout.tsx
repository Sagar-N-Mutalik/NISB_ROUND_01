import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "🧠 Mind Mashup",
  description: "A series of gamified tech and logic challenges set in Kozhikode.",
  metadataBase: new URL("https://your-domain.com"),
  openGraph: {
    title: "Mind Mashup Challenge",
    description: "Test your skills in logic, math, and tech.",
    url: "https://your-domain.com",
    images: [{ url: "/images/og-image.png", width: 100, height: 120 }],
    locale: "en_US",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#111827",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans bg-gray-900 text-gray-200 antialiased flex min-h-screen flex-col items-center justify-center p-4`}
      >
        {children}
      </body>
    </html>
  );
}