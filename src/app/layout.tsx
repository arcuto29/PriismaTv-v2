import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { GlobalFeatures } from "@/components/features/global-features";
import { AnimatedBackground } from "@/components/layout/animated-background";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PriismaTv - Premium Streaming Hub",
  description: "423+ movies, anime & TV shows. Solo Leveling inspired premium streaming platform. Free forever.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PriismaTv",
  },
  openGraph: {
    title: "PriismaTv - Premium Streaming Hub",
    description: "423+ movies, anime & TV shows. Solo Leveling inspired. Built different.",
    type: "website",
    siteName: "PriismaTv",
  },
  twitter: {
    card: "summary_large_image",
    title: "PriismaTv - Premium Streaming Hub",
    description: "423+ movies, anime & TV shows. Solo Leveling inspired. Built different.",
  },
};

export const viewport: Viewport = {
  themeColor: "#00d4ff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
