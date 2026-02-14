import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "💕 Үерхэх Санал",
  description: "Чамд зориулсан онцгой санал",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  );
}
