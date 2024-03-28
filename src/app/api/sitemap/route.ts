export const runtime = "edge"; // 'nodejs' is the default
export const dynamic = "force-dynamic"; // no caching
import { fetchTermList, getAllPlancheTitles } from "@/app/clients/sanityClient";

function addGlossairePage(term: string) {
  return `  <url>
    <loc>${`https://jargon-des-mycologues.vercel.app/glossaire/${term}`}</loc>
    <changefreq>weekly</changefreq>
  </url>`;
}

function addPlanchePage(title: string) {
  return `  <url>
    <loc>${`https://jargon-des-mycologues.vercel.app/planche/${title}`}</loc>
    <changefreq>weekly</changefreq>
  </url>`;
}

export async function GET(request: Request) {
  const terms = await fetchTermList();
  const plancheTitles = await getAllPlancheTitles();

  const sitemap = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
  <loc>${`https://jargon-des-mycologues.vercel.app`}</loc>
  <changefreq>weekly</changefreq>
</url>
  ${terms.map((t) => addGlossairePage(t.term)).join("\n")}
  ${plancheTitles.map((p) => addPlanchePage(p.title)).join("\n")}
  </urlset>`;
  return new Response(sitemap, {
    status: 200,
  });
}
