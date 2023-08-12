import { fetchTermList } from "@/app/clients/sanityClient";
import Sidebar from "../components/sidebar";

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
        <div className='app divide-x > * + *'>
          <Sidebar terms={allTerms.map((x: { term: string; }) => x.term).sort()} />
          <div className="content flex">
            {children}
          </div>
        </div>
  )
}
