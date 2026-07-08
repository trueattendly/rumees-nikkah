import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nikkah of Nizamudheen & Rumeeza | Save the Date — 23 July 2026",
  description:
    "You are cordially invited to the blessed Nikkah of Muhammed Nizamudheen C & Rumeeza V V on 23rd July 2026 at Cheruvannur Vadakke Juma Masjid, Kolathara. Join us for a celebration of love and blessings.",
  keywords: ["Nikkah", "Wedding", "Muslim Wedding", "Save the Date", "Nizamudheen", "Rumeeza", "Cheruvannur"],
  // ── Custom favicon — crescent moon + heart icon ──────────────────
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Nikkah of Nizamudheen & Rumeeza — Save the Date",
    description: "Join us to celebrate the blessed union of Muhammed Nizamudheen C & Rumeeza V V on 23 July 2026.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Jost:wght@200;300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
