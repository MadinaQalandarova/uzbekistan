import type { Metadata } from "next";
import "./globals.css";
import { SwRegistrar } from "@/components/sw-registrar";

export const metadata: Metadata = {
  title: {
    default: "O'zGezer — O'zbekiston sayohat atlasi",
    template: "%s | O'zGezer",
  },
  description:
    "O'zbekiston bo'ylab tarixiy, tabiiy va mahalliy sayohat joylarini kashf eting. Reyting, izohlar va xarita asosida eng yaxshi joylarni toping.",
  keywords: ["O'zbekiston", "sayohat", "turizm", "joylar", "Uzbekistan", "travel", "atlas"],
  openGraph: {
    type: "website",
    siteName: "O'zGezer",
    title: "O'zGezer — O'zbekiston sayohat atlasi",
    description:
      "O'zbekiston bo'ylab tarixiy, tabiiy va mahalliy sayohat joylarini kashf eting.",
    locale: "uz_UZ",
    alternateLocale: ["ru_RU", "en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "O'zGezer — O'zbekiston sayohat atlasi",
    description: "O'zbekiston bo'ylab sayohat joylarini kashf eting.",
  },
  robots: {
    index: true,
    follow: true,
  },
  /* PWA */
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "O'zGezer",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icons/icon-96.png",  sizes: "96x96",   type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icons/icon.svg",     type: "image/svg+xml" },
    ],
    apple: [{ url: "/icons/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="h-full scroll-smooth antialiased" suppressHydrationWarning>
      {/*
        Flash prevention: runs synchronously before first paint.
        Reads saved theme from localStorage (or OS preference) and
        sets data-theme on <html> before React hydrates.
      */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('ozgezer-theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SwRegistrar />
        {children}
      </body>
    </html>
  );
}
