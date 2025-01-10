import {
  getAllTerms,
  fetchTerm,
  getImageUrl,
} from "@/app/clients/sanityClient";
import { Metadata } from "next";

import Content from "../../components/content";

type Props = {
  params: {
    term: string;
  };
};

export async function generateStaticParams() {
  return await getAllTerms();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchTerm(decodeURIComponent(params.term));

  if (!data && params.term.length == 1) {
    return {
      title: `Glossaire - Jargon des mycologues`,
    };
  }

  const term = data.term;
  const exampleOg = data.example && {
    url: getImageUrl(data.example, 350),
    width: 350,
    height: 350,
    alt: `Illustration de l'exemple pour le terme ${term}`,
  };
  const schemaUrl = data.schema && {
    url: getImageUrl(data.schema, 350),
    width: 350,
    height: 350,
    alt: `Illustration du schema pour le terme ${term}`,
  };

  const images = [exampleOg, schemaUrl].filter((i) => !!i);

  return {
    title: `Glossaire - ${term}`,
    description: `Découvrez la définition du terme "${term}" dans le jargon des mycologues.`,
    openGraph: {
      title: `Glossaire - ${term}`,
      url: `https://jargon-des-mycologues.org/glossaire/${term}`,
      images: images,
    },
  };
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
