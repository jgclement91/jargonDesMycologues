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
      title: `Un glossaire illustré des champignons conçu par Jean Després`,
      description: `Un glossaire illustré des champignons conçu par Jean Després`,
      alternates: {
        canonical: `https://www.jargon-des-mycologues.org/glossaire`,
      },
    };
  }

  const term = data.term;
  const exampleImageDimensions = data.example?.asset._ref.split("-")[2].split("x");
  const exampleImageWidth = exampleImageDimensions && exampleImageDimensions[0];
  const exampleImageHeight =
    exampleImageDimensions && exampleImageDimensions[1].split(".")[0];
  const exampleOg = data.example && {
    url: getImageUrl(data.example, parseInt(exampleImageWidth)),
    width: exampleImageWidth,
    height: exampleImageHeight,
    alt: `Illustration de l'exemple pour le terme ${term}`,
  };

  const schemaImageDimensions = data.schema?.asset._ref.split("-")[2].split("x");
  const schemaImageWidth = schemaImageDimensions && schemaImageDimensions[0];
  const schemaImageHeight =
    schemaImageDimensions && schemaImageDimensions[1].split(".")[0];
  const schemaOg = data.schema && {
    url: getImageUrl(data.schema, parseInt(exampleImageWidth)),
    width: schemaImageWidth,
    height: schemaImageHeight,
    alt: `Illustration du schema pour le terme ${term}`,
  };

  const images = !!schemaOg ? schemaOg : !!exampleOg ? exampleOg : [];
  return {
    title: `Glossaire - ${term}`,
    description: `Découvrez la définition du terme "${term}" dans le jargon des mycologues.`,
    openGraph: {
      title: `Glossaire - ${term}`,
      url: `https://www.jargon-des-mycologues.org/glossaire/${term}`,
      images: images,
    },
    alternates: {
      canonical: `https://www.jargon-des-mycologues.org/glossaire/${term}`,
    },
    robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
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