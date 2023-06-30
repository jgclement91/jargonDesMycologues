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
    <div>
      <div className="px-8 py-6 bg-slate-200">
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
      <div className="flex justify-around">
        {schemaImageUrl && (
          <div className="pl-12 pr-10">
            <div>
              <span className="inline-block text-center	w-full text-3xl font-bold pb-5">
                Schéma
              </span>
              <Image
                alt="Schema"
                src={schemaImageUrl}
                width={300}
                height={300}
              />
            </div>
          </div>
        )}
        {exampleImageUrl && (
          <div>
            <span className="inline-block text-center	w-full text-3xl font-bold pb-5">
              Exemple
            </span>
            <Image
              alt="Example"
              src={exampleImageUrl}
              width={300}
              height={300}
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
