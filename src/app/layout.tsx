import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import { Metadata } from 'next'

import "./globals.css";
import "./layout.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Page d'accueil - Jargon des mycologues",
  description: 'Un glossaire illustré des champignons conçu par Jean Després',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link
        href="https://fonts.cdnfonts.com/css/tex-gyre-chorus"
        rel="stylesheet"
      />
      <body className={`${inter.className} overflow-y-hidden`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
