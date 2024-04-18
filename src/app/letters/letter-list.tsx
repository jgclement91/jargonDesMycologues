'use client';

import { useMediaQuery } from "usehooks-ts";
import { usePathname } from "next/navigation";

import LetterListItem from "./letter-list-item";

import "./letter-list.css";

type Props = {
  onLetterSelect: (letter: string) => void;
};

const letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const LetterList = ({ onLetterSelect }: Props) => {
  const mobile = useMediaQuery("(max-width:640px)");
  const path = decodeURIComponent(usePathname());

  return (
    <div className={`w-full ${mobile && !path.startsWith("/planche") ? "mobile-" : ""}letter-list`}>
      <div className="divide-y divide-gray-400">
        {letters.map((letter) => (
          <LetterListItem
            key={letter}
            letter={letter}
            onLetterSelect={() => onLetterSelect(letter)}
          />
        ))}
      </div>
    </div>
  );
};

export default LetterList;
