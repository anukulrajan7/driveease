import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { site } from "@/data/content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://driveease.example"),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    siteName: site.name,
    type: "website",
    locale: "en_IN",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-slate-900">
        <Header />
        <main className="flex-1">{children}</main>
        <WhatsAppButton />
        <Footer />
      </body>
    </html>
  );
}
