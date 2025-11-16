
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import Sidebar from "./components/sidebar";
import { fetchTermList } from "@/app/clients/sanityClient";
import { cache } from "react";
import "./globals.css";
import "./layout.css";

const inter = Inter({ subsets: ["latin"] });

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

export const metadata: Metadata = {
  title: "Page d'accueil",
  description: `Un glossaire illustré des champignons conçu par Jean Després`,
  openGraph: {
    title: "Page d'accueil",
    description: `Un glossaire illustré des champignons conçu par Jean Després`,
    images: [
      {
        url: "https://www.jargon-des-mycologues.org/logo-cmm.png",
        width: 700,
        height: 485,
        alt: "Logo du Cercle des mycologues de Montréal",
      }
    ],
    type: "website"
  },
  alternates: {
    canonical: `https://www.jargon-des-mycologues.org/`,
  },
  other: {
    "ld+json": JSON.stringify(schemaData)
  }
};


// Cache and pre-format the term list server-side
const getSidebarTerms = cache(async () => {
  const allTerms = await fetchTermList();
  const collator = new Intl.Collator('fr', { sensitivity: 'base' });
  return allTerms
    .sort((a, b) => collator.compare(a.term, b.term))
    .map((t) => {
      if (t.categories?.some((u) => u.toLowerCase() === "préfixe")) {
        return `${t.term}-`;
      } else if (t.categories?.some((u) => u.toLowerCase() === "suffixe")) {
        return `-${t.term}`;
      }
      return t.term;
    });
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarTerms = await getSidebarTerms();
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.cdnfonts.com/css/tex-gyre-chorus"
          rel="stylesheet"
        ></link>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        {/* Next.js will inject metadata.other as custom tags */}
      </head>
      <body className={`${inter.className}`}>
        <div className="flex flex-col h-screen">
          <div className="flex flex-1 overflow-hidden">
            <Sidebar terms={sidebarTerms} />
            {children}
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
