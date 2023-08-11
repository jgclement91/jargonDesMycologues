import TermDetails from "../terms/term-details";
import Footer from "./footer";
import Header from "./header";

type Props = {
  term: string;
  definition: any;
  synonyms: any;
  exampleImageUrl: any;
  exampleDescription: any;
  schemaImageUrl: any;
};

const Content = ({
  term,
  definition,
  synonyms,
  exampleImageUrl,
  exampleDescription,
  schemaImageUrl,
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
          exampleDescription={exampleDescription}
          schemaImageUrl={schemaImageUrl}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Content;
