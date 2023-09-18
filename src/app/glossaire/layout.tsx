import Sidebar from "../components/sidebar";
import { fetchTermList } from "@/app/clients/sanityClient";

export const metadata = {
  title: "Jargon des mycologues",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const allTerms = await fetchTermList();

  return (
    <div className="app divide-x > * + *">
      <Sidebar
        terms={allTerms
          .sort((a, b) => a.term.localeCompare(b.term))
          .map((t) => {
            if (t.categories.some((u) => u.toLowerCase() === "préfixe")) {
              return `${t.term}-`;
            } else if (
              t.categories.some((u) => u.toLowerCase() === "suffixe")
            ) {
              return `-${t.term}`;
            }

            return t.term;
          })}
      />
      <div className="content flex">{children}</div>
    </div>
  );
}
