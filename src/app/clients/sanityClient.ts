import { createClient } from "@sanity/client";
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const SanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  token: process.env.SANITY_TOKEN,
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-06-16"
});

const SanityImageBuilder = imageUrlBuilder(SanityClient);

export async function getAllTerms() {
  const query = '*[_type == "glossary"] {term}';
  return (await SanityClient.fetch(query));
};

type Planche = {
  title: string;
}

export async function getAllPlanches() : Promise<Planche[]> {
  const query = '*[_type == "planche"] {title}';
  return (await SanityClient.fetch(query));
};

type Term = {
  term: string;
  definition: any;
  synonymsRichText: any;
  example: string;
  exampleDescription: any;
  schema: string;
  categories: string[];
}

export async function fetchTerm(term: string) : Promise<Term> {
  const query = '*[_type == "glossary" && term == $term]';
  const params = { term };

  var data = (await SanityClient.fetch(query, params))[0];
  return data;
};

export async function fetchPlanche(title: string) {
  const query = '*[_type == "planche" && title == $title]';
  const params = { title };

  var data = (await SanityClient.fetch(query, params))[0];
  return data;
};

type TermListResponse = {
  term: string;
  categories: string[];
}

export async function fetchTermList(): Promise<TermListResponse[]> {
  const query = '*[_type == "glossary"] {term, categories}';
  var queryResult = await SanityClient.fetch(query);
  return queryResult.map((x: TermListResponse) => ({ term: x.term.toString(), categories: x.categories.map(c => c.toString()) }));
};

export function getImageUrl(image: SanityImageSource, width: number): string {
  return SanityImageBuilder.image(image).width(width).url();
}