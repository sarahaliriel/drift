import type { Metadata } from "next";
import { Anton, Geist, Patrick_Hand_SC } from "next/font/google";
import { siteConfig } from "@/config/site";

import "./globals.css";

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] });
const anton = Anton({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});
const patrickHand = Patrick_Hand_SC({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Drift",
    template: "%s | Drift",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  icons: { icon: "/favicon.ico" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${geist.variable} ${anton.variable} ${patrickHand.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
