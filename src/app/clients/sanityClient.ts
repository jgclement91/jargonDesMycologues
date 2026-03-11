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
    mobile: string;
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
        mobile: getImageUrl(planche.image, 340),
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

type FeaturedTerm = {
  term: string;
  definition: any;
  categories: string[];
  example?: {
    _type: string;
    _key: string;
    asset: {
      _ref: string;
    };
  };
  schema?: {
    _type: string;
    _key: string;
    asset: {
      _ref: string;
    };
  };
};

export async function getFeaturedTerms(): Promise<FeaturedTerm[]> {
  const query = '*[_type == "glossary" && (defined(example) || defined(schema))] | order(_createdAt desc) [0...6] {term, definition, categories, example, schema}';
  const terms = await _sanityClient.fetch(query);
  return terms;
}

export function getImageUrl(image: SanityImageSource, width: number): string {
  const sanityImageBuilder = imageUrlBuilder(_sanityClient);

  return sanityImageBuilder.image(image).width(width).url();
}

const _sanityWriteClient = createClient({
  ...clientConfig,
  token: process.env.SANITY_READWRITE_TOKEN,
  useCdn: false,
});

export type CrosswordClue = {
  number: number;
  row: number;
  col: number;
  answer: string;
  clue: string;
  termId?: string;
  termSlug?: string;
};

export type CrosswordData = {
  _id: string;
  title: string;
  slug: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  description?: string;
  availableFrom?: string;
  solutionFrom?: string;
  gridData: {
    rows: number;
    cols: number;
    across: CrosswordClue[];
    down: CrosswordClue[];
  };
  publishedAt?: string;
};

export async function getAllCrosswords(): Promise<Array<{
  _id: string;
  title: string;
  slug: string;
  difficulty: string;
  description?: string;
  publishedAt?: string;
}>> {
  const now = new Date().toISOString();
  const query = `*[_type == "crossword" && (!defined(availableFrom) || availableFrom <= $now)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    difficulty,
    description,
    publishedAt
  }`;
  return await _sanityClient.fetch(query, { now });
}

export async function getAllCrosswordSlugs(): Promise<Array<{ slug: string }>> {
  const query = '*[_type == "crossword"] { "slug": slug.current }';
  return await _sanityClient.fetch(query);
}

export async function fetchCrossword(slug: string): Promise<CrosswordData | null> {
  const query = `*[_type == "crossword" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    difficulty,
    description,
    gridData {
      rows,
      cols,
      across[] {
        number,
        row,
        col,
        answer,
        "clue": coalesce(clue, termReference->definition[0].children[0].text, ""),
        "termId": termReference->_id,
        "termSlug": termReference->term
      },
      down[] {
        number,
        row,
        col,
        answer,
        "clue": coalesce(clue, termReference->definition[0].children[0].text, ""),
        "termId": termReference->_id,
        "termSlug": termReference->term
      }
    },
    availableFrom,
    solutionFrom,
    publishedAt
  }`;
  return await _sanityClient.fetch(query, { slug });
}

export async function searchGlossaryTerms(searchText: string): Promise<Array<{ _id: string; term: string }>> {
  const groq = `*[_type == "glossary" && term match $searchText] | order(term asc) [0...20] { _id, term }`;
  return await _sanityClient.fetch(groq, { searchText: `${searchText}*` });
}

export async function createCrossword(data: {
  title: string;
  slug: string;
  difficulty: string;
  description?: string;
  availableFrom?: string;
  solutionFrom?: string;
  gridData: {
    rows: number;
    cols: number;
    across: Array<{ number: number; row: number; col: number; answer: string; clue: string; termId?: string }>;
    down: Array<{ number: number; row: number; col: number; answer: string; clue: string; termId?: string }>;
  };
}): Promise<{ _id: string }> {
  const mapSlot = (slot: { number: number; row: number; col: number; answer: string; clue: string; termId?: string }) => ({
    _key: `${slot.number}-${Math.random().toString(36).slice(2, 7)}`,
    number: slot.number,
    row: slot.row,
    col: slot.col,
    answer: slot.answer.toUpperCase(),
    clue: slot.clue,
    ...(slot.termId ? { termReference: { _type: 'reference', _ref: slot.termId } } : {}),
  });

  return await _sanityWriteClient.create({
    _type: 'crossword',
    title: data.title,
    slug: { _type: 'slug', current: data.slug },
    difficulty: data.difficulty,
    description: data.description,
    availableFrom: data.availableFrom,
    solutionFrom: data.solutionFrom,
    publishedAt: new Date().toISOString(),
    gridData: {
      rows: data.gridData.rows,
      cols: data.gridData.cols,
      across: data.gridData.across.map(mapSlot),
      down: data.gridData.down.map(mapSlot),
    },
  });
}
