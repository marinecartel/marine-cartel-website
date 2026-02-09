import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marine Cartel | Industrial Automation Parts Supplier",
  description:
    "Marine Cartel supplies PLC, HMI, VFD, Servo Drives and industrial automation parts worldwide. New, used & refurbished stock available.",
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
        {/* Global Navbar */}
        <Navbar />

        {/* Page Content */}
        <main>{children}</main>
      </body>
    </html>
  );
}
