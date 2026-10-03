import "./globals.css";
import "./manakai.css";
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#020617",
};

export const metadata: Metadata = {
  title: "MANAKAI | Bureau of Indian Standards Intelligence",
  description:
    "AI-powered assistant to navigate Bureau of Indian Standards (BIS) confidently. Instant verification, standards discovery, compliance tracking, and laboratory directory.",
  robots: "index, follow",
  openGraph: {
    title: "MANAKAI — Indian Standards Intelligence",
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
    <html lang="en" suppressHydrationWarning>
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
        {/* FontAwesome for MANAKAI icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 antialiased text-slate-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
