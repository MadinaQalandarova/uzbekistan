import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "O'zGezer",
  description:
    "Uzbekistan bo'ylab tarixiy, tabiiy va mahalliy sayohat joylarini kashf etish platformasi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
