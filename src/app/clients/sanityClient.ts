import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const clientConfig = {
  projectId: process.env.SANITY_PROJECT_ID,
  token: process.env.SANITY_TOKEN,
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-06-16",
};

const _sanityClient = createClient(clientConfig);

export async function getAllTerms() {
  const query = '*[_type == "glossary"] {term}';
  return await _sanityClient.fetch(query);
}

type PlancheTitle = {
  title: string;
};

export type Planche = {
  title: string;
  label: string;
  categories: string[];
  images: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  };
};

export async function getAllPlancheTitles(): Promise<PlancheTitle[]> {
  const query = '*[_type == "planche"] {title}';
  const plancheTitles = await _sanityClient.fetch(query);

  return plancheTitles.map((planche: any) => ({
    title: planche.title
  }));
}

export async function getAllPlanches(): Promise<Planche[]> {
  const query = '*[_type == "planche"]';
  const planches = await _sanityClient.fetch(query);
  return planches
    .map((planche: any) => ({
      title: planche.title,
      label: planche.label,
      categories: planche.categories,
      images: {
        small: getImageUrl(planche.image, 400),
        medium: getImageUrl(planche.image, 550),
        large: getImageUrl(planche.image, 700),
        xlarge: getImageUrl(planche.image, 850),
      },
    }))
    .sort((a: Planche, b: Planche) => a.title.localeCompare(b.title));
}

type Term = {
  term: string;
  definition: any;
  synonymsRichText: any;
  example: {
    _type: string;
    _key: string;
    asset: {
      _ref: string;
    };
  };
  exampleDescription: any;
  schema: {
    _type: string;
    _key: string;
    asset: {
      _ref: string;
    };
  };
  categories: string[];
};

export async function fetchTerm(term: string): Promise<Term> {
  const query = '*[_type == "glossary" && term == $term]';
  const params = { term };

  var data = (await _sanityClient.fetch(query, params))[0];
  return data;
}

export async function fetchPlanche(title: string) {
  const query = '*[_type == "planche" && title == $title]';
  const params = { title };

  var data = (await _sanityClient.fetch(query, params))[0];
  return data;
}

type TermListResponse = {
  term: string;
  categories: string[];
};

export async function fetchTermList(): Promise<TermListResponse[]> {
  const query = '*[_type == "glossary"] {term, categories}';
  var queryResult = await _sanityClient.fetch(query);
  return queryResult.map((x: TermListResponse) => ({
    term: x.term.toString(),
    categories: x.categories?.map((c) => c.toString()),
  }));
}

export function getImageUrl(image: SanityImageSource, width: number): string {
  const sanityImageBuilder = imageUrlBuilder(_sanityClient);

  return sanityImageBuilder.image(image).width(width).url();
}
