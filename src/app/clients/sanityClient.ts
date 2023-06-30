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

export async function fetchTerm(term: string) {
  const query = '*[_type == "glossary" && term == $term]';
  const params = { term };

  var data = (await SanityClient.fetch(query, params))[0];
  return data;
};

export async function fetchTermList() {
  const query = '*[_type == "glossary"] {term}';
  return (await SanityClient.fetch(query));
};

export function getImageUrl(image: SanityImageSource): string {
  return SanityImageBuilder.image(image).width(300).url();
}