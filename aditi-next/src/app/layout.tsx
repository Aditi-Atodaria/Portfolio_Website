import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aditi Atodaria — Portfolio",
  description: "CS Engineer · App Developer · Algorithmic Trader",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
