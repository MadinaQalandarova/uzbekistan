import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
