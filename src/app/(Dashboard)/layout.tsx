import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
  icons: {
    icon: "/chart.svg",
  }
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
          position="top-center"
          expand={false}
          richColors
          theme="light"
        />
        {children}
      </body>
    </html>
  );
}
