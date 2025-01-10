"use client";

import { useMediaQuery } from "usehooks-ts";

import Image from "next/image";
import PortableTextComponent from "../components/portableTextComponent";

type Props = {
    exampleImageUrl: any;
    exampleDescription: any;
    schemaImageUrl: any;
  };

const TermIllustrations = ({exampleImageUrl, exampleDescription, schemaImageUrl}: Props) => {
    return (
    <div className="flex flex-grow-[10] md:min-w-[500px] justify-around py-3 items-center flex-col lg:flex-row">
    {schemaImageUrl && (
      <div className="lg:pl-12 lg:pr-10">
        <div>
          <span className="inline-block text-center	w-full text-2xl font-bold pb-5">
            Schéma
          </span>
          <Image
            className="w-[300px] sm:w-[350px]"
            alt="Schema"
            src={schemaImageUrl}
            width={350}
            height={350}
          />
        </div>
      </div>
    )}
    {exampleImageUrl && (
      <div className="pt-8 lg:pt-0">
        <span className="inline-block text-center w-full text-2xl font-bold pb-5">
          Exemple
        </span>
        <Image
          className="w-[300px] sm:w-[350px]"
          alt="Example"
          src={exampleImageUrl}
          width={350}
          height={350}
        />
        <div className="w-[300px] text-sm font-bold pt-2.5">
          <PortableTextComponent value={exampleDescription} />
        </div>
      </div>
    )}
  </div>
)
}

export default TermIllustrations