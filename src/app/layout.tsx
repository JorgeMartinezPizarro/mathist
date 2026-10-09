import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

import Nav from "@/components/Nav";
import "./globals.css";

// Self hosted by next/font, exposed as CSS variables for globals.css
const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: { default: "Mathist", template: "%s · Mathist" },
  description: "Some random math calculations taken to the extreme!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <header className="site-header">
          <Link href="/" className="brand">Mathist</Link>
          <Nav />
        </header>
        <main className="page">{children}</main>
      </body>
    </html>
  );
}
