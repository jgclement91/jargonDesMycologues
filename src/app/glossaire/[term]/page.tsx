import {
  getAllTerms,
  fetchTerm,
  getImageUrl,
} from "@/app/clients/sanityClient";
import { Metadata } from 'next'

import Content from "../../components/content";

type Props = {
  params: {
    term: string;
  };
};

export async function generateStaticParams() {
  return await getAllTerms();
}

export async function generateMetadata(
    { params }: Props
  ): Promise<Metadata> {

    const data = await fetchTerm(decodeURIComponent(params.term));

    if (!data && params.term.length == 1) {
      return {
        title: `Glossaire - Jargon des mycologues`,
      }
    }

    return {
      title: `${data.term}`,
    }
  }

const Page = async ({ params }: Props) => {
  if (params.term.length == 1) {
    return (
      <div className="app">
        <div className="content"></div>
      </div>
    );
  }

  const data = await fetchTerm(decodeURIComponent(params.term));
  if (!data) {
    return (
      <div className="app">
        <div className="content">Terme introuvable</div>
      </div>
    );
  }
  const exampleUrl = data.example && getImageUrl(data.example, 350);
  const schemaUrl = data.schema && getImageUrl(data.schema, 350);

  return (
    <div className="flex flex-grow">
      <div className="flex flex-grow">
        <Content
          term={data.term}
          definition={data.definition}
          synonyms={data.synonymsRichText}
          exampleImageUrl={exampleUrl}
          exampleDescription={data.exampleDescription}
          schemaImageUrl={schemaUrl}
          categories={data.categories?.filter((c) => c !== "Synonyme") || []}
        />
      </div>
    </div>
  );
};

export default Page;
