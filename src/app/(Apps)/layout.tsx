import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { QueryProvider } from "./providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marketplace",
  description: "A modern marketplace application",
  icons: {
    icon: "/logo.webp",
    shortcut: "/logo.webp",
    apple: "/logo.webp",
  },
  openGraph: {
    title: "Marketplace",
    description: "A modern marketplace application",
    url: "https://www.com",
    siteName: "Marketplace",
    images: [
      {
        url: "/logo.webp",
        width: 1200,
        height: 630,
        alt: "Marketplace Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marketplace",
    description: "A modern marketplace application",
    images: ["/logo.webp"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster 
          position="top-right"
          richColors 
          theme="light" />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
