import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import { Metadata } from "next";

import Sidebar from "./components/sidebar";
import { fetchTermList } from "@/app/clients/sanityClient";

import "./globals.css";
import "./layout.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Page d'accueil",
  description: "Un glossaire illustré des champignons conçu par Jean Després",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const allTerms = await fetchTermList();

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://jargon-des-mycologues.org",
    "name": "Jargon des mycologues",
    "publisher": {
      "@type": "Organization",
      "name": "Cercle des mycologues de Montréal",
      "logo": {
        "@type": "ImageObject",
        "url": "https://jargon-des-mycologues.org/icon.png",
        "width": 512,
        "height": 512,
      },
    },
  };


  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.cdnfonts.com/css/tex-gyre-chorus"
          rel="stylesheet"
        ></link>
        <link rel="canonical" href="https://jargon-des-mycologues.org/"></link>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData),
          }}
        />
      </head>
      <body className={`${inter.className} overflow-y-hidden`}>
        <div className="app divide-x > * + *">
          <Sidebar
            terms={allTerms
              .sort((a, b) => a.term.localeCompare(b.term))
              .map((t) => {
                if (t.categories?.some((u) => u.toLowerCase() === "préfixe")) {
                  return `${t.term}-`;
                } else if (
                  t.categories?.some((u) => u.toLowerCase() === "suffixe")
                ) {
                  return `-${t.term}`;
                }

                return t.term;
              })}
          />
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
