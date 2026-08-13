import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Route 53",
  description: "AWS Route 53 Clone",
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