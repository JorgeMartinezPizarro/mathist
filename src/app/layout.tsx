import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mathist",
  description: "Some random math calculations taken to the extreme!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
