import "./globals.css";
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#020617",
};

export const metadata: Metadata = {
  title: "BIS SmartAssist — AI Assistant for Indian Standards & BIS Services",
  description:
    "AI-powered Intelligent Assistant for Indian Standards and BIS Services (SIH26107). Traceable citations, clause verification, product compliance finder, and official Indian Standards knowledge base.",
  robots: "index, follow",
  openGraph: {
    title: "BIS SmartAssist — Bureau of Indian Standards",
    description: "Official National Standards Body Intelligent Regulatory Assistant",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://bis-production-fd54.up.railway.app"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://bis-production-fd54.up.railway.app"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 antialiased text-slate-900">
        {children}
      </body>
    </html>
  );
}
