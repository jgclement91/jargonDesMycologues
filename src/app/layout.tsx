import './globals.css'
import { Inter } from 'next/font/google'

import { fetchTermList } from "@/app/clients/sanityClient";
import Sidebar from "./components/sidebar";

import "./layout.css"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Jargon des mycologues'
}



export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const allTerms = await fetchTermList();

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className='app divide-x > * + *'>
          <Sidebar terms={allTerms.map((x: { term: string; }) => x.term).sort()} />
          <div className="content flex">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
