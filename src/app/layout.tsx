import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RfqSessionProvider } from "@/components/providers/rfq-session-provider";
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
  title: "RFQ AI | Procurement Case Study",
  description:
    "A procurement case study showing how RFQ AI compares supplier quotes, exposes risk, and shortens sourcing cycle time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">
        <RfqSessionProvider>{children}</RfqSessionProvider>
      </body>
    </html>
  );
}
