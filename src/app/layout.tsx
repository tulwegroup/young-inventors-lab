import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Young Inventors Lab - AI Learning Platform",
  description: "An interactive AI learning platform teaching children creativity, invention thinking, and entrepreneurship. 52-week curriculum for young inventors.",
  keywords: ["Young Inventors", "AI Learning", "Kids Education", "Invention", "Entrepreneurship", "Creative Learning"],
  authors: [{ name: "Young Inventors Lab Team" }],
  openGraph: {
    title: "Young Inventors Lab",
    description: "AI-powered learning platform for young inventors",
    siteName: "Young Inventors Lab",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Young Inventors Lab",
    description: "AI-powered learning platform for young inventors",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
