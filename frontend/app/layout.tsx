import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BIS SmartAssist — AI Assistant for Indian Standards & BIS Services",
  description:
    "AI-powered Intelligent Assistant for Indian Standards and BIS Services (SIH26107). Traceable citations, clause verification, product compliance finder, and official Indian Standards knowledge base.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 antialiased text-slate-900">
        {children}
      </body>
    </html>
  );
}
