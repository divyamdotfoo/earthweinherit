import type { Metadata } from "next";
import "./globals.css";
import { Inter, Montserrat } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Earth We Inherit",
  description: "Solving climate crisis with AI.",
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistMono.variable} ${GeistSans.variable} font-mono antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
