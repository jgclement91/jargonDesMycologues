"use client";

import Image from "next/image";
import PortableTextComponent from "../components/portableTextComponent";
import { useMediaQuery } from "@mui/material";

type Props = {
    exampleImageUrl: any;
    exampleDescription: any;
    schemaImageUrl: any;
  };

const TermIllustrations = ({exampleImageUrl, exampleDescription, schemaImageUrl}: Props) => {
    const small = useMediaQuery('(min-width:800px)');

    return (
    <div className={`flex flex-grow-[10] min-w-[500px] justify-around py-3 ${small ? "" : "flex-col items-center"}`}>
    {schemaImageUrl && (
      <div className={`${small ? "pl-12 pr-10" : ""}`}>
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
      <div className={`${small ? "" : "pt-2"}`}>
        <span className="inline-block text-center w-full text-2xl font-bold pb-5">
          Exemple
        </span>
        <Image
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