import PortableTextComponent from "../components/portableTextComponent";
import TermCategories from "./term-categories";
import TermIllustrations from "./term-illustrations";

type Props = {
  term: string;
  definition: any;
  synonyms: any;
  exampleImageUrl: any;
  exampleImageUrlFull: any;
  exampleDescription: any;
  schemaImageUrl: any;
  schemaImageUrlFull: any;
  categories: string[];
};

const TermDetails = ({
  term,
  definition,
  synonyms,
  exampleImageUrl,
  exampleImageUrlFull,
  exampleDescription,
  schemaImageUrl,
  schemaImageUrlFull,
  categories,
}: Props) => {
  if (categories?.some((c) => c.toLowerCase() === "préfixe")) {
    term = `${term}-`;
  } else if (categories?.some((c) => c.toLowerCase() === "suffixe")) {
    term = `-${term}`;
  }

  return (
    <div className="flex flex-col flex-grow">
      <div className="container px-4 md:px-6 mx-auto py-6">
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-emerald-800 text-3xl font-medium">{term}</h1>
              {categories && categories.length > 0 && (
                <TermCategories categories={categories} />
              )}
            </div>
          </div>

          {synonyms && synonyms.length > 0 && (
            <div className="bg-white rounded-md border border-slate-200 p-4 mb-6">
              <div className="text-sm font-medium text-slate-500 mb-1">
                Synonyme(s):
              </div>
              <div className="text-slate-700">
                <PortableTextComponent value={synonyms} />
              </div>
            </div>
          )}

          <div className="prose prose-emerald max-w-none">
            <PortableTextComponent value={definition} />
          </div>

          <TermIllustrations
            exampleDescription={exampleDescription}
            exampleImageUrl={exampleImageUrl}
            exampleImageUrlFull={exampleImageUrlFull}
            schemaImageUrl={schemaImageUrl}
            schemaImageUrlFull={schemaImageUrlFull}
          />
        </div>
      </div>
    </div>
  );
};

export default TermDetails;
