import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";

import "./globals.css";
import "./layout.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Jargon des mycologues",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <link href="https://fonts.cdnfonts.com/css/tex-gyre-chorus" rel="stylesheet" />
      <body className={`${inter.className} overflow-y-hidden`}>
          {children}
        <Analytics />
      </body>
    </html>
  );
}
