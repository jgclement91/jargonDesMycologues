import TermDetails from "../terms/term-details";
import Footer from "./footer";
import Header from "./header";

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
    <div className="content h-full">
      <div className="overflow-y-auto h-full">
        <Header />
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
      </div>
      <Footer />
    </div>
  );
};

export default Content;
