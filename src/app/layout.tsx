import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Markflow - Advanced Markdown Editor",
  description: "A powerful, real-time Markdown editor with split-view, Marp presentation support, and instant PDF/HTML export.",
  keywords: ["markdown", "editor", "marp", "slides", "presentation", "nextjs", "react", "monaco", "real-time"],
  authors: [{ name: "Markflow Team" }],
  creator: "Markflow",
  publisher: "Markflow",
  openGraph: {
    title: "Markflow - Advanced Markdown Editor",
    description: "Write, preview, and present with Markflow. The modern Markdown editor for documentation and slides.",
    url: "https://markflow.app",
    siteName: "Markflow",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Markflow - Advanced Markdown Editor",
    description: "Write, preview, and present with Markflow.",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#1e1e1e"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
