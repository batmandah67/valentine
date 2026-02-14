import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "💕 Би чамд хайртай",
  description: "Чамд зориулсан",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <head>
        <link rel="preload" href="/bg/video.mp4" as="video" type="video/mp4" />
      </head>
      <body>{children}</body>
    </html>
  );
}
