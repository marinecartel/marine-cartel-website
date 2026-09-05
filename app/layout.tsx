import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { GoogleAnalytics } from '@next/third-parties/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://themarinecartel.com'),
  // Global Title Strategy
  title: {
    default: "Marine Cartel | Global Industrial Automation & Marine Spares",
    template: "%s | Marine Cartel" // Isse har product page ke title ke piche automatically "| Marine Cartel" lag jayega
  },
  description:
    "Marine Cartel is a leading supplier of PLC, HMI, VFD, and Marine Engine Spares worldwide. Sourced from Factories & Alang, Gujarat. Global shipping to US, Europe & Asia.",
  
  keywords: ["PLC Supplier India", "Marine Engine Spares Alang", "Industrial Automation Parts", "Used Ship Spares", "HMI VFD Exporter"],

  // Global SEO Tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Metadata for Social Media (OpenGraph)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://themarinecartel.com",
    siteName: "Marine Cartel",
    images: [
      {
        url: "/logo_mc.png", // Make sure to add this image in your public folder
        width: 1200,
        height: 630,
        alt: "Marine Cartel Global Supply",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <Navbar />
        <main>{children}</main>
        <GoogleAnalytics gaId="G-B20WZTC48X" />
      </body>
    </html>
  );
}