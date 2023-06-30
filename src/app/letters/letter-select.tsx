"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import leftArrow from "../svg/left-arrow.svg";

type Props = {
  selectedLetter: string;
  onChange: () => void;
};

const LetterSelect = ({ selectedLetter, onChange }: Props) => {
  return (
    <div className="flex h-12 bg-green-600 items-center">
      {selectedLetter && (
        <>
          <div className="pl-3 cursor-pointer" onClick={() => onChange()}>
            <Image priority src={leftArrow} alt="Sélectionner une lettre" />
          </div>
          <div className="text-white pl-4 items-center">
            <p className="font-bold">{selectedLetter}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default LetterSelect;
