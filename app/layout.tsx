import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Import standard fonts
import "./globals.css";
import DayList from "@/components/DayList";
import { Suspense } from "react";

// Configure fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Tracker",
  description: "Daily learning and task tracking platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-900`}
      >
        <div className="flex">
          <Suspense fallback={<div className="w-64 bg-gray-50 h-screen border-r border-gray-200 p-4">Loading sidebar...</div>}>
            <DayList />
          </Suspense>
          <main className="flex-1 ml-64 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
