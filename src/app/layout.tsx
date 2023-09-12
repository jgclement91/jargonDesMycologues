import { Analytics } from "@vercel/analytics/react";

import './globals.css'
import { Inter } from 'next/font/google'

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

  return (
    <html lang="en">
      <body className={inter.className}>
            {children}
            <Analytics />
      </body>
    </html>
  )
}
