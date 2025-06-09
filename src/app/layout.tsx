import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RAG Marketplace",
  description: "A marketplace for RAG (Retrieval-Augmented Generation) solutions",
  icons: {
    icon: "/logo.webp",
  },
  openGraph: {
    title: "RAG Marketplace",
    description: "A marketplace for RAG (Retrieval-Augmented Generation) solutions",
    type: "website",
    locale: "en_US",
    siteName: "RAG Marketplace",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
