import PortableTextComponent from "../components/portableTextComponent";
import TermCategories from "./term-categories";
import TermIllustrations from "./term-illustrations";

type Props = {
  term: string;
  definition: any;
  synonyms: any;
  exampleImageUrl: any;
  exampleDescription: any;
  schemaImageUrl: any;
  categories: string[];
};

const TermDetails = ({
  term,
  definition,
  synonyms,
  exampleImageUrl,
  exampleDescription,
  schemaImageUrl,
  categories,
}: Props) => {
  if (categories?.some((c) => c.toLowerCase() === "préfixe")) {
    term = `${term}-`;
  } else if (categories?.some((c) => c.toLowerCase() === "suffixe")) {
    term = `-${term}`;
  }

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex flex-col py-4 bg-slate-200 flex-grow">
        <div className="flex text-green-600 text-3xl min-[380px]:text-4xl sm:text-5xl font-semibold px-4 sm:px-8 items-center">
          {term}
          {categories && categories.length > 0 && (
            <TermCategories categories={categories} />
          )}
        </div>
        {synonyms && synonyms.length > 0 && (
          <span className="text-justify font-bold px-4 sm:px-8 pt-4">
            Synonyme(s): <PortableTextComponent value={synonyms} />
          </span>
        )}
        <div className="pt-2 px-4 sm:px-8">
          <p className="text-justify font-semibold leading-loose">
            <PortableTextComponent value={definition} />
          </p>
        </div>
      </div>
      <TermIllustrations
        exampleDescription={exampleDescription}
        exampleImageUrl={exampleImageUrl}
        schemaImageUrl={schemaImageUrl}
      />
    </div>
  );
};

export default TermDetails;
