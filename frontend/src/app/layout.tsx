import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Alex_Brush } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const signature = Alex_Brush({
  variable: "--font-signature",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "noiseToPoise | Deepti Aroura - Artist Portfolio",
  description: "Explore the premium, editorial-style portfolio of artist Deepti Aroura. Experience modern luxury, museum-inspired contemporary art, and art collections.",
  keywords: ["Deepti Aroura", "noiseToPoise", "Artist", "Oil Painting", "Art", "Contemporary Art Portfolio"],
  authors: [{ name: "Deepti Aroura" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${signature.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col paper-texture text-charcoal relative">
        <div className="grain-overlay" />
        <main className="flex-grow flex flex-col">{children}</main>
      </body>
    </html>
  );
}
