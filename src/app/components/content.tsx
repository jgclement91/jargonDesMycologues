"use client";

import TermDetails from "../terms/term-details";
import Footer from "./footer";
import Header from "./header";
import LandscapeContainer from "./landscape-container";

type Props = {
  term: string;
  definition: any;
  synonyms: any;
  exampleImageUrl: any;
  exampleImageUrlFull: any;
  exampleDescription: any;
  schemaImageUrl: any;
  schemaImageUrlFull: any;
  categories: any;
};

const Content = ({
  term,
  definition,
  synonyms,
  exampleImageUrl,
  exampleImageUrlFull,
  exampleDescription,
  schemaImageUrl,
  schemaImageUrlFull,
  categories
}: Props) => {
  return (
    <LandscapeContainer
      header={<Header />}
      footer={<Footer />}
    >
      <TermDetails
        term={term}
        definition={definition}
        synonyms={synonyms}
        exampleImageUrl={exampleImageUrl}
        exampleImageUrlFull={exampleImageUrlFull}
        exampleDescription={exampleDescription}
        schemaImageUrl={schemaImageUrl}
        schemaImageUrlFull={schemaImageUrlFull}
        categories={categories}
      />
    </LandscapeContainer>
  );
};

export default Content;
