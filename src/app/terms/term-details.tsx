import { PortableText } from "@portabletext/react";
import Image from "next/image";

type Props = {
  term: string;
  definition: any;
  synonyms: any;
  exampleImageUrl: any;
  exampleDescription: any;
  schemaImageUrl: any;
};

const TermDetails = ({
  term,
  definition,
  synonyms,
  exampleImageUrl,
  exampleDescription,
  schemaImageUrl,
}: Props) => {
  return (
    <div className="flex flex-col flex-grow">
      <div className="flex flex-col px-8 py-4 bg-slate-200 flex-grow">
        <div className="text-green-600 text-6xl font-semibold">{term}</div>
        {synonyms && synonyms.length > 0 && (
          <span className="text-justify font-bold">
            Synonyme(s): <PortableText value={synonyms} />
          </span>
        )}
        <div className="pt-2">
          <p className="text-justify font-semibold leading-loose">
            <PortableText value={definition} />
          </p>
        </div>
      </div>
      <div className="flex flex-grow-[10] justify-around py-3">
        {schemaImageUrl && (
          <div className="pl-12 pr-10">
            <div>
              <span className="inline-block text-center	w-full text-2xl font-bold pb-5">
                Schéma
              </span>
              <Image
                alt="Schema"
                src={schemaImageUrl}
                width={350}
                height={350}
              />
            </div>
          </div>
        )}
        {exampleImageUrl && (
          <div>
            <span className="inline-block text-center	w-full text-2xl font-bold pb-5">
              Exemple
            </span>
            <Image
              alt="Example"
              src={exampleImageUrl}
              width={350}
              height={350}
            />
            <div className="w-[300px] text-sm font-bold pt-2.5">
              <PortableText value={exampleDescription} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TermDetails;
